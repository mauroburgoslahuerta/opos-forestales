
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyContent() {
    // Topic 1: Lei 3/2007 (Sample)
    const topicId = 'b47a9b13-430f-410d-9d03-ac5bcfd4ccb9';
    const { data, error } = await supabase
        .from('questions')
        .select('question_text, correct_answer, option_a, option_b')
        .eq('topic_id', topicId)
        .limit(5);

    if (error) {
        console.error(error);
        return;
    }

    console.log("SAMPLE DATA FOR TOPIC 1:");
    data.forEach((q, i) => {
        console.log(`Q${i + 1}: ${q.question_text.substring(0, 50)}...`);
        console.log(`- correct_answer: [${q.correct_answer}]`);
        console.log(`- correct_option: [${q.correct_option}]`);
    });
}
verifyContent();
