'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { load, save } from '@/lib/storage'

const SUBJECTS_DEFAULT = [
  { name: 'Épidémiologie',            progress: 0,  done: 0, total: 8  },
  { name: 'Chimie analytique',         progress: 0,  done: 0, total: 12 },
  { name: 'Biochimie Rein / Os',       progress: 0,  done: 0, total: 10 },
  { name: 'Immunologie / Génétique',   progress: 0,  done: 0, total: 9  },
  { name: 'Hématologie',               progress: 0,  done: 0, total: 7  },
  { name: 'Cœur / Lipides / Diabète',  progress: 0,  done: 0, total: 11 },
  { name: 'Pharmacocinétique',         progress: 0,  done: 0, total: 8  },
  { name: 'Parasitologie / Mycologie', progress: 0,  done: 0, total: 6  },
  { name: 'Endocrinologie / Foie',     progress: 0,  done: 0, total: 9  },
  { name: 'Santé publique',            progress: 0,  done: 0, total: 6  },
  { name: 'Thérapeutique',             progress: 0,  done: 0, total: 10 },
  { name: 'Toxicologie',               progress: 0,  done: 0, total: 8  },
]

function pColor(p: number) {
  return p >= 70 ? 'bg-green-500' : p >= 40 ? 'bg-brand-600' : 'bg-red-400'
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState(SUBJECTS_DEFAULT)
  const [xp, setXp]             = useState(0)
  const [streak, setStreak]     = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSubjects(load('pharma_subjects', SUBJECTS_DEFAULT))
    setXp(load('pharma_xp', 0))
    setStreak(load('pharma_streak', 0))
    setHydrated(true)

    // Update streak
    const today = new Date().toISOString().split('T')[0]
    const lastActive = load('pharma_last_active', '')
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (lastActive !== today) {
      save('pharma_last_active', today)
      const currentStreak = load('pharma_streak', 0)
      if (lastActive === yesterday) {
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        save('pharma_streak', newStreak)
      } else if (lastActive !== today) {
        setStreak(1)
        save('pharma_streak', 1)
      }
    }
  }, [])

  const level      = Math.max(1, Math.floor(1 + Math.sqrt(xp / 100)))
  const globalPct  = subjects.length > 0 ? Math.round(subjects.reduce((a, s) => a + s.progress, 0) / subjects.length) : 0
  const totalDone  = subjects.reduce((a, s) => a + s.done, 0)
  const totalAll   = subjects.reduce((a, s) => a + s.total, 0)
  const weak       = [...subjects].sort((a, b) => a.progress - b.progress).slice(0, 3)

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
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard 👋</h1>
              <p className="text-sm text-gray-500 mt-0.5">Niveau {level} · {xp.toLocaleString('fr-FR')} XP · {streak} jour{streak > 1 ? 's' : ''} de suite 🔥</p>
            </div>
            <div className="bg-amber-50 text-amber-800 text-sm font-medium px-3 py-1.5 rounded-full">⭐ {xp.toLocaleString('fr-FR')} XP</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Progression globale', value: `${globalPct}%`, color: 'text-brand-600' },
              { label: 'Chapitres terminés',  value: `${totalDone}/${totalAll}`, color: 'text-gray-900' },
              { label: 'Niveau',              value: `${level}`,  color: 'text-amber-600' },
              { label: 'Série',               value: `${streak} j`, color: 'text-red-500' },
            ].map(m => (
              <div key={m.label} className="card p-4">
                <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                <div className={`text-2xl font-semibold ${m.color}`}>{m.value}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Progression globale</span>
              <span className="text-brand-600 font-medium">{globalPct}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${globalPct}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-gray-900">⚠️ À renforcer</h2>
                <Link href="/subjects" className="text-xs text-brand-600 hover:underline">Voir tout</Link>
              </div>
              <div className="space-y-3">
                {weak.map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-700 truncate mb-1">{s.name}</div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pColor(s.progress)}`} style={{ width: `${s.progress}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-red-500 w-8 text-right">{s.progress}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-gray-900">📅 Planning</h2>
                <Link href="/planning" className="text-xs text-brand-600 hover:underline">Voir tout</Link>
              </div>
              <div className="text-center py-6">
                <p className="text-sm text-gray-400 mb-3">Organise tes révisions</p>
                <Link href="/planning" className="btn btn-primary btn-sm mx-auto">Ouvrir le planning</Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-gray-900">📚 Toutes les matières</h2>
              <Link href="/subjects" className="btn btn-sm btn-primary">Gérer</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subjects.map(s => (
                <div key={s.name} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{s.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.done}/{s.total} chapitres</div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                      <div className={`h-full rounded-full ${pColor(s.progress)}`} style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${s.progress >= 70 ? 'text-green-600' : s.progress >= 40 ? 'text-brand-600' : 'text-red-500'}`}>
                    {s.progress}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
