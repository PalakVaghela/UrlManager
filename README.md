# Bookmark App - Manage the URLs

A Next.js bookmark manager with Supabase auth. Users sign up, save private/public links on `/dashboard`, and share public bookmarks at `/<handle>`.

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

## Run locally

```bash
git clone https://github.com/PalakVaghela/bookmark-app.git
cd bookmark-app
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (signup handle check) |
| `EMAIL_USER` | Gmail address used to send welcome emails |
| `EMAIL_PASSWORD` | Gmail [app password](https://myaccount.google.com/apppasswords) |

## Supabase setup

### Create tables

**`user`**

| Column | Type |
|---|---|
| `id` | `uuid` (references `auth.users.id`) |
| `handle` | `text` |
| `created_at` | `timestamp` |

**`bookmarks`**

| Column | Type |
|---|---|
| `id` | `uuid` |
| `user_id` | `uuid` (references `user.id`) |
| `title` | `text` |
| `url` | `text` |
| `is_public` | `boolean` |
| `created_at` | `timestamp` |

```sql
create table public."user" (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  created_at timestamptz not null default now()
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public."user"(id) on delete cascade,
  title text not null,
  url text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);
```

### Enable Row Level Security

Turn on RLS for both tables. Policies:

**`user`**

| Operation | Policy |
|---|---|
| SELECT | Public read (for `/<handle>` pages) |
| INSERT | `auth.uid() = id` |

**`bookmarks`**

| Operation | Policy |
|---|---|
| SELECT | `auth.uid() = user_id` or `is_public = true` |
| INSERT | `auth.uid() = user_id` |
| UPDATE | `auth.uid() = user_id` |
| DELETE | `auth.uid() = user_id` |


### Notes

- `EMAIL_USER` / `EMAIL_PASSWORD` are the **sender** credentials; users can sign up with any email provider.
- Signup still works if welcome email fails; email is optional, not verification.
- For production, enable Supabase **email confirmation** to block fake signups.
