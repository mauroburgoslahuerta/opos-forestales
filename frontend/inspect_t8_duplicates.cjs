
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectT8Dupes() {
    console.log("--- ANALYZING T8 (PRL) DUPLICATES ---");
    const T8_ID = 'db7b32ff-3a81-48ed-8d4d-263f5a3b91cd';

    // Get all T8 questions
    const { data: questions } = await supabase.from('questions')
        .select('id, question_text, topic_id')
        .eq('topic_id', T8_ID);

    console.log(`Loaded ${questions.length} questions for T8.`);

    const textMap = {};
    let duplicates = 0;

    questions.forEach(q => {
        const txt = q.question_text.trim().toLowerCase(); // simple normalization
        if (textMap[txt]) {
            duplicates++;
            textMap[txt].count++;
            textMap[txt].ids.push(q.id);
        } else {
            textMap[txt] = { count: 1, ids: [q.id], text: q.question_text };
        }
    });

    console.log(`Internal Duplicates in T8: ${duplicates}`);

    if (duplicates > 0) {
        console.log("\nSample Duplicates:");
        Object.values(textMap).filter(x => x.count > 1).slice(0, 3).forEach(d => {
            console.log(`[x${d.count}] "${d.text.substring(0, 80)}..."`);
        });
    }

    // Check overlap with OTHER topics
    console.log("\n--- CHECKING OVERLAP WITH OTHER TOPICS ---");
    // We take a sample of T8 text and search globally
    const sampleTexts = questions.slice(0, 5).map(q => q.question_text);

    for (const txt of sampleTexts) {
        const { data: siblings } = await supabase.from('questions')
            .select('id, topic_id, question_text')
            .eq('question_text', txt)
            .neq('topic_id', T8_ID); // Not T8

        if (siblings && siblings.length > 0) {
            console.log(`\nOverlap found for: "${txt.substring(0, 50)}..."`);
            console.log(`Found in other topics: ${siblings.map(s => s.topic_id).join(', ')}`);
        }
    }
    console.log("Overlap check complete (Sampled 5).");
}

inspectT8Dupes();
