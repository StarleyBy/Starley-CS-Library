const fs = require('fs');
const path = require('path');

const LIBRARY_PATH = 'library.json';
const SEARCH_INDEX_PATH = 'search/search-index.json';
const SEARCH_CONFIG_PATH = 'search/search-config.json';
const BOOKS_BASE_PATH = 'books';

const EDITIONS_MAP = {
    'original': '.md',
    'russian': '-ru.md',
    'hebrew': '-he.md',
    'starley': '-starley.md'
};

// Расширенные списки стоп-слов для разных языков
const STOP_WORDS = {
    english: new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
        'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
        'that', 'these', 'those', 'it', 'its', 'i', 'you', 'he', 'she', 'we',
        'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our',
        'their', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how',
        'not', 'no', 'nor', 'so', 'if', 'then', 'than', 'too', 'very', 'just',
        'about', 'above', 'below', 'between', 'into', 'through', 'during',
        'before', 'after', 'out', 'up', 'down', 'off', 'over', 'under',
        'again', 'further', 'once', 'here', 'there', 'all', 'each', 'every',
        'both', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own',
        'same', 'as', 'also', 'any'
    ]),
    russian: new Set([
        'и', 'в', 'не', 'на', 'с', 'по', 'к', 'у', 'о', 'из', 'до', 'от',
        'для', 'за', 'при', 'без', 'над', 'под', 'между', 'через', 'после',
        'перед', 'что', 'это', 'тот', 'эта', 'это', 'те', 'так', 'как',
        'если', 'или', 'но', 'а', 'же', 'бы', 'ли', 'вот', 'уже', 'еще',
        'только', 'даже', 'все', 'весь', 'вся', 'всё', 'всех', 'всеми',
        'его', 'ее', 'их', 'мой', 'твой', 'наш', 'ваш', 'свой', 'который',
        'кто', 'чем', 'где', 'когда', 'почему', 'зачем', 'потому', 'можно',
        'нужно', 'надо', 'должен', 'должна', 'был', 'была', 'было', 'были',
        'есть', 'быть', 'будет', 'будут', 'была', 'стать', 'стал', 'стало',
        'стали', 'мы', 'вы', 'они', 'я', 'ты', 'он', 'она', 'оно', 'меня',
        'тебя', 'ему', 'ей', 'ним', 'ней', 'ними', 'мне', 'тебе', 'нем',
        'ней', 'меня', 'тебя', 'его', 'нее', 'них'
    ]),
    hebrew: new Set([
        'את', 'של', 'על', 'עם', 'כי', 'זה', 'היא', 'הוא', 'אני', 'אתה',
        'אנחנו', 'הם', 'הן', 'ב', 'ה', 'ו', 'ל', 'מ', 'ש', 'כל', 'גם',
        'אבל', 'או', 'כמו', 'יותר', 'אין', 'יש', 'לא', 'כן', 'מה', 'מי',
        'איפה', 'מתי', 'למה', 'איך', 'אם', 'רק', 'עוד', 'כבר', 'אחרי',
        'לפני', 'בתוך', 'מתוך', 'בין', 'תחת', 'מעל', 'מול', 'ליד', 'עד'
    ])
};

function detectLanguage(text) {
    if (/[\u0400-\u04FF]/.test(text)) return 'russian';
    if (/[\u0590-\u05FF]/.test(text)) return 'hebrew';
    return 'english';
}

function tokenize(text, language) {
    const stopWords = STOP_WORDS[language] || STOP_WORDS.english;
    
    // Приводим к нижнему регистру и разбиваем на токены
    // Сохраняем числа и слова с дефисами (например, "post-operative")
    const tokens = text.toLowerCase()
        .replace(/[^\w\s\u0400-\u04FF\u0590-\u05FF-]/g, ' ')
        .split(/\s+/)
        .filter(token => token.length > 2 && !stopWords.has(token));
    
    return tokens;
}

function buildWordCounts(text, language) {
    const wordCounts = {};
    const tokens = tokenize(text, language);
    
    for (const token of tokens) {
        if (!wordCounts[token]) {
            wordCounts[token] = 0;
        }
        wordCounts[token]++;
    }
    
    return wordCounts;
}

