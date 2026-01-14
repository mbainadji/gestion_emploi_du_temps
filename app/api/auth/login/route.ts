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
    const { username, password } = body
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const raw = fs.readFileSync(dataFile, 'utf-8')
    let users: any[] = []
    try { users = JSON.parse(raw) } catch (e) { users = [] }

    const user = users.find((u: any) => u.username === username && u.password === password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const { password: _p, ...safe } = user
    return NextResponse.json({ ok: true, user: safe })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
