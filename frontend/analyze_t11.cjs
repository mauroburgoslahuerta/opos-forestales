
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeT11() {
    const topicId = 'ce74cba9-0afa-4c14-a090-9f036b72ec31';

    const { data: qAll, error } = await supabase
        .from('questions')
        .select('id, question_text, correct_answer')
        .eq('topic_id', topicId);

    if (error) {
        console.error(error);
        return;
    }

    const missing = qAll.filter(q => !q.correct_answer || q.correct_answer === '?');
    const hasAnswer = qAll.filter(q => q.correct_answer && q.correct_answer !== '?');

    console.log(`Total T11: ${qAll.length}`);
    console.log(`Missing answers: ${missing.length}`);
    console.log(`Has answers: ${hasAnswer.length}`);

    if (hasAnswer.length > 0) {
        console.log("Sample of questions WITH answers:");
        hasAnswer.slice(0, 3).forEach(q => console.log(`- ${q.question_text.substring(0, 50)}: ${q.correct_answer}`));
    }
}
analyzeT11();
