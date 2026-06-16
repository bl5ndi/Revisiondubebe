'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { format, startOfWeek, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'
import { load, save } from '@/lib/storage'

const DEFAULT_TASKS = [
  { id: '1', title: 'QCM Épidémiologie (20 questions)',    date: format(new Date(), 'yyyy-MM-dd'), done: false, xp: 10, type: 'qcm'      },
  { id: '2', title: 'Flashcards Parasitologie',            date: format(new Date(), 'yyyy-MM-dd'), done: false, xp: 5,  type: 'flashcard' },
  { id: '3', title: 'Lecture Pharmacocinétique ch.3',      date: format(new Date(), 'yyyy-MM-dd'), done: false, xp: 8,  type: 'revision'  },
  { id: '4', title: 'QCM Chimie analytique',               date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), done: false, xp: 10, type: 'qcm' },
  { id: '5', title: 'Révision Hématologie — coagulation',  date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), done: false, xp: 8,  type: 'revision' },
  { id: '6', title: 'Flashcards Immunologie',              date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), done: false, xp: 5,  type: 'flashcard' },
  { id: '7', title: 'Examen blanc Épidémiologie',          date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), done: false, xp: 20, type: 'exam' },
]

const TYPE_ICONS: Record<string, string> = { qcm: '✅', flashcard: '🃏', revision: '📖', exam: '📝', other: '📌' }

export default function PlanningPage() {
  const [tasks, setTasks]         = useState(DEFAULT_TASKS)
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle]         = useState('')
  const [date, setDate]           = useState(format(new Date(), 'yyyy-MM-dd'))
  const [type, setType]           = useState('revision')
  const [hydrated, setHydrated]   = useState(false)

  useEffect(() => {
    setTasks(load('pharma_tasks', DEFAULT_TASKS))
    setHydrated(true)
  }, [])

  function updateTasks(next: typeof tasks) {
    setTasks(next)
    save('pharma_tasks', next)
  }

  function toggle(id: string) {
    updateTasks(tasks.map(x => x.id === id ? { ...x, done: !x.done } : x))
  }

  function addTask() {
    if (!title.trim()) return
    const xpMap: Record<string, number> = { revision: 8, qcm: 10, flashcard: 5, exam: 20, other: 5 }
    const newTask = { id: Date.now().toString(), title, date, done: false, xp: xpMap[type] ?? 8, type }
    updateTasks([...tasks, newTask])
    setTitle(''); setShowModal(false)
  }

  function deleteTask(id: string) {
    updateTasks(tasks.filter(x => x.id !== id))
  }

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays  = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const today     = format(new Date(), 'yyyy-MM-dd')
  const totalDone = tasks.filter(t => t.done).length

  if (!hydrated) return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Chargement...</p>
      </main>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold">Planning</h1>
              <p className="text-sm text-gray-500 mt-0.5">{totalDone}/{tasks.length} tâches complétées · sauvegardé automatiquement 💾</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">+ Ajouter une tâche</button>
          </div>

          <div className="card mb-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progression hebdomadaire</span>
              <span className="text-brand-600 font-medium">{tasks.length > 0 ? Math.round((totalDone / tasks.length) * 100) : 0}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${tasks.length > 0 ? (totalDone / tasks.length) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="space-y-4">
            {weekDays.map(day => {
              const key = format(day, 'yyyy-MM-dd')
              const dayTasks = tasks.filter(t => t.date === key)
              const isToday  = key === today
              return (
                <div key={key} className={clsx('card', isToday && 'border-brand-200 bg-brand-50/20')}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={clsx('text-sm font-medium capitalize', isToday ? 'text-brand-700' : 'text-gray-600')}>
                      {format(day, 'EEEE d MMMM', { locale: fr })}
                    </span>
                    {isToday && <span className="pill bg-brand-100 text-brand-700">Aujourd&apos;hui</span>}
                    <span className="ml-auto text-xs text-gray-400">{dayTasks.filter(t=>t.done).length}/{dayTasks.length}</span>
                  </div>
                  {dayTasks.length === 0 ? (
                    <p className="text-xs text-gray-300">Aucune tâche</p>
                  ) : (
                    <div className="space-y-2">
                      {dayTasks.map(t => (
                        <div key={t.id} className={clsx('flex items-center gap-2 p-2 rounded-lg group', t.done && 'opacity-50')}>
                          <span onClick={() => toggle(t.id)} className="cursor-pointer">{t.done ? '✅' : '⬜'}</span>
                          <span className="text-lg">{TYPE_ICONS[t.type]}</span>
                          <span onClick={() => toggle(t.id)} className={clsx('text-sm flex-1 cursor-pointer', t.done && 'line-through text-gray-400')}>{t.title}</span>
                          <span className="text-xs text-amber-500 font-medium">+{t.xp} XP</span>
                          <button onClick={() => deleteTask(t.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs transition-opacity ml-1">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Nouvelle tâche</h2>
              <div className="space-y-3">
                <div>
                  <label className="label">Titre</label>
                  <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Réviser la coagulation" autoFocus />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="input" value={type} onChange={e => setType(e.target.value)}>
                    <option value="revision">📖 Révision</option>
                    <option value="qcm">✅ QCM</option>
                    <option value="flashcard">🃏 Flashcards</option>
                    <option value="exam">📝 Examen blanc</option>
                    <option value="other">📌 Autre</option>
                  </select>
                </div>
                <div>
                  <label className="label">Date</label>
                  <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowModal(false)} className="btn flex-1 justify-center">Annuler</button>
                <button onClick={addTask} className="btn btn-primary flex-1 justify-center">Ajouter</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
