import os, re

emoji_blocks = (
    r'['
    r'\U0001f300-\U0001f64f'      # emoticons
    r'\U0001f680-\U0001f6ff'      # transport & map
    r'\U0001f700-\U0001f77f'      # alchemical
    r'\U0001f780-\U0001f7ff'      # Geometric Shapes Extended
    r'\U0001f800-\U0001f8ff'      # Supplemental Arrows-C
    r'\U0001f900-\U0001f9ff'      # Supplemental Symbols and Pictographs
    r'\U0001fa00-\U0001fa6f'      # Chess Symbols
    r'\U0001fa70-\U0001faff'      # Symbols and Pictographs Extended-A
    r'\u2600-\u26FF'              # Miscellaneous Symbols
    r'\u2700-\u27BF'               # Dingbats
    r']'
)

# Replace any color variation selector with text variation selector
# or just append text variation selector if neither exists
def fix_emojis(content):
    # First replace existing \uFE0F (color) with \uFE0E (text) for our blocks
    content = re.sub(f'({emoji_blocks})\\uFE0F', r'\1\uFE0E', content)
    # Then for any emoji block that doesn't have \uFE0E or \uFE0F, append \uFE0E
    content = re.sub(f'({emoji_blocks})(?![\\uFE0E\\uFE0F])', r'\1\uFE0E', content)
    return content

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = fix_emojis(content)

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
print("Emoji fix completed.")
