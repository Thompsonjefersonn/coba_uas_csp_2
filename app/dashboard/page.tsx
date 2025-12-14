'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 1. Fetch Data Event saat halaman dibuka
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setEvents(data)
      setLoading(false)
    }

    fetchEvents()
  }, [])

  // 2. Fungsi Delete Event
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Yakin mau hapus event ini?")
    if (!confirmDelete) return

    try {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
      
      // Update tampilan tabel tanpa refresh halaman (hapus item dari state)
      setEvents(events.filter(event => event.id !== id))
      alert("Event berhasil dihapus!")
      router.refresh()
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message)
    }
  }

  if (loading) return <div className="text-center p-10">Loading Dashboard...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          
          {/* Tombol ke Halaman Create */}
          <Link href="/events/create" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition">
            + Tambah Event Baru
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b">Title</th>
                <th className="p-4 border-b">Date</th>
                <th className="p-4 border-b">Location</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-slate-800">{event.title}</td>
                  <td className="p-4 text-gray-500">{event.date}</td>
                  <td className="p-4 text-gray-500">{event.location}</td>
                  <td className="p-4 flex justify-center gap-3">
                    
                    {/* Tombol Edit */}
                    <Link href={`/events/edit/${event.id}`} className="text-yellow-600 hover:text-yellow-700 font-medium bg-yellow-50 px-3 py-1 rounded">
                      Edit
                    </Link>

                    {/* Tombol Delete */}
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-700 font-medium bg-red-50 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">Belum ada event. Silakan buat baru.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}