"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Erreur')
    localStorage.setItem('user', JSON.stringify(data.user))
    if (data.user.role === 'student') router.push('/dashboard/student')
    else if (data.user.role === 'teacher') router.push('/dashboard/teacher')
    else router.push('/')
  }

  return (
    <main className="container py-12">
      <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow">
        <h1 className="mb-4">Connexion</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-username" className="block text-sm">Nom d'utilisateur</label>
            <input id="login-username" title="Nom d'utilisateur" placeholder="ex: mdupont" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 rounded border" />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm">Mot de passe</label>
            <input id="login-password" title="Mot de passe" placeholder="Votre mot de passe" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded border" />
          </div>
          {error && <div className="text-destructive">{error}</div>}
          <div className="flex justify-end">
            <button className="btn btn-primary">Se connecter</button>
          </div>
        </form>
      </div>
    </main>
  )
}
