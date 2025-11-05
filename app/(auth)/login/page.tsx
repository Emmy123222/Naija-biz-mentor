"use client"
import { useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin'|'signup'>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setLoading(true)
    setError(null)
    const supabase = getSupabaseBrowser()
    let error
    if(mode === 'signin'){
      const res = await supabase.auth.signInWithPassword({ email, password })
      error = res.error || null
      if(!error){
        window.location.href = '/dashboard'
      }
    } else {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` }
      })
      error = res.error || null
      // If email confirmations are enabled, user must confirm before session exists
      if(!error){
        // If confirmation is not required, redirect; otherwise, show info message
        if(res.data.session){
          window.location.href = '/dashboard'
        } else {
          setError('Check your email to confirm your account, then sign in.')
        }
      }
    }
    setLoading(false)
    if(error) setError(error.message)
  }

  return (
    <div className="grid gap-4 max-w-md">
      <h1 className="text-2xl font-semibold">Login / Signup</h1>
      <div className="flex gap-2 text-sm">
        <button className={`px-3 py-1 rounded border ${mode==='signin'?'bg-brand-600 text-white':'bg-white'}`} onClick={()=>setMode('signin')}>Sign In</button>
        <button className={`px-3 py-1 rounded border ${mode==='signup'?'bg-brand-600 text-white':'bg-white'}`} onClick={()=>setMode('signup')}>Sign Up</button>
      </div>
      <input className="border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit} className="px-4 py-2 bg-brand-600 text-white rounded" disabled={loading}>
        {loading ? (mode==='signin'?'Signing in…':'Creating…') : (mode==='signin'?'Sign In':'Create Account')}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {mode==='signup' && (
        <p className="text-xs text-gray-600">If email confirmation is enabled, you must confirm the email before signing in.</p>
      )}
    </div>
  )
}
