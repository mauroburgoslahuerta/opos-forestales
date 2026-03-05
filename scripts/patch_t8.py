import os
from supabase import create_client

def main():
    URL = "https://ercpofgqayxewtapscsn.supabase.co"
    KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk"
    
    supabase = create_client(URL, KEY)
    
    # Update P8: correct answer 'c'
    print("Actualizando P8...")
    res_p8 = supabase.table("questions").update({"correct_answer": "c"}).eq("id", "adace58a-2075-473d-98e7-f81af0251b80").execute()
    print("P8 update result:", len(res_p8.data))
    
    # Update P37: remove option_c because it is identical to option_b
    print("Actualizando P37...")
    res_p37 = supabase.table("questions").update({"option_c": None}).eq("id", "846df09b-5d9f-404e-907f-815f6ce0c261").execute()
    print("P37 update result:", len(res_p37.data))

if __name__ == "__main__":
    main()
