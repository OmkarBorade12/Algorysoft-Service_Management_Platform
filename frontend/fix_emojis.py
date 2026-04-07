import os, re
import sys

# Matches emojis. Excludes variation selectors \uFE0E and \uFE0F.
emoji_pattern = re.compile(
    r'('
    r'[\U0001f300-\U0001f64f]|'      # emoticons
    r'[\U0001f680-\U0001f6ff]|'      # transport & map
    r'[\U0001f700-\U0001f77f]|'      # alchemical
    r'[\U0001f780-\U0001f7ff]|'      # Geometric Shapes Extended
    r'[\U0001f800-\U0001f8ff]|'      # Supplemental Arrows-C
    r'[\U0001f900-\U0001f9ff]|'      # Supplemental Symbols and Pictographs
    r'[\U0001fa00-\U0001fa6f]|'      # Chess Symbols
    r'[\U0001fa70-\U0001faff]|'      # Symbols and Pictographs Extended-A
    r'[\u2600-\u26FF]|'              # Miscellaneous Symbols
    r'[\u2700-\u27BF]'               # Dingbats
    r')(?!\uFE0E)(?!\uFE0F)',        # negative lookahead for variation selectors
    flags=re.UNICODE
)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = emoji_pattern.sub(r'\1\uFE0E', content)

    # We also update inline font-family to include Noto Emoji
    new_content = new_content.replace("'IBM Plex Sans', sans-serif", "'IBM Plex Sans', 'Noto Emoji', 'Segoe UI Symbol', sans-serif")
    new_content = new_content.replace('"IBM Plex Sans", sans-serif', '"IBM Plex Sans", "Noto Emoji", "Segoe UI Symbol", sans-serif')

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(r'c:\Users\borad\OneDrive\Desktop\AlgorySoft\frontend'):
    if 'node_modules' in root or '.next' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith(('.tsx', '.ts', '.jsx', '.js', '.css')):
            path = os.path.join(root, file)
            try:
                process_file(path)
            except Exception as e:
                pass
print("Emoji conversion done.")
