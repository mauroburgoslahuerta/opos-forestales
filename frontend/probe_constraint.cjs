const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectConstraint() {
    console.log("--- INSPECTING CONSTRAINT 'topics_block_check' ---");

    // We can use rpc if available, or try to select from information_schema if allowed.
    // If restricted, we can try to infer from data again or try different values.
    // But let's try a direct SQL query via the 'pg_meta' features if accessible or just a simple rpc call if we had one.
    // Since we don't have a direct SQL execution capability via JS client easily without RLS blocking system tables often...

    // Wait, the Service Role key usually bypasses RLS but doesn't necessarily grant access to system catalogs via PostgREST 
    // unless they are exposed.

    // Let's try to query information_schema.check_constraints (often not exposed).
    // ALTERNATIVE: Use the error message to learn? No, it just says it violates.

    // LET'S TRY TO INSERT VARIANTS to see what works, using the library.
    // This is a "black box" probing approach.

    const variants = ['Common', 'COMMON', 'specific', 'Specific', 'SPECIFIC', 'bloque_1', 'bloque_2'];

    for (const val of variants) {
        console.log(`Testing value: '${val}'...`);
        const { error } = await supabase.from('topics').insert({
            id: '00000000-0000-0000-0000-00000000000' + variants.indexOf(val), // Dummy UUID
            slug: `test-slug-${val}`,
            name: `Test Name ${val}`,
            block: val
        });

        if (error) {
            console.log(`❌ '${val}' FALÓ: ${error.message} (${error.details})`);
        } else {
            console.log(`✅ '${val}' FUNCIONÓ!`);
            // Clean up
            await supabase.from('topics').delete().eq('slug', `test-slug-${val}`);
        }
    }
}

inspectConstraint();
