"""
verify_topic.py
================
Script xenérico para verificar e correxir (ou eliminar) preguntas de calquera tema.

Regras de seguridade:
  - Se conf="alta" e ok=false  → CORREXIR a resposta en Supabase
  - Se conf="media" e ok=false → ELIMINAR a pregunta (demasiado dubidosa)
  - Se conf="baixa" e ok=false → ELIMINAR a pregunta
  - Se ok=true (calquera conf)  → Sen cambios

Uso:
  python verify_topic.py <slug> <pdf_test> [<pdf2> ...]

Exemplos:
  python verify_topic.py t-esp-1-incendios "TEST LEY INCENDIOS 1 2025.pdf"
  python verify_topic.py t-esp-2-pladiga "Test Nº1 do plan de extinción PLADIGA.pdf"
"""

import os, sys, json, re, time, requests
from pathlib import Path
from google import genai
from google.genai import types

# Fix encoding para Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ─── Config ────────────────────────────────────────────────────────────────────
BASE          = Path(r"f:\Proyectos Antigravity\Opos forestales")
SCRIPTS_DIR   = BASE / "scripts"
PDF_ROOTS     = [
    BASE / "docs" / "PARA CURADOR" / "especificos",
    BASE / "docs" / "forga_especifico",
]

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
SUPABASE_URL   = os.environ.get("SUPABASE_URL", "https://ercpofgqayxewtapscsn.supabase.co")
SUPABASE_KEY   = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not GEMINI_API_KEY or not SUPABASE_KEY:
    print("[ERROR] Require: GEMINI_API_KEY e SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL  = "gemini-2.5-pro"

SB_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

SYSTEM_PROMPT = """Es un experto auditor de exámenes de bomberos forestales (SPIF) de Galicia.
Tu misión es verificar si las respuestas correctas en el JSON son realmente correctas.

Fuentes de verdad (en orden de prioridad):
  1. PDF del test adjunto — si ves respuestas marcadas/subrayadas, son DEFINITIVAS
  2. Documentación técnica / temario
  3. Tu conocimiento técnico

Reglas de confianza:
  - conf="alta"  → Certeza absoluta. Basado en marcas del PDF o texto literal del temario.
  - conf="media" → Razonablemente seguro pero no hay evidencia directa en el PDF.
  - conf="baixa" → Inferencia o ambigüedad. No es seguro.

REGLA CRÍTICA: Si no estás seguro al 100%, pon conf="media" o "baixa". NUNCA inventes una respuesta.

FORMATO DE SALIDA — SOLO JSON válido:
{
  "verificacion": [
    {
      "id": "uuid",
      "n": 1,
      "actual": "c",
      "correcta": "c",
      "ok": true,
      "conf": "alta",
      "fonte": "pdf_marcado|temario|coñecemento",
      "exp": "Explicación concisa (máx 120 chars)"
    }
  ],
  "resumo": {
    "total": 30,
    "ok": 25,
    "erros": 5,
    "para_eliminar": ["uuid1","uuid2"],
    "nota": "Valoración global"
  }
}
Sin texto adicional antes ni después del JSON."""

# ─── Supabase ──────────────────────────────────────────────────────────────────

def get_topic_id(slug):
    r = requests.get(f"{SUPABASE_URL}/rest/v1/topics",
                     headers=SB_HEADERS, params={"slug": f"eq.{slug}", "select": "id"})
    r.raise_for_status()
    data = r.json()
    return data[0]["id"] if data else None

def get_questions(topic_id):
    r = requests.get(f"{SUPABASE_URL}/rest/v1/questions",
                     headers=SB_HEADERS,
                     params={"topic_id": f"eq.{topic_id}",
                             "select": "id,question_text,option_a,option_b,option_c,option_d,correct_answer",
                             "limit": "400"})
    r.raise_for_status()
    return r.json()

def patch_question(q_id, new_answer):
    r = requests.patch(f"{SUPABASE_URL}/rest/v1/questions",
                       headers=SB_HEADERS, params={"id": f"eq.{q_id}"},
                       json={"correct_answer": new_answer})
    r.raise_for_status()

def delete_question(q_id):
    r = requests.delete(f"{SUPABASE_URL}/rest/v1/questions",
                        headers=SB_HEADERS, params={"id": f"eq.{q_id}"})
    r.raise_for_status()

# ─── PDF lookup ────────────────────────────────────────────────────────────────

def find_pdf(name):
    """Busca un PDF recursivamente nas carpetas coñecidas de documentación."""
    name_lower = name.lower()
    for root in PDF_ROOTS:
        for p in root.rglob("*.pdf"):
            if name_lower in p.name.lower():
                return p
    return None

# ─── Gemini ────────────────────────────────────────────────────────────────────

def upload_pdf(pdf_path):
    # Sanitizar display_name: eliminar caracteres non-ASCII que dan problemas na librería en Windows
    import unicodedata
    safe_name = unicodedata.normalize("NFKD", pdf_path.name)
    safe_name = safe_name.encode("ascii", "ignore").decode("ascii")
    safe_name = safe_name.strip() or "documento.pdf"
    print(f"  Subindo: {pdf_path.name} (display: {safe_name})...")
    uploaded = client.files.upload(
        file=str(pdf_path),
        config=types.UploadFileConfig(mime_type="application/pdf",
                                      display_name=safe_name),
    )
    time.sleep(2)
    return types.Part.from_uri(file_uri=uploaded.uri, mime_type="application/pdf")

def ask_gemini(pdf_parts, questions, temario_text=""):
    user_msg = f"""Verifica as seguintes preguntas contra os PDFs adxuntos (fonte primaria) e o temario.

PREGUNTAS A VERIFICAR:
```json
{json.dumps(questions, ensure_ascii=False, indent=2)}
```
{f'''
TEMARIO DE REFERENCIA:
{temario_text[:20000]}
''' if temario_text else ''}

Devolve o JSON de verificación completo con TODAS as {len(questions)} preguntas."""

    parts = list(pdf_parts) + [types.Part.from_text(text=user_msg)]
    response = client.models.generate_content(
        model=MODEL,
        contents=[types.Content(role="user", parts=parts)],
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.1,
            max_output_tokens=65536,
        ),
    )
    raw = response.text
    if raw is None and response.candidates:
        raw = "".join(p.text for p in response.candidates[0].content.parts
                      if hasattr(p, "text") and p.text)
    return raw or ""

