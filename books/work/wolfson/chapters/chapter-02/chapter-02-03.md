# 2.3 Best Practices

## Organizing Sub-Chapters

### When to Use Sub-Chapters

✅ **Good candidates:**
- Chapters > 5000 words
- Chapters with 3+ distinct sections
- Complex topics requiring detailed navigation
- Content that users reference frequently

❌ **Not needed:**
- Short introductory chapters
- Simple procedural descriptions
- Chapters < 2000 words

### Naming Conventions

```
✅ Good:
chapter-02-01.md    ← Clear, sequential
chapter-02-02.md
chapter-02-03.md

❌ Bad:
chapter-02-part1.md    ← Inconsistent
ch2-section-a.md       ← Wrong format
subchapter-1.md        ← Loses parent reference
```

### Image Organization

```
chapters/chapter-02/
├── chapter-02.md           ← Parent chapter
├── chapter-02-01.md        ← Sub-chapter 2.1
├── chapter-02-02.md        ← Sub-chapter 2.2
└── images/                 ← Shared by all
    ├── figure-01.jpg       ← Used in 2.1
    ├── figure-02.jpg       ← Used in 2.2
    └── table-01.png        ← Used in parent
```

**In markdown:**
```markdown
![Figure 1](images/figure-01.jpg)
```

The system automatically resolves to: `books/category/book/chapters/chapter-02/images/figure-01.jpg`

## Performance Tips

### File Size Guidelines

| File Type | Target Size | Loading Time |
|-----------|-------------|--------------|
| Chapter (no sub-chapters) | < 50 KB | < 0.5s |
| Sub-chapter | < 15 KB | < 0.2s |
| Images | < 500 KB each | < 1s |

### Splitting Strategy

**Before:**
```
chapter-05.md (120 KB) - "Surgical Techniques"
- Section 1: CABG (40 KB)
- Section 2: Valve Repair (35 KB)
- Section 3: Aortic Surgery (45 KB)
```

**After:**
```
chapter-05.md (10 KB) - Introduction + Overview
chapter-05-01.md (35 KB) - 5.1 CABG Techniques
chapter-05-02.md (30 KB) - 5.2 Valve Repair
chapter-05-03.md (40 KB) - 5.3 Aortic Surgery
```

**Result:** 4x faster initial load, better navigation.

## Common Issues

### Issue 1: Sub-Chapter Not Found (404)

**Symptoms:** Browser console shows `404 Not Found`

**Causes:**
- File named incorrectly (e.g., `chapter-02-1.md` instead of `chapter-02-01.md`)
- File in wrong folder (e.g., `chapters/chapter-02-01/` instead of `chapters/chapter-02/`)
- Typo in `metadata.json` file reference

**Solution:**
```bash
# Check file structure
ls books/category/book/chapters/chapter-02/

# Should show:
# chapter-02.md
# chapter-02-01.md
# chapter-02-02.md
# images/
```

### Issue 2: Images Not Loading

**Symptoms:** Broken image icons in sub-chapters

**Cause:** Image path incorrect

**Solution:**
```markdown
✅ Correct:
![Alt text](images/figure-01.jpg)

❌ Wrong:
![Alt text](../images/figure-01.jpg)
![Alt text](chapter-02/images/figure-01.jpg)
```

### Issue 3: Sidebar Not Showing Sub-Chapters

**Symptoms:** Parent chapter shows but no expand arrow

**Causes:**
- `subchapters` array missing or malformed in `metadata.json`
- JSON syntax error in manifest

**Solution:**
```json
✅ Valid JSON:
{
  "file": "chapter-02.md",
  "title": "Chapter 2",
  "subchapters": [
    { "file": "chapter-02-01.md", "title": "2.1 First" }
  ]
}

❌ Invalid JSON (trailing comma):
{
  "file": "chapter-02.md",
  "title": "Chapter 2",
  "subchapters": [
    { "file": "chapter-02-01.md", "title": "2.1 First" },
  ]
}
```

## Migration Strategy

### Converting Existing Large Chapters

1. **Identify candidates**: Find chapters > 50 KB
2. **Extract sections**: Split content into sub-chapter files
3. **Update manifest**: Add `subchapters` array to `metadata.json`
4. **Test**: Load each sub-chapter and verify navigation
5. **Keep parent**: Leave parent chapter with brief intro + TOC

### Example Migration

**Original `chapter-05.md`:**
```markdown
# 5. Surgical Techniques

## 5.1 CABG
[40 KB of content...]

## 5.2 Valve Repair
[35 KB of content...]

## 5.3 Aortic Surgery
[45 KB of content...]
```

**After migration:**

`chapter-05.md` (new):
```markdown
# 5. Surgical Techniques

## Overview

This chapter covers major surgical techniques. See sub-chapters for details.

## Table of Contents

- [5.1 CABG Techniques](#) → chapter-05-01.md
- [5.2 Valve Repair](#) → chapter-05-02.md
- [5.3 Aortic Surgery](#) → chapter-05-03.md
```

`chapter-05-01.md`:
```markdown
# 5.1 CABG Techniques

[Full 40 KB content...]
```

---

*See Chapter 3 for troubleshooting common issues.*
