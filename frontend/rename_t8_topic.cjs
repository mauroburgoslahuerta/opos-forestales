
const { createClient } = require('@supabase/supabase-js');

// Service Key
const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function renameT8() {
    console.log("Renaming T8 (t-seguridade) -> t-com-8-prl ...");

    const ID = 'bb271092-93ad-4b92-6747-5285b1fd2d55';

    const { data, error } = await supabase.from('topics')
        .update({
            slug: 't-com-8-prl',
            name: 'T8 Común: Lei 31/1995 Prevención de Riscos Laborais',
            block: 'comun'
        })
        .eq('id', ID)
        .select();

    if (error) {
        console.error("Error updating T8:", error);
    } else {
        console.log("Success:", data);
    }
}

renameT8();
