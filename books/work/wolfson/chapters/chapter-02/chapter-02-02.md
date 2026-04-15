# 2.2 Manifest Examples

## Complete Book Manifest Examples

### Example 1: Simple Book (No Sub-Chapters)

```json
[{
  "title": "Basic Cardiac Surgery",
  "cover_image": "cover.jpg",
  "category": ["cardiac-surgery"],
  "authors": ["John Doe, MD"],
  "versions": {
    "original": true,
    "russian": true,
    "starley": false,
    "hebrew": false
  },
  "chapters": [
    { "file": "chapter-01.md", "title": "1. Introduction" },
    { "file": "chapter-02.md", "title": "2. Preoperative Assessment" },
    { "file": "chapter-03.md", "title": "3. Surgical Techniques" }
  ]
}]
```

### Example 2: Book with Sub-Chapters

```json
[{
  "title": "Advanced Perioperative Care",
  "cover_image": "cover.jpg",
  "category": ["icu", "cardiac-surgery"],
  "authors": ["Jane Smith, MD", "Robert Brown, MD"],
  "versions": {
    "original": true,
    "russian": true,
    "starley": true,
    "hebrew": false
  },
  "chapters": [
    {
      "file": "chapter-01.md",
      "title": "1. Synopsis of Adult Cardiac Surgical Disease",
      "subchapters": [
        { "file": "chapter-01-01.md", "title": "1.1 Coronary Artery Disease" },
        { "file": "chapter-01-02.md", "title": "1.2 Valvular Heart Disease" },
        { "file": "chapter-01-03.md", "title": "1.3 Aortic Disease" }
      ]
    },
    {
      "file": "chapter-02.md",
      "title": "2. Diagnostic Techniques",
      "subchapters": [
        { "file": "chapter-02-01.md", "title": "2.1 Echocardiography" },
        { "file": "chapter-02-02.md", "title": "2.2 Cardiac Catheterization" },
        { "file": "chapter-02-03.md", "title": "2.3 MRI and CT Imaging" }
      ]
    },
    {
      "file": "chapter-03.md",
      "title": "3. Postoperative Care"
    }
  ],
  "appendices": [
    { "file": "appendix.md", "title": "Appendix: Drug Doses" }
  ]
}]
```

### Example 3: Mixed Structure (Some Chapters with Sub-Chapters, Some Without)

```json
[{
  "title": "Comprehensive Thoracic Surgery",
  "cover_image": "cover.jpg",
  "category": ["thoracic-surgery"],
  "authors": ["Dr. Alex Johnson"],
  "versions": {
    "original": true,
    "russian": false,
    "starley": false,
    "hebrew": false
  },
  "chapters": [
    {
      "file": "chapter-01.md",
      "title": "1. Anatomy of the Thorax",
      "subchapters": [
        { "file": "chapter-01-01.md", "title": "1.1 Bony Thorax" },
        { "file": "chapter-01-02.md", "title": "1.2 Mediastinal Structures" },
        { "file": "chapter-01-03.md", "title": "1.3 Pulmonary Anatomy" },
        { "file": "chapter-01-04.md", "title": "1.4 Vascular Anatomy" }
      ]
    },
    {
      "file": "chapter-02.md",
      "title": "2. Preoperative Evaluation"
    },
    {
      "file": "chapter-03.md",
      "title": "3. Lung Resection Techniques",
      "subchapters": [
        { "file": "chapter-03-01.md", "title": "3.1 Lobectomy" },
        { "file": "chapter-03-02.md", "title": "3.2 Segmentectomy" },
        { "file": "chapter-03-03.md", "title": "3.3 Pneumonectomy" }
      ]
    },
    {
      "file": "chapter-04.md",
      "title": "4. Postoperative Complications"
    }
  ]
}]
```

## Chapter Metadata (Optional)

You can also create rich metadata for each chapter:

```json
{
  "title": "CHAPTER 1: Synopsis of Adult Cardiac Surgical Disease",
  "content_table": {
    "type": "table",
    "headers": ["Section", "Page"],
    "rows": [
      ["Coronary Artery Disease", "3"],
      ["Valvular Heart Disease", "15"],
      ["Aortic Disease", "28"]
    ]
  },
  "introduction": "This chapter provides an overview...",
  "sections": [
    {
      "id": "I",
      "title": "I. Coronary Artery Disease",
      "subsections": [
        {
          "id": "A",
          "title": "A. Pathophysiology",
          "content": "Detailed content..."
        }
      ]
    }
  ]
}
```

Save as: `chapters/chapter-01/chapter-01-metadata.json`

---

*See Chapter 2.3 for best practices and tips.*
