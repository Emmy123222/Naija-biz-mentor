import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'

export async function POST(){
  try{
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    await supabase.auth.getSession()
    return NextResponse.json({ ok: true })
  }catch(e:any){
    return NextResponse.json({ ok: false, error: e?.message || 'failed' }, { status: 500 })
  }
}
