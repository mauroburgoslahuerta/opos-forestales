
const { createClient } = require('@supabase/supabase-js');

// Hardcoded for debug
const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFailedTopic() {
    const topicId = '2902ab2d-9d77-4348-93a1-7228a60a9223';

    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topicId)
        .limit(1);

    if (error) {
        console.error("Error fetching:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Sample Question Text:');
        console.log("TEXT_START");
        console.log(data[0].question_text);
        console.log("TEXT_END");
    } else {
        console.log('Topic not found or no questions.');
    }
}
checkFailedTopic();
