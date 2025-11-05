import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import Link from 'next/link'
import AuthListener from '@/components/AuthListener'

export const metadata: Metadata = {
  title: 'AI Business Advisor (Africa)',
  description: 'Advisor, invoices, inventory insights, and fraud detection for African SMEs',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthListener />
        <header className="border-b">
          <div className="container-page flex items-center justify-between h-14">
            <Link href="/" className="font-semibold">Naija Biz Mentor</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/chat">AI Chat</Link>
              <Link href="/invoices">Invoices</Link>
              <Link href="/inventory">Inventory</Link>
              <Link href="/fraud">Fraud Check</Link>
              <Link href="/dashboard" className="px-3 py-1 rounded bg-brand-600 text-white">Dashboard</Link>
            </nav>
          </div>
        </header>
        <main className="container-page py-8">{children}</main>
      </body>
    </html>
  )
}
