-- Enable RLS on all tables
alter table topics enable row level security;
alter table questions enable row level security;
alter table user_progress enable row level security;
alter table exam_sessions enable row level security;
alter table scenarios enable row level security;

-- POLICIES

-- 1. Topics & Questions: PUBLIC READ (Everyone can see the questions)
-- In a real app, maybe only authenticated users, but for now Public is fine for the content.
create policy "Public topics are viewable by everyone"
  on topics for select
  using ( true );

create policy "Public questions are viewable by everyone"
  on questions for select
  using ( true );

-- 2. User Data: PRIVATE (Only the owner can see/edit)
-- This assumes Supabase Auth is used and 'auth.uid()' matches 'user_id'
create policy "Users can see their own progress"
  on user_progress for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own progress"
  on user_progress for insert
  with check ( auth.uid() = user_id );

create policy "Users can see their own exams"
  on exam_sessions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own exams"
  on exam_sessions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own exams"
  on exam_sessions for update
  using ( auth.uid() = user_id );
