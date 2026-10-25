import os

ch_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-02'
for fname in ['chapter-02.md', 'chapter-02-ru.md']:
    fpath = os.path.join(ch_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    open_tags = content.count('<details')
    close_tags = content.count('</details>')
    open_divs = content.count('<div class="details-content">')
    close_divs = content.count('</div></details>')
    print(f"{fname}: details open={open_tags}, close={close_tags} | divs open={open_divs}, close={close_divs}")
