import os
from supabase import create_client

def main():
    URL = "https://ercpofgqayxewtapscsn.supabase.co"
    KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk"
    
    supabase = create_client(URL, KEY)

    # 6. Equipos Complementarios
    print("Aplicando P6 (Equipos Complementarios) -> Resposta 'b'")
    res = supabase.table("questions").update({"correct_answer": "b"}).eq("id", "dc936bda-a0f1-46da-9c5a-a04d20e29da3").execute()
    print("Filas afectadas:", len(res.data))

if __name__ == "__main__":
    main()
