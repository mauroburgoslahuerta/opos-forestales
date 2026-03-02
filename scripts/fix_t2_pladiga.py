import pandas as pd
import requests
import re
from pathlib import Path

# Configuración de Supabase
SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk" # SERVICE ROLE KEY for updates

headers_auth = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

headers_read = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

def parse_excel_answers(excel_path):
    print(f"Reading Excel: {excel_path}")
    df = pd.read_excel(excel_path, header=None)
    answers = {}
    
    # Process rows assuming format: Col0=Num, Col1=Ans, Col2=Num, Col3=Ans
    for idx, row in df.iterrows():
        # First pair (Columns 0 and 1)
        try:
            num1 = str(row[0]).strip()
            ans1 = str(row[1]).strip().lower()
            if num1.replace('.0', '').isdigit() and ans1 in ['a', 'b', 'c', 'd']:
                answers[int(float(num1))] = ans1
        except Exception:
            pass
            
        # Second pair (Columns 2 and 3)
        try:
            num2 = str(row[2]).strip()
            ans2 = str(row[3]).strip().lower()
            if num2.replace('.0', '').isdigit() and ans2 in ['a', 'b', 'c', 'd']:
                answers[int(float(num2))] = ans2
        except Exception:
            pass
            
    print(f"Total answers extracted from Excel: {len(answers)}")
    return answers

def fix_t2_pladiga():
    print("=" * 60)
    print("FIXING T2 PLADIGA ANSWERS")
    print("=" * 60)
    
    # 1. Parse Excel
    base = Path("f:/Proyectos Antigravity/Opos forestales/docs")
    excel_path = base / "forga_especifico/Parte Ramón Recaman/17-06-25  comunicacións -20260214/PLAN DE EXTINCIÓN PLADIGA/Respostas Test nº1 PLADIGA.xlsx"
    
    if not excel_path.exists():
        print(f"ERROR: Excel file not found at {excel_path}")
        return
        
    excel_answers = parse_excel_answers(excel_path)
    
    # 2. Get T2 PLADIGA topic ID
    print("\nFetching T2 PLADIGA topic from Supabase...")
    res = requests.get(f"{SUPABASE_URL}/rest/v1/topics?slug=eq.t-esp-2-pladiga&select=id", headers=headers_read)
    
    if res.status_code != 200 or not res.json():
        print("ERROR: Could not find t-esp-2-pladiga topic in database.")
        print(res.text)
        return
        
    topic_id = res.json()[0]['id']
    print(f"Topic ID: {topic_id}")
    
    # 3. Get Questions for this topic
    print("\nFetching questions for this topic...")
    res = requests.get(f"{SUPABASE_URL}/rest/v1/questions?topic_id=eq.{topic_id}&select=id,question_text,correct_answer", headers=headers_read)
    
    if res.status_code != 200:
        print("ERROR: Could not fetch questions.")
        return
        
    questions = res.json()
    print(f"Found {len(questions)} questions in database.")
    
    # 4. Match and Update
    updates_successful = 0
    updates_failed = 0
    not_matched = 0
    
    for q in questions:
        q_id = q['id']
        q_text = q['question_text']
        
        # Extract question number from text (e.g., "1.- Non é un principio...", "10,-O DTE" -> 1, 10)
        match = re.search(r'^\s*(\d+)[.\-),]+', q_text)
        if match:
            q_num = int(match.group(1))
            
            if q_num in excel_answers:
                correct_ans = excel_answers[q_num]
                
                # Update database
                update_payload = {
                    "correct_answer": correct_ans
                }
                
                update_res = requests.patch(
                    f"{SUPABASE_URL}/rest/v1/questions?id=eq.{q_id}",
                    headers=headers_auth,
                    json=update_payload
                )
                
                if update_res.status_code in (200, 204):
                    print(f"✓ Updated Q{q_num} (ID {q_id[:8]}...) -> Answer: {correct_ans.upper()}")
                    updates_successful += 1
                else:
                    print(f"✗ Failed to update Q{q_num}: {update_res.text}")
                    updates_failed += 1
            else:
                print(f"? Question number {q_num} extracted, but not found in Excel answers.")
                not_matched += 1
        else:
            print(f"! Could not extract question number from text: {q_text[:30]}...")
            not_matched += 1
            
    print("\n" + "=" * 60)
    print("SUMMARY:")
    print(f"Success: {updates_successful}")
    print(f"Failed:  {updates_failed}")
    print(f"Unmatched: {not_matched}")
    print("=" * 60)

if __name__ == "__main__":
    fix_t2_pladiga()
