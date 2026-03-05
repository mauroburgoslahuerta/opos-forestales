import os
from supabase import create_client

def main():
    URL = "https://ercpofgqayxewtapscsn.supabase.co"
    KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk"
    
    supabase = create_client(URL, KEY)
    
    # 1. Observacion OACEL - P3 en el json (ID: 7ec2409c-6013-470e-8216-fada6cab4182) -> C
    print("Actualizando Observacion OACEL...")
    res1 = supabase.table("questions").update({"correct_answer": "c"}).eq("id", "7ec2409c-6013-470e-8216-fada6cab4182").execute()
    print("res1:", len(res1.data))

    # 2. Contenido OACEL - P5 en json (ID: 654282ef-9df0-4192-a907-1d246ccd5266) -> D
    print("Actualizando Contenido OACEL...")
    res2 = supabase.table("questions").update({"correct_answer": "d"}).eq("id", "654282ef-9df0-4192-a907-1d246ccd5266").execute()
    print("res2:", len(res2.data))

    # 3. Velocidad escape - P7 en json (ID: 52800dea-8177-4d13-8630-9d76c522b551) -> C (Experto dice 35m/min, Gemini decia A 80m/min. Gana humano)
    print("Actualizando Velocidad escape...")
    res3 = supabase.table("questions").update({"correct_answer": "c"}).eq("id", "52800dea-8177-4d13-8630-9d76c522b551").execute()
    print("res3:", len(res3.data))

    # 4. Transporte Ladera - P11 en json (ID: ee82369e-6596-40ea-b93a-9d51f1b443b1) -> B
    print("Actualizando Transporte Ladera...")
    res4 = supabase.table("questions").update({"correct_answer": "b"}).eq("id", "ee82369e-6596-40ea-b93a-9d51f1b443b1").execute()
    print("res4:", len(res4.data))

    # 5. Machado transporte - P14 en json (ID: 861e1442-d484-411b-bfd2-cd7263eed332) -> B (Estaba en B ya en la DB. Mantenemos B).
    
    # 6. Traxe Categoria - P18/19 en json (IDs: 063f0893-48fd-4632-96f8-7fcf79382f38 y e833e2af-7506-48c7-a685-d54f1eb496cc) -> C (Estaban en C. Mantenemos C).

if __name__ == "__main__":
    main()
