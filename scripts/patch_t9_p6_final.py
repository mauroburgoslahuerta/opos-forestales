import os
import json
from supabase import create_client

def main():
    URL = "https://ercpofgqayxewtapscsn.supabase.co"
    KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk"
    supabase = create_client(URL, KEY)

    with open('t-esp-9-seguridade_questions_db.json', encoding='utf-8') as f:
        db = json.load(f)

    target_id = None
    for q in db:
        ans = q.get('option_a', '').lower()
        if 'certificad' in ans and 'ue' in ans:
            target_id = q['id']
            print(f"Encontrado ID para P6: {target_id} -> {q['question_text']}")
            break

    if target_id:
        print("Aplicando P6 (Equipos Complementarios) -> Resposta 'b'")
        res = supabase.table("questions").update({"correct_answer": "b"}).eq("id", target_id).execute()
        print("Filas afectadas:", len(res.data))

if __name__ == "__main__":
    main()
