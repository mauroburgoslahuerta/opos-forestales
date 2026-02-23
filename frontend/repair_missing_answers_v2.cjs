
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);
const BASE_PATH = path.join(__dirname, 'public/temario/especifico');

// Recursively find all .md files
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.md')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });
    return arrayOfFiles;
}

const normalize = (s) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

async function repairAnswers() {
    console.log('--- Buscando preguntas rotas ---');

    // 1. Get ALL questions and filter in JS to avoid builder errors
    const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('*');

    if (error) { console.error(error); return; }

    const questions = allQuestions.filter(q => !q.correct_option || q.correct_option === '?' || q.correct_option === '');
    console.log(`Encontradas ${questions.length} preguntas sin respuesta.`);

    // 2. Group by Topic ID
    const byTopic = {};
    for (const q of questions) {
        if (!byTopic[q.topic_id]) byTopic[q.topic_id] = [];
        byTopic[q.topic_id].push(q);
    }

    // 3. Identification Phase
    const allMdFiles = getAllFiles(BASE_PATH);

    for (const [topicId, topicQuestions] of Object.entries(byTopic)) {
        console.log(`\nProcesando Topic ID: ${topicId} (${topicQuestions.length} preguntas)`);

        let foundFile = null;
        let triedSamples = [];

        // Prepare normalized content cache for performance (optional but good)
        // actually just reading synchronously is fine for this scale

        for (let i = 0; i < Math.min(5, topicQuestions.length); i++) {
            const rawText = topicQuestions[i].question_text;
            // Take a chunk from the middle to avoid "1. " numbering issues
            const searchKey = normalize(rawText.substring(0, 100)); // Taking first 100 chars normalized

            if (searchKey.length < 20) continue;
            triedSamples.push(searchKey.substring(0, 20) + "...");

            for (const file of allMdFiles) {
                const content = fs.readFileSync(file, 'utf-8');
                const normContent = normalize(content);
                if (normContent.includes(searchKey)) {
                    foundFile = file;
                    break;
                }
            }
            if (foundFile) break;
        }

        if (!foundFile) {
            console.warn(`  NO SE ENCONTRÓ EL ARCHIVO ORIGEN para este tema.`);
            console.warn(`  Muestras probadas (norm):\n   - "${triedSamples.join('"\n   - "')}"`);
            continue;
        }

        console.log(`  Archivo origen detectado: ${path.basename(foundFile)}`);

        // 4. Parse Answers from File
        const content = fs.readFileSync(foundFile, 'utf-8');
        const answerMap = {};

        // Pattern 1: 1)a
        let regex = /(\d+)\)\s*([a-d])/gi;
        let match;
        while ((match = regex.exec(content)) !== null) {
            answerMap[parseInt(match[1])] = match[2].toLowerCase();
        }

        // Pattern 2: 1.- a (dot dash)
        if (Object.keys(answerMap).length === 0) {
            regex = /(\d+)\.\-\s*([a-d])/gi;
            while ((match = regex.exec(content)) !== null) {
                answerMap[parseInt(match[1])] = match[2].toLowerCase();
            }
        }

        // Pattern 3: 1.-a (no space)
        if (Object.keys(answerMap).length === 0) {
            regex = /(\d+)\.\-([a-d])/gi;
            while ((match = regex.exec(content)) !== null) {
                answerMap[parseInt(match[1])] = match[2].toLowerCase();
            }
        }


        console.log(`  Respuestas parseadas: ${Object.keys(answerMap).length}`);
        console.log(`  Ejemplos: 1=${answerMap[1]}, 2=${answerMap[2]}, 3=${answerMap[3]}`);

        // 5. Update Questions
        let updates = 0;
        for (const q of topicQuestions) {
            const numMatch = q.question_text.match(/^(\d+)\./);
            if (numMatch) {
                const num = parseInt(numMatch[1]);
                const correct = answerMap[num];

                if (correct) {
                    const { error: upErr } = await supabase
                        .from('questions')
                        .update({ correct_option: correct })
                        .eq('id', q.id);

                    if (!upErr) updates++;
                    else console.error(`Error updating ${q.id}: ${upErr.message}`);
                }
            }
        }
        console.log(`  Actualizadas: ${updates}/${topicQuestions.length}`);
    }
}

repairAnswers();
