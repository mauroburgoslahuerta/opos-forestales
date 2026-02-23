
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectCollision() {
    console.log("Inspecting T8 Collision...");

    const { data: t_seg } = await supabase.from('topics').select('id, slug, name').eq('slug', 't-seguridade').single();
    if (t_seg) {
        const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('topic_id', t_seg.id);
        console.log(`[t-seguridade] ID: ${t_seg.id} | Qs: ${count}`);
    }

    const { data: t_com } = await supabase.from('topics').select('id, slug, name').eq('slug', 't-com-8-prl').single();
    if (t_com) {
        const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('topic_id', t_com.id);
        console.log(`[t-com-8-prl] ID: ${t_com.id} | Qs: ${count}`);

        // If empty, delete
        if (count === 0) {
            console.log("Deleting empty t-com-8-prl...");
            const { error } = await supabase.from('topics').delete().eq('id', t_com.id);
            if (error) console.error("Error deleting:", error);
            else console.log("Deleted.");
        }
    }
}

inspectCollision();
