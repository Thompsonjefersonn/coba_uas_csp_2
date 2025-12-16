'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function BookingButton({ eventId }: { eventId: number }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleBooking = async () => {
    setLoading(true)

   
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('You must be logged in to book tickets!')
      router.push('/login')
      return
    }

    // 2. Kirim data ke Supabase (Table: bookings)
    const { error } = await supabase
      .from('bookings')
      .insert({ 
        event_id: eventId, 
        user_id: user.id 
      })

    if (error) {
      alert('Booking Failed: ' + error.message)
    } else {
      alert('🎉 Ticket Booked Successfully!')
      router.push('/dashboard') // Redirect ke halaman tiket saya
    }
    
    setLoading(false)
  }

  return (
    <button
      onClick={handleBooking}
      disabled={loading}
      className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
    >
      {loading ? 'Processing...' : 'Get Ticket Now'}
    </button>
  )
}