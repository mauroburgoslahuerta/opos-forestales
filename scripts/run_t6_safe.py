# -*- coding: utf-8 -*-
"""
run_t6_safe.py - Wrapper para verificar T6 (t-esp-6-prevencion).
Copia os PDFs a rutas sen caracteres especiais antes de subilos a Gemini.
"""
import sys, os, io, shutil, tempfile, json, pathlib

LOG_PATH = r"f:\Proyectos Antigravity\Opos forestales\scripts\t6_run_log.txt"
log_file = open(LOG_PATH, "w", encoding="utf-8", errors="replace")
sys.stdout = log_file
sys.stderr = log_file

if not os.environ.get("GEMINI_API_KEY"):
    os.environ["GEMINI_API_KEY"] = "AIzaSyA4u6Pz9ZxQ9RmuMYv99gvKlqYU10QO2OU"
if not os.environ.get("SUPABASE_SERVICE_ROLE_KEY"):
    os.environ["SUPABASE_SERVICE_ROLE_KEY"] = "sb_secret_g1l1qc_FSid8PCSy67egHA_jsiP5Wcz"

BASE = pathlib.Path(r"f:\Proyectos Antigravity\Opos forestales")
SCRIPTS = BASE / "scripts"
SLUG = "t-esp-6-prevencion"

# PDFs orixinais e nomes seguros
PDF_ORIGINALS = [
    (BASE / "docs" / "forga_especifico" /
     "Parte Hugo Barredo" /
     "Prevenci\u00f3n de incendios accions sobre o territorio e sobre a poboaci\u00f3n. As redes de faixas de xesti\u00f3" /
     "Test_XB_Prevencion_RFXB_Queimas-1.pdf",
     "t6_test_prevencion_1.pdf"),
    (BASE / "docs" / "forga_especifico" /
     "Parte Hugo Barredo" /
     "Prevenci\u00f3n de incendios accions sobre o territorio e sobre a poboaci\u00f3n. As redes de faixas de xesti\u00f3" /
     "Test_XB_Prevencion_RFXB_Queimas-2.pdf",
     "t6_test_prevencion_2.pdf"),
    (BASE / "docs" / "forga_especifico" /
     "Parte Nicolas Pombo" /
     "A PREVENCI\u00d3N DE INCENDIOS FORESTAIS E LEI DE INCENDIOS-20260214" /
     "Test" / "TEST PREVENCI\u00d3N 1 2025.pdf",
     "t6_test_prevencion_3.pdf"),
]

TMP_DIR = tempfile.mkdtemp(prefix="t6_pdfs_")
safe_pdf_names = []

for orig_path, safe_name in PDF_ORIGINALS:
    dest = pathlib.Path(TMP_DIR) / safe_name
    if orig_path.exists():
        shutil.copy2(str(orig_path), str(dest))
        safe_pdf_names.append(safe_name)
        print(f"[PDF] {orig_path.name} -> {safe_name}")
    else:
        print(f"[AVISO] Non atopado: {orig_path}")

sys.argv = ["verify_topic.py", SLUG] + safe_pdf_names

try:
    import importlib.util
    spec = importlib.util.spec_from_file_location("verify_topic", str(SCRIPTS / "verify_topic.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.PDF_ROOTS = [pathlib.Path(TMP_DIR)]

    print(f"\n=== T6 VERIFICACION ===")
    topic_id = mod.get_topic_id(SLUG)
    if not topic_id:
        print(f"[ERRO] Non se atopou o topic '{SLUG}'"); sys.exit(1)
    questions = mod.get_questions(topic_id)
    print(f"  -> {len(questions)} preguntas (topic: {topic_id[:8]}...)")
    (SCRIPTS / f"{SLUG}_questions_db.json").write_text(
        json.dumps(questions, ensure_ascii=False, indent=2), encoding="utf-8")

    pdf_parts = []
    for name in safe_pdf_names:
        p = mod.find_pdf(name)
        if p:
            pdf_parts.append(mod.upload_pdf(p))
        else:
            print(f"  [AVISO] Non atopado: {name}")

    # Temario
    temario = ""
    temario_path = BASE / "frontend" / "public" / "temario" / "especifico"
    if temario_path.exists():
        for md in temario_path.glob("*6*"):
            temario += f"\n\n### {md.name}\n" + md.read_text(encoding="utf-8")[:15000]

    print(f"\n[3] Enviando a Gemini ({len(questions)} preguntas + {len(pdf_parts)} PDFs)...")
    raw = mod.ask_gemini(pdf_parts, questions, temario)
    (SCRIPTS / f"{SLUG}_raw_response.txt").write_text(raw, encoding="utf-8")
    print(f"  -> {len(raw):,} chars recibidos")

    print(f"\n[4] Parseando...")
    data = mod.parse_response(raw)
    (SCRIPTS / f"{SLUG}_report.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    mod.print_report(data, SLUG)

    erros = [v for v in data.get("verificacion", []) if not v.get("ok", True)]
    if not erros:
        print("\n Sen correccions necesarias.")
    else:
        print(f"\n[5] Aplicando cambios en Supabase...")
        correxidas, eliminadas, warns = mod.apply_changes(data, SLUG)
        print(f"\n  Correxidas: {correxidas} | Eliminadas: {eliminadas}")
        for w in warns:
            print(f"  AVISO: {w}")

    print(f"\nCOMPLETADO")

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
