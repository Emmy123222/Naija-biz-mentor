import { NextResponse } from 'next/server'
import { getGroq } from '@/lib/groq'

export async function POST(req: Request){
  try{
    const { text } = await req.json()
    const prompt = `Analyze the following message for fraud risk in the African context (Nigeria/Ghana): bank transfers, POS, mobile money, USSD, fake alerts.
Return JSON with fields: risk_level (low/medium/high), verdict (scam/not_scam/unclear), red_flags (array), explanation (concise), tips (array). Message: \n\n${text}`

    const groq = getGroq()
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You are a fraud detector for African payments and WhatsApp scams.' },
        { role: 'user', content: prompt }
      ]
    })
    const content = completion.choices?.[0]?.message?.content ?? '{}'
    return NextResponse.json({ result: content })
  }catch(e:any){
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
