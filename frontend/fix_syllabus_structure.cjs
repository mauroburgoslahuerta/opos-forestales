
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixSyllabus() {
    console.log("--- FIXING SYLLABUS STRUCTURE ---");

    // 1. FIX T7 QUESTIONS (Discapacidad)
    console.log("1. Fixing T7 (t-com-7-discap) visibility...");
    const { data: t7 } = await supabase.from('topics').select('id').eq('slug', 't-com-7-discap').single();

    if (t7) {
        // Set is_official = true and ensure source_file is not null
        const { count, error } = await supabase.from('questions')
            .update({
                is_official: true,
                source_file: '07_RD_1_2013_Legacy_Import.pdf' // Placeholder to avoid null issues
            })
            .eq('topic_id', t7.id)
            .is('source_file', null); // Only fix broken ones

        console.log(`Updated ${count} questions for T7 to be visible.`);
        if (error) console.error("Error upgrading T7:", error);
    } else {
        console.error("T7 Topic not found!");
    }

    // 2. MODIFY GENERATOR SCRIPT FOR T8 (PRL)
    console.log("2. Updating generate_grouped_registry.cjs...");
    const genScriptPath = path.join(__dirname, 'generate_grouped_registry.cjs');
    let content = fs.readFileSync(genScriptPath, 'utf8');

    // Define T8 Common in the fixed list
    const t8Definition = `    't-com-8-prl': { id: 'bb271092-93ad-4b92-6747-5285b1fd2d55', slug: 't-com-8-prl', title: 'T8 Común: Lei 31/1995 Prevención de Riscos Laborais', category: 'common', sourceFile: '/temario/comun/08_Ley_31_1995_PRL_FULL.md', icon: 'Shield' },`;

    // Check if already present
    if (!content.includes("'t-com-8-prl': {")) {
        // Add after T7
        content = content.replace(
            /('t-com-7-discap': \{[^}]+\},)/,
            `$1\n${t8Definition}`
        );
        console.log("Added T8 to Common Registry.");
    }

    // Prevent T8 from being generated as Specific (Exclude 't-seguridade' logic)
    // We search for where 't-seguridade' is defined in TOPICS object and remove it or comment it out
    // Actually, simply EXCLUDING it from the iteration in generate loop is safer.
    // But easier: Remove the mapping logic for 't-seguridade' in TOPICS object.

    // Regex to remove or comment out the 't-seguridade' block in TOPICS object
    const prlRegex = /['"]t-seguridade['"]:\s*\{[^}]+\},?/;
    if (prlRegex.test(content)) {
        content = content.replace(prlRegex, `// 't-seguridade': MOVED TO COMMON T8 //`);
        console.log("Removed T8 from Specifics generation logic.");
    }

    fs.writeFileSync(genScriptPath, content);
    console.log("Generator script updated.");

    // 3. RUN GENERATOR
    console.log("3. Regenerating Registry (Dry Run - executing script)...");
    require('./generate_grouped_registry.cjs');
}

fixSyllabus();
