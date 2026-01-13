// Types
export interface TimeSlot {
  id: number
  label: string
  startTime: string
  endTime: string
}

export interface Teacher {
  id: number
  name: string
  email: string
  department: string
}

export interface Course {
  id: number
  code: string
  name: string
  credits: number
  courseType: "CM" | "TD" | "TP"
}

export interface Room {
  id: number
  name: string
  capacity: number
  type: string
}

export interface ScheduleEntry {
  id: number
  dayOfWeek: number
  timeSlotId: number
  courseId: number
  teacherId: number
  roomId: number
  groupName: string
}

export interface Class {
  id: number
  name: string
  programName: string
  level: string
}

// Data
export const timeSlots: TimeSlot[] = [
  { id: 1, label: "8h00-11h00", startTime: "08:00", endTime: "11:00" },
  { id: 2, label: "11h30-14h30", startTime: "11:30", endTime: "14:30" },
  { id: 3, label: "15h00-18h00", startTime: "15:00", endTime: "18:00" },
]

export const days = [
  { id: 1, name: "Lundi" },
  { id: 2, name: "Mardi" },
  { id: 3, name: "Mercredi" },
  { id: 4, name: "Jeudi" },
  { id: 5, name: "Vendredi" },
  { id: 6, name: "Samedi" },
]

export const teachers: Teacher[] = [
  { id: 1, name: "MONTHE", email: "monthe@univ-yaounde1.cm", department: "Informatique" },
  { id: 2, name: "EONE", email: "eone@univ-yaounde1.cm", department: "Informatique" },
  { id: 3, name: "KWETTE", email: "kwette@univ-yaounde1.cm", department: "Informatique" },
  { id: 4, name: "MUSIMA", email: "musima@univ-yaounde1.cm", department: "Langues" },
  { id: 5, name: "NKONDOCK", email: "nkondock@univ-yaounde1.cm", department: "Informatique" },
  { id: 6, name: "MOSSEBO", email: "mossebo@univ-yaounde1.cm", department: "Informatique" },
  { id: 7, name: "MBOUS", email: "mbous@univ-yaounde1.cm", department: "Informatique" },
  { id: 8, name: "SEVANY", email: "sevany@univ-yaounde1.cm", department: "Informatique" },
  { id: 9, name: "NKOUANDOU", email: "nkouandou@univ-yaounde1.cm", department: "Informatique" },
  { id: 10, name: "BIYONG", email: "biyong@univ-yaounde1.cm", department: "Langues" },
  { id: 11, name: "VIDEME", email: "videme@univ-yaounde1.cm", department: "Informatique" },
  { id: 12, name: "EKONO", email: "ekono@univ-yaounde1.cm", department: "Informatique" },
]

export const courses: Course[] = [
  { id: 1, code: "ICT201", name: "Programmation Web", credits: 4, courseType: "CM" },
  { id: 2, code: "ICT203", name: "Base de données", credits: 4, courseType: "CM" },
  { id: 3, code: "ICT205", name: "Réseaux Informatiques", credits: 4, courseType: "CM" },
  { id: 4, code: "ICT207", name: "Systèmes d'exploitation", credits: 4, courseType: "CM" },
  { id: 5, code: "ICT213", name: "Génie Logiciel", credits: 4, courseType: "CM" },
  { id: 6, code: "ICT215", name: "Intelligence Artificielle", credits: 4, courseType: "CM" },
  { id: 7, code: "ICT217", name: "Sécurité Informatique", credits: 4, courseType: "CM" },
  { id: 8, code: "ENG203", name: "Anglais Technique", credits: 2, courseType: "TD" },
  { id: 9, code: "FRA203", name: "Français", credits: 2, courseType: "TD" },
]

export const rooms: Room[] = [
  { id: 1, name: "S003", capacity: 100, type: "Amphithéâtre" },
  { id: 2, name: "S008", capacity: 100, type: "Amphithéâtre" },
]

export const classes: Class[] = [{ id: 1, name: "ICT4D-ICTL2", programName: "ICT4D", level: "Licence 2" }]

