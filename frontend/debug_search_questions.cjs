
const { createClient } = require('@supabase/supabase-js');

// Hardcoded for debugging
const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTIwNjcsImV4cCI6MjA4NjY2ODA2N30.Ro3og1p-9E1TtG__K6Tvd5gU9wfgUu2BkEMuW5qFtlI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function searchQuestions() {
    console.log("🔍 Searching for 'lost' questions by text...");

    const keywords = [
        { term: 'Pladiga', topic: 'T2 (Pladiga)' },
        { term: 'igualdade', topic: 'T6 (Igualdad/Prevencion?)' }, // Careful with T6 Common
        { term: 'prevención', topic: 'T6 (Prevención)' },
        { term: 'motoserra', topic: 'T7 (Ferramentas)' },
        { term: 'autoprotección', topic: 'T10 (Autoprotección)' },
        { term: 'tetra', topic: 'T11 (Comunicaciones)' }
    ];

    for (const k of keywords) {
        const { data, error } = await supabase
            .from('questions')
            .select('id, topic_id, question_text, topics(slug)')
            .ilike('question_text', `%${k.term}%`)
            .limit(5);

        if (error) {
            console.error(`Error searching ${k.term}:`, error);
            continue;
        }

        console.log(`\n--- Results for '${k.term}' (${k.topic}) ---`);
        if (data.length === 0) {
            console.log("No questions found.");
        } else {
            data.forEach(q => {
                console.log(`[${q.topics?.slug || 'NULL TOPIC'}] ${q.question_text.substring(0, 60)}...`);
            });
        }
    }
}

searchQuestions();
