"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      // Send the user to the dashboard after successful login
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111F35] p-6">
      <div className="max-w-md w-full bg-[#15233b]/60 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">WELCOME BACK</h2>
          <p className="text-slate-400 font-medium italic">Log in to check your favorite scores.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              className="w-full p-4 rounded-lg bg-[#0b1422] text-white border border-white/10 focus:ring-2 focus:ring-[#F63049] outline-none transition-all"
              placeholder="fan@goalstrkr.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              className="w-full p-4 rounded-lg bg-[#0b1422] text-white border border-white/10 focus:ring-2 focus:ring-[#F63049] outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#F63049] to-[#D02752] text-white font-black py-4 rounded-lg hover:shadow-[0_0_20px_rgba(246,48,73,0.5)] transition-shadow disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'LOG IN'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-lg text-sm font-bold text-center bg-red-900/50 text-red-400 border border-red-400/30">
            ❌ {error}
          </div>
        )}

        <p className="mt-8 text-center text-slate-400 text-sm font-medium">
          New here? <Link href="/signup" className="text-[#F63049] font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}