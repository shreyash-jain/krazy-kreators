## Supabase integration

This project connects to Supabase to store contact form submissions.

### Environment variables

Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=https://dlarskurdadrhzfdrlgz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
# Optional server-only name; if set it will also be detected
SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Replace `YOUR_ANON_KEY` with your project anon key.

You can copy from `./env.local.example` if present.

### Install client

```
npm install @supabase/supabase-js
```

### Create tables (run in Supabase SQL editor)

Open the Supabase SQL editor for your project and run the script:

- `scripts/supabase_schema.sql`

This creates the `public.contact_submissions` table, enables RLS, and adds a policy that allows anonymous inserts (so the public website can write submissions) while preventing public reads.

### Where data is written

The API route `src/app/api/contact/route.ts` persists contact submissions to `public.contact_submissions` (best-effort) before sending email notifications. If the table or env vars are missing, it will skip the write and continue sending the email.


