import requests

url = "https://ercpofgqayxewtapscsn.supabase.co/rest/v1"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTIwNjcsImV4cCI6MjA4NjY2ODA2N30.Ro3og1p-9E1TtG__K6Tvd5gU9wfgUu2BkEMuW5qFtlI",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTIwNjcsImV4cCI6MjA4NjY2ODA2N30.Ro3og1p-9E1TtG__K6Tvd5gU9wfgUu2BkEMuW5qFtlI",
    "Content-Type": "application/json"
}

# 1. Obter o topic_id para T2 Especifico (PLADIGA)
try:
    res = requests.get(f"{url}/topics?select=id,slug,name,block", headers=headers)
    topics = res.json()
    
    t2_topic = next((t for t in topics if "pladiga" in t.get("slug", "").lower() or "pladiga" in t.get("name", "").lower()), None)
    
    if not t2_topic:
        print("No se encontró el tema PLADIGA en la base de datos.")
        # Intentemos listar todos por si el nombre es diferente
        for t in topics:
            if "t2" in t.get("slug", "").lower() and t.get("block") == "especifico":
                t2_topic = t
                break
                
    if not t2_topic:
         print("No pude identificar el ID del tema.")
         exit()
         
    topic_id = t2_topic["id"]
    print(f"Tema encontrado: {t2_topic['name']} (ID: {topic_id}, Bloque: {t2_topic['block']})")
    
    # 2. Obter todas as preguntas desse tema
    q_res = requests.get(f"{url}/questions?topic_id=eq.{topic_id}&select=id,question_text,correct_answer", headers=headers)
    questions = q_res.json()
    
    total_q = len(questions)
    missing_answers = 0
    
    for q in questions:
        ans = q.get("correct_answer")
        if not ans or ans.strip() == "":
            missing_answers += 1
            
    print(f"Total de preguntas en {t2_topic['slug']}: {total_q}")
    print(f"Preguntas SIN respuesta (correct_answer vacío/nulo): {missing_answers}")
    print(f"Preguntas CON respuesta: {total_q - missing_answers}")
    
    if missing_answers > 0:
        print("\nEjemplo de preguntas sin respuesta:")
        empty_qs = [q for q in questions if not q.get("correct_answer") or q.get("correct_answer").strip() == ""]
        for i, eq in enumerate(empty_qs[:5]):
            print(f"[{eq['id']}] {eq['question_text'][:80]}...")
            
except Exception as e:
    print(f"Error: {e}")
