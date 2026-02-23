const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'src/constants/topicRegistry.ts');
let content = fs.readFileSync(registryPath, 'utf8');

// 1. Identify Duplicates regex
// We need to find all slugs and track them.
const slugRegex = /slug:\s*'([^']+)'/g;
const slugs = {};
let match;
let hasDuplicates = false;

// We will reconstruct the file line by line to be safe, or just replace duplicates on the fly.
// A safer approach for a large file is to read, parse logic, fix, write.
// Since it's TS, simple regex replacement might be risky if we don't track context.
// But the format is very regular.

// Let's use a replacer function that tracks counts.
const lines = content.split('\n');
const seenSlugs = new Map();
const newLines = [];

// Regex to capture the slug line
const lineSlugRegex = /(\s*slug:\s*')([^']+)(')/;

lines.forEach((line, index) => {
    const m = line.match(lineSlugRegex);
    if (m) {
        const originalSlug = m[2];
        const prefix = m[1];
        const suffix = m[3];

        if (seenSlugs.has(originalSlug)) {
            // Duplicate found!
            const count = seenSlugs.get(originalSlug) + 1;
            const newSlug = `${originalSlug}-${count}`; // e.g. slug-2
            seenSlugs.set(originalSlug, count);

            console.log(`Fixing Duplicate: Line ${index + 1}: ${originalSlug} -> ${newSlug}`);
            newLines.push(`${prefix}${newSlug}${suffix}, // FIXED DUPLICATE`);
            hasDuplicates = true;
        } else {
            seenSlugs.set(originalSlug, 1);
            newLines.push(line);
        }
    } else {
        newLines.push(line);
    }
});

if (hasDuplicates) {
    fs.writeFileSync(registryPath, newLines.join('\n'));
    console.log("Registry updated with unique slugs.");
} else {
    console.log("No duplicates found (unexpected based on error).");
}
