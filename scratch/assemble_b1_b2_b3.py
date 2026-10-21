# -*- coding: utf-8 -*-
import subprocess

# Run generators
subprocess.run(['python', 'scratch/build_block3_en.py'], check=True)
subprocess.run(['python', 'scratch/build_block3_ru.py'], check=True)

# Combine Block 1+2 and Block 3 for EN
with open('books/guidelines/guide/chapters/chapter-10/chapter-10.md', 'r', encoding='utf-8') as f:
    b12_en = f.read()
with open('scratch/block3_en_text.md', 'r', encoding='utf-8') as f:
    b3_en = f.read()

full_en = b12_en.strip() + "\n\n" + b3_en.strip() + "\n"
with open('books/guidelines/guide/chapters/chapter-10/chapter-10.md', 'w', encoding='utf-8') as f:
    f.write(full_en)

# Combine Block 1+2 and Block 3 for RU
with open('books/guidelines/guide/chapters/chapter-10/chapter-10-ru.md', 'r', encoding='utf-8') as f:
    b12_ru = f.read()
with open('scratch/block3_ru_text.md', 'r', encoding='utf-8') as f:
    b3_ru = f.read()

full_ru = b12_ru.strip() + "\n\n" + b3_ru.strip() + "\n"
with open('books/guidelines/guide/chapters/chapter-10/chapter-10-ru.md', 'w', encoding='utf-8') as f:
    f.write(full_ru)

print("Block 1 + Block 2 + Block 3 combined successfully for both EN and RU!")
