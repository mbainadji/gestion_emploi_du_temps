import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { teachers, rooms, classes } from "@/lib/data"
import Link from "next/link"
import { Users, Building2, GraduationCap } from "lucide-react"

export default function TimetablePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Consulter les Emplois du Temps</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Par Classe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Par Classe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {classes.map((cls) => (
                  <Link
                    key={cls.id}
                    href={`/timetable/class/${cls.id}`}
                    className="block p-3 rounded-md border hover:bg-accent transition-colors"
                  >
                    <div className="font-medium">{cls.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {cls.programName} - {cls.level}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Par Enseignant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Par Enseignant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {teachers.map((teacher) => (
                  <Link
                    key={teacher.id}
                    href={`/timetable/teacher/${teacher.id}`}
                    className="block p-3 rounded-md border hover:bg-accent transition-colors"
                  >
                    <div className="font-medium">{teacher.name}</div>
                    <div className="text-sm text-muted-foreground">{teacher.department}</div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Par Salle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Par Salle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rooms.map((room) => (
                  <Link
                    key={room.id}
                    href={`/timetable/room/${room.id}`}
                    className="block p-3 rounded-md border hover:bg-accent transition-colors"
                  >
                    <div className="font-medium">{room.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {room.type} - {room.capacity} places
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
