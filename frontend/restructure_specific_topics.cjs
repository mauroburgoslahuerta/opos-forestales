const fs = require('fs');
const path = require('path');

// Configure the mapping based on file analysis
const TOPIC_MAPPING = [
    {
        id: 1,
        title: "Lei 3/2007 de prevención e defensa contra os incendios forestais de Galicia",
        sourcePhrase: "ley 3-2007 incendios consolidado",
        filename: "01_Lei_3_2007_Incendios_Galicia.md"
    },
    {
        id: 2,
        title: "O Plan Pladiga",
        sourcePhrase: "Plan de extinción Pladiga 2025",
        filename: "02_Plan_Pladiga.md"
    },
    {
        id: 3,
        title: "O Sistema SEMOP (Mando Operativo)",
        sourcePhrase: "SEMOP 2025",
        filename: "03_Sistema_SEMOP.md"
    },
    {
        id: 4,
        title: "Características e comportamento do lume forestal",
        sourcePhrase: "Tama y presentacion_O lume forestal",
        filename: "04_Comportamento_Lume.md"
    },
    {
        id: 5,
        title: "Extinción (accións básicas, ataque directo/indirecto e remate)",
        sourcePhrase: "Tema 6 Técnicas de extinción", // Mapping defined by content analysis
        filename: "05_Extincion.md"
    },
    {
        id: 6,
        title: "Accións de prevención de incendios",
        sourcePhrase: "A prevencion de incendios forestais 2025",
        filename: "06_Accions_Prevencion.md"
    },
    {
        id: 7,
        title: "Equipamento, ferramentas de ataque e prevención, e maquinaria lixeira",
        sourcePhrase: "FERRAMENTAS MANUAIS 2025",
        filename: "07_Equipamento_Ferramentas.md"
    },
    {
        id: 8,
        title: "Condución de todoterreos, estiba de ferramentas, aproximación e estacionamento",
        sourcePhrase: "A CONDUCCIÓN TODOTERREO 2025",
        filename: "08_Conduccion_Todoterreo.md"
    },
    {
        id: 9,
        title: "Seguridade do persoal, riscos, medidas preventivas e EPIs",
        sourcePhrase: "Tema IX Seguridade e Saúde",
        filename: "09_Seguridade_EPIs.md"
    },
    {
        id: 10,
        title: "Prevención de accidentes, atrapamentos e autoprotección",
        sourcePhrase: "Documentacion_Autoproteccion_IF_Gal",
        filename: "10_Accidentes_Autoproteccion.md"
    },
    {
        id: 11,
        title: "Comunicacións, rede de radio, equipos e recolla/transmisión de datos",
        sourcePhrase: "TETRA_2025",
        filename: "11_Comunicacions.md"
    }
];

const SOURCE_DIR = path.join(__dirname, 'public/temario/especifico');
const OUTPUT_DIR = path.join(__dirname, 'public/temario/especifico');

function findFile(phrase) {
    if (!fs.existsSync(SOURCE_DIR)) return null;
    const files = fs.readdirSync(SOURCE_DIR);
    // Case insensitive search
    return files.find(f => f.toLowerCase().includes(phrase.toLowerCase()));
}

function cleanMarkdown(content) {
    let lines = content.split('\n');

    const filteredLines = lines.filter(line => {
        const t = line.trim();
        // Remove page numbers
        if (t.match(/^Página \d+/i)) return false;
        if (t.match(/^Páxina \d+/i)) return false;
        if (t.match(/^\d+\s*\/\s*\d+$/)) return false;
        if (t.match(/^\d+$/) && t.length < 4) return false;

        // Remove version strings
        if (t.match(/^V\.?\d+(\.\d+)?$/i)) return false;

        // Remove repetitive document headers
        if (t.includes("Manual de formación")) return false;
        if (t.includes("Consellería de Facenda")) return false;
        if (t.includes("CIG.- FORGA")) return false;
        if (t.includes("CURSO repaso")) return false;
        if (t.match(/MANUAL DE PREVENCI[ÓO]N/i)) return false;
        if (t.match(/SEGURIDADE E HIXIENE/i)) return false;
        if (t.match(/^TEMA\s*\d*$/i)) return false;
        if (t.match(/^LEI\s+\d+\/\d+/i)) return false;
        if (t.includes("Depósito legal")) return false;
        if (t.includes("ISSN")) return false;
        if (t.includes("UD 1.-")) return false;

        return true;
    });

    let cleanedText = filteredLines.join('\n');

    // Bold "Artículo X" / "Artigo X"
    cleanedText = cleanedText.replace(/^(Artículo\s+\d+\.?)/gim, '\n### $1');
    cleanedText = cleanedText.replace(/^(Artigo\s+\d+\.?)/gim, '\n### $1');

    // Bold sections like "1.1.", "2. "
    cleanedText = cleanedText.replace(/^(\d+\.\d+\.?\s+.*)$/gm, '#### $1');

    // Fix Hyphenation
    cleanedText = cleanedText.replace(/(\p{L}+)-\s+(\p{L}+)/gu, '$1$2');
    cleanedText = cleanedText.replace(/(\p{L}+)-\n\s*(\p{L}+)/gu, '$1$2');

    // Format Lists
    cleanedText = cleanedText.replace(/•\s*/g, '\n- ');

    // Compacting multiple newlines
    cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');

    return cleanedText;
}

function main() {
    console.log("🚀 Starting Specific Block Restructuring (11 Topics)...");

    TOPIC_MAPPING.forEach(topic => {
        const sourceFile = findFile(topic.sourcePhrase);
        if (sourceFile) {
            const fullSourcePath = path.join(SOURCE_DIR, sourceFile);
            const fullOutputPath = path.join(OUTPUT_DIR, topic.filename);

            console.log(`Processing T${topic.id}: Found source '${sourceFile}'`);

            try {
                const content = fs.readFileSync(fullSourcePath, 'utf-8');
                const cleaned = cleanMarkdown(content);
                // Add Title if missing
                const finalContent = `# ${topic.title}\n\n${cleaned}`;

                fs.writeFileSync(fullOutputPath, finalContent);
                console.log(`✅ T${topic.id} Created: ${topic.filename}`);
            } catch (e) {
                console.error(`❌ Error processing T${topic.id}:`, e.message);
            }
        } else {
            console.warn(`⚠️ T${topic.id} Source NOT FOUND for phrase: '${topic.sourcePhrase}'`);
        }
    });
}

main();
