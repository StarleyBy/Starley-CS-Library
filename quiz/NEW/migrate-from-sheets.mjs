// migrate-from-sheets.mjs
//
// One-off migration: reads the CURRENT Google Sheets quiz_data (via the
// existing Apps Script ?action=getAll endpoint) and imports every account,
// favorite, playlist and session into the new Supabase schema.
//
// Run locally (NOT in the browser — this uses the service-role key):
//   node migrate-from-sheets.mjs
//
// Env vars required (create a .env or export in shell):
//   GOOGLE_SHEETS_WEB_APP_URL   -- the existing Apps Script /exec URL
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   -- service role, NOT the anon key
//
// npm i @supabase/supabase-js node-fetch dotenv   (if not already available)

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const {
    GOOGLE_SHEETS_WEB_APP_URL,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
} = process.env;

if (!GOOGLE_SHEETS_WEB_APP_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required env vars. See header comment.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Compacts the old, bloated per-question detail array (full bilingual
// question/options/explanation text) down to the same short format
// sanitizeSessionForSync() in quiz.js already computes but never used.
// Only wrong answers get the (correct)chosen suffix; correct ones are bare.
function compactDetail(errorsArr) {
    if (!Array.isArray(errorsArr) || errorsArr.length === 0) return '';
    return errorsArr.map(e => {
        const specId = e.specialId || e.questionId || '';
        if (e.isCorrect) return String(specId);
        const correctL = String(e.correctAnswer || '').trim();
        const chosenL = String(e.chosen || '').trim();
        return `${specId}(${correctL})${chosenL}`;
    }).join(', ');
}

async function fetchAllSheetData() {
    const url = `${GOOGLE_SHEETS_WEB_APP_URL}?action=getAll&v=${Date.now()}`;
    const res = await fetch(url);
    const json = await res.json();
    if (!json || !json.ok || !json.data) {
        throw new Error('Failed to read quiz_data from Google Sheets: ' + JSON.stringify(json));
    }
    return json.data; // { accounts: [...], user_<pin>: {...}, ... }
}

async function migrateOneUser(pin, userData, accountMeta) {
    const email = `pin_${pin}@starley.local`;
    console.log(`\n--- Migrating PIN ${pin} (${userData.nickname || accountMeta?.nickname || 'unknown'}) ---`);

    // 1. Create the auth user (idempotent-ish: skip if it already exists)
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email,
        password: String(pin),
        email_confirm: true,
        user_metadata: {
            nickname: userData.nickname || accountMeta?.nickname || 'Doctor',
            username: userData.username || `user_${pin}`
        }
    });

    let userId;
    if (createErr) {
        if (String(createErr.message || '').toLowerCase().includes('already')) {
            const { data: list } = await supabase.auth.admin.listUsers();
            const existing = list.users.find(u => u.email === email);
            if (!existing) throw createErr;
            userId = existing.id;
            console.log('  User already existed, reusing id', userId);
        } else {
            throw createErr;
        }
    } else {
        userId = created.user.id;
    }

    // 2. Update profile (role, RPG progress)
    const role = (userData.role === 'admin' || accountMeta?.role === 'admin') ? 'admin' : 'user';
    await supabase.from('profiles').update({
        role,
        avatar: userData.avatar || 'doc',
        level_num: userData.levelNum || 1,
        current_exp: userData.currentExp || 0,
        total_exp: userData.totalExp || 0,
        tier_id: userData.tierId || 1
    }).eq('id', userId);

    // 3. Favorites -> one row each
    const favorites = Array.isArray(userData.favorites) ? userData.favorites : [];
    if (favorites.length) {
        const rows = favorites.map(f => ({
            user_id: userId,
            special_id: typeof f === 'string' ? f : String(f.id || f.specialId || '')
        })).filter(r => r.special_id);
        const { error } = await supabase.from('favorites').upsert(rows, { onConflict: 'user_id,special_id' });
        if (error) console.warn('  favorites error:', error.message);
        else console.log(`  imported ${rows.length} favorites`);
    }

    // 4. Playlists + items
    const playlists = Array.isArray(userData.playlists) ? userData.playlists : [];
    for (const pl of playlists) {
        if (!Array.isArray(pl.questionIds) || pl.questionIds.length === 0) continue; // skip empty default playlists
        const { data: newPl, error: plErr } = await supabase
            .from('playlists')
            .insert({ user_id: userId, title: pl.title || String(pl.id), icon_id: pl.iconId || 1 })
            .select()
            .single();
        if (plErr) { console.warn('  playlist error:', plErr.message); continue; }

        const itemRows = pl.questionIds.map(qid => ({ playlist_id: newPl.id, special_id: String(qid) }));
        const { error: itemErr } = await supabase.from('playlist_items').upsert(itemRows, { onConflict: 'playlist_id,special_id' });
        if (itemErr) console.warn('  playlist_items error:', itemErr.message);
        else console.log(`  imported playlist "${pl.title}" with ${itemRows.length} items`);
    }

    // 5. Session history -> compact rows
    const sessions = Array.isArray(userData.sessionHistory) ? userData.sessionHistory : [];
    if (sessions.length) {
        const rows = sessions.map(s => ({
            user_id: userId,
            session_id: String(s.sessionId || s.date || Date.now()),
            date: s.date || new Date().toISOString(),
            set_title: s.setTitle || null,
            mode: s.mode || null,
            lang: s.lang || null,
            total_q: s.totalQ || s.count || 0,
            correct_q: s.correctQ || s.correctCount || 0,
            score_pct: s.scorePct || s.accuracyPct || null,
            time_spent_sec: s.timeSpentSec || null,
            exp_gained: s.expGained || 0,
            topics: Array.isArray(s.topics) ? s.topics : (s.setTitle ? [s.setTitle] : []),
            detail_summary: compactDetail(s.errors)   // <-- the fix: compact, not full bilingual dump
        }));
        const { error } = await supabase.from('quiz_sessions').upsert(rows, { onConflict: 'user_id,session_id' });
        if (error) console.warn('  sessions error:', error.message);
        else console.log(`  imported ${rows.length} sessions`);
    }
}

async function main() {
    console.log('Fetching current data from Google Sheets...');
    const allData = await fetchAllSheetData();
    const accounts = allData.accounts || [];

    for (const acc of accounts) {
        const pin = String(acc.password || '').trim();
        if (!pin) continue;
        const userData = allData['user_' + pin] || {};
        try {
            await migrateOneUser(pin, userData, acc);
        } catch (err) {
            console.error(`Failed to migrate PIN ${pin}:`, err.message || err);
        }
    }

    console.log('\nMigration complete. Spot-check a few accounts in the Supabase dashboard before decommissioning the Apps Script backend.');
}

main().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
