const fs = require('fs');
const path = require('path');

// 1. Load Registry (Mocking the import)
const registryContent = fs.readFileSync(path.join(__dirname, 'src/constants/topicRegistry.ts'), 'utf8');

// Extract definitions via Regex
const newTopics = [];
const regex = /'([^']+)':\s*{\s*id:\s*'([^']+)',\s*slug:\s*'[^']+',\s*title:\s*'([^']+)'/g;
let match;
while ((match = regex.exec(registryContent)) !== null) {
    newTopics.push({
        key: match[1],
        id: match[2],
        title: match[3]
    });
}

// 2. Load Old Topics from Report (Parsed manually from text)
const oldTopics = [
    { id: '808c27d6-5fd9-4150-b11c-3916cf9cf350', name: 'T6 Específico: A Prevención de Incendios', slug: 't-esp-6-prevencion' },
    { id: '7a363adf-8368-4b14-af09-9f9c50052631', name: 'T1 Específico: Lei 3/2007 Prevención e Defensa contra Incendios', slug: 't-esp-1-lei' },
    { id: 'ae663cb8-d9c1-43b0-9a17-bb6467bc04e6', name: 'T5 Específico: Extinción de Incendios Forestais', slug: 't-esp-5-extincion' },
    { id: '430bfd25-ba3e-430b-b87a-806a2746d2b0', name: 'T8 Específico: A Condución Todoterreo', slug: 't-esp-8-conduccion' },
    { id: 'ae7330d6-cb21-41a0-895a-b6bf696452d3', name: 'T7 Específico: O Equipamento na Loita contra Incendios', slug: 't-esp-7-equipamento' },
    { id: 'a9abe9a1-c783-484b-95c7-d8417ca6fa8c', name: 'T4 Específico: O Lume Forestal e Características', slug: 't-esp-4-lume' },
    { id: '73e64544-4bf6-4572-be84-085de26738c1', name: 'T3 Específico: SEMOP - Sistema Estrutural de Mando Operativo', slug: 't-esp-3-semop' },
    { id: '549e1467-8ad7-4583-83a1-b59dc3f5d291', name: 'T9 Específico: A Seguridade do Persoal', slug: 't-esp-9-seguridade' }
];

console.log(`Found ${newTopics.length} new topics in Registry.`);
console.log(`Mapping ${oldTopics.length} old topics...`);

let sql = "-- Migration Script: Map Old Topics to New Topics\n";
sql += "-- Generated based on name similarity\n\n";

oldTopics.forEach(old => {
    let bestMatch = null;
    let maxScore = 0;

    newTopics.forEach(newT => {
        const score = similarity(old.name, newT.title);
        if (score > maxScore) {
            maxScore = score;
            bestMatch = newT;
        }
    });

    if (bestMatch && maxScore > 0.2) { // Low threshold as names might differ wildly
        console.log(`MATCH: [${old.name}] -> [${bestMatch.title}] (Score: ${maxScore.toFixed(2)})`);
        sql += `UPDATE questions SET topic_id = '${bestMatch.id}' WHERE topic_id = '${old.id}'; -- ${old.name} -> ${bestMatch.title}\n`;
    } else {
        console.log(`NO MATCH: ${old.name}`);
        sql += `-- TODO: Map manually '${old.name}' (${old.id})\n`;
    }
});

fs.writeFileSync('fix_topic_ids.sql', sql);
console.log("SQL generated: fix_topic_ids.sql");

// Simple similarity (Jaccard-ish on words)
function similarity(s1, s2) {
    const clean = s => s.toLowerCase().replace(/[^a-z0-9áéíóúñ]/g, ' ').split(/\s+/).filter(w => w.length > 3);
    const w1 = new Set(clean(s1));
    const w2 = new Set(clean(s2));
    const intersection = new Set([...w1].filter(x => w2.has(x)));
    const union = new Set([...w1, ...w2]);
    return intersection.size / union.size;
}
