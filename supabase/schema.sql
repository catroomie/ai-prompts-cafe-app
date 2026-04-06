-- profiles（認証ユーザーと1:1）
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

-- prompts（プロンプト本体）
create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  title text not null,
  description_ja text not null,
  description_en text,
  category text not null,
  content text not null,
  status text not null default 'approved',
  submitted_by uuid references profiles(id) on delete set null,
  copy_count int not null default 0,
  created_at timestamptz not null default now()
);

-- favorites（お気に入り）
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  prompt_id uuid not null references prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, prompt_id)
);

-- RLS有効化
alter table profiles enable row level security;
alter table prompts enable row level security;
alter table favorites enable row level security;

-- RLSポリシー
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_update" on profiles for update using (auth.uid() = id);
create policy "prompts_select_approved" on prompts for select using (status = 'approved');
create policy "favorites_select" on favorites for select using (auth.uid() = user_id);
create policy "favorites_insert" on favorites for insert with check (auth.uid() = user_id);
create policy "favorites_delete" on favorites for delete using (auth.uid() = user_id);

-- 新規ユーザー登録時にprofilesを自動作成するトリガー
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
