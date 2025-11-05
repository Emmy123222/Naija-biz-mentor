"use client"
import { useState } from 'react'

export default function InventoryPage(){
  const [rows, setRows] = useState<{name:string; cost:number; sold:number; price:number}[]>([])
  const [insight, setInsight] = useState<any>(null)

  const add = () => setRows([...rows, { name:'', cost:0, sold:0, price:0 }])

  const analyze = async () => {
    const revenue = rows.reduce((s,r)=> s + r.sold * r.price, 0)
    const cost = rows.reduce((s,r)=> s + r.sold * r.cost, 0)
    const profit = revenue - cost
    const res = await fetch('/api/ai/chat', { method: 'POST', body: JSON.stringify({ messages: [
      { role: 'system', content: 'You are a Nigerian/African business mentor AI providing inventory and pricing insights.' },
      { role: 'user', content: `Given products with cost, price, and sold quantities: ${JSON.stringify(rows)}. Compute profit/loss summary and give pricing, stock, and demand advice in simple bullets.` }
    ] }) })
    const data = await res.json()
    setInsight({ revenue, cost, profit, advice: data.content })
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Inventory & Profit Insights</h1>

      <div className="grid gap-2">
        {rows.map((r, i)=> (
          <div key={i} className="grid md:grid-cols-4 gap-2">
            <input className="border rounded px-3 py-2" placeholder="Product" value={r.name} onChange={e=>{ const c=[...rows]; c[i].name=e.target.value; setRows(c) }} />
            <input type="number" className="border rounded px-3 py-2" placeholder="Unit Cost" value={r.cost} onChange={e=>{ const c=[...rows]; c[i].cost=Number(e.target.value); setRows(c) }} />
            <input type="number" className="border rounded px-3 py-2" placeholder="Unit Price" value={r.price} onChange={e=>{ const c=[...rows]; c[i].price=Number(e.target.value); setRows(c) }} />
            <input type="number" className="border rounded px-3 py-2" placeholder="Sold Qty" value={r.sold} onChange={e=>{ const c=[...rows]; c[i].sold=Number(e.target.value); setRows(c) }} />
          </div>
        ))}
        <button onClick={add} className="px-3 py-2 border rounded">Add Product</button>
      </div>

      <button onClick={analyze} className="px-4 py-2 bg-brand-600 text-white rounded w-fit">Analyze</button>

      {insight && (
        <div className="border rounded p-4">
          <div>Revenue: {insight.revenue}</div>
          <div>Cost: {insight.cost}</div>
          <div>Profit: {insight.profit}</div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-gray-800">{insight.advice}</div>
        </div>
      )}
    </div>
  )
}
