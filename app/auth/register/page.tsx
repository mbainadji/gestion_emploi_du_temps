"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role }),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Erreur')
    // store user in localStorage and redirect
    localStorage.setItem('user', JSON.stringify(data.user))
    if (data.user.role === 'student') router.push('/dashboard/student')
    else if (data.user.role === 'teacher') router.push('/dashboard/teacher')
    else router.push('/')
  }

  return (
    <main className="container py-12">
      <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow">
        <h1 className="mb-4">Créer un compte</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reg-username" className="block text-sm">Nom d'utilisateur</label>
            <input id="reg-username" title="Nom d'utilisateur" placeholder="ex: etu2025" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 rounded border" />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm">Email</label>
            <input id="reg-email" title="Email" placeholder="votre@email.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded border" />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm">Mot de passe</label>
            <input id="reg-password" title="Mot de passe" placeholder="Choisissez un mot de passe" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded border" />
          </div>
          <div>
            <label htmlFor="reg-role" className="block text-sm">Rôle</label>
            <select id="reg-role" title="Rôle" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 rounded border">
              <option value="student">Étudiant</option>
              <option value="teacher">Enseignant</option>
            </select>
          </div>
          {error && <div className="text-destructive">{error}</div>}
          <div className="flex justify-end">
            <button className="btn btn-primary">Créer</button>
          </div>
        </form>
      </div>
    </main>
  )
}
