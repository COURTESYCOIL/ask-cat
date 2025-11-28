
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

// Read the original script
const originalCode = fs.readFileSync('script.js', 'utf8');

// Obfuscate the code
const obfuscationResult = JavaScriptObfuscator.obfuscate(originalCode, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    numbersToExpressions: true,
    simplify: true,
    stringArrayShuffle: true,
    splitStrings: true,
    stringArrayThreshold: 1
});

// Write the obfuscated code to a new file
fs.writeFileSync('script.obfuscated.js', obfuscationResult.getObfuscatedCode());

console.log('Script obfuscated successfully!');
