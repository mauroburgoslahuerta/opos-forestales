# 🌲 Plataforma de Oposiciones Forestales de Galicia

Plataforma integral de tests, simulacros y seguimiento para las Oposiciones Forestales de la Xunta de Galicia.

🔴 **[Ver aplicación en vivo](https://opos-forestales.vercel.app)** *(Nota: Si la URL de Vercel es diferente, asegúrate de actualizar este enlace)*

## 🛠️ Stack Tecnológico

- **Frontend:** React, Vite, Tailwind CSS
- **Backend & Base de Datos:** Supabase (PostgreSQL)
- **Procesamiento de Datos:** Python, Node.js (Extracción, limpieza y carga de cientos de preguntas oficiales usando IA)
- **Despliegue:** Vercel

## ✨ Características Principales

- **Tests Dinámicos:** Generación de tests por temas (Legislación, Específico, Prevención de Riesgos).
- **Casos Prácticos:** Soporte para simulacros complejos.
- **Autenticación y Seguimiento:** Registro de usuarios y estadísticas de progreso.
- **Base de Datos Robusta:** Más de mil preguntas oficiales extraídas y categorizadas de exámenes reales de la Xunta de Galicia.

## 🚀 Instalación y Desarrollo Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/mauroburgoslahuerta/opos-forestales.git
   ```
2. Instala las dependencias del frontend:
   ```bash
   cd frontend
   npm install
   ```
3. Ejecuta el servidor de desarrollo local:
   ```bash
   npm run dev
   ```

## 🧠 Arquitectura de Datos (Data Pipeline)

*Nota para reclutadores técnicos:* 
Para construir la base de datos de esta plataforma, se desarrolló un pipeline ETL personalizado. Los scripts de procesamiento (ubicados localmente en `_data_processing` e ignorados en Git para mantener la limpieza del repositorio web) se encargan de:
1. **Extracción:** Parseo de texto de PDFs y Excel de exámenes oficiales históricos.
2. **Transformación:** Estructuración y corrección de las preguntas mediante scripts y APIs de LLMs (Gemini).
3. **Carga:** Inyección programática de los datos limpios en la base de datos relacional de Supabase asegurando la integridad referencial.
