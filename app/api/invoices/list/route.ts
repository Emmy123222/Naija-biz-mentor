import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'

export async function GET(){
  try{
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('invoices')
      .select('id, customer_name, currency, date, subtotal')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if(error) throw error

    return NextResponse.json({ invoices: data })
  }catch(e:any){
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
