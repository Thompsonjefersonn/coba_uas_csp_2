import { supabase } from '../app/lib/supabase'
import Link from 'next/link'
import { Event } from '@/types'

// Agar data selalu baru setiap kali halaman direfresh (no cache)
export const revalidate = 0 

export default async function Home() {
  const { data: events } = await supabase.from('events').select('*').order('date', { ascending: true })

  return (
    <>
   
      <main className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Upcoming Events</h1>
            <p className="text-gray-600">Discover and book the best workshops in town.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events?.map((event: Event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
                {/* Image */}
                <div className="h-48 w-full bg-gray-200 relative">
                  <img 
                    src={event.image_url} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow">
                    {event.price === 0 ? 'Free' : `Rp ${event.price.toLocaleString()}`}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h2>
                    <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                      <span>📅 {event.date}</span>
                      <span>📍 {event.location}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-4">{event.description}</p>
                  </div>
                  
                  <Link 
                    href={`/events/${event.id}`} 
                    className="block w-full text-center bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}