import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { rooms, getScheduleForRoom } from "@/lib/data"
import { Building2, Users, Calendar } from "lucide-react"
import Link from "next/link"

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Salles
        </h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const roomSchedule = getScheduleForRoom(room.id)

            return (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Salle {room.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {room.type}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Capacité: {room.capacity} places
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {roomSchedule.length} séance(s) programmée(s)
                    </div>
                  </div>
                  <Link
                    href={`/timetable/room/${room.id}`}
                    className="mt-4 inline-block text-primary hover:underline text-sm font-medium"
                  >
                    Voir emploi du temps →
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
