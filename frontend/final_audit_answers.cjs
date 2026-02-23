
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalAudit() {
    console.log('--- Final Audit: Missing Answers (Using select *) ---');

    const { data: questions, error } = await supabase
        .from('questions')
        .select('*');

    if (error) { console.error("Fetch Error:", error); return; }

    const missingBoth = questions.filter(q => {
        const optBad = !q.correct_option || q.correct_option === '?' || q.correct_option === '';
        // Note: broken_questions.json showed correct_answer is at the top level of the returned object
        const ansBad = !q.correct_answer || q.correct_answer === '?' || q.correct_answer === '';
        return optBad && ansBad;
    });

    console.log(`Total questions: ${questions.length}`);
    console.log(`Questions missing BOTH sources: ${missingBoth.length}`);

    if (missingBoth.length > 0) {
        const byTopic = {};
        missingBoth.forEach(q => {
            byTopic[q.topic_id] = (byTopic[q.topic_id] || 0) + 1;
        });
        console.log('Missing by Topic ID:', byTopic);

        console.log('Sample missing (First 10):');
        missingBoth.slice(0, 10).forEach(q => {
            console.log(`- [${q.topic_id}] ID: ${q.id} | TXT: ${q.question_text.substring(0, 50)}...`);
        });
    } else {
        console.log('SUCCESS: All questions have an answer in either correct_option or correct_answer.');
    }
}

finalAudit();
