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
            
            // 1. Remove color variant selector (\uFE0F) and replace with text variant selector (\uFE0E)
            content = content.replace(/\uFE0F/g, '\uFE0E');
            
            // 2. We use a more explicit emoji regex for JS
            const emojiRegex = /([\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])/gu;
            
            content = content.replace(emojiRegex, (match) => {
                // Return itself if followed by \uFE0E (text variation selector)
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
