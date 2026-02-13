"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // This must match the folder we created: src/app/auth/callback
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(`❌ Error: ${error.message}`)
    } else {
      setMessage('✅ Success! Check your email for the confirmation link to activate your account.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111F35] p-6">
      <div className="max-w-md w-full bg-[#15233b]/60 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">JOIN THE CLUB</h2>
          <p className="text-slate-400 font-medium italic">Create an account to follow your teams.</p>
        </div>
        
        <form onSubmit={handleSignUp} className="space-y-6">
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
            {loading ? 'PREPARING PITCH...' : 'SIGN UP NOW'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg text-sm font-bold text-center ${message.includes('Error') ? 'bg-red-900/50 text-red-400 border border-red-400/30' : 'bg-green-900/50 text-green-400 border border-green-400/30'}`}>
            {message}
          </div>
        )}

        <p className="mt-8 text-center text-slate-400 text-sm font-medium">
          Already a member? <Link href="/login" className="text-[#F63049] font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  )
}