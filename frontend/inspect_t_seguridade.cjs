
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Use Service Key to bypass RLS for verification
const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkTopic() {
    console.log("Checking t-seguridade...");
    const { data: topic, error } = await supabase
        .from('topics')
        .select('*')
        .eq('slug', 't-seguridade')
        .single();

    if (error) {
        console.error("Error fetching topic:", error);
    } else {
        console.log("Topic found:", topic);
        // Check questions count
        const { count, error: countError } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('topic_id', topic.id);

        if (countError) console.error("Error counting questions:", countError);
        else console.log(`Questions count for ${topic.name}: ${count}`);
    }
}

checkTopic();
