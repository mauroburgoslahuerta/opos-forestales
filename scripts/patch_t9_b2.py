import os
from supabase import create_client

def main():
    URL = "https://ercpofgqayxewtapscsn.supabase.co"
    KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk"
    
    supabase = create_client(URL, KEY)

    # 2. Situacións de Perigo CLIF
    print("Aplicando P2 (Situacións perigo) -> Resposta 'c'")
    res1 = supabase.table("questions").update({"correct_answer": "c"}).eq("id", "a0a65d78-8e94-4a31-a7b1-df8c855efd40").execute()
    print("res1:", len(res1.data))

    # 4. Acrónimo OACEL inventado
    print("Aplicando P4 (Acrónimo OACEL) -> Cambiar texto Opción B por 'Atención'")
    res2 = supabase.table("questions").update({"option_b": "Observación, Atención, Comunicación, Ruta de escape e Lugar seguro."}).eq("id", "d1eda63c-1084-4555-b0d3-8f484d6554b5").execute()
    print("res2:", len(res2.data))

    # 6. Equipos Complementarios
    print("Aplicando P6 (Equipos Complementarios) -> Resposta 'b'")
    res3 = supabase.table("questions").update({"correct_answer": "b"}).eq("id", "e3dc0b4a-82c7-46b2-9df7-bbfe43ef21fe").execute()
    print("res3:", len(res3.data))

if __name__ == "__main__":
    main()
