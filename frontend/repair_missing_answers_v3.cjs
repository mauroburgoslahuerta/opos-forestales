
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);
const BASE_PATH = path.join(__dirname, 'public/temario/especifico');

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

    const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('*');

    if (error) { console.error(error); return; }

    const questions = allQuestions.filter(q => !q.correct_option || q.correct_option === '?' || q.correct_option === '');
    console.log(`Encontradas ${questions.length} preguntas sin respuesta.`);

    const byTopic = {};
    for (const q of questions) {
        if (!byTopic[q.topic_id]) byTopic[q.topic_id] = [];
        byTopic[q.topic_id].push(q);
    }

    const allMdFiles = getAllFiles(BASE_PATH);

    for (const [topicId, topicQuestions] of Object.entries(byTopic)) {
        console.log(`\nProcesando Topic ID: ${topicId} (${topicQuestions.length} preguntas)`);

        let foundFile = null;
        let bestMatchScore = 0;

        // Try to find file by content matching
        for (let i = 0; i < Math.min(5, topicQuestions.length); i++) {
            const rawText = topicQuestions[i].question_text;
            const searchKey = normalize(rawText.substring(0, 100));
            if (searchKey.length < 20) continue;

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
            console.warn(`  NO SE ENCONTRÓ EL ARCHIVO ORIGEN.`);
            continue;
        }

        console.log(`  Archivo origen detectado: ${path.basename(foundFile)}`);

        // Read content
        const content = fs.readFileSync(foundFile, 'utf-8');
        const answerMap = {};

        // Try multiple regex patterns
        const patterns = [
            /(\d+)\)\s*([a-d])/gi,       // 1)a
            /(\d+)\.\s*([a-d])/gi,       // 1. a
            /(\d+)\.\-\s*([a-d])/gi,     // 1.- a
            /(\d+)\s+([a-d])\s+/gi,      // 1 a (risky)
            /(\d+)\.-([a-d])/gi          // 1.-a
        ];

        for (const regex of patterns) {
            let match;
            while ((match = regex.exec(content)) !== null) {
                // Avoid matching inside text if possible (e.g. date 2025)
                // Heuristic: check if previous char is newline or space
                answerMap[parseInt(match[1])] = match[2].toLowerCase();
            }
        }

        console.log(`  Respuestas parseadas: ${Object.keys(answerMap).length}`);

        // Debugging: Show first 5 answers found
        const first5 = Object.keys(answerMap).slice(0, 5).map(k => `${k}=${answerMap[k]}`).join(', ');
        console.log(`  Ejemplos de mapa: ${first5}`);

        let updates = 0;
        let missingInMap = 0;

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
                } else {
                    missingInMap++;
                }
            }
        }
        console.log(`  Actualizadas: ${updates}/${topicQuestions.length}. Faltan en mapa: ${missingInMap}`);
    }
}

repairAnswers();
