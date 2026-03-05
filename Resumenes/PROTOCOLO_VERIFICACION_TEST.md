# PROTOCOLO: Verificación e Corrección de Preguntas de Test

**Data:** 2026-03-05 | **Estado:** T1-T6 + T7 correxidos — T8-T11 pendentes

---

## 1. PROBLEMA DETECTADO

O banco de preguntas de opos forestais (Supabase) tiña **respostas correctas mal asignadas** en múltiples temas. A causa raíz é que durante a extracción automática con Gemini desde os PDFs, a resposta marcada no PDF non sempre coincidiu coa que quedou gardada no JSON/BD.

**Erros detectados ata agora:**
| Tema | Preguntas | Erros | Taxa erro | Correxidas | Eliminadas |
|------|-----------|-------|-----------|------------|------------|
| T4 (`t-esp-4-lume`) | 40 | 16 | 40% | 16 | 0 |
| T3 (`t-esp-3-semop`) | 34 | 5 | 15% | 5 | 0 |
| T1 (`t-esp-1-defensa`) | 139 | 30 | 22% | 30 | 0 |
| T2 (`t-esp-2-pladiga`) | 45 | 2 | 4% | 2 | 0 |
| T5 (`t-esp-5-extincion`) | 101 | 3 | 3% | 0 | 3 |
| T6 (`t-esp-6-prevencion`) | 124 | 0 | 0% | 0 | 0 |
| T7 (`t-esp-7-equipamento`) | 38 | 2 | 5% | 1 | 1 |

**Tamén correxido:** O resumo `t-esp-4-lume.md` tiña a velocidade crítica en 60 m/min (erro). Correxido a **50 m/min** segundo o PDF FORGA 18/11/2025.

---

## 2. METODOLOXÍA DE VERIFICACIÓN

### Ferramenta
- **Modelo:** `gemini-2.5-pro` vía API (`google-genai` library)
- **API Key:** gardada no entorno como `GEMINI_API_KEY`
- **Script principal:** `scripts/verify_topic.py` (xenérico para calquera tema)

### Proceso por tema
1. Descargar preguntas de Supabase (`topic_id` do slug)
2. Subir PDF orixinal do test FORGA a Gemini Files API
3. Gemini compara cada pregunta contra: (1) PDF marcado, (2) temario MD, (3) coñecemento
4. Resposta en JSON con `conf` (alta/media/baixa) e `ok` (true/false)
5. **Regra de acción:**
   - `conf=alta` + `ok=false` → **CORREXIR** a resposta en Supabase
   - `conf=media` ou `conf=baixa` + `ok=false` → **ELIMINAR** a pregunta (máis seguro que correxir con dúbida)
   - `ok=true` → Sen cambios

### Credenciais necesarias
```
GEMINI_API_KEY = AIzaSyA4u6Pz9ZxQ9RmuMYv99gvKlqYU10QO2OU
SUPABASE_URL   = https://ercpofgqayxewtapscsn.supabase.co
SUPABASE_SERVICE_ROLE_KEY = sb_secret_g1l1qc_FSid8PCSy67egHA_jsiP5Wcz
```

---

## 3. COMO EXECUTAR (INSTRUCIONS CRÍTICAS)

### ⚠️ Problema de encoding en Windows
O entorno Windows ten problemas de encoding UTF-8 con caracteres especiais (galego). Para evitar erros:

```powershell
# SEMPRE executar así (con -X utf8 e PYTHONIOENCODING):
$env:GEMINI_API_KEY = "AIzaSyA4u6Pz9ZxQ9RmuMYv99gvKlqYU10QO2OU"
$env:SUPABASE_SERVICE_ROLE_KEY = "sb_secret_g1l1qc_FSid8PCSy67egHA_jsiP5Wcz"
$env:PYTHONIOENCODING = "utf-8"
python -X utf8 scripts\verify_topic.py <slug> <nome_pdf>
```

### ⚠️ Scripts con caracteres especiais nas rutas de PDF
Se o PDF ten caracteres especiais no nome/ruta (ex: `Nº1`, `extinción`), **non pasar a ruta como argumento ao terminal**. En cambio, crear un script Python ad-hoc que construya a ruta con `chr()`:

```python
# Exemplo para ruta con caracteres especiais
pdf_path = (
    BASE / "docs" / "forga_especifico" /
    ("Parte Ram" + chr(243) + "n Recaman") /  # ó = chr(243)
    ("PLAN DE EXTINCI" + chr(211) + "N PLADIGA") /  # Ó = chr(211)
    ("Test N" + chr(186) + "1 ...")  # º = chr(186)
)
```

