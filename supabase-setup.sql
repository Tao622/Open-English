-- ============================================
-- 笑小英口语练习 · Supabase 初始化 SQL
-- 使用方法：Supabase 控制台 → SQL Editor → New query → 粘贴 → Run
-- ============================================

-- 用户学习进度表（每个用户一行，JSONB 存整个学习进度）
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 开启行级安全（RLS）：只允许用户读写自己的进度行
alter table public.user_progress enable row level security;

create policy "own progress select"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "own progress insert"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "own progress update"
  on public.user_progress for update
  using (auth.uid() = user_id);
