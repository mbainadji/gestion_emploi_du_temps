import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'users.json')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password, role } = body
    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const raw = fs.readFileSync(dataFile, 'utf-8')
    const users = JSON.parse(raw)
    if (users.find((u: any) => u.username === username || u.email === email)) {
      return NextResponse.json({ error: 'User exists' }, { status: 409 })
    }

    const id = users.length ? Math.max(...users.map((u: any) => u.id)) + 1 : 1
    const newUser = { id, username, email, role, password }
    users.push(newUser)
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2))

    return NextResponse.json({ ok: true, user: { id, username, email, role } })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
