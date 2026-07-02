create table tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active','on_hold','done')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table project_tags (
  project_id uuid references projects(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (project_id, tag_id)
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  priority text not null default 'med' check (priority in ('high','med','low')),
  due_date date,
  done boolean not null default false,
  project_id uuid references projects(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table task_tags (
  task_id uuid references tasks(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (task_id, tag_id)
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  target_description text,
  progress int not null default 0 check (progress between 0 and 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table note_tags (
  note_id uuid references notes(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (note_id, tag_id)
);

create table captures (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  promoted_to_task_id uuid references tasks(id) on delete set null,
  created_at timestamptz default now()
);
