'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../app/lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // 1. Cek session saat pertama kali load
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getUser()

    // 2. Pasang listener untuk mendeteksi login/logout otomatis
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      router.refresh() // Refresh halaman agar data terbaru muncul
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
          Eventify
        </Link>

        {/* Menu Items */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-gray-300">My Tickets</Link>
              <div className="flex items-center gap-4 pl-4 border-l border-gray-700">
                <span className="text-xs text-gray-400 hidden md:block">{user.email}</span>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-600 px-4 py-2 rounded text-sm font-semibold hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link 
              href="/login" 
              className="bg-blue-600 px-5 py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}