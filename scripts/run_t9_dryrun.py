# -*- coding: utf-8 -*-
"""
run_t9_dryrun.py - Verificacion DRY-RUN para T9 (t-esp-9-seguridade).
"""
import sys, os, shutil, tempfile, json, pathlib

LOG_PATH = r"f:\Proyectos Antigravity\Opos forestales\scripts\t9_dryrun_log.txt"
log_file = open(LOG_PATH, "w", encoding="utf-8", errors="replace")
sys.stdout = log_file
sys.stderr = log_file

if not os.environ.get("GEMINI_API_KEY"):
    os.environ["GEMINI_API_KEY"] = "AIzaSyA4u6Pz9ZxQ9RmuMYv99gvKlqYU10QO2OU" # From previous verified runs

if not os.environ.get("SUPABASE_SERVICE_ROLE_KEY"):
    os.environ["SUPABASE_SERVICE_ROLE_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk"

if not os.environ.get("SUPABASE_URL"):
    os.environ["SUPABASE_URL"] = "https://ercpofgqayxewtapscsn.supabase.co"
    
BASE    = pathlib.Path(r"f:\Proyectos Antigravity\Opos forestales")
SCRIPTS = BASE / "scripts"

# Force write to .env so verify_topic.py doesn't overwrite with anon key
env_path = SCRIPTS / ".env"
with open(env_path, "w") as f:
    f.write(f"SUPABASE_URL={os.environ['SUPABASE_URL']}\n")
    f.write(f"SUPABASE_SERVICE_ROLE_KEY={os.environ['SUPABASE_SERVICE_ROLE_KEY']}\n")
    f.write(f"GEMINI_API_KEY={os.environ['GEMINI_API_KEY']}\n")
    
SLUG    = "t-esp-9-seguridade"
PDF_DIR_CURADOR = BASE / "docs" / "PARA CURADOR" / "especificos" / "t-esp-9-seguridade"
PDF_DIR_BRUNA   = BASE / "docs" / "forga_especifico" / "prevencion de riscos laborales- Xavier Bruña" / "test"

# PDFs para T9
PDF_ORIGINALS = [
    (PDF_DIR_CURADOR / "1.4.- Protocolo OACEL (AGASP).pdf", "t9_ocel_agasp.pdf"),
    (PDF_DIR_CURADOR / "1.1.- Manual de prevención de riscos laborais na defensa contra incendios forestais.pdf", "t9_manual_prl.pdf"),
    (PDF_DIR_BRUNA / "3.2.- Test clase nº 1.pdf", "t9_test_clase_1.pdf"),
    (PDF_DIR_BRUNA / "4.2.- Test clase N2 seguridade e saúde - Setembro 25.pdf", "t9_test_clase_2.pdf"),
    (PDF_DIR_BRUNA / "5.2.- Test clase N3 Seguridade e Saúde.pdf", "t9_test_clase_3.pdf"),
    (PDF_DIR_BRUNA / "6.2.- Test nº4 de Seguridade e Saúde.pdf", "t9_test_clase_4.pdf"),
]

TMP_DIR = tempfile.mkdtemp(prefix="t9_pdfs_")
safe_pdf_names = []

for orig_path, safe_name in PDF_ORIGINALS:
    orig_resolved = orig_path.resolve()
    if orig_resolved.exists():
        dest = pathlib.Path(TMP_DIR) / safe_name
        shutil.copy2(str(orig_resolved), str(dest))
        safe_pdf_names.append(safe_name)
        print(f"[PDF] {orig_resolved.name} -> {safe_name}")
    else:
        print(f"[AVISO] Non atopado: {orig_path}")

sys.argv = ["verify_topic.py", SLUG] + safe_pdf_names

try:
    import importlib.util
    spec = importlib.util.spec_from_file_location("verify_topic", str(SCRIPTS / "verify_topic.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.PDF_ROOTS = [pathlib.Path(TMP_DIR)]

    print(f"\n=== T9 DRY-RUN (SEN APLICAR CAMBIOS) ===")

    topic_id = mod.get_topic_id(SLUG)
    if not topic_id:
        print(f"[ERRO] Non se atopou o topic '{SLUG}'"); sys.exit(1)
    
    questions = mod.get_questions(topic_id)
    print(f"  -> {len(questions)} preguntas (topic: {topic_id[:8]}...)")

    q_path = SCRIPTS / f"{SLUG}_questions_db.json"
    q_path.write_text(json.dumps(questions, ensure_ascii=False, indent=2), encoding="utf-8")

    pdf_parts = []
    for name in safe_pdf_names:
        p = mod.find_pdf(name)
        if p:
            pdf_parts.append(mod.upload_pdf(p))
        else:
            print(f"  [AVISO] Non atopado: {name}")

    temario = ""
    temario_path = BASE / "frontend" / "public" / "temario" / "t-esp-9-seguridade"
    if temario_path.exists():
        for md in temario_path.glob("*.md"):
            temario += f"\n\n### {md.name}\n" + md.read_text(encoding="utf-8", errors="replace")[:15000]
    print(f"  -> Temario: {len(temario):,} chars")

    print(f"\n[3] Enviando a Gemini ({len(questions)} preguntas + {len(pdf_parts)} PDFs)...")
    raw = mod.ask_gemini(pdf_parts, questions, temario)
    (SCRIPTS / f"{SLUG}_raw_response.txt").write_text(raw, encoding="utf-8")
    print(f"  -> {len(raw):,} chars recibidos")

    print(f"\n[4] Parseando...")
    data = mod.parse_response(raw)
    report_path = SCRIPTS / f"{SLUG}_report.json"
    report_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    mod.print_report(data, SLUG)

except SystemExit:
    pass
except Exception as e:
    import traceback
    print(f"\n[ERRO CRITICO]: {e}")
    traceback.print_exc()
finally:
    shutil.rmtree(TMP_DIR, ignore_errors=True)
    log_file.flush()
    log_file.close()
