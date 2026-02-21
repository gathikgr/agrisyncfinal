create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text check (role in ('farmer','buyer')) not null,
  language text default 'en',
  payload jsonb not null,
  created_at timestamp default now()
);

create table if not exists commitments (
  id uuid primary key default gen_random_uuid(),
  buyer_email text not null,
  crop text not null,
  quantity_kg numeric not null,
  harvest_window text,
  created_at timestamp default now()
);
