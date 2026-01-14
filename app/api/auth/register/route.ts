import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Optional MySQL support: if MYSQL_* env vars are set, attempt to insert into DB.
const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'users.json')

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([], null, 2))
}

async function tryInsertToMySQL(user: { username: string; email: string; password: string; role: string }) {
  const host = process.env.MYSQL_HOST || ''
  const userDb = process.env.MYSQL_USER || ''
  const pass = process.env.MYSQL_PASSWORD || ''
  const database = process.env.MYSQL_DATABASE || ''
  const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : undefined
  if (!host || !userDb || !database) return null
  try {
    // require lazily so project works without mysql2 installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mysql = require('mysql2/promise')
    const conn = await mysql.createConnection({ host, user: userDb, password: pass, database, port })
    // create simple app_users table if not exists
    await conn.execute(`CREATE TABLE IF NOT EXISTS app_users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`)
    const [rows]: any = await conn.execute('SELECT id FROM app_users WHERE username = ? OR email = ?', [user.username, user.email])
    if (Array.isArray(rows) && rows.length) { await conn.end(); return { exists: true } }
    const [res]: any = await conn.execute('INSERT INTO app_users (username,email,password,role) VALUES (?,?,?,?)', [user.username, user.email, user.password, user.role])
    await conn.end()
    return { id: res.insertId }
  } catch (e) {
    console.error('MySQL insert error', e)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password, role } = body
    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // If MySQL configured, try to store in DB
    const mysqlResult = await tryInsertToMySQL({ username, email, password, role })
    if (mysqlResult && mysqlResult.exists) {
      return NextResponse.json({ error: 'User exists' }, { status: 409 })
    }
    if (mysqlResult && mysqlResult.id) {
      return NextResponse.json({ ok: true, user: { id: mysqlResult.id, username, email, role } })
    }

    // Fall back to JSON storage
    ensureDataFile()
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
