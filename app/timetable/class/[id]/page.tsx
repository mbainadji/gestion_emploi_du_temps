import { Header } from "@/components/header"
import { TimetableGrid } from "@/components/timetable-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { classes, scheduleEntries } from "@/lib/data"
import { GraduationCap } from "lucide-react"
import { notFound } from "next/navigation"

export default async function ClassTimetablePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const classId = Number.parseInt(id)
  const classData = classes.find((c) => c.id === classId)

  if (!classData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Emploi du temps - {classData.name}
            </CardTitle>
            <p className="text-muted-foreground">
              {classData.programName} - {classData.level} | Semestre 1, 2025-2026
            </p>
          </CardHeader>
          <CardContent>
            <TimetableGrid filteredEntries={scheduleEntries} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
