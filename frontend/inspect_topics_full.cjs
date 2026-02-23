const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTIwNjcsImV4cCI6MjA4NjY2ODA2N30.Ro3og1p-9E1TtG__K6Tvd5gU9wfgUu2BkEMuW5qFtlI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspect() {
    console.log('Fetching schema...');
    const { data, error } = await supabase.from('topics').select('*').limit(1);

    if (error) {
        console.error('Error:', error);
        fs.writeFileSync('schema_error.txt', JSON.stringify(error, null, 2));
    } else if (data && data.length > 0) {
        const cols = Object.keys(data[0]);
        console.log('Columns:', cols);
        fs.writeFileSync('schema_dump.json', JSON.stringify(cols, null, 2));
    } else {
        console.log('Table empty');
        fs.writeFileSync('schema_empty.txt', 'Table empty');
        // If empty, try to deduce from error by selecting non-existent column?
        // Or assume minimum columns: id, slug, name?
    }
}

inspect();
