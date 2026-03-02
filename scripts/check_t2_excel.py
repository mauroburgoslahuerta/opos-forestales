import pandas as pd
import json
from pathlib import Path

base = Path("f:/Proyectos Antigravity/Opos forestales/docs")
excel_path = base / "forga_especifico/Parte Ramón Recaman/17-06-25  comunicacións -20260214/PLAN DE EXTINCIÓN PLADIGA/Respostas Test nº1 PLADIGA.xlsx"

if excel_path.exists():
    try:
        df = pd.read_excel(excel_path, header=None) # Read without header to see raw data
        
        # Convert to dictionary format
        data = df.to_dict(orient='records')
        
        with open("t2_excel_dump.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print("Done. Wrote to t2_excel_dump.json")
    except Exception as e:
        print(f"Error reading excel: {e}")
