-- Migration Script: Map Old Topics to New Topics
-- Generated based on name similarity

UPDATE questions SET topic_id = 'd0b757d3-5b13-526a-9898-47cbe4537cc3' WHERE topic_id = '808c27d6-5fd9-4150-b11c-3916cf9cf350'; -- T6 Específico: A Prevención de Incendios -> Esp: A PREVENCIÓN DE INCENDIOS FORE ley 3-2007 incendios consolidado
UPDATE questions SET topic_id = 'd0b757d3-5b13-526a-9898-47cbe4537cc3' WHERE topic_id = '7a363adf-8368-4b14-af09-9f9c50052631'; -- T1 Específico: Lei 3/2007 Prevención e Defensa contra Incendios -> Esp: A PREVENCIÓN DE INCENDIOS FORE ley 3-2007 incendios consolidado
UPDATE questions SET topic_id = 'cebc6043-2b53-5812-8b46-4b7b312f76c7' WHERE topic_id = 'ae663cb8-d9c1-43b0-9a17-bb6467bc04e6'; -- T5 Específico: Extinción de Incendios Forestais -> Esp: Os incendios forestais na inte XB IUF SO
-- TODO: Map manually 'T8 Específico: A Condución Todoterreo' (430bfd25-ba3e-430b-b87a-806a2746d2b0)
-- TODO: Map manually 'T7 Específico: O Equipamento na Loita contra Incendios' (ae7330d6-cb21-41a0-895a-b6bf696452d3)
UPDATE questions SET topic_id = '783ad3fb-f31c-5600-870d-fcbed1e62e13' WHERE topic_id = 'a9abe9a1-c783-484b-95c7-d8417ca6fa8c'; -- T4 Específico: O Lume Forestal e Características -> Esp: Tama y presentacion O lume forestal 08 07 25
-- TODO: Map manually 'T3 Específico: SEMOP - Sistema Estrutural de Mando Operativo' (73e64544-4bf6-4572-be84-085de26738c1)
-- TODO: Map manually 'T9 Específico: A Seguridade do Persoal' (549e1467-8ad7-4583-83a1-b59dc3f5d291)
