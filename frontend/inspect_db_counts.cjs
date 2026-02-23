const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) {
            process.env[key.trim()] = val.trim();
        }
    });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function countQuestionsPerTopic() {
    console.log("--- Counting questions per topic ---");

    // Get all questions
    const { data: questions, error } = await supabase
        .from('questions')
        .select('topic_id');

    if (error) {
        console.error("Error:", error);
        return;
    }

    const counts = {};
    questions.forEach(q => {
        counts[q.topic_id] = (counts[q.topic_id] || 0) + 1;
    });

    console.log("Topic ID | Count");
    console.log("--- | ---");
    Object.entries(counts).forEach(([id, count]) => {
        console.log(`${id} | ${count}`);
    });
    console.log(`Total questions: ${questions.length}`);
}

countQuestionsPerTopic();
