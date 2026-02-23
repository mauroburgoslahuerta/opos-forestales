
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Hardcoded for debugging to avoid dotenv issues
const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_DIR = path.resolve(__dirname, 'public/temario');

const TOPIC_IDS = {
    T2: 'f2c96f54-2e21-4883-a7ec-c36cc3549835', // Pladiga
    T6: '808c27d6-5fd9-4150-b11c-3916cf9cf350', // Prevención
    T9: '549e1467-8ad7-4583-83a1-b59dc3f5d291', // Seguridade
    T10: '38bbed41-bb96-49ed-84a9-c112f5712258', // Accidentes
    T11: 'ce74cba9-0afa-4c14-a090-9f036b72ec31'  // Comunicaciones
};

// Files to Answer Key Map (manual mapping for split files)
const MANUAL_ANSWERS = {
    'clases_6.2.- Test nº4 de Seguridade e Saúde_FORGA.md': 'clases_6.3.- Respostas Test nº 4 Seguridade e Saúde_FORGA.md',
    'clases_5.2.- Test clase N3 Seguridade e Saúde_FORGA.md': 'clases_5.3.- Respostas test N3 Seguridade e Saúde_FORGA.md',
    'clases_4.2.- Test clase N2 seguridade e saúde - Setembro _FORGA.md': 'clases_4.3.- Respostas test Nº 2_FORGA.md',
    'clases_3.2.- Test clase nº 1_FORGA.md': 'clases_3.3.- Respostas test N1 Seguridade e Saúde_FORGA.md',
    'clases_7.2.- Test N5 Repaso Seguridade e Saúde_FORGA.md': 'clases_7.3.- Resposta nº 5 Seguridade e Saúde_FORGA.md'
};

const MAPPINGS = [
    { pattern: /PLADIGA.*Test/i, topicId: TOPIC_IDS.T2 },
    { pattern: /IUF.*Test/i, topicId: TOPIC_IDS.T2 },
    { pattern: /Prevencion.*Test/i, topicId: TOPIC_IDS.T6 },
    { pattern: /Test.*PREVENCIÓN/i, topicId: TOPIC_IDS.T6 },
    { pattern: /Test nº4 de Seguridade/i, topicId: TOPIC_IDS.T10 },
    { pattern: /seguridade e saúde.*Test/i, topicId: TOPIC_IDS.T9 },
    { pattern: /Test.*seguridade e saúde/i, topicId: TOPIC_IDS.T9 },
    { pattern: /TETRA/i, topicId: TOPIC_IDS.T11 },
    { pattern: /Comunicacions/i, topicId: TOPIC_IDS.T11 }
];

async function findFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(await findFiles(filePath));
        } else if (file.endsWith('.md')) {
            results.push(filePath);
        }
    }
    return results;
}

function parseAnswers(content) {
    const map = {};
    const lines = content.split('\n');
    lines.forEach(line => {
        // Matches "1)A", "1. A", "1-A", "1 A"
        const match = line.match(/^\s*(\d+)[\)\.\-\s]\s*([a-dA-D])/i);
        if (match) {
            map[match[1]] = match[2].toLowerCase();
        }
    });
    return map;
}

function parseQuestions(content, answerMapFromFile = {}) {
    const questions = [];

    let answerMap = { ...answerMapFromFile };
    if (Object.keys(answerMap).length === 0) {
        const answerKeyMatch = content.match(/RESPOSTAS TEST([\s\S]*)$/i);
        if (answerKeyMatch) {
            const internalAnswers = parseAnswers(answerKeyMatch[1]);
            answerMap = { ...internalAnswers };
        }
    }

    const lines = content.split('\n');
    let currentQ = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Check for new question start "1. ", "1.- ", "1) "
        const qStart = line.match(/^(\d+)[\.\)\-]+\s*(.*)/);
        if (qStart) {
            if (currentQ) questions.push(currentQ);
            currentQ = {
                number: qStart[1],
                text: qStart[2],
                options: {}, // Will map to option_a...d later
                raw: line
            };
        } else if (currentQ) {
            // Check for option "a)", "a. ", "A "
            const optStart = line.match(/^([a-d])[\)\.]\s*(.*)/i) || line.match(/^([A-D])\s+(.*)/); // "A Text" or "a) Text"
            if (optStart) {
                const letter = optStart[1].toLowerCase();
                currentQ.options[letter] = optStart[2];
            } else {
                const lastOpt = Object.keys(currentQ.options).pop();
                if (lastOpt) {
                    currentQ.options[lastOpt] += ' ' + line;
                } else {
                    currentQ.text += ' ' + line;
                }
            }
        }
    }
    if (currentQ) questions.push(currentQ);

    return questions.map(q => {
        const correctChar = answerMap[q.number] || null;

        // Map simplified options object to columns
        // Assuming options are always 'a', 'b', 'c', 'd'
        return {
            topic_id: null, // Set in loop
            question_text: q.text,
            option_a: q.options['a'] || '',
            option_b: q.options['b'] || '',
            option_c: q.options['c'] || '',
            option_d: q.options['d'] || '',
            correct_answer: correctChar, // 'a', 'b', 'c', 'd' or null
            explanation: correctChar ? `Respuesta correcta: ${correctChar.toUpperCase()}` : 'Respuesta no disponible.',
            original_number: q.number,
            is_official: true
        };
    }).filter(q => q.option_a && q.option_b); // Ensure at least 2 options exist
}

async function run() {
    console.log("🔍 Scanning for files in " + BASE_DIR);
    const files = await findFiles(BASE_DIR);

    let totalImported = 0;

    for (const layout of MAPPINGS) {
        const matchedFiles = files.filter(f => f.match(layout.pattern));

        for (const file of matchedFiles) {
            const basename = path.basename(file);

            if (basename.match(/Respostas|Resposta/i)) {
                continue;
            }

            console.log(`\n📂 Processing: ${basename} -> Topic ${layout.topicId}`);
            let content = fs.readFileSync(file, 'utf-8');

            let answerMap = {};
            if (MANUAL_ANSWERS[basename]) {
                const answerFile = path.join(path.dirname(file), MANUAL_ANSWERS[basename]);
                if (fs.existsSync(answerFile)) {
                    console.log(`   Found separate answer key: ${MANUAL_ANSWERS[basename]}`);
                    const answerContent = fs.readFileSync(answerFile, 'utf-8');
                    answerMap = parseAnswers(answerContent);
                    console.log(`   Parsed ${Object.keys(answerMap).length} answers.`);
                }
            }

            const records = parseQuestions(content, answerMap).map(r => {
                const { original_number, ...rest } = r; // Exclude original_number
                return {
                    ...rest,
                    topic_id: layout.topicId,
                    source_file: basename
                };
            });

            console.log(`   Found ${records.length} valid questions.`);

            if (records.length === 0) continue;

            // Batch insert
            const { error } = await supabase.from('questions').insert(records);
            if (error) {
                console.error(`   ❌ Supabase Error: ${JSON.stringify(error, null, 2)}`);
            } else {
                console.log(`   ✅ Inserted ${records.length} questions.`);
                totalImported += records.length;
            }
        }
    }
    console.log(`\n🎉 Total Questions Imported: ${totalImported}`);
}

run();
