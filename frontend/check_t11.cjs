
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkT11() {
    const topicId = 'ce74cba9-0afa-4c14-a090-9f036b72ec31'; // From topicRegistry.ts
    console.log(`Checking Topic 11: ${topicId}`);

    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topicId)
        .limit(10);

    if (error) {
        console.error(error);
    } else {
        data.forEach(q => {
            console.log(`- ${q.question_text.substring(0, 100)}`);
        });
    }
}
checkT11();
