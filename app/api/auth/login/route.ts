import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'users.json')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const raw = fs.readFileSync(dataFile, 'utf-8')
    const users = JSON.parse(raw)
    const user = users.find((u: any) => u.username === username && u.password === password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const { password: _p, ...safe } = user
    return NextResponse.json({ ok: true, user: safe })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
