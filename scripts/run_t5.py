# -*- coding: utf-8 -*-
"""
Script ad-hoc para verificar T5 (t-esp-5-extincion).
Redirixe todo o output a un ficheiro para evitar problemas de encoding en Windows.
"""
import sys, os, io

# Fix encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Sobrescribir sys.argv para chamar a verify_topic con os argumentos correctos
sys.argv = [
    "verify_topic.py",
    "t-esp-5-extincion",
    "Tema 6 T",       # Matches: "Tema 6 Técnicas de extinción.pdf"
    "Tema 6_Test",    # Matches: "Tema 6_Test Nº1.pdf"
]

# Executar
exec(open(r"f:\Proyectos Antigravity\Opos forestales\scripts\verify_topic.py",
          encoding="utf-8").read())
