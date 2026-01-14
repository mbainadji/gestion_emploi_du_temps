import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'users.json')

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([], null, 2))
}

export async function POST(request: Request) {
  try {
    ensureDataFile()
    const body = await request.json()
    const { username, email, password, role } = body
    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const raw = fs.readFileSync(dataFile, 'utf-8')
    let users: any[] = []
    try { users = JSON.parse(raw) } catch (e) { users = [] }

    if (users.find((u: any) => u.username === username || u.email === email)) {
      return NextResponse.json({ error: 'User exists' }, { status: 409 })
    }

    const id = users.length ? Math.max(...users.map((u: any) => u.id)) + 1 : 1
    const newUser = { id, username, email, role, password }
    users.push(newUser)
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2))

    return NextResponse.json({ ok: true, user: { id, username, email, role } })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
