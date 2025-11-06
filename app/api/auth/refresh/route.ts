import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(){
  try{
    const cookieStore = cookies()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            cookie: cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; '),
          },
        },
      }
    )
    await supabase.auth.getUser()
    return NextResponse.json({ ok: true })
  }catch(e:any){
    return NextResponse.json({ ok: false, error: e?.message || 'failed' }, { status: 500 })
  }
}
