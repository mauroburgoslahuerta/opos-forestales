
-- Table to store the structured study material (Markdown) extracted from PDFs
create table if not exists study_materials (
  id uuid primary key default uuid_generate_v4(),
  topic_slug text not null, -- Links to topics.slug conceptually
  title text not null,
  content_markdown text not null,
  key_articles jsonb, -- Array of strings e.g. ["Art. 21", "Art. 48"]
  importance text, -- e.g. "alta"
  source_file text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Add a unique constraint to avoid duplicates per slug/source
  unique(topic_slug, source_file)
);

-- Policy to allow public read (for the app)
alter table study_materials enable row level security;

create policy "Enable read access for all users" on study_materials
  for select using (true);
  
-- Allow insert/update/delete for service_role (which our script uses)
create policy "Enable all access for service_role" on study_materials
  for all using (true) with check (true);
