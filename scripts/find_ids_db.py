import os
from supabase import create_client

def main():
    URL = "https://ercpofgqayxewtapscsn.supabase.co"
    KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk"

    supabase = create_client(URL, KEY)
    
    # fetch all questions for T9
    topic_res = supabase.table("topics").select("id").eq("slug", "t-esp-9-seguridade").execute()
    if not topic_res.data:
        print("Topic not found")
        return
    
    topic_id = topic_res.data[0]["id"]
    res = supabase.table("questions").select("id, question_text, option_a, option_b, option_c, option_d").eq("topic_id", topic_id).execute()
    
    for r in res.data:
        text = r["question_text"].lower()
        if "18" in text and "atención" in text:
            print(f"P2: {r['id']}")
            
        if "oacel" in text and "elementos" in text:
            print(f"P4: {r['id']}")
            print(f"  A: {r['option_a']}")
            print(f"  B: {r['option_b']}")
            
        if "complementario" in text or "certificados" in r["option_a"].lower() or "protección" in r.get("option_b", "").lower():
            if "equipos" in text or "ue" in r.get("option_a", "").lower():
                print(f"P6: {r['id']}")
                print(f"  Q: {r['question_text']}")
                print(f"  A: {r.get('option_a')}")
                print(f"  B: {r.get('option_b')}")

if __name__ == "__main__":
    main()
