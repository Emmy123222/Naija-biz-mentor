import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export function createServerSupabase(){
  const cookieStore = cookies()
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; '),
        },
      },
    }
  )
}
