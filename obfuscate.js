
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const { minify } = require('html-minifier-terser');
const postcss = require('postcss');
const obfuscator = require('postcss-obfuscator');

// Read the original files
const originalHtml = fs.readFileSync('index.html', 'utf8');
const originalCss = fs.readFileSync('style.css', 'utf8');
const originalJs = fs.readFileSync('script.js', 'utf8');

// Obfuscate CSS and create a map of original to obfuscated class names
postcss([obfuscator({ length: 5, classMap: 'classMap.json' })])
    .process(originalCss, { from: 'style.css', to: 'style.obfuscated.css' })
    .then(async (result) => {
        fs.writeFileSync('style.obfuscated.css', result.css);
        const classMap = JSON.parse(fs.readFileSync('classMap.json', 'utf8'));

        // Replace class names in HTML and JS
        let updatedHtml = originalHtml;
        let updatedJs = originalJs;
        for (const originalClass in classMap) {
            const obfuscatedClass = classMap[originalClass];
            updatedHtml = updatedHtml.replace(new RegExp(`\\b${originalClass}\\b`, 'g'), obfuscatedClass);
            updatedJs = updatedJs.replace(new RegExp(`\\b${originalClass}\\b`, 'g'), obfuscatedClass);
        }

        // Minify the updated HTML
        const minifiedHtml = await minify(updatedHtml, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
        });
        fs.writeFileSync('index.obfuscated.html', minifiedHtml);

        // Obfuscate the updated JavaScript
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
        fs.writeFileSync('script.obfuscated.js', obfuscationResult.getObfuscatedCode());

        console.log('HTML, CSS, and Script obfuscated successfully!');
    });
