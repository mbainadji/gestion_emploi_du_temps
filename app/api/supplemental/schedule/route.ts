import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'supplemental_schedule.json')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dayOfWeek, timeSlotId, courseId, teacherId, roomId, groupName } = body
    if (!dayOfWeek || !timeSlotId || !courseId || !teacherId || !roomId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const raw = fs.readFileSync(filePath, 'utf-8')
    const items = JSON.parse(raw)
    const id = items.length ? Math.max(...items.map((i: any) => i.id)) + 1 : 1000
    const entry = { id, dayOfWeek, timeSlotId, courseId, teacherId, roomId, groupName }
    items.push(entry)
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2))
    return NextResponse.json({ ok: true, entry })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
