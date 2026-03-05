import os
from supabase import create_client

def main():
    URL = "https://ercpofgqayxewtapscsn.supabase.co"
    KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk"
    
    supabase = create_client(URL, KEY)
    
    # 3. Velocidad escape -> A (80 m/min)
    print("Revirtiendo Velocidad escape a 80m/min (A)...")
    res1 = supabase.table("questions").update({"correct_answer": "a"}).eq("id", "52800dea-8177-4d13-8630-9d76c522b551").execute()
    print("res1:", len(res1.data))

    # 5. Machado transporte -> A (Sobre o ombreiro)
    print("Revirtiendo Transporte machada a sobre o ombreiro (A)...")
    res2 = supabase.table("questions").update({"correct_answer": "a"}).eq("id", "861e1442-d484-411b-bfd2-cd7263eed332").execute()
    print("res2:", len(res2.data))

    # 6. Traxe Categoria -> B (Categoría II) para ambas preguntas duplicadas
    print("Revirtiendo Traxe Ignífugo a Categoría II (B)...")
    res3 = supabase.table("questions").update({"correct_answer": "b"}).eq("id", "063f0893-48fd-4632-96f8-7fcf79382f38").execute()
    res4 = supabase.table("questions").update({"correct_answer": "b"}).eq("id", "e833e2af-7506-48c7-a685-d54f1eb496cc").execute()
    print("res3:", len(res3.data), "res4:", len(res4.data))

if __name__ == "__main__":
    main()
