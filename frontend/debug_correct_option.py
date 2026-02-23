
import os
from supabase import create_client, Client

url: str = "https://ercpofgqayxewtapscsn.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk"

supabase: Client = create_client(url, key)

response = supabase.table('questions').select('id, correct_option, question_text').ilike('question_text', '%SEMOP%').limit(5).execute()

print(response.data)