# ─── Parse ─────────────────────────────────────────────────────────────────────

def parse_response(raw):
    text = raw.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
        text = re.sub(r"\s*```\s*$", "", text, flags=re.MULTILINE)
    text = text.strip()
    s, e = text.find("{"), text.rfind("}") + 1
    if s < 0 or e <= s:
        raise ValueError("Non se atopou JSON na resposta")
    return json.loads(text[s:e])

# ─── Aplicar correccións ───────────────────────────────────────────────────────

def apply_changes(data, slug):
    ver   = data.get("verificacion", [])
    erros = [v for v in ver if not v.get("ok", True)]

    correxidas = 0
    eliminadas = 0
    warnings   = []

    for v in erros:
        q_id     = v.get("id", "")
        correcta = v.get("correcta", "")
        actual   = v.get("actual", "?")
        conf     = v.get("conf", "baixa")
        n        = v.get("n", "?")
        exp      = v.get("exp", "")

        if not q_id:
            warnings.append(f"P{n}: sen ID, ignorada")
            continue

        if conf == "alta":
            # Correxir
            try:
                patch_question(q_id, correcta)
                print(f"  ✓ CORREXIDA P{n}: [{actual}] → [{correcta}] — {exp[:80]}")
                correxidas += 1
            except Exception as e:
                warnings.append(f"P{n}: erro ao correxir — {e}")
        else:
            # Eliminar (conf media ou baixa = demasiado dubidoso)
            try:
                delete_question(q_id)
                print(f"  🗑 ELIMINADA P{n}: conf={conf} — {exp[:80]}")
                eliminadas += 1
            except Exception as e:
                warnings.append(f"P{n}: erro ao eliminar — {e}")

    return correxidas, eliminadas, warnings

# ─── Report ────────────────────────────────────────────────────────────────────

