
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deepAuditCommon() {
    const { data: topics, error: tErr } = await supabase
        .from('topics')
        .select('id, name')
        .eq('block', 'comun'); // Assuming 'comun' is the block name based on previous exploration or registry

    if (tErr) {
        // If 'block' column fails, try fetching all and filtering by ID or Name patterns
        const { data: allT, error: aErr } = await supabase.from('topics').select('id, name');
        if (aErr) return console.error(aErr);
        // Common topics usually have T1, T2... names or specific IDs from the registry
        const commonIds = [
            '324a4e7a-5433-4c40-83ea-38463fe1514e', // T1
            'af38ef8f-9251-4036-9764-67d9c224b3e7', // T2
            '2902ab2d-9d77-4348-93a1-7228a60a9223', // T3
            'db2cbf56-3240-486f-8766-b63cfb996a89', // T4
            'c7c09d15-c524-4fe2-953a-bf5dbd96b72f', // T5
            'd4b9f6d5-dd19-4da5-b907-fd8ede3937a2', // T6
            '55abe9db-928d-4868-816d-d2b4a51da76f', // T7
            'db7b32ff-3a81-48ed-8d4d-263f5a3b91cd'  // T8
        ];
        topics = allT.filter(t => commonIds.includes(t.id));
    }

    console.log(`Auditing ${topics.length} Common Topics...`);

    for (const t of topics) {
        const { data: qAll, error: qErr } = await supabase
            .from('questions')
            .select('id, question_text, correct_answer')
            .eq('topic_id', t.id);

        if (qErr) continue;

        const total = qAll.length;
        const missing = qAll.filter(q => !q.correct_answer || q.correct_answer === '?' || q.correct_answer.trim() === '');

        if (missing.length > 0) {
            console.log(`Topic: ${t.name}`);
            console.log(`  Total: ${total}, MISSING: ${missing.length}`);
            console.log(`  Sample missing: "${missing[0].question_text.substring(0, 60)}..."`);
        } else {
            console.log(`Topic: ${t.name} - OK (${total}/${total})`);
        }
    }
}
deepAuditCommon();
