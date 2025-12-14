'use client'

import { useEffect, useState, use } from 'react' // Import 'use' untuk params
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Event } from '../../../../types'

// Next.js 15: Props params berbentuk Promise
export default function EditEvent({ params }: { params: Promise<{ id: string }> }) {
  // Gunakan hook use() untuk unwrap params (cara baru Next.js 15 utk Client Component)
  const { id } = use(params)
  
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Event>({
    id: 0,
    title: '',
    date: '',
    location: '',
    description: '',
    price: 0,
    image_url: ''
  })

  // 1. Ambil data lama berdasarkan ID saat halaman dibuka
  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
      if (error) {
        alert("Event tidak ditemukan!")
        router.push('/dashboard')
      } else {
        setFormData(data)
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id, router])

  // 2. Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: formData.title,
          date: formData.date,
          location: formData.location,
          description: formData.description,
          price: formData.price,
          image_url: formData.image_url
        })
        .eq('id', id) // Update di mana ID-nya cocok

      if (error) throw error
      
      alert("Event berhasil diupdate!")
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      alert("Error: " + error.message)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name === 'price' ? parseFloat(value) : value })
  }

  if (loading) return <div className="p-10 text-center">Loading Data...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Event Title</label>
            <input name="title" value={formData.title} required onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Date</label>
              <input type="date" name="date" value={formData.date} required onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Price</label>
              <input type="number" name="price" value={formData.price} required onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Location</label>
            <input name="location" value={formData.location} required onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          
           <div>
            <label className="block text-sm font-bold mb-1">Image URL</label>
            <input name="image_url" value={formData.image_url} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Description</label>
            <textarea name="description" value={formData.description} required rows={4} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div className="flex gap-4 mt-6">
            <Link href="/dashboard" className="px-6 py-2 bg-gray-300 rounded font-bold hover:bg-gray-400">Cancel</Link>
            <button type="submit" className="px-6 py-2 bg-yellow-500 text-white rounded font-bold hover:bg-yellow-600">
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}