'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateEvent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    price: 0,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50935278?w=800&q=80' // Default gambar
  })

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('events').insert([formData])
      if (error) throw error
      
      alert('Event berhasil dibuat!')
      router.push('/dashboard') // Balik ke dashboard
      router.refresh()
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Event Title</label>
            <input name="title" required onChange={handleChange} className="w-full border p-2 rounded" placeholder="Contoh: Belajar Next.js" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Date</label>
              <input type="date" name="date" required onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Price (Rp)</label>
              <input type="number" name="price" required onChange={handleChange} className="w-full border p-2 rounded" placeholder="0" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Location</label>
            <input name="location" required onChange={handleChange} className="w-full border p-2 rounded" placeholder="Contoh: Jakarta / Online" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Image URL</label>
            <input name="image_url" value={formData.image_url} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Link gambar (https://...)" />
            <p className="text-xs text-gray-500 mt-1">Gunakan link gambar langsung. Sementara pakai default jika kosong.</p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Description</label>
            <textarea name="description" required rows={4} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Deskripsi event..." />
          </div>

          <div className="flex gap-4 mt-6">
            <Link href="/dashboard" className="px-6 py-2 bg-gray-300 rounded font-bold hover:bg-gray-400">Cancel</Link>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">
              {loading ? 'Saving...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}