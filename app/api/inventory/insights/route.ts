import { NextResponse } from 'next/server'
import { groq } from '@/lib/groq'

export async function POST(req: Request){
  try{
    const { rows } = await req.json() as { rows: { name:string; cost:number; sold:number; price:number }[] }
    const revenue = rows.reduce((s,r)=> s + (r.sold||0) * (r.price||0), 0)
    const cost = rows.reduce((s,r)=> s + (r.sold||0) * (r.cost||0), 0)
    const profit = revenue - cost

    const advicePrompt = `You are a Nigerian/African SME mentor. Using the data ${JSON.stringify(rows)}, give:
- Pricing advice
- Stock/Restock tips
- Demand suggestions per product
- Simple bookkeeping reminders
Keep it short, bullet points, local examples (Nigeria/Ghana).`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.4,
      messages: [
        { role: 'system', content: 'Mentor for African SMEs (Nigeria/Ghana), practical and simple.' },
        { role: 'user', content: advicePrompt }
      ]
    })
    const content = completion.choices?.[0]?.message?.content ?? ''
    return NextResponse.json({ revenue, cost, profit, advice: content })
  }catch(e:any){
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
