
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function globalAudit() {
    const { data: topics, error: tErr } = await supabase.from('topics').select('id, name');
    if (tErr) return console.error(tErr);

    console.log(`Auditing ${topics.length} topics... SUCCESSFUL TOPICS ONLY:`);

    for (const t of topics) {
        const { data: qAll, error: qErr } = await supabase
            .from('questions')
            .select('correct_answer')
            .eq('topic_id', t.id);

        if (qErr) continue;

        const total = qAll.length;
        const ok = qAll.filter(q => q.correct_answer && q.correct_answer !== '?' && q.correct_answer.trim() !== '').length;

        if (total > 0 && ok > 0) {
            console.log(`- ${t.name}: Total=${total}, OK=${ok} (${Math.round(ok / total * 100)}%)`);
        }
    }
}
globalAudit();
