
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAnswered() {
    const qText = "O sistema de comunicación TETRA conta cunha banda comprendida entre:";
    const { data, error } = await supabase
        .from('questions')
        .select('id, question_text')
        .ilike('question_text', `%${qText}%`);

    if (error) {
        console.error(error);
    } else {
        console.log("Found:", data.length);
        if (data.length > 0) {
            console.log("Match:", data[0].question_text.substring(0, 100));
        }
    }
}
verifyAnswered();
