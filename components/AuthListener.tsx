"use client"
import { useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'

export default function AuthListener(){
  useEffect(() => {
    const supabase = getSupabaseBrowser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, _session) => {
      await fetch('/api/auth/refresh', { method: 'POST' })
    })
    return () => subscription.unsubscribe()
  }, [])
  return null
}
