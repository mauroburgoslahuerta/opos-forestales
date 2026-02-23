
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUpdateFields() {
    const id = '1deb5ab0-8aa2-4825-9eda-6fa751d9ce49';
    console.log(`Debug ID: ${id}`);

    // Test 1: Update text
    console.log('1. Text update...');
    const { error: e1 } = await supabase.from('questions')
        .update({ question_text: "TEMP TEXT" })
        .eq('id', id).select('id');
    if (e1) console.error("Text Error:", e1);
    else console.log("Text Success");

    // Revert text
    if (!e1) {
        await supabase.from('questions').update({ question_text: "Constitúe o obxecto..." }).eq('id', id);
    }

    // Test 2: Update correct_option
    console.log('2. Option update...');
    const { error: e2 } = await supabase.from('questions')
        .update({ correct_option: 'c' })
        .eq('id', id).select('id');
    if (e2) console.error("Option Error:", e2);
    else console.log("Option Success");
}

debugUpdateFields();
