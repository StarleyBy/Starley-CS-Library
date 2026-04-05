const fs = require('fs');
const path = require('path');

const books = [
    {
        title: 'Executive Summaries: Bojar - ICU',
        baseDir: 'books/icu/bojar/chapters',
        outputFile: 'Executive_Summaries_Bojar.md'
    },
    {
        title: 'Executive Summaries: Key Questions in Cardiac Surgery',
        baseDir: 'books/cardiac-surgery/Key-questions-in-cardiac-surgery/chapters',
        outputFile: 'Executive_Summaries_Key_Questions_Cardiac.md'
    },
    {
        title: 'Executive Summaries: Key Questions in Congenital Cardiac Surgery',
        baseDir: 'books/cardiac-surgery/Key-questions-in-congenital-cardiac-surgery/chapters',
        outputFile: 'Executive_Summaries_Key_Questions_Congenital.md'
    }
];

function extractSummaries(book) {
    console.log(`Processing: ${book.title}`);
    let combinedContent = `# ${book.title}\n\n`;
    const fullBaseDir = path.resolve(book.baseDir);

    if (!fs.existsSync(fullBaseDir)) {
        console.error(`Error: Directory not found ${fullBaseDir}`);
        return;
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
            
            // Find all <summary> tags
            const summaryRegex = /<summary>([\s\S]*?)<\/summary>/gi;
            let match;
            
            while ((match = summaryRegex.exec(content)) !== null) {
                const summaryHTML = match[1];
                const summaryText = summaryHTML.replace(/<[^>]+>/g, '').trim();
                
                if (summaryText.toLowerCase().includes('executive summary')) {
                    const summaryStart = match.index;
                    const detailsStart = content.lastIndexOf('<details', summaryStart);
                    
                    if (detailsStart !== -1) {
                        // Find the end of this details block (balanced)
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
                                combinedContent += `## Chapter ${chapterNum}: ${title}\n\n${summaryContent}\n\n---\n\n`;
                                foundSummary = true;
                                console.log(`  Successfully processed Chapter ${chapterNum}`);
                                break;
                            }
                        }
                    }
                }
            }

            if (!foundSummary) {
                console.warn(`  Warning: Could not find Executive Summary in ${filePath}`);
            }
        }
    });

    fs.writeFileSync(book.outputFile, combinedContent);
    console.log(`  Done! Saved to ${book.outputFile}\n`);
}

books.forEach(extractSummaries);
