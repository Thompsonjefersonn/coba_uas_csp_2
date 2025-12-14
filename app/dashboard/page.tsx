'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase' // Gunakan alias @ agar lebih aman
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { Booking } from '@/types' // Pastikan import ini benar

export default function Dashboard() {
  // State sudah di-set tipe array of Booking
  const [bookings, setBookings] = useState<Booking[]>([]) 
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBookings = async () => {
      // 1. Cek User
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

    
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          created_at,
          user_id,
          event_id,
          events (
            title,
            date,
            location,
            image_url,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
      } else if (data) {
        // PERBAIKAN DI SINI:
        // Gunakan 'as Booking[]' bukan 'as any'. 
        // Ini memberitahu TS: "Saya yakin data dari Supabase ini bentuknya array of Booking"
        setBookings(data as unknown as Booking[]) 
      }
      setLoading(false)
    }

    fetchBookings()
  }, [router])

  return (
    <>

      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-slate-800">My Tickets</h1>

          {loading ? (
            <p>Loading tickets...</p>
          ) : bookings.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <p className="text-gray-500 mb-4">You havent booked any events yet.</p>
              <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm hover:shadow-md transition">
                  {/* Gambar Kecil */}
                  <img 
                    src={booking.events.image_url} 
                    alt={booking.events.title} 
                    className="w-full md:w-32 h-32 md:h-24 object-cover rounded-lg bg-gray-200"
                  />
                  
                  {/* Info Tiket */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-bold text-lg text-slate-800">{booking.events.title}</h3>
                    {/* PERBAIKAN TYPO DI SINI: .Location jadi .location (huruf kecil) */}
                    <p className="text-gray-500 text-sm mb-1">{booking.events.date} • {booking.events.location}</p>
                    <p className="text-xs text-gray-400">Booking ID: #{booking.id}</p>
                  </div>

                  {/* Status Badge */}
                  <div className="px-4">
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold border border-green-200">
                      ✓ Confirmed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}