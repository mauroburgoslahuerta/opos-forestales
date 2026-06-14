-- RESET COMPLETO DE BD OPOS FORESTALES
-- Ejecutar en Supabase SQL Editor

-- 1. Borrar TODO (TRUNCATE es instantáneo)
TRUNCATE TABLE questions CASCADE;
TRUNCATE TABLE topics CASCADE;

-- 2. Insertar 19 topics oficiales con pesos correctos
INSERT INTO topics (slug, name, block, exam_weight) VALUES
-- PARTE COMÚN (8 temas, 20 preguntas → 2.5/tema)
('t-com-1-const', 'T1 Común: Constitución Española 1978', 'comun', 2.5),
('t-com-2-estatuto', 'T2 Común: Estatuto de Autonomía de Galicia', 'comun', 2.5),
('t-com-3-admin', 'T3 Común: Lei 39/2015 Procedemento Administrativo', 'comun', 2.5),
('t-com-4-transp', 'T4 Común: Lei 1/2016 Transparencia e Bo Goberno', 'comun', 2.5),
('t-com-5-emprego', 'T5 Común: Lei 2/2015 Emprego Público de Galicia', 'comun', 2.5),
('t-com-6-igualdade', 'T6 Común: Lei 7/2023 Igualdade Efectiva', 'comun', 2.5),
('t-com-7-discap', 'T7 Común: RD 1/2013 Dereitos Persoas con Discapacidade', 'comun', 2.5),
('t-com-8-prl', 'T8 Común: Lei 31/1995 Prevención de Riscos Laborais', 'comun', 2.5),

-- PARTE ESPECÍFICA (11 temas, 60 preguntas → 5.5/tema)
('t-esp-1-lei', 'T1 Específico: Lei 3/2007 Prevención e Defensa contra Incendios', 'especifico', 5.5),
('t-esp-2-pladiga', 'T2 Específico: PLADIGA - Plan de Prevención e Defensa', 'especifico', 5.5),
('t-esp-3-semop', 'T3 Específico: SEMOP - Sistema Estrutural de Mando Operativo', 'especifico', 5.5),
('t-esp-4-lume', 'T4 Específico: O Lume Forestal e Características', 'especifico', 5.5),
('t-esp-5-extincion', 'T5 Específico: Extinción de Incendios Forestais', 'especifico', 5.5),
('t-esp-6-prevencion', 'T6 Específico: A Prevención de Incendios', 'especifico', 5.5),
('t-esp-7-equipamento', 'T7 Específico: O Equipamento na Loita contra Incendios', 'especifico', 5.5),
('t-esp-8-conduccion', 'T8 Específico: A Condución Todoterreo', 'especifico', 5.5),
('t-esp-9-seguridade', 'T9 Específico: A Seguridade do Persoal', 'especifico', 5.5),
('t-esp-10-accidentes', 'T10 Específico: Prevención de Accidentes', 'especifico', 5.5),
('t-esp-11-comms', 'T11 Específico: As Comunicacións', 'especifico', 5.5);

-- 3. Verificar resultado
SELECT block, COUNT(*) as num_temas, SUM(exam_weight) as peso_total
FROM topics
GROUP BY block
ORDER BY block;

-- Debería mostrar:
-- comun       | 8  | 20.0
-- especifico  | 11 | 60.5
