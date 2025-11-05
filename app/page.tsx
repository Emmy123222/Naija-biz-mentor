export default function Page() {
  return (
    <div className="grid gap-6">
      <section className="text-center py-10">
        <h1 className="text-3xl font-bold">AI Business Advisor for African Entrepreneurs</h1>
        <p className="mt-2 text-gray-600">Get local advice, generate invoices, track profit, and avoid scams.</p>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <Card title="AI Mentor" desc="Pricing, marketing, bookkeeping tips for Nigeria & Africa." href="/chat" />
        <Card title="Invoices" desc="Create PDF invoices with ₦/$/₵ and keep records." href="/invoices" />
        <Card title="Inventory & Profit" desc="Enter costs/sales and get insights." href="/inventory" />
        <Card title="Fraud Detector" desc="Paste messages, we flag scams and explain." href="/fraud" />
        <Card title="Dashboard" desc="Your business at a glance." href="/dashboard" />
        <Card title="Settings" desc="Profile and preferences." href="/settings" />
      </section>
    </div>
  )
}

function Card({ title, desc, href }: { title: string; desc: string; href: string }){
  return (
    <a href={href} className="border rounded-lg p-4 hover:shadow">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
    </a>
  )
}
