const https = require('https');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Source Files
const T5_SOURCE_PATH = path.join(__dirname, 'public/temario/especifico/5- Emprego publico C2- bombeiros_FORGA.md');
const T6_PATH = path.join(__dirname, 'public/temario/comun/06_Ley_7_2023_Igualdad_Galicia_FULL.md');
const T8_PATH = path.join(__dirname, 'public/temario/especifico/documentación base_1.5.- Tema IX Seguridade e Saúde do Manual de Prev_FORGA.md');

// Destination for T5 (Standardized Name)
const T5_OUTPUT = path.join(__dirname, 'public/temario/comun/05_Ley_2_2015_Emprego_Galicia_FULL.md');

function cleanMarkdown(content) {
    let lines = content.split('\n');

    // 1. Remove common artifacts (headers, footers, page numbers)
    const filteredLines = lines.filter(line => {
        const t = line.trim();
        // Remove page numbers
        if (t.match(/^Página \d+/i)) return false;
        if (t.match(/^Páxina \d+/i)) return false; // Galician
        if (t.match(/^\d+\s*\/\s*\d+$/)) return false;
        if (t.match(/^\d+$/) && t.length < 4) return false;

        // Remove version strings
        if (t.match(/^V\.?\d+(\.\d+)?$/i)) return false;

        // Remove repetitive document headers specific to FORGA/Xunta manuals
        if (t.includes("Manual de formación")) return false;
        if (t.includes("Consellería de Facenda")) return false;
        if (t.includes("CIG.- FORGA")) return false;
        if (t.includes("CURSO repaso")) return false;
        if (t.match(/MANUAL DE PREVENCI[ÓO]N/i)) return false;
        if (t.match(/SEGURIDADE E HIXIENE/i)) return false;
        if (t.match(/^TEMA\s*\d*$/i)) return false;
        if (t.match(/^LEI\s+\d+\/\d+/i)) return false; // Repeat headers of the law itself in pages
        if (t.includes("Depósito legal")) return false;
        if (t.includes("ISSN")) return false;
        if (t.includes("UD 1.-")) return false;

        return true;
    });

    let cleanedText = filteredLines.join('\n');

    // 2. Format Titles and Sections
    // Bold "Artículo X" / "Artigo X"
    cleanedText = cleanedText.replace(/^(Artículo\s+\d+\.?)/gim, '\n### $1');
    cleanedText = cleanedText.replace(/^(Artigo\s+\d+\.?)/gim, '\n### $1');

    // Bold sections like "1.1.", "2. "
    cleanedText = cleanedText.replace(/^(\d+\.\d+\.?\s+.*)$/gm, '#### $1');

    // 3. Fix Hyphenation (words broken by PDF line endings)
    // Matches: "word- ", "word- \n", "pro- vocar", "respira- torio"
    cleanedText = cleanedText.replace(/(\p{L}+)-\s+(\p{L}+)/gu, '$1$2'); // "pro- vocar" -> "provocar"
    cleanedText = cleanedText.replace(/(\p{L}+)-\n\s*(\p{L}+)/gu, '$1$2'); // Broken across lines

    // 4. Format Lists (Convert "•" to Markdown list items)
    // Ensure newlines before list items
    cleanedText = cleanedText.replace(/•\s*/g, '\n- ');

    // 5. Fix common PDF artifacts in lists (e.g., "1.-", "a)") followed by text
    // cleanedText = cleanedText.replace(/^(\d+\.-)\s*/gm, '\n$1 '); // Ensure newline before numbered lists

    // Compacting multiple newlines again just in case
    cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');

    return cleanedText;
}

async function main() {
    console.log("🚀 Starting Document Cleanup...");

    // 1. Process T5 from User Notes
    if (fs.existsSync(T5_SOURCE_PATH)) {
        console.log(`Processing T5 from User Notes: ${path.basename(T5_SOURCE_PATH)}`);
        const t5 = fs.readFileSync(T5_SOURCE_PATH, 'utf-8');
        const cleanedT5 = cleanMarkdown(t5);
        fs.writeFileSync(T5_OUTPUT, cleanedT5);
        console.log("✅ T5 Cleaned & Restored (User Notes Version).");
    } else {
        console.error(`❌ T5 User Notes not found at: ${T5_SOURCE_PATH}`);
    }

    // 2. Clean T6 (Equality)
    if (fs.existsSync(T6_PATH)) {
        console.log("Cleaning T6 (Equality)...");
        const t6 = fs.readFileSync(T6_PATH, 'utf-8');
        const cleanedT6 = cleanMarkdown(t6);
        fs.writeFileSync(T6_PATH, cleanedT6);
        console.log("✅ T6 Cleaned.");
    } else {
        console.warn(`⚠️ T6 file not found at ${T6_PATH}`);
    }

    // 3. Clean T8 (PRL)
    if (fs.existsSync(T8_PATH)) {
        console.log("Cleaning T8 (PRL/Seguridade)...");
        const t8 = fs.readFileSync(T8_PATH, 'utf-8');
        const cleanedT8 = cleanMarkdown(t8);
        fs.writeFileSync(T8_PATH, cleanedT8);
        console.log("✅ T8 Cleaned.");
    } else {
        console.warn(`⚠️ T8 file not found at ${T8_PATH}`);
    }
}

main();
