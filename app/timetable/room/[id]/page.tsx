import { Header } from "@/components/header"
import { TimetableGrid } from "@/components/timetable-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { rooms, getScheduleForRoom } from "@/lib/data"
import { Building2 } from "lucide-react"
import { notFound } from "next/navigation"

export default async function RoomTimetablePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const roomId = Number.parseInt(id)
  const room = rooms.find((r) => r.id === roomId)

  if (!room) {
    notFound()
  }

  const roomSchedule = getScheduleForRoom(roomId)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Emploi du temps - Salle {room.name}
            </CardTitle>
            <p className="text-muted-foreground">
              {room.type} | Capacité: {room.capacity} places
            </p>
          </CardHeader>
          <CardContent>
            <TimetableGrid filteredEntries={roomSchedule} showRoom={false} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
