import { NextResponse } from 'next/server'
import { getGroq } from '@/lib/groq'

const SYSTEM_PROMPT = `You are a Nigerian/African business mentor AI. You help small business owners grow with simple language, practical advice, and local examples.
Provide: pricing suggestions, sales tips, social media content ideas, bookkeeping reminders, fraud warnings, resource recommendations. Focus on real African markets: food, fashion, POS, logistics, mini-importation, crypto (with risk warnings), cosmetics, tech services, phone accessories. Be friendly, motivating, and practical.`

export const runtime = 'nodejs'

export async function POST(req: Request){
  try{
    const body = await req.json().catch(() => null as any)
    if(!body || !Array.isArray(body.messages)){
      return NextResponse.json({ error: 'Invalid body. Expected { messages: Array<{role, content} > }' }, { status: 400 })
    }
    const { messages } = body
    const groq = getGroq()
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.4,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ]
    })
    const content = completion.choices?.[0]?.message?.content ?? ''
    return NextResponse.json({ content })
  }catch(e:any){
    return NextResponse.json({ error: e?.message || 'Failed calling Groq' }, { status: 500 })
  }
}
