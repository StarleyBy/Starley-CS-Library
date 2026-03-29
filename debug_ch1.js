const fs = require('fs');
const content = fs.readFileSync('books/cardiac-surgery/cohn/chapters/chapter-01/chapter-01.md', 'utf8');
const detailsStartRegex = /<details[^>]*>/gi;
let match;
while ((match = detailsStartRegex.exec(content)) !== null) {
    const startIndex = match.index;
    console.log(`Found details at ${startIndex}`);
    const blockSnippet = content.substring(startIndex, startIndex + 500);
    console.log(`Snippet: ${blockSnippet}`);
    const summaryMatch = blockSnippet.match(/<summary>([\s\S]*?)<\/summary>/i);
    if (summaryMatch) {
        console.log(`Found summary: [${summaryMatch[1]}]`);
        const summaryText = summaryMatch[1].replace(/<[^>]+>/g, '').trim();
        console.log(`Summary text: [${summaryText}]`);
    }
}
