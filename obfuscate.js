
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

// --- Helper function to generate random strings ---
function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// --- Main Logic ---
async function obfuscateProject() {
    try {
        // 1. Read original files
        const originalCss = fs.readFileSync('style.css', 'utf8');
        const originalHtml = fs.readFileSync('index.html', 'utf8');
        const originalJs = fs.readFileSync('script.js', 'utf8');

        // 2. Find all unique class names in CSS
        const classRegex = /\\.([a-zA-Z0-9_-]+)/g;
        const foundClasses = new Set();
        let match;
        while ((match = classRegex.exec(originalCss)) !== null) {
            foundClasses.add(match[1]);
        }

        // 3. Generate obfuscated names and create a map
        const classMap = {};
        const usedObfuscatedNames = new Set();
        for (const className of foundClasses) {
            let obfuscatedName;
            do {
                obfuscatedName = generateRandomString(5);
            } while (usedObfuscatedNames.has(obfuscatedName));
            usedObfuscatedNames.add(obfuscatedName);
            classMap[className] = obfuscatedName;
        }

        // 4. Replace class names in CSS, HTML, and JS
        let updatedCss = originalCss;
        let updatedHtml = originalHtml;
        let updatedJs = originalJs;

        for (const originalName in classMap) {
            const obfuscatedName = classMap[originalName];
            // Use word boundary `\\b` to avoid replacing parts of other words
            updatedCss = updatedCss.replace(new RegExp(`\\\\.${originalName}\\\\b`, 'g'), `.${obfuscatedName}`);
            updatedHtml = updatedHtml.replace(new RegExp(`class="${originalName}"`, 'g'), `class="${obfuscatedName}"`);
            updatedHtml = updatedHtml.replace(new RegExp(`class="([^"]*?)${originalName}([^"]*?)"`, 'g'), (match, p1, p2) => {
                const classes = `${p1}${originalName}${p2}`.split(' ').map(c => classMap[c] || c);
                return `class="${classes.join(' ')}"`;
            });
            // For JS, handle both direct class names and selectors
            updatedJs = updatedJs.replace(new RegExp(`'\\\\.${originalName}'`, 'g'), `'.${obfuscatedName}'`);
            updatedJs = updatedJs.replace(new RegExp(`"\\\\.${originalName}"`, 'g'), `".${obfuscatedName}"`);
            updatedJs = updatedJs.replace(new RegExp(`\`\\\\.${originalName}\``, 'g'), `\`.${obfuscatedName}\``);
        }

        // 5. Minify HTML
        const minifiedHtml = await minify(updatedHtml, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
        });

        // 6. Obfuscate JavaScript
        const obfuscationResult = JavaScriptObfuscator.obfuscate(updatedJs, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1
        });

        // 7. Write updated files
        fs.writeFileSync('style.obfuscated.css', updatedCss);
        fs.writeFileSync('index.obfuscated.html', minifiedHtml);
        fs.writeFileSync('script.obfuscated.js', obfuscationResult.getObfuscatedCode());

        console.log('Project obfuscated successfully!');

    } catch (error) {
        console.error('An error occurred during obfuscation:', error);
    }
}

obfuscateProject();
