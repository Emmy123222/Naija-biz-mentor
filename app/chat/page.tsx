"use client"
import { useState } from 'react'

export default function ChatPage(){
  const [messages, setMessages] = useState<{role:'user'|'assistant'; content:string}[]>([])
  const [input, setInput] = useState('')

  const send = async () => {
    if(!input.trim()) return
    const next = [...messages, { role: 'user' as const, content: input }]
    setMessages(next)
    setInput('')
    try{
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next })
      })
      const data = await res.json()
      if(!res.ok){
        setMessages([...next, { role: 'assistant', content: `Error: ${data.error || 'Failed'}` }])
        return
      }
      setMessages([...next, { role: 'assistant', content: data.content }])
    }catch(e:any){
      setMessages([...next, { role: 'assistant', content: `Network error: ${e?.message||e}` }])
    }
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">AI Mentor</h1>
      <div className="border rounded p-3 h-80 overflow-auto bg-white">
        {messages.map((m,i)=> (
          <div key={i} className={m.role==='user' ? 'text-right' : 'text-left'}>
            <div className="inline-block px-3 py-2 my-1 rounded bg-gray-100">{m.content}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about pricing, marketing, bookkeeping..." />
        <button onClick={send} className="px-4 py-2 bg-brand-600 text-white rounded">Send</button>
      </div>
    </div>
  )
}
