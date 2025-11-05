"use client"
import { useState } from 'react'

export default function FraudPage(){
  const [text, setText] = useState('')
  const [result, setResult] = useState<any>(null)

  const check = async () => {
    const res = await fetch('/api/fraud/check', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text }) })
    const data = await res.json()
    try{ setResult(JSON.parse(data.result)) }catch{ setResult(data.result) }
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Fraud & Scam Detector</h1>
      <textarea className="border rounded p-3 h-40" placeholder="Paste WhatsApp/SMS/email message here..." value={text} onChange={e=>setText(e.target.value)} />
      <button onClick={check} className="px-4 py-2 bg-brand-600 text-white rounded w-fit">Check</button>
      {result && (
        <pre className="border rounded p-3 bg-gray-50 text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  )
}
