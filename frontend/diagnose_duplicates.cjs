const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk"; // Service Role

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function diagnose() {
    console.log("--- DIAGNOSTIC START ---");

    // 1. Analyze Registry File
    const registryPath = path.join(__dirname, 'src/constants/topicRegistry.ts');
    const registryContent = fs.readFileSync(registryPath, 'utf8');

    // Extract headers
    const newTopics = [];
    const regex = /title:\s*'([^']+)'/g;
    let match;
    while ((match = regex.exec(registryContent)) !== null) {
        newTopics.push(match[1]);
    }

    console.log(`\n[REGISTRY] Total Items: ${newTopics.length}`);
    const nameCounts = {};
    newTopics.forEach(n => nameCounts[n] = (nameCounts[n] || 0) + 1);

    const duplicates = Object.entries(nameCounts).filter(([k, v]) => v > 1);

    if (duplicates.length > 0) {
        console.log("❌ [REGISTRY] Found DUPLICATE TITLES in code:");
        duplicates.forEach(d => console.log(`   - "${d[0]}" (${d[1]} times)`));
    } else {
        console.log("✅ [REGISTRY] No duplicate titles found.");
    }

    // 2. Analyze Database
    const { data: dbTopics, error } = await supabase.from('topics').select('id, name, slug, block');
    if (error) {
        console.error("Error fetching DB:", error);
    } else {
        console.log(`\n[DATABASE] Total Rows: ${dbTopics.length}`);

        // Check for duplicates in DB
        const dbNameCounts = {};
        dbTopics.forEach(t => dbNameCounts[t.name] = (dbNameCounts[t.name] || 0) + 1);
        const dbDups = Object.entries(dbNameCounts).filter(([k, v]) => v > 1);

        if (dbDups.length > 0) {
            console.log("⚠️ [DATABASE] Found duplicate names in DB (might be old vs new):");
            dbDups.forEach(d => console.log(`   - "${d[0]}" (${d[1]} times)`));
        }

        // Check for block content
        const blocks = [...new Set(dbTopics.map(t => t.block))];
        console.log(`[DATABASE] Block values present: ${JSON.stringify(blocks)}`);
    }
    console.log("--- DIAGNOSTIC END ---");
}

diagnose();
