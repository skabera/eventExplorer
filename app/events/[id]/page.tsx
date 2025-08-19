"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { ArrowLeft, Calendar, MapPin, Star, Users, Clock, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EventDetail {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string
  images: string[]
  category: string
  rating: number
  stock: number
  brand: string
  discountPercentage: number
  tags: string[]
}

interface RegisteredEvent {
  id: number
  title: string
  price: number
  thumbnail: string
  category: string
  registeredAt: string
  eventDate: string
  location: string
}

function EventDetailContent() {
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const eventId = params.id as string

  useEffect(() => {
    if (eventId) {
      fetchEventDetail()
    }
  }, [eventId])

  useEffect(() => {
    if (user && eventId) {
      checkRegistrationStatus()
    }
  }, [user, eventId])

  const fetchEventDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`https://dummyjson.com/products/${eventId}`)

      if (!response.ok) {
        throw new Error("Event not found")
      }

      const data = await response.json()
      setEvent(data)
    } catch (err) {
      setError("Failed to load event details. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load event details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkRegistrationStatus = () => {
    if (!user) return

    const registeredEvents = getRegisteredEvents()
    const isAlreadyRegistered = registeredEvents.some((regEvent) => regEvent.id === Number.parseInt(eventId))
    setIsRegistered(isAlreadyRegistered)
  }

  const getRegisteredEvents = (): RegisteredEvent[] => {
    if (!user) return []

    const userRegistrations = localStorage.getItem(`registrations_${user.id}`)
    return userRegistrations ? JSON.parse(userRegistrations) : []
  }

  const saveRegisteredEvents = (events: RegisteredEvent[]) => {
    if (!user) return

    localStorage.setItem(`registrations_${user.id}`, JSON.stringify(events))
  }

  const formatDate = (eventId: number) => {
    // Generate a consistent future date based on event ID
    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() + (eventId % 30) + 1)
    return baseDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (eventId: number) => {
    // Generate a consistent time based on event ID
    const hours = 9 + (eventId % 8) // 9 AM to 4 PM
    const minutes = (eventId % 4) * 15 // 0, 15, 30, or 45 minutes
    return `${hours}:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`
  }

  const getLocation = (category: string) => {
    const locations = {
      smartphones: "Tech Center, Silicon Valley",
      laptops: "Innovation Hub, Downtown",
      fragrances: "Wellness Center, Midtown",
      skincare: "Beauty Lounge, Fashion District",
      groceries: "Community Hall, Central Park",
      "home-decoration": "Design Studio, Arts Quarter",
      furniture: "Exhibition Center, Convention Ave",
      tops: "Fashion District, Style Street",
      "womens-dresses": "Style Arena, Fashion Plaza",
      "womens-shoes": "Fashion Plaza, Boutique Row",
      "mens-shirts": "Men's Pavilion, Commerce St",
      "mens-shoes": "Sports Complex, Athletic Ave",
      "mens-watches": "Luxury Lounge, Premium Plaza",
      "womens-watches": "Elegance Hall, Jewelry District",
      "womens-bags": "Accessories Center, Style Square",
      "womens-jewellery": "Jewelry Gallery, Diamond Row",
      sunglasses: "Outdoor Plaza, Sunshine Blvd",
      automotive: "Auto Expo Center, Motor Mile",
      motorcycle: "Motor Sports Arena, Speed Way",
      lighting: "Design Center, Innovation Park",
    }
    return locations[category as keyof typeof locations] || "Event Center, Main Street"
  }

  const handleRegister = async () => {
    if (!user || !event) return

    setRegistering(true)

    try {
      const registeredEvents = getRegisteredEvents()

      if (isRegistered) {
        // Unregister from event
        const updatedEvents = registeredEvents.filter((regEvent) => regEvent.id !== event.id)
        saveRegisteredEvents(updatedEvents)
        setIsRegistered(false)

        toast({
          title: "Unregistered Successfully",
          description: `You have been unregistered from "${event.title}".`,
        })
      } else {
        // Register for event
        const newRegistration: RegisteredEvent = {
          id: event.id,
          title: event.title,
          price: event.price,
          thumbnail: event.thumbnail,
          category: event.category,
          registeredAt: new Date().toISOString(),
          eventDate: formatDate(event.id),
          location: getLocation(event.category),
        }

        const updatedEvents = [...registeredEvents, newRegistration]
        saveRegisteredEvents(updatedEvents)
        setIsRegistered(true)

        toast({
          title: "Registration Successful!",
          description: `You have successfully registered for "${event.title}".`,
        })
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Event Not Found</CardTitle>
            <CardDescription>{error || "The event you're looking for doesn't exist."}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={() => router.push("/events")} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
            <Button variant="outline" onClick={fetchEventDetail} className="w-full bg-transparent">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const allImages = event.images && event.images.length > 0 ? event.images : [event.thumbnail]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/events")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
              <img
                src={allImages[currentImageIndex] || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {event.discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-accent">{Math.round(event.discountPercentage)}% OFF</Badge>
              )}
              {isRegistered && (
                <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                  <Check className="h-3 w-3 mr-1" />
                  Registered
                </Badge>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${event.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{event.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{event.rating}</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{event.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{event.description}</p>
            </div>

            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{formatDate(event.id)}</p>
                    <p className="text-sm text-muted-foreground">{formatTime(event.id)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{getLocation(event.category)}</p>
                    <p className="text-sm text-muted-foreground">Venue details will be sent after registration</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{event.stock} spots available</p>
                    <p className="text-sm text-muted-foreground">Limited capacity event</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">2-3 hours duration</p>
                    <p className="text-sm text-muted-foreground">Including networking time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing & Registration */}
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">${event.price}</p>
                    <p className="text-sm text-muted-foreground">Per person</p>
                  </div>
                  {event.brand && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Organized by</p>
                      <p className="font-semibold">{event.brand}</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleRegister}
                  className="w-full"
                  size="lg"
                  disabled={registering || event.stock === 0}
                  variant={isRegistered ? "secondary" : "default"}
                >
                  {registering ? (
                    "Processing..."
                  ) : event.stock === 0 ? (
                    "Sold Out"
                  ) : isRegistered ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Registered - Click to Unregister
                    </>
                  ) : (
                    "Register for Event"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-2">
                  {isRegistered
                    ? "You can unregister up to 24 hours before the event"
                    : "Free cancellation up to 24 hours before the event"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function EventDetailPage() {
  return (
    <AuthGuard>
      <EventDetailContent />
    </AuthGuard>
  )
}
