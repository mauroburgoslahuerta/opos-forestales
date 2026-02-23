const fs = require('fs');
const path = require('path');

// 1. Load Registry
const registryContent = fs.readFileSync(path.join(__dirname, 'src/constants/topicRegistry.ts'), 'utf8');

// Extract definitions
const topics = [];
const regex = /'([^']+)':\s*{\s*id:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)',\s*category:\s*'([^']+)'/g;
let match;

while ((match = regex.exec(registryContent)) !== null) {
    topics.push({
        id: match[2],
        slug: match[3],
        name: match[4], // Database column is 'name' based on previous inspection
        category: match[5]
        // sourceFile is not in DB schema usually, or maybe it is? 
        // Let's stick to standard columns: id, slug, name.
    });
}

console.log(`Parsed ${topics.length} topics from Registry.`);

let sql = "-- 1. INSERT MISSING TOPICS\n";
sql += "-- Generated from topicRegistry.ts\n";
sql += "-- Run this BEFORE fixing questions.\n\n";

topics.forEach(t => {
    // Escape single quotes in name
    const safeName = t.name.replace(/'/g, "''");

    // ON CONFLICT DO NOTHING to avoid errors if some already exist
    // Map category to block based on VALIDATED check constraint in DB
    // Constraint: CHECK (block = ANY (ARRAY['comun'::text, 'especifico'::text]))
    const blockValue = t.category === 'common' ? 'comun' : 'especifico';

    sql += `INSERT INTO public.topics (id, slug, name, block) VALUES ('${t.id}', '${t.slug}', '${safeName}', '${blockValue}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, block = EXCLUDED.block;\n`;
});

fs.writeFileSync('insert_new_topics.sql', sql);
console.log("SQL generated: insert_new_topics.sql");
