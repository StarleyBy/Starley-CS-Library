const fs = require('fs');
const path = require('path');
const lunr = require('lunr');

const LIBRARY_PATH = 'library.json';
const LUNR_INDEX_PATH = 'search/lunr-index.json';
const DOC_STORE_PATH = 'search/document-store.json';
const BOOKS_BASE_PATH = 'books';

const EDITIONS_MAP = {
    'original': '.md',
    'russian': '-ru.md',
    'hebrew': '-he.md',
    'starley': '-starley.md'
};

function stripMarkdown(markdown) {
    // Remove headers
    markdown = markdown.replace(/^(#+\s.*)$/gm, ' ');
    // Remove bold/italics
    markdown = markdown.replace(/(\*\*|__)(.*?)\1/g, '$2');
    markdown = markdown.replace(/(\*|_)(.*?)\1/g, '$2');
    // Remove links (only the markdown syntax, keep the text)
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '$1');
    // Remove images
    markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '');
    // Remove blockquotes
    markdown = markdown.replace(/^>\s?.*$/gm, ' ');
    // Remove list markers
    markdown = markdown.replace(/^(\s*(-|\*|\d+\.))\s/gm, ' ');
    // Remove horizontal rules
    markdown = markdown.replace(/^-{3,}$/gm, ' ');
    markdown = markdown.replace(/^_{3,}$/gm, ' ');
    markdown = markdown.replace(/^\*{3,}$/gm, ' ');
    // Remove code blocks
    markdown = markdown.replace(/```[\s\S]*?```/g, ' ');
    // Remove inline code
    markdown = markdown.replace(/`([^`]+)`/g, '$1');
    // Remove HTML tags
    markdown = markdown.replace(/<[^>]*>/g, ' ');
    // Remove extra spaces and newlines
    markdown = markdown.replace(/\s+/g, ' ').trim();
    return markdown;
}

async function generateSearchIndex() {
    console.log('Generating Lunr search index with smart snippet support...');
    const documents = [];
    const documentStore = {};
    let docId = 0;

    if (!fs.existsSync(LIBRARY_PATH)) {
        console.error(`Library file not found: ${LIBRARY_PATH}`);
        return;
    }

    const libraryData = JSON.parse(fs.readFileSync(LIBRARY_PATH, 'utf8'));

    for (const category of libraryData.categories) {
        // Extract category folder from path (e.g., "books/anatomy" -> "anatomy")
        const categoryFolder = category.path.split('/').filter(p => p && p !== 'books')[0] || '';
        
        for (const bookInfo of category.books) {
            const bookFolderPath = path.join(BOOKS_BASE_PATH, categoryFolder, bookInfo.folder);
            const metadataPath = path.join(bookFolderPath, 'metadata.json');

            if (!fs.existsSync(metadataPath)) {
                // console.warn(`Metadata not found for book: ${bookFolderPath}`);
                continue;
            }

            const metadataContent = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            const bookMetadata = metadataContent[0];

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
                    const plainTextContent = stripMarkdown(chapterContent);

                    if (plainTextContent.length < 10) continue; // Skip nearly empty files

                    const doc = {
                        id: docId,
                        title: `${bookMetadata.title} - ${chapter.title}`,
                        content: plainTextContent,
                        language: editionKey
                    };
                    documents.push(doc);

                    documentStore[docId] = {
                        bookTitle: bookMetadata.title,
                        chapterTitle: chapter.title,
                        bookId: `books/${categoryFolder}/${bookInfo.folder}`,
                        chapterId: chapterBaseName,
                        edition: editionKey
                        // content removed to save space, will be fetched on demand
                    };
                    
                    docId++;
                }
            }
        }
    }

    // Create the Lunr index
    const lunrIndex = lunr(function () {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('content');
        this.field('language');

        // Optional: enable position metadata for advanced highlighting if needed later
        // this.metadataWhitelist = ['position'];

        documents.forEach(function (doc) {
            this.add(doc);
        }, this);
    });

    // Save the serialized index and the document store
    fs.writeFileSync(LUNR_INDEX_PATH, JSON.stringify(lunrIndex), 'utf8');
    fs.writeFileSync(DOC_STORE_PATH, JSON.stringify(documentStore), 'utf8'); // Minified for size
    
    console.log(`Lunr index generated: ${LUNR_INDEX_PATH} (${(fs.statSync(LUNR_INDEX_PATH).size / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`Document store generated: ${DOC_STORE_PATH} (${(fs.statSync(DOC_STORE_PATH).size / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`Total indexed items: ${documents.length}`);
}

generateSearchIndex().catch(console.error);