### ⚠️ Declaración de encoding nos scripts
Todo script con caracteres especiais DEBE comezar así:
```python
# -*- coding: utf-8 -*-
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
```

### Exemplo funcional para un tema sen caracteres especiais
```powershell
$env:GEMINI_API_KEY = "..."
$env:SUPABASE_SERVICE_ROLE_KEY = "..."
$env:PYTHONIOENCODING = "utf-8"
python -X utf8 scripts\verify_topic.py t-esp-1-defensa "TEST LEY INCENDIOS 1 2025.pdf"
```

---

## 4. TEMAS PENDENTES

### Temas sen revisar
Slugs dispoñibles en Supabase:
- `t-esp-8-conduccion`, `t-esp-9-seguridade`, `t-esp-10-accidentes`, `t-esp-11-comunicacions`

PDFs de tests dispoñibles en `docs/PARA CURADOR/especificos/<tema>/` e `docs/forga_especifico/`

### ⚠️ Nota sobre T5 (extinción)
T5 non tiña PDF de test propio. Verificouse con:
- `Tema 6 Técnicas de extinción.pdf` (temario FORGA)
- `Tema 6_Test Nº1.pdf` (test FORGA)
Para futuras execucións: os PDFs con carácteres especiais nas rutas deben copiarse a un directorio temporal. Ver script `scripts/run_t5_safe.py` como referencia.

---

## 5. FICHEIROS DE REFERENCIA

| Ficheiro | Descrición |
|----------|------------|
| `scripts/verify_topic.py` | Script xenérico de verificación/corrección |
| `scripts/run_t5_safe.py` | Wrapper para T5 (trata rutas con carácteres especiais) |
| `scripts/t-esp-1-defensa_report.json` | Informe T1 — 30 correccións |
| `scripts/t-esp-2-pladiga_report.json` | Informe T2 — 2 correccións |
| `scripts/verify_t3_report.json` | Informe T3 — 5 correccións |
| `scripts/verify_t4_report.json` | Informe T4 — 16 correccións |
| `scripts/t-esp-5-extincion_report.json` | Informe T5 — 3 eliminadas |
| `extracted_t-esp-4-lume_session11.json` | JSON local T4 (actualizado) |
| `docs/PARA CURADOR/especificos/` | PDFs orixinais dos tests FORGA |

---

## 7. REVISIÓN MANUAL DAS CORRECCIÓNS APLICADAS

> [!IMPORTANT]
> A verificación automática con Gemini non é infalible, mesmo con `conf=alta`. Recoméndase revisar manualmente as preguntas correxidas antes de confiar nelas ao 100% nun estudo intensivo.

### Como revisar
Cada informe JSON (`scripts/<slug>_report.json`) contén **todas as correccións** con explicación. Para revisar:
1. Abrir o informe do tema correspondente
2. Filtrar por `"ok": false` — son as preguntas que se cambiaron
3. Para cada unha: ler a `exp` (explicación) e comprobar contra o temario MD ou o PDF orixinal
4. Se unha corrección parece dubidosa → eliminar a pregunta directamente en Supabase

### Revisión rápida por tema (só os cambios)
- **T4:** `scripts/verify_t4_report.json` — 16 preguntas cambiadas, enfoque en thresholds numéricos (alturas combustible, velocidades)
- **T3:** `scripts/verify_t3_report.json` — 5 preguntas, roles do DTE vs CCC vs XOA
- **T1:** `scripts/t-esp-1-defensa_report.json` — 30 preguntas, distancias de biomasa e épocas de perigo (Lei 3/2007)
- **T2:** `scripts/t-esp-2-pladiga_report.json` — 2 preguntas, avaliación do incendio e IGP (DTE vs CCC)
- **T5:** `scripts/t-esp-5-extincion_report.json` — 3 eliminadas verificadas correctas (P7, P33, P39): nivel C vs B, puntos de inflexión, fase de avaliación.
- **T6:** `scripts/t-esp-6-prevencion_report.json` — *REVERTIDAS*. Gemini confundiu 2 preguntas no test, foron revertidas en Supabase.
- **T7:** `scripts/t-esp-7-equipamento_report.json` — 1 eliminada (P21) por opcións duplicadas idénticas, 1 corrixida (P38) por porcentaxe curva de nivel.

---

## 6. VERIFICACIÓN POST-CORRECCIÓN

Despois de correxir cada tema, verificar que Supabase ten as respostas actualizadas:

```python
import requests
H = {"apikey": "sb_secret...", "Authorization": "Bearer sb_secret..."}
r = requests.get("https://ercpofgqayxewtapscsn.supabase.co/rest/v1/questions",
                 headers=H, params={"topic_id": "eq.<id>", "select": "question_text,correct_answer", "limit": "5"})
print(r.json())
```
