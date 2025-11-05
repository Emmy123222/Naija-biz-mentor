"use client"
import { useEffect, useState } from 'react'

export default function InvoicesPage(){
  const [items, setItems] = useState<{description:string; quantity:number; unit_price:number}[]>([])
  const [customer, setCustomer] = useState({ name:'', phone:'', address:'', currency:'NGN', date: new Date().toISOString().slice(0,10) })
  const [history, setHistory] = useState<any[]>([])

  const addItem = () => setItems([...items, { description:'', quantity:1, unit_price:0 }])

  const save = async () => {
    const res = await fetch('/api/invoices/create', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: customer.address,
        currency: customer.currency,
        date: customer.date,
        items
      })
    })
    const data = await res.json()
    if(data.id){
      await load()
      alert('Saved invoice #' + data.id)
    }else{
      alert('Error: '+ (data.error||'Unknown'))
    }
  }

  const pdf = async () => {
    const subtotal = items.reduce((s,i)=> s+i.quantity*i.unit_price, 0)
    const res = await fetch('/api/invoices/pdf', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ invoice: { customer_name: customer.name, date: customer.date, currency: customer.currency, items, subtotal } }) })
    const blob = await res.blob();
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='invoice.pdf'; a.click(); URL.revokeObjectURL(url)
  }

  const load = async () => {
    const res = await fetch('/api/invoices/list')
    const data = await res.json()
    setHistory(data.invoices||[])
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Invoice Builder</h1>

      <div className="grid gap-3 border rounded p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Customer name" value={customer.name} onChange={e=>setCustomer({...customer, name:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Phone" value={customer.phone} onChange={e=>setCustomer({...customer, phone:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Address" value={customer.address} onChange={e=>setCustomer({...customer, address:e.target.value})} />
          <div className="flex gap-2">
            <select className="border rounded px-3 py-2" value={customer.currency} onChange={e=>setCustomer({...customer, currency:e.target.value})}>
              <option value="NGN">₦ NGN</option>
              <option value="USD">$ USD</option>
              <option value="GHS">₵ GHS</option>
            </select>
            <input type="date" className="border rounded px-3 py-2" value={customer.date} onChange={e=>setCustomer({...customer, date:e.target.value})} />
          </div>
        </div>

        <div className="grid gap-2">
          <div className="font-medium">Items</div>
          {items.map((it, idx)=> (
            <div key={idx} className="grid md:grid-cols-3 gap-2">
              <input className="border rounded px-3 py-2" placeholder="Description" value={it.description} onChange={e=>{ const copy=[...items]; copy[idx].description = e.target.value; setItems(copy) }} />
              <input type="number" className="border rounded px-3 py-2" placeholder="Qty" value={it.quantity} onChange={e=>{ const copy=[...items]; copy[idx].quantity = Number(e.target.value); setItems(copy) }} />
              <input type="number" className="border rounded px-3 py-2" placeholder="Unit price" value={it.unit_price} onChange={e=>{ const copy=[...items]; copy[idx].unit_price = Number(e.target.value); setItems(copy) }} />
            </div>
          ))}
          <button onClick={addItem} className="px-3 py-2 border rounded">Add Item</button>
        </div>

        <div className="flex gap-3">
          <button onClick={save} className="px-4 py-2 bg-brand-600 text-white rounded">Save Invoice</button>
          <button onClick={pdf} className="px-4 py-2 border rounded">Download PDF</button>
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="font-semibold">Invoice History</h2>
        <div className="grid gap-2">
          {history?.map((inv:any)=> (
            <div key={inv.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{inv.customer_name}</div>
                <div className="text-sm text-gray-600">{inv.currency} • {new Date(inv.date).toLocaleDateString()}</div>
              </div>
              <div className="text-sm">Subtotal: {inv.subtotal}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
