
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectUnknown() {
    console.log("--- INSPECTING UNKNOWN T8 QUESTIONS ---");

    const { data: questions } = await supabase.from('questions')
        .select('id, question_text, created_at')
        .eq('source_file', 'Unknown') // Based on previous output potentially being literal "Unknown" or null?
        // Actually, if it was null in DB, my script printed "Unknown". 
        // So I should search for is.null
        .is('source_file', null)
        .limit(3);

    if (questions && questions.length > 0) {
        questions.forEach(q => {
            console.log(`[${q.created_at}] ${q.question_text.substring(0, 100)}...`);
        });
    } else {
        console.log("No NULL source files found? Checking literal 'Unknown'...");
        const { data: qLiteral } = await supabase.from('questions')
            .select('id, question_text')
            .eq('source_file', 'Unknown')
            .limit(3);

        if (qLiteral) {
            qLiteral.forEach(q => console.log(`[Literal Unknown] ${q.question_text.substring(0, 100)}...`));
        }
    }
}

inspectUnknown();
