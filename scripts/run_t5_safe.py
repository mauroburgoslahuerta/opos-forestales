# -*- coding: utf-8 -*-
"""
run_t5_safe.py - Wrapper seguro para verificar T5.
Copia os PDFs a rutas sen caracteres especiais antes de subilos a Gemini.
"""
import sys, os, io, shutil, tempfile

LOG_PATH = r"f:\Proyectos Antigravity\Opos forestales\scripts\t5_run_log.txt"

log_file = open(LOG_PATH, "w", encoding="utf-8", errors="replace")
sys.stdout = log_file
sys.stderr = log_file

if not os.environ.get("GEMINI_API_KEY"):
    os.environ["GEMINI_API_KEY"] = "AIzaSyA4u6Pz9ZxQ9RmuMYv99gvKlqYU10QO2OU"
if not os.environ.get("SUPABASE_SERVICE_ROLE_KEY"):
    os.environ["SUPABASE_SERVICE_ROLE_KEY"] = "sb_secret_g1l1qc_FSid8PCSy67egHA_jsiP5Wcz"

# Directorio temporal para PDFs con nomes seguros
TMP_DIR = tempfile.mkdtemp(prefix="t5_pdfs_")

# Rutas orixinais dos PDFs de T5
PDF_ORIGINALS = [
    (r"f:\Proyectos Antigravity\Opos forestales\docs\forga_especifico\Parte Ramón Recaman\17-06-25  comunicacións -20260214\Tema 6 Clase de extinción\Tema 6 Técnicas de extinción.pdf",
     "tema6_tecnicas_extincion.pdf"),
]

# Comprobar se hai test (buscalo)
import os as _os
TEST_BASE = r"f:\Proyectos Antigravity\Opos forestales\docs\forga_especifico\Parte Ramón Recaman\17-06-25  comunicacións -20260214"
for root, dirs, files in _os.walk(TEST_BASE):
    for f in files:
        if "test" in f.lower() and "6" in f and f.endswith(".pdf"):
            PDF_ORIGINALS.append((_os.path.join(root, f), "tema6_test1.pdf"))
            break

# Copiar PDFs a rutas seguras
safe_pdf_names = []
for orig_path, safe_name in PDF_ORIGINALS:
    dest = _os.path.join(TMP_DIR, safe_name)
    if _os.path.exists(orig_path):
        shutil.copy2(orig_path, dest)
        safe_pdf_names.append(safe_name)
        print(f"[PDF copiado] {_os.path.basename(orig_path)} -> {safe_name}")
    else:
        print(f"[AVISO] Non atopado: {orig_path}")

# Modificar PDF_ROOTS en verify_topic para que busque no directorio temporal
sys.argv = [
    "verify_topic.py",
    "t-esp-5-extincion",
] + safe_pdf_names

# Parchear PDF_ROOTS para que apunte ao directorio temporal
import pathlib
_ORIG_PDF_ROOTS = None

# Executar verify_topic
try:
    # Cargar o módulo e modificar PDF_ROOTS antes de executar main()
    import importlib.util, types as _types

    spec = importlib.util.spec_from_file_location(
        "verify_topic",
        r"f:\Proyectos Antigravity\Opos forestales\scripts\verify_topic.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    # Sobreescribir PDF_ROOTS para que busque no directorio temporal
    mod.PDF_ROOTS = [pathlib.Path(TMP_DIR)]

    # Chamar a main()
    # Reconstruír os argumentos
    slug = "t-esp-5-extincion"
    pdf_names = safe_pdf_names

    print(f"\n=== INICIANDO VERIFICACIÓN MANUAL ===")
    print(f"Slug: {slug}")
    print(f"PDFs: {pdf_names}")
    print(f"TMP_DIR: {TMP_DIR}")

    # Executar o fluxo de verify_topic manualmente
    topic_id = mod.get_topic_id(slug)
    if not topic_id:
        print(f"[ERRO] Non se atopou o topic '{slug}'")
        sys.exit(1)
    questions = mod.get_questions(topic_id)
    print(f"  -> {len(questions)} preguntas (topic: {topic_id[:8]}...)")

    # Gardar local
    import json
    out_json = pathlib.Path(r"f:\Proyectos Antigravity\Opos forestales\scripts") / f"{slug}_questions_db.json"
    out_json.write_text(json.dumps(questions, ensure_ascii=False, indent=2), encoding="utf-8")

    # Subir PDFs
    pdf_parts = []
    for name in pdf_names:
        p = mod.find_pdf(name)
        if p:
            part = mod.upload_pdf(p)
            pdf_parts.append(part)
        else:
            print(f"  [AVISO] Non atopado: {name}")

    if not pdf_parts:
        print("  [AVISO] Sen PDFs — verificación só con coñecemento do modelo")

    # Temario
    temario = ""
    temario_path = pathlib.Path(r"f:\Proyectos Antigravity\Opos forestales\frontend\public\temario\especifico")
    if temario_path.exists():
        for md in temario_path.glob("*5*"):
            temario += f"\n\n### {md.name}\n" + md.read_text(encoding="utf-8")[:15000]

    # Gemini
    print(f"\n[3] Enviando a Gemini 2.5 Pro ({len(questions)} preguntas + {len(pdf_parts)} PDFs)...")
    raw = mod.ask_gemini(pdf_parts, questions, temario)

    raw_path = pathlib.Path(r"f:\Proyectos Antigravity\Opos forestales\scripts") / f"{slug}_raw_response.txt"
    raw_path.write_text(raw, encoding="utf-8")
    print(f"  -> Resposta recibida ({len(raw):,} chars)")

    # Parse
    print(f"\n[4] Parseando...")
    data = mod.parse_response(raw)

    report_path = pathlib.Path(r"f:\Proyectos Antigravity\Opos forestales\scripts") / f"{slug}_report.json"
    report_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    # Informe
    mod.print_report(data, slug)

    # Aplicar
    erros = [v for v in data.get("verificacion", []) if not v.get("ok", True)]
    if not erros:
        print("\n Sen correccions necesarias.")
    else:
        print(f"\n[5] Aplicando cambios en Supabase...")
        correxidas, eliminadas, warns = mod.apply_changes(data, slug)
        print(f"\n  RESULTADO:")
        print(f"    Correxidas: {correxidas}")
        print(f"    Eliminadas: {eliminadas}")
        for w in warns:
            print(f"    AVISO: {w}")

    print(f"\nCOMPLETADO - Informe: {report_path.name}")

except SystemExit:
    pass
except Exception as e:
    import traceback
    print(f"\n[ERRO CRITICO]: {e}")
    traceback.print_exc()
finally:
    # Limpar directorio temporal
    shutil.rmtree(TMP_DIR, ignore_errors=True)
    log_file.flush()
    log_file.close()
