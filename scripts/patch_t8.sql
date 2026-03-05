-- Parche para T8 Conducción: Pregunta 8 y 37

-- 1. P8: Actualizar respuesta correcta de 'a' a 'c' (Ángulo de saída)
-- Justificación: El pliego dice explícitamente "Ángulo de saída: 20º como mínimo".
UPDATE questions 
SET correct_answer = 'c' 
WHERE id = 'adace58a-2075-473d-98e7-f81af0251b80';

-- 2. P37: Eliminar opción C que es exacta a B
UPDATE questions 
SET option_c = NULL 
WHERE id = '846df09b-5d9f-404e-907f-815f6ce0c261';

