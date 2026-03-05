# -*- coding: utf-8 -*-
import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open('t-esp-9-seguridade_report.json', encoding='utf-8') as f:
    report = json.load(f)

for item in report['results']:
    q = item['question']
    text = q['question_text'].lower()
    
    if 'situación de atención' in text and '18' in text:
        print(f"P2 Situaciones CLIF: {q['id']}")
        
    if 'protocolo' in text and 'elementos básicos' in text:
        print(f"P4 Acronimo OACEL: {q['id']}")
        print(f"  B original: {q.get('b')}")
        
    if 'complementarios' in text and 'son' in text:
        print(f"P6 Equipos Complementarios: {q['id']}")
