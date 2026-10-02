/**
 * Custom Search Index Generator - Starley Medical Library
 * Human-Readable Book Titles & Rich Thematic Topic Emojis
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const OUTPUT_INDEX = path.join(__dirname, 'search-index.json');
const OUTPUT_CONFIG = path.join(__dirname, 'search-config.json');

const HUMAN_BOOK_TITLES = {
  'cohn': 'Cardiac Surgery in the Adult (Cohn 5th ed)',
  'Kirklin5': 'Cardiac Surgery (Kirklin & Barratt-Boyes 5th ed)',
  'bojar': 'Manual of Perioperative Care in Adult Cardiac Surgery (Bojar 6th ed)',
  'sellke': 'Sabiston & Spencer Surgery of the Chest (Sellke)',
  'Spray6': 'Pediatric Cardiac Surgery (Spray & Mayer 6th ed)',
  'Key-questions-in-cardiac-surgery': 'Key Questions in Cardiac Surgery',
  'Key-questions-in-congenital-cardiac-surgery': 'Key Questions in Congenital Cardiac Surgery',
  'Sugarbaker2': 'Adult Chest Surgery (Sugarbaker 2nd ed)',
  'Hurst': 'Hurst\'s the Heart (14th ed)',
  'mori': 'Surgical Anatomy of the Heart (Mori)',
  'wilcox': 'Surgical Anatomy of the Heart (Wilcox 4th ed)',
  'Netter-Cardiothoracic-Anatomy': 'Netter\'s Surgical Anatomy of the Heart',
  'cardiovascular-system-glance': 'The Cardiovascular System at a Glance',
  'handbook-of-cardiac-anatomy': 'Handbook of Cardiac Anatomy & Physiology',
  'Echo6': 'Feigenbaum\'s Echocardiography (6th ed)',
  'ECG_Interpretation_for_Everyone': 'ECG Interpretation for Everyone',
  'ECGs_Made_Easy': 'ECGs Made Easy',
  'drugs-in-icu-oxford': 'Drugs in Intensive Care (Oxford)',
  'opie\'s-cardiovascular-drugs': 'Opie\'s Cardiovascular Drugs',
  'guide': 'AHA / ESC Clinical Guidelines',
  'article': 'Clinical Guidelines & Consensus Articles',
  'marino': 'The ICU Book (Marino 4th ed)',
  'oxford': 'Oxford Handbook of Critical Care',
  'Pilbeam': 'Pilbeam\'s Mechanical Ventilation (7th ed)',
  'mysummary': 'Executive Summaries: Cardiac Surgery in the Adult',
  'wolfson': 'Wolfson Implementation Guide',
  'examen': 'Board Exam Questions'
};

const CATEGORY_EMOJIS = {
  'summary': '📝',
  'icu': '🏥',
  'cardiac_surgery': '🫀',
  'thoracic_surgery': '🫁',
  'cardiology': '❤️',
  'anatomy': '🦴',
  'cardiovascular_system': '🩸',
  'cardiac echo': '🔊',
  'ecg': '📈',
  'drugs': '💊',
  'guidelines': '📋',
  'work': '🛠️'
};

const STOP_WORDS = new Set([
  'to','this','the','a','an','and','or','in','on','at','for','of','with','by','from','is','are','was','were',
  'be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must',
  'can','that','these','those','it','its','what','which','who','whom','when','where','why','how','not','no',
  'so','if','then','than','too','very','just','about','above','below','between','into','through','during','before','after','out','up','down','over','under',
  'и','на','в','с','по','за','из','к','о','от','до','для','при','обе','бы','же','ли','так','или','но','а','у','со','об','это','как','все','также','что',
  'после','поводу','предмет','отношении','связи','через','между','около','путем','согласно','время','место','целью','случае','относительно','наряду','ряду',
  'данном','данных','который','которая','которое','которые','были','была','было','быть','того','этого','этом','этой','этих'
]);

function stemRussianWord(word) {
  if (!word || typeof word !== 'string' || word.length < 3) return word;
  let w = word.toLowerCase();
  w = w.replace(/(ами|ями|ов|ев|ей|ям|ам|ах|ях|ом|ем|ой|ей|ею|ою|ый|ий|ой|ая|яя|ое|ее|ые|ие|ых|их|ым|им|ыми|ими|ого|его|ому|ему|у|ю|а|я|о|е|и|ы|ь)$/i, '');
  return w.length >= 2 ? w : word;
}

function detectLanguage(text) {
  const cyrillicMatches = (text.match(/[\u0400-\u04FF]/g) || []).length;
  const hebrewMatches = (text.match(/[\u0590-\u05FF]/g) || []).length;
  const total = text.length || 1;

  if (cyrillicMatches / total > 0.1) return 'russian';
  if (hebrewMatches / total > 0.1) return 'hebrew';
  return 'english';
}

function stripDiacritics(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function tokenizeText(text) {
  const clean = stripDiacritics(text.toLowerCase())
    .replace(/[^\w\u0400-\u04FF\u0590-\u05FF-]/g, ' ');
  return clean.split(/\s+/).filter(t => t.length > 1);
}

function buildWordCounts(text) {
  const tokens = tokenizeText(text);
  const counts = {};

  tokens.forEach(t => {
    if (t.length > 2 && !STOP_WORDS.has(t) && !/^\d+$/.test(t) && !/_/.test(t)) {
      counts[t] = (counts[t] || 0) + 1;
      const stemmed = stemRussianWord(t);
      if (stemmed !== t && stemmed.length > 2) {
        counts[stemmed] = (counts[stemmed] || 0) + 1;
      }
    }
  });

  return counts;
}

const TAXONOMY_PATH = path.join(BASE_DIR, 'quiz', 'quiz-taxonomy.json');
const TAXONOMY_SUMMARY_PATH = path.join(BASE_DIR, 'quiz', 'taxonomy-summary.json');

let taxonomySummary = null;
try {
  if (fs.existsSync(TAXONOMY_SUMMARY_PATH)) {
    taxonomySummary = JSON.parse(fs.readFileSync(TAXONOMY_SUMMARY_PATH, 'utf8'));
  }
} catch (e) {
  console.warn('⚠️ Could not load taxonomy summary:', e.message);
}

const TOPIC_KEYWORD_RULES = [
  { pattern: /(анатоми.*сердц|камер.*сердц|перикард.*анатоми|проводящ.*анатоми)/i, topicId: 'cardiac_anatomy' },
  { pattern: /(коронарн.*артери|коронарн.*анатоми|коронарн.*кровообращен)/i, topicId: 'cad_cabg' },
  { pattern: /(коронарн|ибс|cabg|кш|стент|инфаркт|окс|стенокард)/i, topicId: 'cad_cabg' },
  { pattern: /(аортальн.*клапан|аортальн.*стеноз|tavi|тавр|тави|росс|озаки|ао.*регургитац)/i, topicId: 'aortic_valve' },
  { pattern: /(митральн|mitraclip|клипирован.*митрал|мр|пластик.*митрал)/i, topicId: 'mitral_valve' },
  { pattern: /(трикуспид|легочн.*клапан|тк|клапан.*легочн)/i, topicId: 'tricuspid_pulmonary' },
  { pattern: /(грудн.*аорт|диссекци|расслоен.*аорт|дебейки|debakey|stanford|стэнфорд|tevar|тэвар|аневризм.*аорт)/i, topicId: 'aorta_thoracic' },
  { pattern: /(марфан|лоис-дитц|эхлерс|дисплази.*соедин)/i, topicId: 'marfan_connective' },
  { pattern: /(эндокардит|вегетаци|абсцесс.*кольца)/i, topicId: 'endocarditis' },
  { pattern: /(перикард|тампонад|выпот.*перикард|перикардит)/i, topicId: 'pericardium_tumors' },
  { pattern: /(сердечн.*недостаточн|сн|lvad|хсн|трансплантац.*сердц)/i, topicId: 'heart_failure_lvad' },
  { pattern: /(аритми|фибрилляци.*предсерд| maze|лабиринт|пучок гиса|проводящ.*систем|блокад.*ножек)/i, topicId: 'arrhythmia_surgery' },
  { pattern: /(искусственн.*кровообращен|аппарат.*ик|перфузи|контур ик)/i, topicId: 'cpb_cannulation' },
  { pattern: /(кардиоплеги|защит.*миокард|холодов.*кровян)/i, topicId: 'cpb_cardioplegia' },
  { pattern: /(коагулопати|гемостаз|гепарин|протамин|кровотечен.*послеоперац)/i, topicId: 'cpb_hemostasis' },
  { pattern: /(экмо|ecmo|va-ecmo|vv-ecmo)/i, topicId: 'ecmo_mcs' },
  { pattern: /(тетрад.*фалло|tof|fallot)/i, topicId: 'chd_tetralogy' },
  { pattern: /(дмжп|дмпп|дефект.*перегород|оап|авк)/i, topicId: 'chd_shunts' },
  { pattern: /(коарктаци|аортальн.*коаркт)/i, topicId: 'chd_obstructive' },
  { pattern: /(фонтен|гленн|норвуд|единственн.*желудочк)/i, topicId: 'single_ventricle' },
  { pattern: /(рак легк|лобэктоми|пневмонэктоми|торакальн)/i, topicId: 'pulmonary_resection' }
];

function addWeightedTokens(wordCounts, str, weight = 5) {
  if (!str || typeof str !== 'string') return;
  const tokens = tokenizeText(str);
  tokens.forEach(t => {
    if (t.length > 2 && !STOP_WORDS.has(t) && !/^\d+$/.test(t)) {
      wordCounts[t] = (wordCounts[t] || 0) + weight;
      const stemmed = stemRussianWord(t);
      if (stemmed !== t && stemmed.length > 2) {
        wordCounts[stemmed] = (wordCounts[stemmed] || 0) + weight;
      }
    }
  });
}

function findQuizFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        findQuizFiles(filePath, fileList);
      }
    } else if (file.endsWith('.json') && (file.startsWith('quiz-') || filePath.includes('quiz'))) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function generateIndex() {
  console.log('🔍 Generating search index & config with Human Book Titles & Rich Emojis...');

  const libraryPath = path.join(BASE_DIR, 'library.json');
  if (!fs.existsSync(libraryPath)) {
    console.error('❌ library.json not found');
    return;
  }

  const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
  const rawDocuments = [];
  const booksConfig = {};
  const categoriesConfig = {};

  // Add Quiz Category
  categoriesConfig['quiz'] = {
    title: 'Quiz Questions',
    icon: '🧠'
  };

  if (library.categories) {
    library.categories.forEach(cat => {
      const normCatId = cat.id.toLowerCase().replace(/-/g, '_');
      categoriesConfig[normCatId] = {
        title: cat.title,
        icon: CATEGORY_EMOJIS[normCatId] || '📚'
      };

      if (cat.books) {
        cat.books.forEach(b => {
          const folderName = b.folder || b.id;
          if (folderName) {
            const canonicalPath = `books/${cat.id.replace(/_/g, '-')}/${folderName}`;
            const humanTitle = HUMAN_BOOK_TITLES[folderName] || b.title || folderName;

            booksConfig[canonicalPath] = {
              title: humanTitle,
              category: normCatId,
              author: b.author || ''
            };
          }
        });
      }
    });
  }

  // 1. Scan Book Chapters (.md)
  const booksDir = path.join(BASE_DIR, 'books');
  if (fs.existsSync(booksDir)) {
    const categories = fs.readdirSync(booksDir);

    for (const catName of categories) {
      const catPath = path.join(booksDir, catName);
      if (!fs.statSync(catPath).isDirectory()) continue;

      const normCatId = catName.toLowerCase().replace(/-/g, '_');
      const books = fs.readdirSync(catPath);

      for (const bookName of books) {
        const bookPath = path.join(catPath, bookName);
        if (!fs.statSync(bookPath).isDirectory()) continue;

        const canonicalBookId = `books/${catName}/${bookName}`;
        const humanTitle = HUMAN_BOOK_TITLES[bookName] || bookName;

        if (!booksConfig[canonicalBookId]) {
          booksConfig[canonicalBookId] = {
            title: humanTitle,
            category: normCatId,
            author: ''
          };
        }

        const chaptersDir = path.join(bookPath, 'chapters');
        if (!fs.existsSync(chaptersDir)) continue;

        const chapterFolders = fs.readdirSync(chaptersDir);
        for (const chFolder of chapterFolders) {
          const chFolderPath = path.join(chaptersDir, chFolder);
          if (!fs.statSync(chFolderPath).isDirectory()) continue;

          const files = fs.readdirSync(chFolderPath);
          const mdFiles = files.filter(f => f.endsWith('.md'));

          for (const mdFile of mdFiles) {
            const filePath = path.join(chFolderPath, mdFile);
            const content = fs.readFileSync(filePath, 'utf8');

            let editionKey = 'original';
            if (mdFile.endsWith('-ru.md')) editionKey = 'russian';
            else if (mdFile.endsWith('-he.md')) editionKey = 'hebrew';
            else if (mdFile.endsWith('-starley.md')) editionKey = 'starley';

            const chapterBaseName = chFolder;
            const plainText = content.replace(/^#+\s+/gm, '').replace(/```[\s\S]*?```/g, '');

            if (plainText.length < 20) continue;

            const language = detectLanguage(plainText);
            const wordCounts = buildWordCounts(plainText);

            let bookTitle = booksConfig[canonicalBookId]?.title || humanTitle;
            let chapterTitle = chapterBaseName;

            const h1Match = content.match(/^#\s+(.+)$/m);
            if (h1Match) chapterTitle = h1Match[1].trim();

            // Extract explicit taxonomy tags from <details>
            const docTopics = new Set();
            const docTags = new Set();
            const docDisciplines = new Set();

            const detailsRegex = /<details[^>]*>/gi;
            let dMatch;
            while ((dMatch = detailsRegex.exec(content)) !== null) {
              const tagStr = dMatch[0];
              const topM = tagStr.match(/data-topic="([^"]+)"/i);
              if (topM) topM[1].split(',').forEach(x => { const c = x.trim(); if (c) docTopics.add(c); });

              const tagM = tagStr.match(/data-tags="([^"]+)"/i);
              if (tagM) tagM[1].split(',').forEach(x => { const c = x.trim(); if (c) docTags.add(c); });

              const discM = tagStr.match(/data-discipline="([^"]+)"/i);
              if (discM) discM[1].split(',').forEach(x => { const c = x.trim(); if (c) docDisciplines.add(c); });
            }

            // Check verified book taxonomy map first
            const verifiedTopic = taxonomySummary && taxonomySummary.bookMap && taxonomySummary.bookMap[canonicalBookId] && taxonomySummary.bookMap[canonicalBookId][chapterBaseName];
            if (verifiedTopic) {
              if (Array.isArray(verifiedTopic)) {
                verifiedTopic.forEach(t => { if (typeof t === 'string' && t.trim()) docTopics.add(t.trim()); });
              } else if (typeof verifiedTopic === 'string') {
                docTopics.add(verifiedTopic.trim());
              }
            } else {
              // Match strictly against chapter title (never arbitrary body text)
              for (const rule of TOPIC_KEYWORD_RULES) {
                if (rule.pattern.test(chapterTitle)) {
                  docTopics.add(rule.topicId);
                }
              }
            }

            // Inject topic & tag vocabulary tokens into wordCounts
            docTopics.forEach(topId => {
              addWeightedTokens(wordCounts, topId.replace(/_/g, ' '), 6);
              if (taxonomySummary && taxonomySummary.topics && taxonomySummary.topics[topId]) {
                const tInfo = taxonomySummary.topics[topId];
                addWeightedTokens(wordCounts, tInfo.nameRu, 5);
                addWeightedTokens(wordCounts, tInfo.nameEn, 5);
                if (tInfo.disciplineId) docDisciplines.add(tInfo.disciplineId);
              }
            });

            docTags.forEach(tagId => {
              addWeightedTokens(wordCounts, tagId.replace(/_/g, ' '), 7);
              if (taxonomySummary && taxonomySummary.tags && taxonomySummary.tags[tagId]) {
                const tgInfo = taxonomySummary.tags[tagId];
                addWeightedTokens(wordCounts, tgInfo.nameRu, 6);
                addWeightedTokens(wordCounts, tgInfo.nameEn, 6);
              }
            });

            rawDocuments.push({
              id: `${canonicalBookId}|${chapterBaseName}|${editionKey}`,
              type: 'book',
              b: canonicalBookId,
              c: chapterBaseName,
              cat: normCatId,
              ct: chapterTitle,
              bt: bookTitle,
              e: editionKey,
              l: language,
              topics: Array.from(docTopics),
              tags: Array.from(docTags),
              disciplines: Array.from(docDisciplines),
              w: wordCounts
            });
          }
        }
      }
    }
  }

  // 2. Scan Quiz Manifest Files (.json)
  let quizQuestionCount = 0;
  const quizFiles = findQuizFiles(booksDir);

  for (const qFilePath of quizFiles) {
    try {
      const qContent = fs.readFileSync(qFilePath, 'utf8');
      const qJson = JSON.parse(qContent);

      if (!qJson || !Array.isArray(qJson.questions)) continue;

      const relPath = path.relative(BASE_DIR, qFilePath).replace(/\\/g, '/');
      const manifestFileName = path.basename(qFilePath);
      const manifestTitle = (qJson.meta && qJson.meta.title) ? qJson.meta.title : manifestFileName;

      qJson.questions.forEach((q, idx) => {
        const qId = q.id !== undefined ? q.id : (idx + 1);

        // Build searchable text from question text and option values ONLY (EXCLUDE EXPLANATIONS!)
        let textParts = [];
        if (q.questionRu) textParts.push(q.questionRu.replace(/<[^>]+>/g, ' '));
        if (q.questionEn) textParts.push(q.questionEn.replace(/<[^>]+>/g, ' '));

        if (q.optionsRu) {
          Object.values(q.optionsRu).forEach(optVal => {
            if (optVal) textParts.push(String(optVal).replace(/<[^>]+>/g, ' '));
          });
        }
        if (q.optionsEn) {
          Object.values(q.optionsEn).forEach(optVal => {
            if (optVal) textParts.push(String(optVal).replace(/<[^>]+>/g, ' '));
          });
        }

        const fullSearchableText = textParts.join(' ');
        if (fullSearchableText.trim().length < 5) return;

        const wordCounts = buildWordCounts(fullSearchableText);
        const headingText = (q.questionRu || q.questionEn || `Question #${qId}`).replace(/<[^>]+>/g, '').trim();

        const qTopics = Array.isArray(q.topics) ? q.topics : [];
        const qTags = Array.isArray(q.tags) ? q.tags : [];
        const qDisciplines = Array.isArray(q.disciplines) ? q.disciplines : [];

        qTopics.forEach(tId => {
          addWeightedTokens(wordCounts, tId.replace(/_/g, ' '), 5);
          if (taxonomySummary && taxonomySummary.topics && taxonomySummary.topics[tId]) {
            addWeightedTokens(wordCounts, taxonomySummary.topics[tId].nameRu, 4);
            addWeightedTokens(wordCounts, taxonomySummary.topics[tId].nameEn, 4);
          }
        });
        qTags.forEach(tgId => {
          addWeightedTokens(wordCounts, tgId.replace(/_/g, ' '), 6);
          if (taxonomySummary && taxonomySummary.tags && taxonomySummary.tags[tgId]) {
            addWeightedTokens(wordCounts, taxonomySummary.tags[tgId].nameRu, 5);
            addWeightedTokens(wordCounts, taxonomySummary.tags[tgId].nameEn, 5);
          }
        });

        rawDocuments.push({
          id: `quiz|${relPath}|${qId}`,
          type: 'quiz',
          b: relPath.substring(0, relPath.lastIndexOf('/')),
          c: `q-${qId}`,
          cat: 'quiz',
          ct: headingText.length > 90 ? headingText.substring(0, 90) + '...' : headingText,
          bt: `${manifestFileName} (ID: ${qId}) — ${manifestTitle}`,
          manifestName: manifestFileName,
          manifestTitle: manifestTitle,
          e: 'original',
          l: detectLanguage(fullSearchableText),
          w: wordCounts,
          topics: qTopics,
          tags: qTags,
          disciplines: qDisciplines,
          quizFile: relPath,
          qId: qId,
          qRu: q.questionRu || '',
          qEn: q.questionEn || '',
          optRu: q.optionsRu || null,
          optEn: q.optionsEn || null,
          ans: q.correctAnswer || ''
        });

        quizQuestionCount++;
      });
    } catch (err) {
      console.warn(`⚠️ Skipped quiz file ${qFilePath}: ${err.message}`);
    }
  }

  const indexData = {
    version: '2.7',
    generated: new Date().toISOString(),
    totalDocuments: rawDocuments.length,
    quizQuestionCount: quizQuestionCount,
    documents: rawDocuments
  };

  const configData = {
    generated: new Date().toISOString(),
    categories: categoriesConfig,
    books: booksConfig
  };

  fs.writeFileSync(OUTPUT_INDEX, JSON.stringify(indexData));
  fs.writeFileSync(OUTPUT_CONFIG, JSON.stringify(configData, null, 2));

  const stats = fs.statSync(OUTPUT_INDEX);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Search index generated: ${OUTPUT_INDEX} (${sizeMB} MB)`);
  console.log(`✅ Search config generated: ${OUTPUT_CONFIG}`);
  console.log(`📊 Total indexed documents: ${rawDocuments.length} (${quizQuestionCount} quiz questions)`);
}

generateIndex();

