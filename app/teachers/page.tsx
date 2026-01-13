import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { teachers, getScheduleForTeacher, getCourseById } from "@/lib/data"
import { Users, Mail, Building, Calendar } from "lucide-react"
import Link from "next/link"

export default function TeachersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Users className="h-8 w-8" />
          Enseignants
        </h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => {
            const teacherCourses = getScheduleForTeacher(teacher.id)
            const uniqueCourses = [...new Set(teacherCourses.map((s) => getCourseById(s.courseId)?.code))]

            return (
              <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{teacher.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {teacher.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {teacher.department}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {teacherCourses.length} séance(s) - {uniqueCourses.join(", ")}
                    </div>
                  </div>
                  <Link
                    href={`/timetable/teacher/${teacher.id}`}
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
