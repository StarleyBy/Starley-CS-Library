# 3. Troubleshooting

## Quick Reference

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `404 Not Found` | File not found or wrong path | Check file name and location |
| `Failed to load resource` | Image path incorrect | Use relative paths from chapter folder |
| `JSON parse error` | Invalid manifest syntax | Validate JSON syntax |

### Debug Checklist

- [ ] File naming follows `chapter-XX-YY.md` pattern?
- [ ] Files in correct parent folder?
- [ ] `metadata.json` valid JSON?
- [ ] `subchapters` array present?
- [ ] Images in parent's `images/` folder?

### Getting Help

If issues persist:
1. Check browser console for detailed errors
2. Validate JSON at [jsonlint.com](https://jsonlint.com)
3. Review file structure matches examples in Chapter 2.2

---

*End of guide. Happy writing!*
