# 2.1 How Sub-Chapters Work

## Overview

Sub-chapters are defined in the book's `metadata.json` file using the `subchapters` array. The system automatically detects and renders them with collapsible navigation.

## Step 1: Update Book Manifest

Open `books/category/book-folder/metadata.json` and add the `subchapters` array to any chapter:

```json
{
  "file": "chapter-02.md",
  "title": "2. Main Chapter Title",
  "subchapters": [
    { "file": "chapter-02-01.md", "title": "2.1 First Sub-Chapter" },
    { "file": "chapter-02-02.md", "title": "2.2 Second Sub-Chapter" },
    { "file": "chapter-02-03.md", "title": "2.3 Third Sub-Chapter" }
  ]
}
```

### Important Rules:

1. **File naming**: Sub-chapters MUST follow the pattern `chapter-XX-YY.md` where:
   - `XX` = parent chapter number (e.g., `02`)
   - `YY` = sub-chapter number (e.g., `01`, `02`, `03`)

2. **File location**: All sub-chapters live in the **same folder** as the parent:
   ```
   chapters/chapter-02/chapter-02.md       ← Parent
   chapters/chapter-02/chapter-02-01.md    ← Sub-chapter
   chapters/chapter-02/chapter-02-02.md    ← Sub-chapter
   ```

3. **Shared images**: All sub-chapters share the parent's `images/` folder:
   ```
   chapters/chapter-02/images/
   ├── figure-01.jpg
   ├── table-01.png
   └── diagram-01.svg
   ```

## Step 2: Create Sub-Chapter Files

Create markdown files for each sub-chapter:

```markdown
# 2.1 First Sub-Chapter Title

## Section 1

Content here...

## Section 2

More content...

---

*This is a sub-chapter of Chapter 2: Main Chapter Title*
```

## Step 3: Add Translations (Optional)

For multi-language support, create translated versions:

```
chapters/chapter-02/
├── chapter-02-01.md       ← English (original)
├── chapter-02-01-ru.md    ← Russian
├── chapter-02-01-he.md    ← Hebrew
└── chapter-02-01-starley.md ← Starley edition
```

The system automatically falls back to original if translation not found.

## How the System Loads Sub-Chapters

When you click a sub-chapter in the sidebar:

1. **URL format**: `reader.html?book=books/category/book&chapter=chapter-02-01&edition=original`
2. **Parent detection**: System extracts parent folder from chapter ID:
   ```javascript
   // chapter-02-01 → chapter-02
   const subchapterMatch = chapterId.match(/^(chapter-\d+)-\d+$/);
   if (subchapterMatch) {
       parentFolder = subchapterMatch[1];
   }
   ```
3. **File path**: System loads from `chapters/chapter-02/chapter-02-01.md`
4. **Images**: Base URL set to `chapters/chapter-02/images/`

## Navigation Behavior

| Action | Result |
|--------|--------|
| Click parent chapter | Expand/collapse sub-chapters |
| Click sub-chapter | Navigate to sub-chapter content |
| Active sub-chapter | Auto-expands parent on page load |
| Sidebar toggle | Arrow rotates from ▶ to ▼ |

---

*See Chapter 2.2 for complete manifest examples.*
