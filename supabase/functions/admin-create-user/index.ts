// supabase/functions/admin-create-user/index.ts
//
// Runs server-side with the service-role key. This is the ONLY place that key
// exists — never ship it to the browser. This function is what closes the
// "admin PIN 456755 is visible in public JS, anyone can call admin_create_user
// directly" hole from the current Apps Script backend.
//
// Deploy:  supabase functions deploy admin-create-user
// Secrets: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are auto-injected by
//          Supabase for Edge Functions — no manual secret setup needed.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const authHeader = req.headers.get('Authorization') || '';
        const jwt = authHeader.replace('Bearer ', '');
        if (!jwt) {
            return json({ ok: false, error: 'Missing Authorization header' }, 401);
        }

        // 1. Verify the caller is a logged-in user...
        const { data: { user: caller }, error: authErr } = await supabaseAdmin.auth.getUser(jwt);
        if (authErr || !caller) {
            return json({ ok: false, error: 'Invalid session' }, 401);
        }

        // 2. ...and that they are an admin, checked server-side against the DB
        //    (never trust a role claim sent by the client itself).
        const { data: callerProfile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', caller.id)
            .single();

        if (!callerProfile || callerProfile.role !== 'admin') {
            return json({ ok: false, error: 'Forbidden: admin role required' }, 403);
        }

        const body = await req.json();

        // 3. Handle User Deletion
        if (body.action === 'delete' || body.targetUserId) {
            const targetUserId = body.targetUserId;
            if (!targetUserId) {
                return json({ ok: false, error: 'targetUserId is required' }, 400);
            }
            if (targetUserId === caller.id) {
                return json({ ok: false, error: 'Cannot delete own admin account' }, 400);
            }
            const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
            if (delErr) return json({ ok: false, error: delErr.message }, 400);
            return json({ ok: true, success: true, message: 'User deleted successfully' });
        }

        // 4. Create the new account
        const { pin, nickname, role } = body;
        if (!pin || String(pin).trim().length < 4) {
            return json({ ok: false, error: 'PIN must be at least 4 characters' }, 400);
        }
        const cleanPin = String(pin).trim();

        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin
            .from('profiles')
            .select('id, nickname, username, role')
            .or(`username.eq.user_${cleanPin},username.eq.${cleanPin}`)
            .maybeSingle();

        if (existingUser) {
            return json({
                ok: false,
                duplicate: true,
                error: `Пользователь с паролем/PIN ${cleanPin} уже существует (${existingUser.nickname || 'Doctor'}, роль: ${existingUser.role})`
            }, 400);
        }

        const safeRole = role === 'admin' ? 'admin' : 'user';
        const email = `pin_${cleanPin}@starley.com`;
        const password = `starley_${cleanPin}`;

        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { nickname: nickname || 'Doctor', username: `user_${cleanPin}` }
        });
        if (createErr) return json({ ok: false, error: createErr.message }, 400);

        // profiles row is created automatically by the on_auth_user_created
        // trigger; just patch the role if it should be admin.
        if (safeRole === 'admin') {
            await supabaseAdmin
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', created.user!.id);
        }

        return json({
            ok: true,
            success: true,
            message: `Account created for PIN ${pin}`,
            user: { id: created.user!.id, nickname, role: safeRole }
        });

    } catch (err) {
        return json({ ok: false, error: String(err) }, 500);
    }
});

function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
        }
    });
}
