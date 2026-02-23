import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Manually parse .env because dotenv config path might be tricky in modules
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectQuestions() {
    console.log("--- Inspecting 'questions' table ---");

    // 1. Get total count
    const { count, error: countError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error("Error getting count:", countError);
    } else {
        console.log(`Total rows in 'questions': ${count}`);
    }

    // 2. Get distinct topic_ids
    const { data: topics, error: topicError } = await supabase
        .from('questions')
        .select('topic_id')
        .limit(100);

    if (topicError) {
        console.error("Error getting topics:", topicError);
    } else {
        const distinctTopics = [...new Set(topics.map(t => t.topic_id))];
        console.log(`Unique topic_ids found in first 100 rows: ${distinctTopics.length}`);
        console.log("Sample topic_ids:", distinctTopics.slice(0, 5));
    }

    // 3. Get a sample question with full data
    const { data: sample, error: sampleError } = await supabase
        .from('questions')
        .select('*')
        .limit(1);

    if (sampleError) {
        console.error("Error getting sample:", sampleError);
    } else {
        console.log("Sample Question Data:", JSON.stringify(sample[0], null, 2));
    }
}

inspectQuestions();
