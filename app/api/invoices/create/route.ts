import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabase } from '@/lib/supabaseServer'

const schema = z.object({
  customer_name: z.string().min(1),
  customer_phone: z.string().optional().default(''),
  customer_address: z.string().optional().default(''),
  currency: z.enum(['NGN','USD','GHS']),
  date: z.string(),
  items: z.array(z.object({ description: z.string(), quantity: z.number().min(1), unit_price: z.number().nonnegative() }))
})

export async function POST(req: Request){
  try{
    const body = schema.parse(await req.json())
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const subtotal = body.items.reduce((s,i)=> s + i.quantity * i.unit_price, 0)

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_address: body.customer_address,
        currency: body.currency,
        date: body.date,
        subtotal,
      })
      .select('id')
      .single()

    if(error) throw error

    const invoiceId = data.id

    const { error: itemsErr } = await supabase
      .from('invoice_items')
      .insert(body.items.map(i => ({ invoice_id: invoiceId, description: i.description, quantity: i.quantity, unit_price: i.unit_price })))
    if(itemsErr) throw itemsErr

    return NextResponse.json({ id: invoiceId })
  }catch(e:any){
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
