import { Header } from "@/components/header"
import { TimetableGrid } from "@/components/timetable-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { teachers, courses, rooms, scheduleEntries } from "@/lib/data"
import { Users, BookOpen, Building2, Calendar } from "lucide-react"

export default function HomePage() {
  const stats = [
    {
      title: "Enseignants",
      value: teachers.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Cours",
      value: courses.length,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Salles",
      value: rooms.length,
      icon: Building2,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Séances",
      value: scheduleEntries.length,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Emploi du Temps - ICT4D-ICTL2</h1>
          <p className="text-muted-foreground text-lg">Semestre 1 - Année Académique 2025-2026</p>
          <p className="text-sm text-muted-foreground mt-1">Faculté des Sciences - Département d&apos;Informatique</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Timetable */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Emploi du Temps Complet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimetableGrid />
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Salles: S003 / S008</p>
          <p className="mt-1">Document approuvé par le Doyen - Prof. Luc C. Owono Owono</p>
        </div>
      </main>
    </div>
  )
}
