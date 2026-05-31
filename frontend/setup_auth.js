
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const users = [
    { email: 'mauro@oposforestales.gal', password: 'Unlucky', full_name: 'Mauro', role: 'admin' },
    { email: 'dario@oposforestales.gal', password: 'Wilfred', full_name: 'Dario', role: 'student' },
    { email: 'hugo@oposforestales.gal', password: 'Wilfred', full_name: 'Hugo', role: 'student' },
    { email: 'invitado@oposforestales.gal', password: 'guest_password', full_name: 'Invitado', role: 'student' }
];

async function seedUsers() {
    console.log("🌲 Seeding Users...");

    // 1. Try to check if profiles table exists by selecting from it (limit 0)
    const { error: tableCheckError } = await supabase.from('profiles').select('id').limit(0);
    if (tableCheckError) {
        console.error("⚠️  Table 'public.profiles' might be missing or not accessible.");
        console.error("    Error details:", tableCheckError.message);
        console.error("    PLEASE RUN 'supabase/migrations/20260216_create_profiles.sql' IN SUPABASE DASHBOARD SQL EDITOR.");
    } else {
        console.log("✅ Table 'public.profiles' appears to exist.");
    }

    for (const user of users) {
        console.log(`\nChecking ${user.full_name}...`);

        // Check if user exists via Admin API
        const { data: { users: existingUsers }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            console.error("❌ Error listing users:", listError);
            return;
        }

        const exists = existingUsers.find(u => u.email === user.email);

        if (exists) {
            console.log(`✅ User ${user.full_name} AUTH exists. ID: ${exists.id}`);

            // Update profile
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({ id: exists.id, full_name: user.full_name, role: user.role });

            if (profileError) console.error(`   ⚠️  Profile Sync Failed: ${profileError.message}`);
            else console.log(`   ✅ Profile Synced.`);

        } else {
            // Create User
            const { data, error } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true,
                user_metadata: { full_name: user.full_name, role: user.role }
            });

            if (error) {
                console.error(`❌ Error creating ${user.full_name}:`, error.message);
            } else {
                console.log(`✨ Created AUTH User ${user.full_name}. ID: ${data.user.id}`);

                // Manual Profile Insert (in case trigger missing)
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({ id: data.user.id, full_name: user.full_name, role: user.role });

                if (profileError) console.error(`   ⚠️  Profile Creation Failed: ${profileError.message}`);
                else console.log(`   ✅ Profile Created.`);
            }
        }
    }
}

seedUsers();
