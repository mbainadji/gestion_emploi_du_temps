import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { courses, scheduleEntries, getTeacherById } from "@/lib/data"
import { BookOpen, GraduationCap, Users } from "lucide-react"

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Cours
        </h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const courseSchedules = scheduleEntries.filter((s) => s.courseId === course.id)
            const teacherIds = [...new Set(courseSchedules.map((s) => s.teacherId))]
            const teacherNames = teacherIds.map((id) => getTeacherById(id)?.name).filter(Boolean)

            return (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{course.code}</CardTitle>
                    <Badge variant="secondary">{course.courseType}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-3">{course.name}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      {course.credits} crédits
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {teacherNames.length > 0 ? teacherNames.join(", ") : "Non assigné"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
