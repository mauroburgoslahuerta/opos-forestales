# Rede dixital de comunicacións TETRA

**TETRA**: **TE**rrestrial **T**runked **R**adio
- Sistema de radio terrestre troncalizado: infraestrutura para conectar varios puntos e bases de radios

- Estándar definido polo Instituto Europeo de Estándares de Telecomunicación (ETSI) https://www.etsi.org
- Interoperabilidade
- Independencia de fabricantes

## Para que se necesita unha rede radio?

- Interconexión segura, fiable e altos niveis de dispoñibilidade das comunicacións, incluso en situacións extremas ou de saturación
- Priorización de chamadas
- Chamada de emerxencia
- Caída rede: modo directo entre terminais
- Xestión de grupos e perfís de comunicación
- Posibilita a integración das comunicacións de todos os colectivos con competencias en materia de emerxencias e seguridade (ámbito autonómico, provincial e local)
- Comunicacións encriptadas (**estándar TEA2**)

## Características xerais

- Estándar ETSI
- Banda 380-430 MHz
- Soporte DMO/TMO
- Nivel de protección IP67
- Autonomía en prego de 14 hs (5/5/90%). Segunda batería adicional
- Cargador individual, cargador para coche e funda de protección
- Chamada de emerxencia e recepción de chamadas
- GPS e envío automático de localización
- Motorola MTP3550, MTP6650
  - Modo Repeater
- Sepura SRG3900 (mobilófono)
  - Modo Repeater
  - Modo Gateway

## Características radio dixital

- Máis comunicacións en menor espectro frecuencias
- Calidade comunicación
- Alcance global
- Chamada individual
- Envío de datos e mensaxes de estado
- Xeolocalización

Por primeira vez Galicia conta cunha rede pública propia de comunicacións móbiles para emerxencias e seguridade
http://www.red.es/redes/sites/redes/files/pcp__003-12-cd.pdf

## Corpos de emerxencia adheridos

- SPIF
- AXEGA
- 112
- 061
- UPA
- Emerxencias Administración Local (concellos, mancomunidades, bombeiros)

## Estacións Base Retegal (TBS)

- Máis de 100 estacións
- Servizo 24x7
- Alarmas ante caídas
- Acordo Nivel Servizo

## Cobertura

- Frecuencia 380-430MHz

## Protocolo OACEL

## Modos de Operación

### Chamada Individual e Chamada de Grupo

A chamada individual lévase a cabo entre dous usuarios da rede mediante o seu número identificativo. (Pode non estar dispoñible para o equipo, posto que require privilexios).
Pódense limitar os dereitos dun usuario para enviar e/ou recibir chamadas individuais.
Na chamada de grupo realizase a un grupo de usuarios, non é individual.

### Modos de Explotación TETRA

#### Trunking Mode Operation (TMO)

Terminal autenticado e controlado pola rede.
O terminal pode utilizar todos os servizos soportados pola rede aos que teña permitido o acceso (dereitos de usuario).
Modo de uso habitual dos equipos TETRA.
Neste modo os equipos poden sintonizar o grupo da provincia seleccionada, a canle do distrito ou un dos 99 canais do grupo de extinción.

#### Direct Mode Operation (DMO)

Os terminais comunícanse directamente sen intervención da rede.
Este modo actívase voluntariamente polo usuario, cando aparece unha incidencia.
Non necesita estar rexistrado.
Cando está en modo directo non fai escaneo nin escoita os grupos da rede. Para facelo debe volver a modo rede TMO.

## Repeater / Gateway

### Modo Gateway

A función do modo Gateway é extender a cobertura da rede TETRA a lugares onde non pode chegar. É dicir, permite enlazar comunicación en directo ou DMO ca rede TETRA ou TMO e viceversa.

DMO
TMO
GATEWAY

## Tipos de terminais

- **Portófonos**
  - Sepura STP9038
  - Sepura SRG3900
  - Motorola MTP3550
- **Mobilófonos**
  - Motorola MTP6650
  - Motorola MTM5400
- **Emisoras fixas**

## Posta en Marcha e Manexo dos Terminais

### Portófono Sepura STP9038

#### Emerxencia (Home morto)
(chamada a posto de despacho provincial)

- Micro modo radio
- Conector accesorios
- Modo
- Selector de Grupo
- Colgar
- Navegación
- Modo Rede/Directo
- Semidúplex/Símplex
- Volume
- LED de estado
- Acendido/apagado (pulsación prolongada)
- PTT (push to talk)
- Menú
- Chamada individual
- Altofalante
- Micro modo teléfono
- **Verde fixo:** Fin turno
- **Laranxa intermitente:** Chamada entrante
- **Vermello fixo:** En uso

### Guías de uso

### Portófono Motorola MTP3550

- **Verde intermitente:** En servizo
- **Verde fixo:** En uso
- **Laranxa intermitente:** Chamada entrante
- **Vermello fixo:** Fóra de servizo

