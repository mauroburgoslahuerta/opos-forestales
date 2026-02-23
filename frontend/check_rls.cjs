const { createClient } = require('@supabase/supabase-js');

// ADMIN KEY para poder consultar catálogos del sistema
const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectPolicies() {
    console.log("--- INSPECCIONANDO POLÍTICAS DE SEGURIDAD (RLS) ---");

    // Consultar pg_policies
    // Note: Supabase-js client might limit access to system tables via standard 'from', 
    // but let's try calling a rpc if this fails, or use a direct SQL via pg-meta if available. 
    // Actually, usually we can't select from pg_policies via the API unless exposed.
    // Let's try to verify what we can see about the table.

    // Plan B: Probaremos SELECT como 'anon' y como 'authenticated' para confirmar el bloqueo.
}

// Better approach: Generate a SQL query to be run in the Dashboard Inspect, 
// OR just assume standard RLS is ON and no policy exists for SELECT.

// Let's check if RLS is enabled on the table.
async function checkRLS() {
    // 1. Check as ANON
    const { count: anonCount, error: anonError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

    console.log(`Visibilidad (ANON): ${anonCount} preguntas.`);
    if (anonError) console.error("Error Anon:", anonError.message);

    // 2. Check as AUTHENTICATED USER (Mauro)
    console.log("Iniciando sesión como Mauro...");
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'mauro@oposforestales.gal',
        password: 'Unlucky'
    });

    if (authError) {
        console.error("Error Auth:", authError.message);
        return;
    }

    // Create client with user session
    // Note: In supabase-js, the client updates its session automatically usually, 
    // but strictly we should pass the access token in headers if creating new, 
    // or just use the same client if it auto-updates.
    // Let's rely on the same client instance which usually persists session.

    const { count: userCount, error: userError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

    console.log(`Visibilidad (USER MAURO): ${userCount} preguntas.`);
    if (userCount < anonCount) {
        console.log("🚨 ALERTA: El usuario autenticado ve MENOS preguntas que el anónimo.");
        console.log("CAUSA PROBABLE: Política RLS 'auth.uid() = user_id' o similar.");
    }
}

checkRLS();
