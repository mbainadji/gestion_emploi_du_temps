import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'rooms_extra.json')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, capacity, type } = body
    if (!name || !capacity) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const raw = fs.readFileSync(filePath, 'utf-8')
    const items = JSON.parse(raw)
    const id = items.length ? Math.max(...items.map((i: any) => i.id)) + 1 : 100
    const room = { id, name, capacity, type }
    items.push(room)
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2))
    return NextResponse.json({ ok: true, room })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
