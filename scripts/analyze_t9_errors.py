import json
with open("scripts/t-esp-9-seguridade_report.json", encoding="utf-8") as f:
    data = json.load(f)

for q in data:
    if not q["ok"]:
        print(f"--- ID: {q['id']}")
        print(f"[{q['action'].upper()}] Conf({q['confidence']}) - {q['reason']}")
        print(f"Q: {q.get('question_text')}")
        print(f"A: {q.get('option_a')}")
        print(f"B: {q.get('option_b')}")
        print(f"C: {q.get('option_c')}")
        print(f"D: {q.get('option_d')}")
        print(f"DB says: {q.get('correct_answer')} | Gemini says: {q.get('proposed_answer')}\n")
