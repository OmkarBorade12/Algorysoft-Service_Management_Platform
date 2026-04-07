const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        if (file === 'node_modules' || file === '.next' || file === '.git') continue;
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.match(/\.(tsx|ts|jsx|js)$/)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const originalContent = content;
            
            // Remove color variant selector
            content = content.replace(/\uFE0F/g, '\uFE0E');
            
            // Append text variant selector to all emojis
            const emojiRegex = /(\p{Emoji})/gu;
            
            content = content.replace(emojiRegex, (match) => {
                // Ignore basic ASCII like numbers and symbols that happen to be in \p{Emoji}
                if (/^[#*0-9©®\s]$/.test(match)) return match;
                if (match.endsWith('\uFE0E')) return match;
                return match + '\uFE0E';
            });
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed emojis in:', fullPath);
            }
        }
    }
}

processDirectory(path.join(__dirname));
