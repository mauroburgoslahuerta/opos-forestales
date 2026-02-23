
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Env vars from .env
const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_PATH = path.join(__dirname, 'public/temario/especifico');

async function repairAnswers() {
    console.log('--- Buscando preguntas sin respuesta ---');

    // 1. Get broken questions (assuming correct_option is NULL or '?')
    // We'll also fetch source_file to know where to look
    const { data: questions, error } = await supabase
        .from('questions')
        .select('id, source_file, question_text, correct_option')
        .or('correct_option.is.null,correct_option.eq.?,correct_option.eq.""');

    if (error) {
        console.error('Error fetching broken questions:', error);
        return;
    }

    console.log(`Encontradas ${questions.length} preguntas sin respuesta.`);

    // 2. Group by source file to read files efficiently
    const questionsByFile = {};
    for (const q of questions) {
        if (!q.source_file) continue;
        if (!questionsByFile[q.source_file]) {
            questionsByFile[q.source_file] = [];
        }
        questionsByFile[q.source_file].push(q);
    }

    // 3. Process each file
    for (const [filename, fileQuestions] of Object.entries(questionsByFile)) {
        const filePath = path.join(BASE_PATH, filename);
        if (!fs.existsSync(filePath)) {
            console.warn(`Archivo no encontrado: ${filename}`);
            continue;
        }

        console.log(`Procesando archivo: ${filename} (${fileQuestions.length} preguntas)`);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract answers map from file content
        // Pattern: "1)a", "2)b", etc. usually at the end of the file
        const answerMap = {};
        const regex = /(\d+)\)\s*([a-d])/gi;
        let match;
        while ((match = regex.exec(content)) !== null) {
            const num = parseInt(match[1]);
            const letter = match[2].toLowerCase();
            answerMap[num] = letter;
        }

        console.log(`  -> Encontradas ${Object.keys(answerMap).length} respuestas en el archivo.`);

        // 4. Update questions
        let updates = 0;
        for (const q of fileQuestions) {
            // Try to match question number from text? 
            // The questions in DB don't have a 'number' column, but usually start with "1.", "2.", etc.
            const numMatch = q.question_text.match(/^(\d+)\./);
            if (numMatch) {
                const num = parseInt(numMatch[1]);
                const correct = answerMap[num];

                if (correct) {
                    const { error: updateError } = await supabase
                        .from('questions')
                        .update({ correct_option: correct })
                        .eq('id', q.id);

                    if (updateError) {
                        console.error(`  Error actualizando ID ${q.id}:`, updateError);
                    } else {
                        updates++;
                    }
                } else {
                    console.warn(`  No se encontró respuesta para la pregunta ${num} en el mapa.`);
                }
            } else {
                console.warn(`  No se pudo determinar el número de pregunta para: "${q.question_text.substring(0, 30)}..."`);
            }
        }
        console.log(`  -> Actualizadas ${updates} preguntas de ${fileQuestions.length}.`);
    }
    console.log('--- Reparación completada ---');
}

repairAnswers();
