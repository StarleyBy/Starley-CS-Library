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
    // ... (stripping logic remains the same)
    // Remove headers
    markdown = markdown.replace(/^(#+\s.*)$/gm, '');
    // Remove bold/italics
    markdown = markdown.replace(/(\*\*|__)(.*?)\1/g, '$2');
    markdown = markdown.replace(/(\*|_)(.*?)\1/g, '$2');
    // Remove links (only the markdown syntax, keep the text)
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '$1');
    // Remove images
    markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '');
    // Remove blockquotes
    markdown = markdown.replace(/^>\s?.*$/gm, '');
    // Remove list markers
    markdown = markdown.replace(/^(\s*(-|\*|\d+\.))\s/gm, '');
    // Remove horizontal rules
    markdown = markdown.replace(/^-{3,}$/gm, '');
    markdown = markdown.replace(/^_{3,}$/gm, '');
    markdown = markdown.replace(/^\*{3,}$/gm, '');
    // Remove code blocks
    markdown = markdown.replace(/```[\s\S]*?```/g, '');
    // Remove inline code
    markdown = markdown.replace(/`([^`]+)`/g, '$1');
    // Remove extra spaces and newlines
    markdown = markdown.replace(/\s+/g, ' ').trim();
    return markdown;
}

async function generateSearchIndex() {
    console.log('Generating Lunr search index with multi-language support...');
    const documents = [];
    const documentStore = {};
    let docId = 0;

    const libraryData = JSON.parse(fs.readFileSync(LIBRARY_PATH, 'utf8'));

    for (const category of libraryData.categories) {
        for (const bookInfo of category.books) {
            const bookFolderPath = path.join(BOOKS_BASE_PATH, category.path.split('/')[1], bookInfo.folder);
            const metadataPath = path.join(bookFolderPath, 'metadata.json');

            if (!fs.existsSync(metadataPath)) {
                console.warn(`Metadata not found for book: ${bookFolderPath}`);
                continue;
            }

            const metadataContent = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            const bookMetadata = metadataContent[0];

            for (const chapter of bookMetadata.chapters) {
                for (const editionKey in EDITIONS_MAP) {
                    const editionSuffix = EDITIONS_MAP[editionKey];
                    const chapterFileName = chapter.file.replace('.md', editionSuffix);
                    const chapterFolderPath = path.join(bookFolderPath, 'chapters', chapter.file.replace('.md', ''));
                    const chapterFilePath = path.join(chapterFolderPath, chapterFileName);

                    const categoryFolder = category.path.split('/')[1];
                    const bookId = `books/${categoryFolder}/${bookInfo.folder}`;
                    const chapterId = chapter.file.replace('.md', ''); // Base chapter ID

                    if (!fs.existsSync(chapterFilePath)) {
                        // console.warn(`Chapter file not found for edition ${editionKey}: ${chapterFilePath}`);
                        continue; // Skip if file doesn't exist for this edition
                    }

                    const chapterContent = fs.readFileSync(chapterFilePath, 'utf8');
                    const plainTextContent = stripMarkdown(chapterContent);

                    const doc = {
                        id: docId,
                        title: `${bookMetadata.title} - ${chapter.title}`,
                        content: plainTextContent,
                        language: editionKey // Add language field to Lunr document
                    };
                    documents.push(doc);

                    documentStore[docId] = {
                        bookTitle: bookMetadata.title,
                        chapterTitle: chapter.title,
                        bookId: bookId,
                        chapterId: chapterId,
                        edition: editionKey, // Store the specific edition for URL construction
                        snippet: plainTextContent.substring(0, 300) + '...'
                    };
                    
                    docId++;
                }
            }
        }
    }

    // Create the Lunr index
    const lunrIndex = lunr(function () {
        this.ref('id');
        this.field('title', { boost: 10 }); // Boost title field for relevance
        this.field('content');
        this.field('language'); // Add language field to Lunr index for filtering

        documents.forEach(function (doc) {
            this.add(doc);
        }, this);
    });

    // Save the serialized index and the document store
    fs.writeFileSync(LUNR_INDEX_PATH, JSON.stringify(lunrIndex), 'utf8');
    fs.writeFileSync(DOC_STORE_PATH, JSON.stringify(documentStore, null, 2), 'utf8');
    
    console.log(`Lunr index generated successfully: ${LUNR_INDEX_PATH}`);
    console.log(`Document store generated successfully: ${DOC_STORE_PATH}`);
    console.log(`Total indexed items: ${documents.length}`);
}

generateSearchIndex().catch(console.error);
