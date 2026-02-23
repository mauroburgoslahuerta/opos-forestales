const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'src/constants/topicRegistry.ts');
const content = fs.readFileSync(registryPath, 'utf8');

// Regex to match items
// format: 'key': { ... title: 'Value', ... }
// We'll iterate lines and keep buffer of current item.

const lines = content.split('\n');
const newLines = [];
let buffer = [];
let isRemoving = false;

// Keywords to exclude
const EXCLUDE_KEYWORDS = [
    'Test', 'TEST', 'test',
    'Presentación', 'Presentacion',
    'Respostas', 'Resposta',
    'Ficha',
    'Clase', 'clases',
    'Supuesto', 'Suposto',
    'Documentacion', 'Documentación',
    'Exemplos',
    'Anexo',
    'Guia', 'Guía',
    'Borrador',
    'Copia'
];

// Special whitelist to PROTECT strictly known good topics if needed
// const KEEP_KEYWORDS = ['Tema', 'Lei', 'Decreto', 'Manual'];

let keptCount = 0;
let removedCount = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of an item?
    if (line.match(/^\s*'t-esp-/)) {
        // If we were buffering an item, verify it before pushing (shouldn't happen if structure is flat)
        // Actually, we usually process line by line, but we need to check the TITLE of the item.
        // The title is usually on a subsequent line.
        // So we must buffer the whole item block.
        buffer = [line];
        isRemoving = false; // Reset decision
    } else if (line.match(/^\s*},/)) {
        // End of item
        buffer.push(line);

        // Decide whether to keep or drop buffer
        // Find title line
        const titleLine = buffer.find(l => l.includes('title:'));
        if (titleLine) {
            const titleMatch = titleLine.match(/title:\s*'([^']+)'/);
            if (titleMatch) {
                const title = titleMatch[1];

                // Check exclusion
                const shouldRemove = EXCLUDE_KEYWORDS.some(kw => title.includes(kw));

                if (shouldRemove) {
                    // console.log(`Removing: ${title}`);
                    removedCount++;
                } else {
                    newLines.push(...buffer);
                    keptCount++;
                }
            } else {
                newLines.push(...buffer); // Fallback
            }
        } else {
            newLines.push(...buffer); // Fallback (maybe not an entry)
        }
        buffer = [];
    } else if (buffer.length > 0) {
        // Inside item
        buffer.push(line);
    } else {
        // Outside item (headers, exports, common topics)
        newLines.push(line);
    }
}

console.log(`Cleanup Complete.`);
console.log(`Original Specific approx: ${keptCount + removedCount}`);
console.log(`Removed: ${removedCount}`);
console.log(`Kept: ${keptCount}`);

fs.writeFileSync(registryPath, newLines.join('\n'));
