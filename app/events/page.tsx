"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { useRouter } from "next/navigation"
import { Search, Calendar, MapPin, LogOut, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string
  category: string
  rating: number
  stock: number
  brand: string
}

function EventsContent() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("https://dummyjson.com/products?limit=20")

      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const data = await response.json()
      setEvents(data.products)
    } catch (err) {
      setError("Failed to load events. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load events. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const formatDate = (eventId: number) => {
    // Generate a consistent future date based on event ID
    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() + (eventId % 30) + 1)
    return baseDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getLocation = (category: string) => {
    const locations = {
      smartphones: "Tech Center",
      laptops: "Innovation Hub",
      fragrances: "Wellness Center",
      skincare: "Beauty Lounge",
      groceries: "Community Hall",
      "home-decoration": "Design Studio",
      furniture: "Exhibition Center",
      tops: "Fashion District",
      "womens-dresses": "Style Arena",
      "womens-shoes": "Fashion Plaza",
      "mens-shirts": "Men's Pavilion",
      "mens-shoes": "Sports Complex",
      "mens-watches": "Luxury Lounge",
      "womens-watches": "Elegance Hall",
      "womens-bags": "Accessories Center",
      "womens-jewellery": "Jewelry Gallery",
      sunglasses: "Outdoor Plaza",
      automotive: "Auto Expo Center",
      motorcycle: "Motor Sports Arena",
      lighting: "Design Center",
    }
    return locations[category as keyof typeof locations] || "Event Center"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Event Explorer</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchEvents} className="mt-2 bg-transparent">
              Try Again
            </Button>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={event.thumbnail || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-primary">{event.category}</Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.id)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {getLocation(event.category)}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-semibold text-primary">${event.price}</span>
                    <Badge variant="secondary">⭐ {event.rating}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No events found matching your search.</p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

export default function EventsPage() {
  return (
    <AuthGuard>
      <EventsContent />
    </AuthGuard>
  )
}
