"use client"
import { useEffect } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'

export default function AuthListener(){
  useEffect(() => {
    const supabase = getSupabaseBrowser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, _session: Session | null) => {
      (async () => {
        try {
          await fetch('/api/auth/refresh', { method: 'POST' })
        } catch (e) {
          console.error('Failed to refresh auth:', e)
        }
      })()
    })
    return () => subscription.unsubscribe()
  }, [])
  return null
}
