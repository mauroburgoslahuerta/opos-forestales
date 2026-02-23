const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'src/constants/topicRegistry.ts');
const content = fs.readFileSync(registryPath, 'utf8');

// The file structure is:
// 'key': {
//    id: ...,
//    slug: 'slug-value',
//    ...
// }

// We want to replace 'key' with 'slug-value'.
// Regex strategy:
// Match:  'some-key': {\s*id: [^,]+,\s*slug: '([^']+)',
// Replace with: '$1': {\s*id: ... slug: '$1',

// But we need to handle the full block.
// Let's iterate line by line.

const lines = content.split('\n');
const newLines = [];
let currentSlug = null;
let currentKeyLineIndex = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line is a key definition: "    'some-key': {"
    if (line.match(/^\s*'[^']+':\s*\{/)) {
        currentKeyLineIndex = newLines.length; // Mark where the key line will be
        newLines.push(line); // Push it for now, we'll edit it later if needed
    }
    // Check if this line is a slug definition: "        slug: 'actual-slug',"
    else if (line.match(/^\s*slug:\s*'([^']+)'/)) {
        const match = line.match(/^\s*slug:\s*'([^']+)'/);
        if (match && currentKeyLineIndex !== -1) {
            const realSlug = match[1];
            // Update the key line to match the real slug
            newLines[currentKeyLineIndex] = `    '${realSlug}': {`;
            currentKeyLineIndex = -1; // Reset
        }
        newLines.push(line);
    }
    else {
        newLines.push(line);
    }
}

fs.writeFileSync(registryPath, newLines.join('\n'));
console.log("Registry keys synced with slugs.");
