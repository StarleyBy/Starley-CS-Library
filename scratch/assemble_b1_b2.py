# -*- coding: utf-8 -*-
import subprocess

# Run generators
subprocess.run(['python', 'scratch/build_block2_en.py'], check=True)
subprocess.run(['python', 'scratch/build_block2_ru.py'], check=True)

# Combine Block 1 and Block 2 for EN
with open('books/guidelines/guide/chapters/chapter-10/chapter-10.md', 'r', encoding='utf-8') as f:
    b1_en = f.read()
with open('scratch/block2_en_text.md', 'r', encoding='utf-8') as f:
    b2_en = f.read()

full_en = b1_en.strip() + "\n\n" + b2_en.strip() + "\n"
with open('books/guidelines/guide/chapters/chapter-10/chapter-10.md', 'w', encoding='utf-8') as f:
    f.write(full_en)

# Combine Block 1 and Block 2 for RU
with open('books/guidelines/guide/chapters/chapter-10/chapter-10-ru.md', 'r', encoding='utf-8') as f:
    b1_ru = f.read()
with open('scratch/block2_ru_text.md', 'r', encoding='utf-8') as f:
    b2_ru = f.read()

full_ru = b1_ru.strip() + "\n\n" + b2_ru.strip() + "\n"
with open('books/guidelines/guide/chapters/chapter-10/chapter-10-ru.md', 'w', encoding='utf-8') as f:
    f.write(full_ru)

print("Block 1 + Block 2 combined successfully for both EN and RU!")
