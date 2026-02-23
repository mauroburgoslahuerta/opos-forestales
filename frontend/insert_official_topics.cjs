const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TOPICS = [
    // COMMON
    { id: 'c1110000-0000-0000-0000-000000000000', slug: 't-com-1-constitucion', name: 'T1 Común: A Constitución española de 1978', block: 'comun' },
    { id: 'c2220000-0000-0000-0000-000000000000', slug: 't-com-2-estatuto', name: 'T2 Común: Estatuto de autonomía para Galicia', block: 'comun' },
    { id: 'c3330000-0000-0000-0000-000000000000', slug: 't-com-3-procedemento', name: 'T3 Común: Procedemento administrativo común', block: 'comun' },
    { id: 'c4440000-0000-0000-0000-000000000000', slug: 't-com-4-transparencia', name: 'T4 Común: Transparencia e bo goberno', block: 'comun' },
    { id: 'c5550000-0000-0000-0000-000000000000', slug: 't-com-5-emprego', name: 'T5 Común: Emprego público de Galicia', block: 'comun' },
    { id: 'c6660000-0000-0000-0000-000000000000', slug: 't-com-6-igualdade', name: 'T6 Común: Igualdade de mulleres e homes', block: 'comun' },
    { id: 'c7770000-0000-0000-0000-000000000000', slug: 't-com-7-discapacidade', name: 'T7 Común: Dereitos das persoas con discapacidade', block: 'comun' },
    { id: 'c8880000-0000-0000-0000-000000000000', slug: 't-com-8-prl', name: 'T8 Común: Prevención de riscos laborais', block: 'comun' },
    // SPECIFIC
    { id: 'e1110000-0000-0000-0000-000000000000', slug: 't-esp-1-defensa', name: 'T1 Específico: Lei 3/2007 Prevención e Defensa', block: 'especifico' },
    { id: 'e2220000-0000-0000-0000-000000000000', slug: 't-esp-2-pladiga', name: 'T2 Específico: Plan PLADIGA', block: 'especifico' },
    { id: 'e3330000-0000-0000-0000-000000000000', slug: 't-esp-3-semop', name: 'T3 Específico: Sistema SEMOP', block: 'especifico' },
    { id: 'e4440000-0000-0000-0000-000000000000', slug: 't-esp-4-lume', name: 'T4 Específico: Comportamento do Lume', block: 'especifico' },
    { id: 'e5550000-0000-0000-0000-000000000000', slug: 't-esp-5-extincion', name: 'T5 Específico: Técnicas de Extinción', block: 'especifico' },
    { id: 'e6660000-0000-0000-0000-000000000000', slug: 't-esp-6-prevencion', name: 'T6 Específico: Accións de Prevención', block: 'especifico' },
    { id: 'e7770000-0000-0000-0000-000000000000', slug: 't-esp-7-equipamento', name: 'T7 Específico: Ferramentas e Maquinaria', block: 'especifico' },
    { id: 'e8880000-0000-0000-0000-000000000000', slug: 't-esp-8-conduccion', name: 'T8 Específico: Condución e Estiba', block: 'especifico' },
    { id: 'e9990000-0000-0000-0000-000000000000', slug: 't-esp-9-seguridade', name: 'T9 Específico: Seguridade e EPIs', block: 'especifico' },
    { id: 'eaaa0000-0000-0000-0000-000000000000', slug: 't-esp-10-accidentes', name: 'T10 Específico: Accidentes e Autoprotección', block: 'especifico' },
    { id: 'ebbb0000-0000-0000-0000-000000000000', slug: 't-esp-11-comunicacions', name: 'T11 Específico: Comunicacións', block: 'especifico' }
];

async function run() {
    console.log("Inyectando 19 UUIDs oficiales en la tabla topics con el schema correcto...");
    const { data, error } = await supabase.from('topics').upsert(TOPICS, { onConflict: 'id' });

    if (error) {
        console.error("❌ Error insertando:", error);
    } else {
        console.log("✅ Tabla topics restaurada con éxito.");
    }
}

run();
