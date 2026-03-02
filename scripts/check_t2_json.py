import requests
import json

url = "https://ercpofgqayxewtapscsn.supabase.co/rest/v1"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTIwNjcsImV4cCI6MjA4NjY2ODA2N30.Ro3og1p-9E1TtG__K6Tvd5gU9wfgUu2BkEMuW5qFtlI",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTIwNjcsImV4cCI6MjA4NjY2ODA2N30.Ro3og1p-9E1TtG__K6Tvd5gU9wfgUu2BkEMuW5qFtlI"
}

res = requests.get(f"{url}/topics?select=id,slug,name,block", headers=headers)
topics = res.json()

t2_topic = next((t for t in topics if t.get("slug") == "t-esp-2-pladiga"), None)

if t2_topic:
    topic_id = t2_topic["id"]
    q_res = requests.get(f"{url}/questions?topic_id=eq.{topic_id}&select=id,question_text,correct_answer", headers=headers)
    questions = q_res.json()
    
    missing_answers = []
    
    for q in questions:
        ans = q.get("correct_answer")
        if not ans or ans.strip() == "":
            missing_answers.append({
                "id": q["id"],
                "question": q["question_text"],
                "correct_answer": q.get("correct_answer")
            })
            
    out = {
        "topic": t2_topic,
        "total": len(questions),
        "missing_answers_count": len(missing_answers),
        "missing_samples": missing_answers
    }
    
    with open("t2_debug.json", "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    print("Done. Wrote to t2_debug.json")
else:
    print("Topic not found.")
