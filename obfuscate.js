
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
        const classRegex = /\.([a-zA-Z0-9_-]+)/g;
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
            // Use word boundary `\b` to avoid replacing parts of other words
            updatedCss = updatedCss.replace(new RegExp(`\\.${originalName}\\b`, 'g'), `.${obfuscatedName}`);
            updatedHtml = updatedHtml.replace(new RegExp(`\\b${originalName}\\b`, 'g'), obfuscatedName);
            updatedJs = updatedJs.replace(new RegExp(`\\b${originalName}\\b`, 'g'), obfuscatedName);
        }
        
        // Also update file references in HTML
        updatedHtml = updatedHtml.replace('style.css', 'style.obfuscated.css');
        updatedHtml = updatedHtml.replace('script.obfuscated.js', 'script.obfuscated.js');


        // 5. Save obfuscated CSS
        fs.writeFileSync('style.obfuscated.css', updatedCss);

        // 6. Minify HTML
        const minifiedHtml = await minify(updatedHtml, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
        });
        fs.writeFileSync('index.obfuscated.html', minifiedHtml);

        // 7. Obfuscate JavaScript
        const obfuscationResult = JavaScriptObfuscator.obfuscate(updatedJs, {
            compact: true,
            controlFlowFlattening: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
        });
        fs.writeFileSync('script.obfuscated.js', obfuscationResult.getObfuscatedCode());

        console.log('HTML, CSS, and Script obfuscated successfully!');
        console.log('Please use index.obfuscated.html to see the result.');

    } catch (error) {
        console.error('An error occurred during obfuscation:', error);
    }
}

obfuscateProject();