def print_report(data, slug):
    r   = data.get("resumo", {})
    ver = data.get("verificacion", [])
    erros = [v for v in ver if not v.get("ok", True)]

    print(f"\n{'='*68}")
    print(f"INFORME VERIFICACIÓN: {slug.upper()}")
    print(f"{'='*68}")
    print(f"  Total:     {r.get('total', len(ver))}")
    print(f"  OK:        {r.get('ok', len(ver)-len(erros))}")
    print(f"  Erros:     {r.get('erros', len(erros))}")
    nota = r.get("nota", "")
    if nota:
        print(f"\n  → {nota}")
    print(f"{'='*68}")

    if erros:
        print(f"\n🔍 DISCREPANCIAS:\n")
        for v in erros:
            n       = v.get("n", "?")
            actual  = v.get("actual", "?")
            correct = v.get("correcta", "?")
            conf    = v.get("conf", "?")
            fonte   = v.get("fonte", "?")
            exp     = v.get("exp", "")
            icon    = "✓" if conf == "alta" else "🗑"
            accion  = "CORREXIR" if conf == "alta" else f"ELIMINAR (conf={conf})"
            print(f"  {icon} P{n}: [{actual}]→[{correct}] {accion} ({fonte})")
            if exp:
                print(f"     {exp[:120]}")
            print()

# ─── Main ──────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    slug     = sys.argv[1]
    pdf_names = sys.argv[2:]

    print("="*68)
    print(f"AUDITORÍA SEGURA: {slug}")
    print(f"  Regra: conf=alta → CORREXIR | conf<alta → ELIMINAR")
    print("="*68)

    # 1. Supabase
    print(f"\n[1] Descargando preguntas de Supabase...")
    topic_id = get_topic_id(slug)
    if not topic_id:
        print(f"  [ERRO] Non se atopou o topic '{slug}'")
        sys.exit(1)
    questions = get_questions(topic_id)
    print(f"  ✓ {len(questions)} preguntas (topic: {topic_id[:8]}...)")

    # Gardar local
    out_json = SCRIPTS_DIR / f"{slug}_questions_db.json"
    out_json.write_text(json.dumps(questions, ensure_ascii=False, indent=2), encoding="utf-8")

    # 2. PDFs
    print(f"\n[2] Cargando PDFs...")
    pdf_parts = []
    for name in pdf_names:
        p = find_pdf(name)
        if p:
            part = upload_pdf(p)
            pdf_parts.append(part)
        else:
            print(f"  [AVISO] Non atopado: {name}")

    if not pdf_parts:
        print("  [AVISO] Sen PDFs — a verificación usará só coñecemento do modelo")

    # 3. Temario (opcional)
    temario = ""
    temario_path = BASE / "frontend" / "public" / "temario" / "especifico"
    if temario_path.exists():
        slug_short = slug.replace("t-esp-", "").split("-")[0]  # "1", "2", etc.
        for md in temario_path.glob(f"*{slug_short}*"):
            temario += f"\n\n### {md.name}\n" + md.read_text(encoding="utf-8")[:15000]

    # 4. Gemini
    print(f"\n[3] Enviando a Gemini 2.5 Pro ({len(questions)} preguntas + {len(pdf_parts)} PDFs)...")
    raw = ask_gemini(pdf_parts, questions, temario)

    # Gardar raw
    raw_path = SCRIPTS_DIR / f"{slug}_raw_response.txt"
    raw_path.write_text(raw, encoding="utf-8")
    print(f"  ✓ Resposta recibida ({len(raw):,} chars)")

    # 5. Parse
    print(f"\n[4] Parseando...")
    try:
        data = parse_response(raw)
    except Exception as e:
        print(f"  [ERRO] {e}\n  Raw gardado en: {raw_path}")
        sys.exit(1)

    report_path = SCRIPTS_DIR / f"{slug}_report.json"
    report_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    # 6. Informe
    print_report(data, slug)

    # 7. Aplicar
    erros = [v for v in data.get("verificacion", []) if not v.get("ok", True)]
    if not erros:
        print("\n✅ Sen correccións necesarias.")
    else:
        print(f"\n[5] Aplicando cambios en Supabase...")
        correxidas, eliminadas, warns = apply_changes(data, slug)
        print(f"\n  RESULTADO:")
        print(f"    ✓ Correxidas: {correxidas}")
        print(f"    🗑 Eliminadas: {eliminadas}")
        for w in warns:
            print(f"    ⚠ {w}")

    print(f"\n{'='*68}")
    print(f"COMPLETADO — Informe: {report_path.name}")
    print(f"{'='*68}")

if __name__ == "__main__":
    main()
