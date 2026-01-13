import { Header } from "@/components/header"
import { TimetableGrid } from "@/components/timetable-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { teachers, getScheduleForTeacher } from "@/lib/data"
import { User } from "lucide-react"
import { notFound } from "next/navigation"

export default async function TeacherTimetablePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const teacherId = Number.parseInt(id)
  const teacher = teachers.find((t) => t.id === teacherId)

  if (!teacher) {
    notFound()
  }

  const teacherSchedule = getScheduleForTeacher(teacherId)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Emploi du temps - {teacher.name}
            </CardTitle>
            <p className="text-muted-foreground">
              {teacher.department} | {teacher.email}
            </p>
          </CardHeader>
          <CardContent>
            <TimetableGrid filteredEntries={teacherSchedule} showTeacher={false} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
