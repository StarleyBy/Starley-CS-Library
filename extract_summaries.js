const fs = require('fs');
const path = require('path');

const baseDir = 'books/cardiac-surgery/cohn/chapters';
const outputFile = 'Executive_Summaries_Cohn.md';
let combinedContent = '# Executive Summaries: Cardiac Surgery in the Adult, Fifth Edition\n\n';

for (let i = 1; i <= 63; i++) {
    const chapterNum = i.toString().padStart(2, '0');
    const chapterDir = `chapter-${chapterNum}`;
    const filePath = path.join(baseDir, chapterDir, `chapter-${chapterNum}.md`);

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
                            combinedContent += `## Chapter ${i}: ${title}\n\n${summaryContent}\n\n---\n\n`;
                            foundSummary = true;
                            console.log(`Successfully processed Chapter ${i}`);
                            break;
                        }
                    }
                }
            }
        }

        if (!foundSummary) {
            console.warn(`Could not find Executive Summary in ${filePath}`);
        }
    }
}

fs.writeFileSync(outputFile, combinedContent);
console.log(`Done!`);
