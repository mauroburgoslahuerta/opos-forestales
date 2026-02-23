
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function findDuplicates() {
    console.log("--- FINDING DUPLICATES (Text Based) ---");

    // We want to check duplicates across all questions or just common?
    // Let's check common first.

    // 1. Get all questions with text and id
    const { data: questions, error } = await supabase
        .from('questions')
        .select('id, question_text, topic_id, source_file')
        .order('question_text');

    if (error) return console.error("Error fetching questions:", error);

    const textMap = {};
    let duplicates = 0;

    questions.forEach(q => {
        // Normalize text roughly
        const txt = q.question_text.trim().toLowerCase();
        if (textMap[txt]) {
            textMap[txt].push({ id: q.id, source: q.source_file, topic: q.topic_id });
            duplicates++;
        } else {
            textMap[txt] = [{ id: q.id, source: q.source_file, topic: q.topic_id }];
        }
    });

    console.log(`Total rows: ${questions.length}`);
    console.log(`Unique texts: ${Object.keys(textMap).length}`);
    console.log(`Potential Duplicates: ${duplicates}`);

    // Show some examples with source files
    let shown = 0;
    for (const [txt, items] of Object.entries(textMap)) {
        if (items.length > 1 && shown < 10) {
            console.log(`\nDuplicate Text: "${txt.substring(0, 80)}..."`);
            items.forEach(item => {
                console.log(`  - ID: ${item.id} | Source: ${item.source} | Topic: ${item.topic}`);
            });
            shown++;
        }
    }
}

findDuplicates();
