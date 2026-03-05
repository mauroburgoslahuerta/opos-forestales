# -*- coding: utf-8 -*-
"""
run_t8_dryrun.py - Verificacion DRY-RUN para T8 (t-esp-8-conduccion).
NON aplica cambios en Supabase - so xera o informe para revision manual.
"""
import sys, os, shutil, tempfile, json, pathlib

LOG_PATH = r"f:\Proyectos Antigravity\Opos forestales\scripts\t8_dryrun_log.txt"
log_file = open(LOG_PATH, "w", encoding="utf-8", errors="replace")
sys.stdout = log_file
sys.stderr = log_file

if not os.environ.get("GEMINI_API_KEY"):
    os.environ["GEMINI_API_KEY"] = "AIzaSyA4u6Pz9ZxQ9RmuMYv99gvKlqYU10QO2OU"
if not os.environ.get("SUPABASE_SERVICE_ROLE_KEY"):
    os.environ["SUPABASE_SERVICE_ROLE_KEY"] = "sb_secret_g1l1qc_FSid8PCSy67egHA_jsiP5Wcz"

BASE    = pathlib.Path(r"f:\Proyectos Antigravity\Opos forestales")
SCRIPTS = BASE / "scripts"
SLUG    = "t-esp-8-conduccion"
PDF_DIR = BASE / "docs" / "PARA CURADOR" / "especificos" / "t-esp-8-conducion"

# PDFs para T8
PDF_ORIGINALS = [
    (PDF_DIR / "TEST TODOTERREO 1.pdf",             "t8_test_todoterreo1.pdf"),
    (PDF_DIR / "A CONDUCCION TODOTERREO 2025.pdf",  "t8_temario_conduccion.pdf"),
    (PDF_DIR / "CIRCULAR 2021 CIRCULACION V1 AGASP.pdf", "t8_circular_circulacion.pdf"),
]

TMP_DIR = tempfile.mkdtemp(prefix="t8_pdfs_")
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

# Deduplicar
seen = set()
unique_pdfs = []
for name in safe_pdf_names:
    if name not in seen:
        seen.add(name)
        unique_pdfs.append(name)
safe_pdf_names = unique_pdfs

sys.argv = ["verify_topic.py", SLUG] + safe_pdf_names

try:
    import importlib.util
    spec = importlib.util.spec_from_file_location("verify_topic", str(SCRIPTS / "verify_topic.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.PDF_ROOTS = [pathlib.Path(TMP_DIR)]

    print(f"\n=== T8 DRY-RUN (SEN APLICAR CAMBIOS) ===")
    topic_id = mod.get_topic_id(SLUG)
    if not topic_id:
        print(f"[ERRO] Non se atopou o topic '{SLUG}'"); sys.exit(1)
    questions = mod.get_questions(topic_id)
    print(f"  -> {len(questions)} preguntas (topic: {topic_id[:8]}...)")

    # Gardar JSON de preguntas para revisión manual
    q_path = SCRIPTS / f"{SLUG}_questions_db.json"
    q_path.write_text(json.dumps(questions, ensure_ascii=False, indent=2), encoding="utf-8")

    # Subir PDFs
    pdf_parts = []
    for name in safe_pdf_names:
        p = mod.find_pdf(name)
        if p:
            pdf_parts.append(mod.upload_pdf(p))
        else:
            print(f"  [AVISO] Non atopado: {name}")

    # Temario
    temario = ""
    temario_path = BASE / "frontend" / "public" / "temario" / "t-esp-8-conduccion"
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

    # INFORME - SEN APLICAR CAMBIOS
    mod.print_report(data, SLUG)

    erros = [v for v in data.get("verificacion", []) if not v.get("ok", True)]
    print(f"\n[!] DRY-RUN: {len(erros)} erros detectados. NON se aplicaron cambios.")
    print(f"[!] Revisar manualmente: {report_path}")

    # Mostrar detalle completo para revision manual
    print(f"\n=== DETALLE PARA REVISION MANUAL ===")
    q_by_id = {q["id"]: q for q in questions}
    for v in erros:
        qid = v.get("id", "")
        q = q_by_id.get(qid, {})
        n = v.get("n", "?")
        actual = v.get("actual", "?")
        correcta = v.get("correcta", "?")
        conf = v.get("conf", "?")
        exp = v.get("exp", "")
        print(f"\n--- P{n} (conf={conf}) ---")
        print(f"  Pregunta: {q.get('question_text','?')[:150]}")
        print(f"  A) {q.get('option_a','?')[:80]}")
        print(f"  B) {q.get('option_b','?')[:80]}")
        print(f"  C) {q.get('option_c','?')[:80]}")
        print(f"  D) {q.get('option_d','?')[:80]}")
        print(f"  Actual: [{actual}] | Proposta: [{correcta}]")
        print(f"  Xustificacion: {exp[:200]}")

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
