const fs = require('fs');
const path = require('path');

const books = [
    {
        id: 'cohn',
        title: 'Executive Summaries: Cardiac Surgery in the Adult (Cohn)',
        baseDir: 'books/cardiac-surgery/cohn/chapters',
        outputFile: 'Executive_Summaries_Cohn.md',
        chapterIndex: 0,
        metaTitle: '1. Cardiac Surgery in the Adult, Fifth Edition by Lawrence H. Cohn, MD, David H. Adams, MD'
    },
    {
        id: 'bojar',
        title: 'Executive Summaries: Bojar - ICU',
        baseDir: 'books/icu/bojar/chapters',
        outputFile: 'Executive_Summaries_Bojar.md',
        chapterIndex: 1,
        metaTitle: '2. MANUAL of PERIOPERATIVE CARE in ADULT CARDIAC SURGERY, Sixth Edition by Robert M. Bojar, MD'
    },
    {
        id: 'congenital',
        title: 'Executive Summaries: Key Questions in Congenital Cardiac Surgery',
        baseDir: 'books/cardiac-surgery/Key-questions-in-congenital-cardiac-surgery/chapters',
        outputFile: 'Executive_Summaries_Key_Questions_Congenital.md',
        chapterIndex: 2,
        metaTitle: '3. Key Questions in Congenital Cardiac Surgery by Narain Moorjani, Nicola Viola, Christopher A. Caldarone'
    },
    {
        id: 'cardiac',
        title: 'Executive Summaries: Key Questions in Cardiac Surgery',
        baseDir: 'books/cardiac-surgery/Key-questions-in-cardiac-surgery/chapters',
        outputFile: 'Executive_Summaries_Key_Questions_Cardiac.md',
        chapterIndex: 3,
        metaTitle: '4. Key Questions in Cardiac Surgery by Narain Moorjani, Nicola Viola, Sunil K. Ohri'
    },
    {
        id: 'netter',
        title: 'Executive Summaries: Netter Cardiothoracic Anatomy',
        baseDir: 'books/anatomy/Netter-Cardiothoracic-Anatomy/chapters',
        outputFile: 'Executive_Summaries_Netter.md',
        chapterIndex: 4,
        metaTitle: '5. Netter Cardiothoracic Anatomy by Florentino J. Neto'
    },
    {
        id: 'wilcox',
        title: 'Executive Summaries: Wilcox - Surgical Anatomy',
        baseDir: 'books/anatomy/wilcox/chapters',
        outputFile: 'Executive_Summaries_Wilcox.md',
        chapterIndex: 5,
        metaTitle: '6. Surgical Anatomy of the Heart by Benson R. Wilcox'
    }
];

const summaryBookDir = 'books/summary/mysummary';

function extractSummaries(book) {
    console.log(`Processing: ${book.title}`);
    let combinedContent = `# ${book.title}\n\n`;
    const fullBaseDir = path.resolve(book.baseDir);

    if (!fs.existsSync(fullBaseDir)) {
        console.error(`Error: Directory not found ${fullBaseDir}`);
        return null;
    }

    const chapters = fs.readdirSync(fullBaseDir)
        .filter(f => f.startsWith('chapter-'))
        .sort((a, b) => {
            const numA = parseInt(a.replace('chapter-', ''));
            const numB = parseInt(b.replace('chapter-', ''));
            return numA - numB;
        });

    chapters.forEach(chapterDir => {
        const chapterNumStr = chapterDir.replace('chapter-', '');
        const chapterNum = parseInt(chapterNumStr);
        const filePath = path.join(fullBaseDir, chapterDir, `${chapterDir}.md`);

        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const titleMatch = content.match(/^#\s+(.+)$/m);
            const title = titleMatch ? titleMatch[1] : `Chapter ${chapterNum}`;

            let foundSummary = false;
            const summaryRegex = /<summary>([\s\S]*?)<\/summary>/gi;
            let match;
            
            while ((match = summaryRegex.exec(content)) !== null) {
                const summaryHTML = match[1];
                const summaryText = summaryHTML.replace(/<[^>]+>/g, '').trim();
                
                if (summaryText.toLowerCase().includes('executive summary')) {
                    const summaryStart = match.index;
                    const detailsStart = content.lastIndexOf('<details', summaryStart);
                    
                    if (detailsStart !== -1) {
                        let depth = 0;
                        let currentIndex = detailsStart;
                        let endIndex = -1;
                        const lowerContent = content.toLowerCase();
                        
                        while (currentIndex < content.length) {
                            const nextOpen = lowerContent.indexOf('<details', currentIndex);
                            const nextClose = lowerContent.indexOf('</details>', currentIndex);
                            if (nextClose === -1) break;
                            if (nextOpen !== -1 && nextOpen < nextClose) {
                                depth++;
                                currentIndex = nextOpen + 8;
                            } else {
                                depth--;
                                currentIndex = nextClose + 10;
                                if (depth === 0) {
                                    endIndex = currentIndex;
                                    break;
                                }
                            }
                        }
                        
                        if (endIndex !== -1) {
                            const fullBlock = content.substring(detailsStart, endIndex);
                            const divStart = fullBlock.indexOf('<div class="details-content">');
                            if (divStart !== -1) {
                                const contentStartIndex = divStart + '<div class="details-content">'.length;
                                const contentEndIndex = fullBlock.lastIndexOf('</div>');
                                const summaryContent = fullBlock.substring(contentStartIndex, contentEndIndex).trim();
                                
                                combinedContent += `<details>\n<summary>\n\n## Chapter ${chapterNum}: ${title}</summary>\n\n${summaryContent}\n\n</details>\n\n---\n\n`;
                                
                                foundSummary = true;
                                console.log(`  Successfully processed Chapter ${chapterNum}`);
                                break;
                            }
                        }
                    }
                }
            }
        }
    });

    fs.writeFileSync(book.outputFile, combinedContent);
    return combinedContent;
}

function updateSummaryBook(book, content) {
    if (!content) return;
    const chapterNum = book.chapterIndex + 1;
    const chapterFolderName = `chapter-${chapterNum.toString().padStart(2, '0')}`;
    const chapterDirPath = path.join(summaryBookDir, 'chapters', chapterFolderName);
    const chapterFilePath = path.join(chapterDirPath, `${chapterFolderName}.md`);

    if (!fs.existsSync(chapterDirPath)) {
        fs.mkdirSync(chapterDirPath, { recursive: true });
    }

    fs.writeFileSync(chapterFilePath, content);
    console.log(`  Updated ${chapterFolderName} in mysummary`);
}

function updateMetadata() {
    const metadataPath = path.join(summaryBookDir, 'metadata.json');
    if (!fs.existsSync(metadataPath)) return;

    const metadataArray = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const metadata = metadataArray[0];
    
    books.forEach(book => {
        const chapterNum = book.chapterIndex + 1;
        const fileName = `chapter-${chapterNum.toString().padStart(2, '0')}.md`;
        
        if (metadata.chapters[book.chapterIndex]) {
            metadata.chapters[book.chapterIndex].file = fileName;
            metadata.chapters[book.chapterIndex].title = book.metaTitle;
        } else {
            metadata.chapters[book.chapterIndex] = {
                file: fileName,
                title: book.metaTitle
            };
        }
    });

    fs.writeFileSync(metadataPath, JSON.stringify(metadataArray, null, 2));
    console.log(`Metadata updated successfully.`);
}

books.forEach(book => {
    const content = extractSummaries(book);
    updateSummaryBook(book, content);
});

updateMetadata();