// Emploi du temps basé sur le document officiel
export const scheduleEntries: ScheduleEntry[] = [
  // Lundi
  { id: 1, dayOfWeek: 1, timeSlotId: 2, courseId: 4, teacherId: 1, roomId: 1, groupName: "G1" }, // ICT207-G1 MONTHE
  { id: 2, dayOfWeek: 1, timeSlotId: 3, courseId: 7, teacherId: 9, roomId: 1, groupName: "G1" }, // ICT217-G1 NKOUANDOU

  // Mardi
  { id: 3, dayOfWeek: 2, timeSlotId: 1, courseId: 4, teacherId: 1, roomId: 1, groupName: "G2" }, // ICT207-G2 MONTHE
  { id: 4, dayOfWeek: 2, timeSlotId: 2, courseId: 1, teacherId: 5, roomId: 1, groupName: "G1" }, // ICT201-G1 NKONDOCK
  { id: 5, dayOfWeek: 2, timeSlotId: 3, courseId: 8, teacherId: 4, roomId: 1, groupName: "G2" }, // ENG203-G2 MUSIMA
  { id: 6, dayOfWeek: 2, timeSlotId: 3, courseId: 9, teacherId: 10, roomId: 2, groupName: "G1" }, // FRA203-G1 BIYONG

  // Mercredi
  { id: 7, dayOfWeek: 3, timeSlotId: 1, courseId: 2, teacherId: 2, roomId: 1, groupName: "G2" }, // ICT203-G2 EONE
  { id: 8, dayOfWeek: 3, timeSlotId: 2, courseId: 5, teacherId: 6, roomId: 1, groupName: "G1" }, // ICT213-G1 MOSSEBO
  { id: 9, dayOfWeek: 3, timeSlotId: 3, courseId: 6, teacherId: 11, roomId: 1, groupName: "G1" }, // ICT215-G1 VIDEME

  // Jeudi
  { id: 10, dayOfWeek: 4, timeSlotId: 1, courseId: 3, teacherId: 3, roomId: 1, groupName: "G2" }, // ICT205-G2 KWETTE
  { id: 11, dayOfWeek: 4, timeSlotId: 2, courseId: 6, teacherId: 7, roomId: 1, groupName: "G2" }, // ICT215-G2 MBOUS
  { id: 12, dayOfWeek: 4, timeSlotId: 3, courseId: 7, teacherId: 9, roomId: 1, groupName: "G2" }, // ICT217-G2 NKOUANDOU

  // Vendredi
  { id: 13, dayOfWeek: 5, timeSlotId: 1, courseId: 3, teacherId: 3, roomId: 1, groupName: "G1" }, // ICT205-G1 KWETTE
  { id: 14, dayOfWeek: 5, timeSlotId: 2, courseId: 1, teacherId: 5, roomId: 1, groupName: "G2" }, // ICT201-G2 NKONDOCK
  { id: 15, dayOfWeek: 5, timeSlotId: 3, courseId: 5, teacherId: 12, roomId: 1, groupName: "G2" }, // ICT213-G2 EKONO

  // Samedi
  { id: 16, dayOfWeek: 6, timeSlotId: 1, courseId: 8, teacherId: 4, roomId: 1, groupName: "G1" }, // ENG203-G1 MUSIMA
  { id: 17, dayOfWeek: 6, timeSlotId: 2, courseId: 2, teacherId: 8, roomId: 1, groupName: "G1" }, // ICT203-G1 SEVANY
  { id: 18, dayOfWeek: 6, timeSlotId: 3, courseId: 9, teacherId: 10, roomId: 1, groupName: "G2" }, // FRA203-G2 BIYONG
]

// Helper functions
export function getTeacherById(id: number): Teacher | undefined {
  return teachers.find((t) => t.id === id)
}

export function getCourseById(id: number): Course | undefined {
  return courses.find((c) => c.id === id)
}

export function getRoomById(id: number): Room | undefined {
  return rooms.find((r) => r.id === id)
}

export function getTimeSlotById(id: number): TimeSlot | undefined {
  return timeSlots.find((t) => t.id === id)
}

export function getScheduleForDay(dayOfWeek: number): ScheduleEntry[] {
  return scheduleEntries.filter((e) => e.dayOfWeek === dayOfWeek)
}

export function getScheduleForTeacher(teacherId: number): ScheduleEntry[] {
  return scheduleEntries.filter((e) => e.teacherId === teacherId)
}

export function getScheduleForRoom(roomId: number): ScheduleEntry[] {
  return scheduleEntries.filter((e) => e.roomId === roomId)
}