function stripMarkdown(markdown) {
    markdown = markdown.replace(/```[\s\S]*?```/g, ' ');
    markdown = markdown.replace(/^(#+\s.*)$/gm, ' ');
    markdown = markdown.replace(/(\*\*|__)(.*?)\1/g, '$2');
    markdown = markdown.replace(/(\*|_)(.*?)\1/g, '$2');
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '$1');
    markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '');
    markdown = markdown.replace(/^>\s?.*$/gm, ' ');
    markdown = markdown.replace(/^(\s*(-|\*|\d+\.))\s/gm, ' ');
    markdown = markdown.replace(/^-{3,}$/gm, ' ');
    markdown = markdown.replace(/^_{3,}$/gm, ' ');
    markdown = markdown.replace(/^\*{3,}$/gm, ' ');
    markdown = markdown.replace(/`([^`]+)`/g, '$1');
    markdown = markdown.replace(/<[^>]*>/g, ' ');
    markdown = markdown.replace(/\s+/g, ' ').trim();
    return markdown;
}

function extractContext(text, position, contextLength = 100) {
    const start = Math.max(0, position.start - contextLength);
    const end = Math.min(text.length, position.end + contextLength);
    
    let snippet = text.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    return snippet;
}

async function generateSearchIndex() {
    console.log('🔍 Generating custom search index with word positions...');
    
    const documents = [];
    const config = {
        books: {},
        categories: {}
    };
    
    if (!fs.existsSync(LIBRARY_PATH)) {
        console.error(`❌ Library file not found: ${LIBRARY_PATH}`);
        return;
    }

    const libraryData = JSON.parse(fs.readFileSync(LIBRARY_PATH, 'utf8'));

    // Собираем конфигурацию книг
    for (const category of libraryData.categories) {
        const categoryFolder = category.path.split('/').filter(p => p && p !== 'books')[0] || '';
        config.categories[category.id] = {
            title: category.title,
            path: category.path
        };
        
        for (const bookInfo of category.books) {
            const bookFolderPath = path.join(BOOKS_BASE_PATH, categoryFolder, bookInfo.folder);
            const metadataPath = path.join(bookFolderPath, 'metadata.json');

            if (!fs.existsSync(metadataPath)) {
                continue;
            }

            const metadataContent = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            const bookMetadata = metadataContent[0];
            const bookId = `books/${categoryFolder}/${bookInfo.folder}`;
            
            config.books[bookId] = {
                title: bookMetadata.title,
                category: category.id,
                path: bookFolderPath
            };

            // Индексируем каждую главу
            for (const chapter of bookMetadata.chapters) {
                const chapterBaseName = chapter.file.replace('.md', '');

                for (const editionKey in EDITIONS_MAP) {
                    const editionSuffix = EDITIONS_MAP[editionKey];
                    const chapterFileName = `${chapterBaseName}${editionSuffix}`;
                    const chapterFilePath = path.join(bookFolderPath, 'chapters', chapterBaseName, chapterFileName);

                    if (!fs.existsSync(chapterFilePath)) {
                        continue;
                    }

                    const chapterContent = fs.readFileSync(chapterFilePath, 'utf8');
                    const plainText = stripMarkdown(chapterContent);

                    if (plainText.length < 20) continue;

                    const language = detectLanguage(plainText);
                    const wordCounts = buildWordCounts(plainText, language);

                    // Агрессивная компрессия: только счетчики для слов > 3 символов
                    const compressedWords = {};
                    for (const [word, count] of Object.entries(wordCounts)) {
                        if (count > 1 && word.length > 3) {
                            compressedWords[word] = count;
                        }
                    }

                    documents.push({
                        id: `${bookId}|${chapterBaseName}|${editionKey}`,
                        b: bookId,
                        c: chapterBaseName,
                        ct: chapter.title,
                        bt: bookMetadata.title,
                        e: editionKey,
                        l: language,
                        len: plainText.length,
                        w: compressedWords
                    });
                }
            }
        }
    }

    // Сохраняем индекс и конфигурацию
    const indexData = {
        version: '2.0',
        generated: new Date().toISOString(),
        totalDocuments: documents.length,
        documents: documents
    };

    fs.writeFileSync(SEARCH_INDEX_PATH, JSON.stringify(indexData), 'utf8');
    fs.writeFileSync(SEARCH_CONFIG_PATH, JSON.stringify(config), 'utf8');

    const indexSizeMB = (fs.statSync(SEARCH_INDEX_PATH).size / 1024 / 1024).toFixed(2);
    const configSizeKB = (fs.statSync(SEARCH_CONFIG_PATH).size / 1024).toFixed(2);
    
    console.log(`✅ Search index generated: ${SEARCH_INDEX_PATH} (${indexSizeMB} MB)`);
    console.log(`✅ Search config generated: ${SEARCH_CONFIG_PATH} (${configSizeKB} KB)`);
    console.log(`📊 Total indexed documents: ${documents.length}`);
    console.log(`📚 Total books: ${Object.keys(config.books).length}`);
    console.log(`📁 Total categories: ${Object.keys(config.categories).length}`);
}

generateSearchIndex().catch(console.error);
