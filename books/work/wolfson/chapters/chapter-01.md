# 1. Introduction to Sub-Chapters

## What are Sub-Chapters?

Sub-chapters allow you to split large chapters into smaller, more manageable sections. This improves:

- **Loading speed** - smaller files load faster
- **Navigation** - easier to find specific content
- **Mobile UX** - better readability on small screens
- **Organization** - logical grouping of related topics

## Key Features

✅ **Collapsible sidebar** - click parent chapter to expand/collapse  
✅ **Auto-expansion** - active sub-chapter automatically opens parent  
✅ **Visual hierarchy** - indentation and dot indicators  
✅ **Shared images** - all sub-chapters use parent's `images/` folder  
✅ **Full translation support** - works with all editions (EN, RU, HE, STL)  

## File Structure

```
books/category/book-folder/
├── metadata.json              ← Book manifest with subchapters array
├── cover.jpg                  ← Book cover image
└── chapters/
    ├── chapter-01/
    │   ├── chapter-01.md      ← Regular chapter (no sub-chapters)
    │   └── images/            ← Chapter images
    ├── chapter-02/
    │   ├── chapter-02.md      ← Parent chapter
    │   ├── chapter-02-01.md   ← Sub-chapter 2.1
    │   ├── chapter-02-02.md   ← Sub-chapter 2.2
    │   ├── chapter-02-03.md   ← Sub-chapter 2.3
    │   └── images/            ← Shared images for all sub-chapters
    └── chapter-03/
        └── chapter-03.md      ← Another regular chapter
```

## Naming Convention

Sub-chapters follow this pattern:
- Parent: `chapter-02.md`
- Sub-chapters: `chapter-02-01.md`, `chapter-02-02.md`, etc.

All files live in the **same folder** as the parent (`chapters/chapter-02/`).

---

*Continue to Chapter 2 for detailed implementation guide with examples.*
