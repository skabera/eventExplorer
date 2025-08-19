"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, MapPin, Trash2, Eye, User, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

function ProfileContent() {
  const [registeredEvents, setRegisteredEvents] = useState<RegisteredEvent[]>([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadRegisteredEvents()
    }
  }, [user])

  const loadRegisteredEvents = () => {
    if (!user) return

    try {
      const userRegistrations = localStorage.getItem(`registrations_${user.id}`)
      const events = userRegistrations ? JSON.parse(userRegistrations) : []

      // Sort events by registration date (newest first)
      const sortedEvents = events.sort(
        (a: RegisteredEvent, b: RegisteredEvent) =>
          new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime(),
      )

      setRegisteredEvents(sortedEvents)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your registered events.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUnregister = (eventId: number, eventTitle: string) => {
    if (!user) return

    try {
      const updatedEvents = registeredEvents.filter((event) => event.id !== eventId)
      localStorage.setItem(`registrations_${user.id}`, JSON.stringify(updatedEvents))
      setRegisteredEvents(updatedEvents)

      toast({
        title: "Unregistered Successfully",
        description: `You have been unregistered from "${eventTitle}".`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unregister from the event.",
        variant: "destructive",
      })
    }
  }

  const handleViewEvent = (eventId: number) => {
    router.push(`/events/${eventId}`)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const formatRegistrationDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalSpent = () => {
    return registeredEvents.reduce((total, event) => total + event.price, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
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
            <Button variant="ghost" onClick={() => router.push("/events")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* User Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user?.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{registeredEvents.length}</p>
                <p className="text-sm text-muted-foreground">Events Registered</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">${getTotalSpent()}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {new Set(registeredEvents.map((e) => e.category)).size}
                </p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registered Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Registered Events</h2>
            {registeredEvents.length > 0 && (
              <Badge variant="secondary">
                {registeredEvents.length} event{registeredEvents.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {registeredEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Events Registered</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't registered for any events yet. Explore our events and find something interesting!
                </p>
                <Button onClick={() => router.push("/events")}>Browse Events</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {registeredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Event Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={event.thumbnail || "/placeholder.svg"}
                          alt={event.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Event Details */}
                      <div className="flex-grow space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                            <Badge variant="outline" className="mt-1">
                              {event.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">${event.price}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {event.eventDate}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <p className="text-xs text-muted-foreground">
                            Registered on {formatRegistrationDate(event.registeredAt)}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewEvent(event.id)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnregister(event.id, event.title)}
                              className="flex items-center gap-1 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                              Unregister
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
}
