import requests

SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

# The ID was obtained from t2_debug.json
q_id = "78df9610-08ad-41b7-805b-b18c41371d28"

print(f"Deleting question {q_id} (Question 46) from T2 PLADIGA...")
res = requests.delete(f"{SUPABASE_URL}/rest/v1/questions?id=eq.{q_id}", headers=headers)

if res.status_code in (200, 204):
    print("Delete successful.")
else:
    print(f"Error deleting: {res.status_code} - {res.text}")
