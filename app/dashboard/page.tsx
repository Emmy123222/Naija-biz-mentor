export default function Dashboard(){
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded p-4">Quick Links: Chat</div>
        <div className="border rounded p-4">Quick Links: Invoices</div>
        <div className="border rounded p-4">Quick Links: Fraud Check</div>
      </div>
    </div>
  )
}
