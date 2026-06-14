-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. TOPICS (Temario)
-- Stores the list of topics and their official exam weight for C2.
create table topics (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null, -- e.g., 'legislacion-comun', 'tema-1-incendios'
  name text not null,        -- e.g., 'Tema 1: A defensa contra incendios'
  block text not null check (block in ('comun', 'especifico')),
  exam_weight numeric default 1.0, -- Multiplier for random selection probability
  created_at timestamp with time zone default now()
);

-- 2. QUESTIONS (Banco de Preguntas)
-- Stores the ~1215 extracted questions + future AI generated ones.
create table questions (
  id uuid primary key default uuid_generate_v4(),
  topic_id uuid references topics(id),
  
  question_text text not null,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_answer char(1) check (correct_answer in ('a', 'b', 'c', 'd')),
  explanation text, -- AI generated explanation
  
  source_file text, -- e.g., 'Test_2018.pdf'
  is_official boolean default false, -- true = from PDF, false = AI generated
  difficulty_level int default 1, -- 1-3
  
  created_at timestamp with time zone default now()
);

-- 3. USER_PROGRESS (Seguimiento)
-- Tracks which questions the user has seen and their performance.
create table user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null, -- Links to Supabase Auth
  question_id uuid references questions(id),
  
  is_correct boolean not null,
  answered_at timestamp with time zone default now()
);

-- 4. EXAM_SESSIONS (Simulacros)
-- Stores full exam sessions to review later.
create table exam_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  mode text check (mode in ('study', 'mock_real', 'mock_custom')),
  score numeric,
  total_questions int,
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

-- Seed initial Topics (C2 Structure)
insert into topics (slug, name, block, exam_weight) values
('const', 'Constitución Española', 'comun', 2.0),
('statute', 'Estatuto de Autonomía', 'comun', 1.5),
('admin-proc', 'Procedimiento Administrativo (39/2015)', 'comun', 1.5),
('public-emp', 'Empleo Público (2/2015)', 'comun', 1.0),
('equality', 'Igualdad y Violencia de Género', 'comun', 0.5),
('transparency', 'Transparencia y Buen Gobierno', 'comun', 0.5),

('t1-defense', 'T1: Defensa contra Incendios (Lei 3/2007)', 'especifico', 3.0),
('t2-pladiga', 'T2: PLADIGA', 'especifico', 2.5),
('t3-semop', 'T3: SEMOP', 'especifico', 2.5),
('t4-fire', 'T4: Comportamiento del Fuego', 'especifico', 3.0),
('t5-extinction', 'T5: Extinción y Herramientas', 'especifico', 3.0),
('t6-prevention', 'T6: Prevención y Silvicultura', 'especifico', 2.0),
('t7-machinery', 'T7: Maquinaria Pesada', 'especifico', 2.0),
('t8-driving', 'T8: Conducción Todoterreno', 'especifico', 1.5),
('t9-safety', 'T9: Seguridad y PRL', 'especifico', 2.5),
('t10-firstaid', 'T10: Primeros Auxilios', 'especifico', 1.5),
('t11-comms', 'T11: Comunicaciones (TETRA)', 'especifico', 2.0);
