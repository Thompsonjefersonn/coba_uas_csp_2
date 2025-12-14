export interface Event {
  id: number
  title: string
  description: string
  date: string
  price: number
  image_url: string
  location: string
}

export interface Booking {
  id: number
  created_at: string
  user_id: string
  event_id: number
  events: Event // Untuk join table
}