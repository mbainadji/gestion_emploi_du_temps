"use client"

import Link from 'next/link'

export default function StudentDashboard() {
  return (
    <main className="container py-12">
      <div className="max-w-3xl mx-auto bg-card p-6 rounded-lg shadow">
        <h1>Tableau de bord étudiant</h1>
        <p className="mb-4">Accès rapide:</p>
        <ul className="space-y-2">
          <li><Link href="/timetable" className="text-primary">Voir l'emploi du temps</Link></li>
          <li><Link href="/rooms" className="text-primary">Voir les salles</Link></li>
          <li><Link href="/courses" className="text-primary">Voir les cours</Link></li>
          <li><Link href="/teachers" className="text-primary">Voir les enseignants</Link></li>
        </ul>
      </div>
    </main>
  )
}
