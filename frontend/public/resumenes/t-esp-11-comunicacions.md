# TEMA 11: COMUNICACIÓNS E CARTOGRAFÍA (V12 MASTER)

## 0. GLOSARIO DE SIGLAS E ACÓNIMOS (CERTIFICACIÓN OBRIGATORIA)

- **PPT:** Prego de Prescricións Técnicas (Documento de requisitos técnicos).
- **SPIF:** Servizo de Prevención e Defensa Contra Incendios Forestais.
- **RESGAL:** Rede de Comunicacións Dixitais Móbiles de Galicia.
- **TETRA:** TErrestrial Trunked RAdio (Estándar dixital).
- **ETSI:** Instituto Europeo de Estándares de Telecomunicación.
- **ISSI:** Individual Short Subscriber Identity (Identidade do terminal).
- **SGE:** Servicio Geográfico del Ejército / **IGN:** Instituto Geográfico Nacional.
- **UTM:** Universal Transverse Mercator.
- **LIP:** Location Information Protocol (Protocolo GPS).
- **SDS:** Short Data Service (Mensaxería de ata 1000 caracteres).
- **RFID:** Radio Frequency Identification (Identificación por Radiofrecuencia).
- **PTT:** Push-To-Talk (Premar para falar).
- **UHF / VHF:** Ultra High Frequency / Very High Frequency.
- **OTAP / OTAR:** Over The Air Programming / Rekeying.
- **TEA2:** TETRA Encryption Algorithm 2.
- **SCK / DCK / CCK / GCK:** Claves de encriptación (Estática, Derivada, Común, Grupo).
- **IP:** Ingress Protection (Grao de protección ambiental).
- **AM / FM:** Amplitude / Frecuencia Modulada.
- **OCELA:** Protocolo de seguridade (Observación, Comunicación, Escape, Lugar seguro, Atribución).

---

## CAPÍTULO 1: CARTOGRAFÍA E ORIENTACIÓN

### 1.1. Fundamentos e Jerarquía de Series SGE
A cartografía oficial en España organízase mediante unha xerarquía estrita de follas:
- **Serie 2C (1:200.000):** Unha folla desta serie comprende **catro** da serie C.
- **Serie C (1:100.000):** Unha folla desta serie comprende **catro** da serie L.
- **Serie L (1:50.000):** A máis usada en detalle. Unha folla 2C contén, por tanto, **16 follas** da serie L.
- **Serie 5L (1:250.000):** É a serie utilizada para cubrir **Galicia** con **6 follas**.

> [!IMPORTANT]
> **Orixe de Coordenadas:** O Meridiano 0 (Greenwich) é o sistema de medición angular **sesaxesimal**. Todas as cotas teñen como referencia o nivel do mar en **Alicante**.

### 1.2. Relevo e Conceptos Avanzados
- **Curvas de Depresión:** Indican hoxas ou dolinas (trazos cara ao interior).
- **Prominencia Topográfica (Factor Primario):** Desnivel mínimo que hai que descender desde un cume para poder ascender a outro máis alto.
- **Sombreado Oblicuo:** Luz a **45º** desde o NO para dar relieve 3D.
- **Mértodo da Grella:** División do terreo en cadrados. Ex: "Lanzar en 7 A e B" significa descargar sobre a **cabeza do lume** desde Alfa cara a Bravo.

---

## CAPÍTULO 2: COMUNICACIÓNS (TETRA E BANDA AÉREA)

### 2.1. Terminoloxía Administrativa (Criba de Exame)
- **Alarma de Incendio:** É o que comunica un vixiante fixo ao detectar un fume. **NUNCA di "teño un incendio"**, senón que comunica unha alarma.
- **Triple C:** As comunicacións deben ser **Claras, Curtas e Concisas**.

### 2.2. Fraseoloxía Aérea e Descargas
As aeronaves usan códigos específicos para informar da zona de descarga:
- **Fox-trot (F):** Refírese á **Cola** do incendio.
- **Sierra (S):** Refírese á **Cabeza** do incendio.
- **Cuadrantes:** Divídese en flanco dereito (1 e 3) e esquerdo (2 e 4).
    - **F4:** Verde na cola do flanco esquerdo.
    - **S1:** Chama na cabeza do flanco dereito.
- **Deletreo de Decimais:** O número 11.60 en banda aérea deuse como: **uno-uno-seis-cero-cero**.

### 2.3. Táboa de Frecuencias Aéreas en Galicia
| Zona / Uso | Frecuencia (MHz) |
| :--- | :--- |
| **Emerxencia / Reserva (Galicia)** | **129.825** |
| **Principal Incendio Lugo** | **122.350** |
| **Rango Banda Aérea** | 118.000 - 136.975 MHz |

---

### 2.4. Hardware e Botonoloxía Específica

#### **Sepura STP 9038 (Material de Exame)**
A pesar de ser un terminal antiguo, aparece en test pola súa complexidade:
- **Bloqueo:** Pulsar botón **asterisco (*)** e despois botón **Menú (Aceptar)**.
- **Función Repetidor:** **ESTE EQUIPO NON ADMITE MODO REPETIDOR**.
- **Localización Botón Emerxencia:** Parte superior, ao lado da antena.

#### **Especificacións Técnicas PPT 2024 (Blindaxe)**
| Parámetro | Valor Mínimo Esixido |
| :--- | :--- |
| **Potencia Audio (TIPO 1 e 2)** | **2 W** |
| **Potencia Audio (TIPO 3)** | **2.2 W** |
| **Sensibilidade Estática** | **-115 dBm** |
| **Sensibilidade Dinámica** | **-107 dBm** |
| **Batería (Capacidade)** | **1880 - 1950 mAh** |
| **Autonomía** | **14 horas** (Ciclo 5/5/90) |

---

### 2.5. Identificadores ISSI Xeográficos
O ISSI permite localizar recursos de forma inequívoca.
- **Vixilancia Oribio (Lugo):** ISSI **8509012**.
- **Estrutura:** 5º díxito identifica o recurso (5 = Vixilancia).

---

## RESPOSTAS BLINDADAS PARA O EXAMINADOR

1. **Que comunica un vixiante?** Unha **alarma de incendio**.
2. **Como se bloquea un Sepura 9038?** Asterisco + Aceptar.
3. **Pode o Sepura 9038 ser repetidor?** Non, nunca.
4. **Que é Sierra 1?** Chama na cabeza, flanco dereito.
5. **Cal é a frecuencia de reserva en Galicia?** 129.825 MHz.
6. **Que é a prominencia?** Desnivel necesario para subir a outra montaña máis alta.
7. **Cal é a potencia de audio dun terminal Tipo 3?** 2.2 W.
8. **Diferenza entre TMO e DMO?** TMO usa rede (repetidores), DMO é directo terminal-terminal.
9. **Que significa a E de OCELA?** Roteiro de **E**scape.
10. **Como se di 11.60 en radio?** Uno-uno-seis-cero-cero.
