import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'users.json')

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([], null, 2))
}

async function tryLoginMySQL(username: string, password: string) {
  const host = process.env.MYSQL_HOST || ''
  const userDb = process.env.MYSQL_USER || ''
  const pass = process.env.MYSQL_PASSWORD || ''
  const database = process.env.MYSQL_DATABASE || ''
  const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : undefined
  if (!host || !userDb || !database) return null
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mysql = require('mysql2/promise')
    const conn = await mysql.createConnection({ host, user: userDb, password: pass, database, port })
    // try app_users first
    const [rows]: any = await conn.execute('SELECT id, username, email, role FROM app_users WHERE username = ? AND password = ?', [username, password])
    await conn.end()
    if (Array.isArray(rows) && rows.length) return rows[0]
    return null
  } catch (e) {
    console.error('MySQL login error', e)
    return null
  }
}

export async function POST(request: Request) {
  try {
    ensureDataFile()
    const body = await request.json()
    const { username, password } = body
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // If ALLOW_ANY_LOGIN is set, accept any credentials and persist the user
    const allowAny = process.env.ALLOW_ANY_LOGIN === 'true'
    if (allowAny) {
      // Try MySQL first
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mysql = require('mysql2/promise')
        const host = process.env.MYSQL_HOST || ''
        const userDb = process.env.MYSQL_USER || ''
        const pass = process.env.MYSQL_PASSWORD || ''
        const database = process.env.MYSQL_DATABASE || ''
        const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : undefined
        if (host && userDb && database) {
          const conn = await mysql.createConnection({ host, user: userDb, password: pass, database, port })
          await conn.execute(`CREATE TABLE IF NOT EXISTS app_users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) DEFAULT NULL,
            password VARCHAR(255) DEFAULT NULL,
            role VARCHAR(50) DEFAULT 'student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`)
          const [rows]: any = await conn.execute('SELECT id, username, email, role FROM app_users WHERE username = ?', [username])
          if (Array.isArray(rows) && rows.length) { await conn.end(); return NextResponse.json({ ok: true, user: rows[0] }) }
          const [res]: any = await conn.execute('INSERT INTO app_users (username,password,role) VALUES (?,?,?)', [username, password, 'student'])
          const newUser = { id: res.insertId, username, email: null, role: 'student' }
          await conn.end()
          return NextResponse.json({ ok: true, user: newUser })
        }
      } catch (e) {
        console.error('ALLOW_ANY_LOGIN MySQL path error', e)
        // fall through to JSON fallback
      }

      // JSON fallback: create/find user in data/users.json without password check
      try {
        ensureDataFile()
        const raw = fs.readFileSync(dataFile, 'utf-8')
        let users: any[] = []
        try { users = JSON.parse(raw) } catch (e) { users = [] }
        let user = users.find((u: any) => u.username === username)
        if (!user) {
          const id = users.length ? Math.max(...users.map((u: any) => u.id)) + 1 : 1
          user = { id, username, email: null, role: 'student', password }
          users.push(user)
          fs.writeFileSync(dataFile, JSON.stringify(users, null, 2))
        }
        const { password: _p, ...safe } = user
        return NextResponse.json({ ok: true, user: safe })
      } catch (e) {
        console.error('ALLOW_ANY_LOGIN JSON path error', e)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
      }
    }

    // Try MySQL if configured
    const dbUser = await tryLoginMySQL(username, password)
    if (dbUser) {
      return NextResponse.json({ ok: true, user: dbUser })
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