### Guías de uso

### Mobilófono Motorola MTM5400

- **Verde intermitente:** En servizo
- **Verde fixo:** En uso
- **Laranxa intermitente:** Chamada entrante
- **Vermello fixo:** Fóra de servizo

### Mobilófono Sepura SRG3900

#### Emerxencia
(chamada a posto de despacho provincial)

- Volume
- Acendido/apagado (pulsación prolongada)
- Selector de Grupo
- T. Group (Unha pulsación)
- Conector PTT (pulse para falar)
- Chamada individual
- Colgar
- Modo Rede / Directo
- Semidúplex / símplex
- LED de estado
- Navegación
- **Verde fixo:** Fin turno
- **Laranxa intermitente:** Chamada entrante
- **Vermello fixo:** En uso

## Identificadores Numéricos dos Terminais

### Identificadores Numéricos dos Terminais TETRA

Cada dispositivo, ben sexa mobilófono ou portófono, dispón dun número identificador en función das tarefas ás que está encomendado e a localización do mesmo.

## Grupos de Comunicación

### Grupos de Comunicación en modo rede (TMO)

- **19 Grupos de Comunicación de Distrito**
  - D01 – D19
- **4 Grupos de Comunicación Provincial**
  - CORUÑA, LUGO, OURENSE, PONTEVEDRA
- **99 Grupos de Extinción**
  - EXTINCION01 – EXTINCION99

### Grupos de Comunicación en modo directo (DMO)

- **30 Grupos Directos**
  - Directo01 – Directo30

### Cambio dun modo a outro

- Pulsación prolongada no 0

## Grupos de Extinción (TMO)

| DISTRITO                     | GRUPOS EXTINCIÓN                      |
|:-----------------------------|:--------------------------------------|
| 01 FERROL                    | 1 20                                  |
| 02 BERGANTIÑOS-MARIÑAS CORUÑESAS | 2 21 22 23 24                         |
| 03 SANTIAGO-MESETA INTERIOR  | 3 25 26 27 28                         |
| 04 BARBANZA                  | 4 29 30 31 32                         |
| 05 FISTERRA                  | 5 33 34                               |
| 06 A MARIÑA LUCENSE          | 6 35                                  |
| 07 FONSAGRADA-OS ANCARES     | 7 36 37 38                            |
| 08 TERRA DE LEMOS            | 8 39 40 41                            |
| 09 LUGO-SARRIA               | 9 42 43 44 45 46                      |
| 10 TERRA CHÁ                 | 10 47 48 49                           |
| 11 O RIBEIRO-ARENTEIRO       | 11 50 51 52 53                        |
| 12 MIÑO-ARNOIA               | 12 54 55 56 57 58 59                  |
| 13 VALDEORRAS-TRIVES         | 13 60 61 62 63 64 65 66               |
| 14 VERÍN-VIANA               | 14 67 68 69 70 71 72 73               |
| 15 A LIMIA                   | 15 74 75 76 77 78 79                  |
| 16 DEZA-TABEIRÓS             | 16 80 81 82 83 84                     |
| 17 O CONDADO-A PARADANTA     | 17 85 86 87 88 89                     |
| 18 VIGO-BAIXO MIÑO           | 18 90 91 92 93 94                     |
| 19 CALDAS-O SALNÉS           | 19 95 96 97 98 99                     |
| 99 GRUPOS EXTINCIÓN          |                                       |

## Novas Plantillas: Navegación por Carpetas

- 1 Carpeta por distrito
  Grupo de Comunicación + Grupos de Extinción

## Tipos de Terminais (Ejemplos de Uso)

### Sepura SRG3900 (Todoterreo Axente)

### Sepura SRG3900 (Motobomba)

### Sepura SRG3900 (Helicóptero)

### Motorola MTM5400 (SPIF A Coruña)

## Chamada de Emerxencia

O botón de emerxencia é de cor laranxa ou vermello. Nos portófonos están colocados na parte superior dos equipos ao lado da antena. E nos equipos mobilófonos está ao lado do rotor.

### Chamada de emerxencia en TMO

Cando se preme o botón de emerxencia, o equipo transmite automaticamente durante 30 segundos á emisora provincial tendo prioridade máxima. Non é preciso pulsar o PTT. Ao mesmo tempo o equipo envía unha mensaxe co ISSI e o estado de emerxencia a todos os usuarios do grupo, transmitindo a posición GPS.

### Chamada de emerxencia en DMO

Cando se preme o botón de emerxencia, o equipo transmite automaticamente no grupo DMO. Non e preciso pulsar o PTT. Ao mesmo tempo o equipo envía unha mensaxe co ISSI e o estado de emerxencia a todos os usuarios do grupo.

## XeoCode

- TETRA: Integración alarma, estados

## Aplicación Emisoras

Fonte: Dirección Xeral de Defensa do Monte