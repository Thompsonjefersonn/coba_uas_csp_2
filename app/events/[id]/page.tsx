import { supabase } from '../../lib/supabase'
import Navbar from '@/components/Navbar'
import BookingButton from './BookingButton'
import Link from 'next/link'

// Perhatikan tipe data params di sini berubah menjadi Promise
export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  
  // SOLUSI: Kita harus await params-nya dulu sebelum mengambil ID
  const { id } = await params 

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id) // Gunakan variabel 'id' yang sudah di-await tadi
    .single()

  if (!event) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-red-500">Event Not Found</h1>
            <Link href="/" className="text-blue-500 underline mt-4">Back to Home</Link>
        </div>
    )
  }

  return (
    <>
   
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="container mx-auto max-w-5xl">
          <Link href="/" className="text-gray-500 hover:text-black mb-4 inline-block">← Back to Events</Link>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
            {/* Gambar Besar */}
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-200">
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    Workshop
                </span>
                <h1 className="text-3xl font-bold text-slate-900 mt-2 mb-4">{event.title}</h1>
                
                <div className="space-y-2 mb-6 text-gray-600">
                    <p>📅 <span className="font-medium text-black">{event.date}</span></p>
                    <p>📍 <span className="font-medium text-black">{event.location}</span></p>
                </div>

                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {event.description}
                </p>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Total Price</span>
                    <span className="text-3xl font-bold text-blue-600">
                        {event.price === 0 ? 'Free' : `Rp ${event.price.toLocaleString()}`}
                    </span>
                </div>
                {/* Kirim ID ke tombol booking */}
                <BookingButton eventId={event.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}