import {
  days,
  timeSlots,
  scheduleEntries,
  getTeacherById,
  getCourseById,
  getRoomById,
  type ScheduleEntry,
} from "@/lib/data"
import { cn } from "@/lib/utils"

interface TimetableGridProps {
  filteredEntries?: ScheduleEntry[]
  showRoom?: boolean
  showTeacher?: boolean
  title?: string
}

export function TimetableGrid({
  filteredEntries = scheduleEntries,
  showRoom = true,
  showTeacher = true,
  title,
}: TimetableGridProps) {
  const getEntryForCell = (dayId: number, timeSlotId: number) => {
    return filteredEntries.filter((e) => e.dayOfWeek === dayId && e.timeSlotId === timeSlotId)
  }

  return (
    <div className="w-full overflow-x-auto">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <table className="w-full border-collapse border border-border min-w-[800px]">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="border border-border p-3 text-left font-semibold w-28">Horaire</th>
            {days.map((day) => (
              <th key={day.id} className="border border-border p-3 text-center font-semibold">
                {day.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => (
            <tr key={slot.id} className="hover:bg-muted/50">
              <td className="border border-border p-3 font-medium bg-muted/30">{slot.label}</td>
              {days.map((day) => {
                const entries = getEntryForCell(day.id, slot.id)
                return (
                  <td
                    key={day.id}
                    className={cn(
                      "border border-border p-2 text-center align-top min-h-[100px]",
                      entries.length > 0 ? "bg-accent/20" : "",
                    )}
                  >
                    {entries.map((entry) => {
                      const course = getCourseById(entry.courseId)
                      const teacher = getTeacherById(entry.teacherId)
                      const room = getRoomById(entry.roomId)
                      return (
                        <div
                          key={entry.id}
                          className="p-2 rounded-md bg-primary/10 border border-primary/20 mb-1 last:mb-0"
                        >
                          <div className="font-semibold text-primary">
                            {course?.code}-{entry.groupName}
                          </div>
                          {showTeacher && teacher && (
                            <div className="text-sm text-muted-foreground">{teacher.name}</div>
                          )}
                          {showRoom && room && <div className="text-xs text-muted-foreground">{room.name}</div>}
                        </div>
                      )
                    })}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
