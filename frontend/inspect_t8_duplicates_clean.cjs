
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectT8DupesClean() {
    const T8_ID = 'db7b32ff-3a81-48ed-8d4d-263f5a3b91cd';
    const { data: questions } = await supabase.from('questions').select('question_text').eq('topic_id', T8_ID);

    if (!questions) return;

    const textMap = {};
    let duplicates = 0;

    questions.forEach(q => {
        const txt = q.question_text.trim();
        if (textMap[txt]) {
            textMap[txt]++;
            if (textMap[txt] === 2) duplicates++; // Count unique duplicates
        } else {
            textMap[txt] = 1;
        }
    });

    console.log(`Found ${duplicates} repeated questions inside T8.`);
    if (duplicates > 0) {
        Object.entries(textMap).filter(([k, v]) => v > 1).slice(0, 5).forEach(([txt, count]) => {
            console.log(`[x${count}] ${txt.substring(0, 50)}...`);
        });
    }
}

inspectT8DupesClean();
