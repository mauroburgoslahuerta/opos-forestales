# TEMA 3: SISTEMA ESTRUTURAL DE MANDO OPERATIVO (SEMOP) - V6 (ARMADURA FINAL)

> [!IMPORTANT]
> **O Manto Dixital:** En todos os niveis e roles, o uso de **XeoCode Lite** é o fío condutor. Todos os mandos (DTE, Operacións, Planificación, Sectores) deben alimentar e consultar esta App para que a información flúa en tempo real.

---

## 1. CONCEPTOS BÁSICOS E FILOSOFÍA

O **SEMOP** é un modelo modular baseado no **ICS (Incident Command System)**. Permite que o mando se adapte á evolución do incendio.

*   **Nomenclatura Correlativa:** Os sectores noméanse seguindo o avance do lume.
    *   **Flanco Esquerdo (Letras):** SA, SB... O **Sector P (Papa)** está na cabeza deste flanco.
    *   **Flanco Dereito (Números):** S1, S2... S1 adoita ser a cola.
    *   **Cabeza (SZ):** O punto de máxima propagación.

---

## 2. OS ROLES E A SÚA XERARQUÍA

### A. Director/a Técnico/a de Extinción (DTE) - "O Responsable Legal"
É un **Axente da Autoridade**. Nada se fai sen o seu permiso.
*   **Observadores:** O/A DTE é o **responsable de definir os/as observadores/as** no plan de extinción, incluso en incendios de **Nivel B**.
*   **Reportes:** Cada **30 min** en incendio / cada **1 h** en queimas ao **CCD/CCP**.
*   **Ferramentas:** Uso obrigatorio de **XeoCode Lite**.

### B. Xefe/a de Planificación - "O Cerebro Estratéxico"
Mira o futuro do incendio. Traballa principalmente en **Nivel C**.
*   **Control do PMA:** Decide se a ubicación do **PMA (Posto de Mando Avanzado)** é idónea e **propón o suo desprazamento**.
*   **Análise:** Realiza o análise técnico do incendio.

### C. Xefe/a de Operacións - "O Coordinador Táctico"
Aparece en **Nivel B/C**. Executa o plan do DTE a través dos sectores.
*   **Xerarquía:** O XOA (Xefe de Op. Aéreas) depende del nesta fase.
*   **Xestión:** Aínda que xestiona os recursos, a definición dos observadores sigue sendo competencia do DTE.

### D. XOA e CMA - "O Control Aéreo"
*   **XOA (Xefe de Op. Aéreas):** No solo. Só fai o **esbozo técnico de zonas** se existe unha aeronave de coordinación (**CMA**).
*   **CMA (Coordinación de Medios Aéreos):** No aire. Ten prohibido abandonar o incendio sen avisar ao DTE ou XOA.

---

## 3. NIVELES OPERATIVOS: A REGRA DO 3

| Nivel | Sectores de Traballo | Lóxica de Mando |
| :--- | :--- | :--- |
| **Nivel A** | Ataque Inicial | O DTE xestiona ata 5-7 equipos directamente. |
| **Nivel B** | **Ata 3 sectores** | Aparece o Xefe de Operacións e o PRM. |
| **Nivel C** | **Máis de 3 sectores** | Traballo previsto **> 12 horas**. Entra en xogo a UDEX. |

---

## 4. COMUNICACIÓNS E MATERIAIS

*   **O Cálculo das canles TMO (Tetra):** 1 canle de Comando + 1 canle de Aire (XOA/CMA) + **1 canle por cada sector**.
    *   *Exemplo:* 2 sectores e un XOA = **4 canles TMO** (Mando + Aire + S1 + S2).
*   **Loxística e UDEX:**
    *   **UDEX (Unidade de Directores de Extinción):** Equipo cualificado con **dependencia funcional da Dirección Xeral de Defensa do Monte**.
    *   **Xefe de Loxística:** Vehículo 4x4 rotulado, rotativo e radio Tetra fixa (**Canle TMO 6**).
*   **Medios:** Motobomba (2.500-4.500 l) / Nodriza (> 10.000 l).

---

## 5. MATRIZ DE SEGURIDADE FINAL (SINGLE SOURCE OF TRUTH)

| Punto de Fricción Nico | Resposta Blindada Exame |
| :--- | :--- |
| **¿Quen define observadores en B?** | O **DTE** (Director Técnico de Extinción). |
| **¿Quen move o PMA?** | O **Xefe de Planificación**. |
| **¿Dependencia UDEX?** | **Dirección Xeral de Defensa do Monte**. |
| **¿App de cabeceira?** | **XeoCode Lite** (para todos os mandos). |
| **¿Cando é Nivel C?** | Cando hai **Máis de 3 sectores**. |
| **¿Reporte en queimas?** | Cada **1 hora**. |
| **¿Ubicación Sector P?** | Cabeza do **flanco esquerdo**. |
| **¿Aviso PRM?** | **30 minutos** antes de chegar. |
