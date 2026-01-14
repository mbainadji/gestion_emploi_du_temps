"use client"

import { useState } from 'react'

export default function TeacherDashboard() {
  const [dayOfWeek, setDayOfWeek] = useState(1)
  const [timeSlotId, setTimeSlotId] = useState(1)
  const [courseId, setCourseId] = useState(1)
  const [teacherId, setTeacherId] = useState(1)
  const [roomId, setRoomId] = useState(1)
  const [groupName, setGroupName] = useState('G1')
  const [message, setMessage] = useState('')

  async function addSchedule(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    const res = await fetch('/api/supplemental/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayOfWeek, timeSlotId, courseId, teacherId, roomId, groupName }),
    })
    const data = await res.json()
    if (!res.ok) return setMessage(data.error || 'Erreur')
    setMessage('Créneau ajouté')
  }

  async function addRoom(e: React.FormEvent) {
    e.preventDefault()
    const name = (document.getElementById('room-name') as HTMLInputElement).value
    const capacity = Number((document.getElementById('room-cap') as HTMLInputElement).value)
    const type = (document.getElementById('room-type') as HTMLInputElement).value
    const res = await fetch('/api/supplemental/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, capacity, type }),
    })
    const data = await res.json()
    if (!res.ok) return setMessage(data.error || 'Erreur')
    setMessage('Salle ajoutée')
  }

  return (
    <main className="container py-12">
      <div className="max-w-3xl mx-auto bg-card p-6 rounded-lg shadow space-y-6">
        <h1>Tableau de bord enseignant</h1>

        <section>
          <h2 className="mb-2">Programmer un créneau / rattrapage</h2>
          <form onSubmit={addSchedule} className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sch-day" className="sr-only">Jour</label>
              <select id="sch-day" title="Jour" value={dayOfWeek} onChange={e => setDayOfWeek(Number(e.target.value))} className="w-full px-3 py-2 rounded border">
                <option value={1}>Lundi</option>
                <option value={2}>Mardi</option>
                <option value={3}>Mercredi</option>
                <option value={4}>Jeudi</option>
                <option value={5}>Vendredi</option>
                <option value={6}>Samedi</option>
              </select>
            </div>
            <div>
              <label htmlFor="sch-timeslot" className="sr-only">Créneau</label>
              <input id="sch-timeslot" title="ID du créneau" placeholder="ID créneau" type="number" value={timeSlotId} onChange={e => setTimeSlotId(Number(e.target.value))} min={1} className="w-full px-3 py-2 rounded border" />
            </div>
            <div>
              <label htmlFor="sch-course" className="sr-only">Cours</label>
              <input id="sch-course" title="ID du cours" placeholder="ID cours" type="number" value={courseId} onChange={e => setCourseId(Number(e.target.value))} min={1} className="w-full px-3 py-2 rounded border" />
            </div>
            <div>
              <label htmlFor="sch-teacher" className="sr-only">Enseignant</label>
              <input id="sch-teacher" title="ID enseignant" placeholder="ID enseignant" type="number" value={teacherId} onChange={e => setTeacherId(Number(e.target.value))} min={1} className="w-full px-3 py-2 rounded border" />
            </div>
            <div>
              <label htmlFor="sch-room" className="sr-only">Salle</label>
              <input id="sch-room" title="ID salle" placeholder="ID salle" type="number" value={roomId} onChange={e => setRoomId(Number(e.target.value))} min={1} className="w-full px-3 py-2 rounded border" />
            </div>
            <div>
              <label htmlFor="sch-group" className="sr-only">Groupe</label>
              <input id="sch-group" title="Nom du groupe" placeholder="G1" value={groupName} onChange={e => setGroupName(e.target.value)} className="w-full px-3 py-2 rounded border" />
            </div>
            <div className="col-span-2 flex justify-end">
              <button className="btn btn-primary">Ajouter créneau</button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="mb-2">Ajouter une salle</h2>
          <form onSubmit={addRoom} className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="room-name" className="sr-only">Nom de la salle</label>
              <input id="room-name" title="Nom de la salle" placeholder="Nom (ex: S015)" required className="w-full px-3 py-2 rounded border" />
            </div>
            <div>
              <label htmlFor="room-cap" className="sr-only">Capacité</label>
              <input id="room-cap" title="Capacité" placeholder="Capacité" required type="number" className="w-full px-3 py-2 rounded border" />
            </div>
            <div>
              <label htmlFor="room-type" className="sr-only">Type de salle</label>
              <input id="room-type" title="Type de salle" placeholder="Type (ex: TP/Amphi)" className="w-full px-3 py-2 rounded border" />
            </div>
            <div className="col-span-2 flex justify-end">
              <button className="btn">Ajouter salle</button>
            </div>
          </form>
        </section>

        {message && <div className="text-primary">{message}</div>}
      </div>
    </main>
  )
}
