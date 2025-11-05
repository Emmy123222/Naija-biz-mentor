import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const hasEnv = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!hasEnv) {
    return res
  }
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const protectedPaths = [/^\/dashboard/, /^\/invoices/, /^\/inventory/, /^\/settings/]
  const isProtected = protectedPaths.some((re) => re.test(req.nextUrl.pathname))

  if (isProtected && !user) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next|api/ai|api/fraud|api/invoices/pdf|favicon.ico).*)'],
}
