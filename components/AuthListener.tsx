"use client"
import { useEffect } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'

export default function AuthListener(){
  useEffect(() => {
    const supabase = getSupabaseBrowser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, _session: Session | null) => {
      await fetch('/api/auth/refresh', { method: 'POST' })
    })
    return () => subscription.unsubscribe()
  }, [])
  return null
}
