'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { load, save } from '@/lib/storage'

const SUBJECTS_DEFAULT = [
  { name: 'Épidémiologie',            icon: '📊', done: 0, total: 8  },
  { name: 'Chimie analytique',         icon: '🧪', done: 0, total: 12 },
  { name: 'Biochimie Rein / Os',       icon: '🔬', done: 0, total: 10 },
  { name: 'Immunologie / Génétique',   icon: '🧬', done: 0, total: 9  },
  { name: 'Hématologie',               icon: '🩸', done: 0, total: 7  },
  { name: 'Cœur / Lipides / Diabète',  icon: '❤️', done: 0, total: 11 },
  { name: 'Pharmacocinétique',         icon: '📈', done: 0, total: 8  },
  { name: 'Parasitologie / Mycologie', icon: '🦠', done: 0, total: 6  },
  { name: 'Endocrinologie / Foie',     icon: '🫀', done: 0, total: 9  },
  { name: 'Santé publique',            icon: '🌍', done: 0, total: 6  },
  { name: 'Thérapeutique',             icon: '💊', done: 0, total: 10 },
  { name: 'Toxicologie',               icon: '⚠️', done: 0, total: 8  },
]

function pColor(p: number) {
  return p >= 70 ? 'bg-green-500' : p >= 40 ? 'bg-brand-600' : 'bg-red-400'
}
function tColor(p: number) {
  return p >= 70 ? 'text-green-600' : p >= 40 ? 'text-brand-600' : 'text-red-500'
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(SUBJECTS_DEFAULT)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSubjects(load('pharma_subjects', SUBJECTS_DEFAULT))
    setHydrated(true)
  }, [])

  function increment(idx: number) {
    const updated = subjects.map((s, i) => {
      if (i !== idx) return s
      const newDone = Math.min(s.done + 1, s.total)
      return { ...s, done: newDone }
    })
    setSubjects(updated)
    save('pharma_subjects', updated)
    // Update XP
    const xp = load('pharma_xp', 0) + 10
    save('pharma_xp', xp)
  }

  function decrement(idx: number) {
    const updated = subjects.map((s, i) => {
      if (i !== idx) return s
      const newDone = Math.max(s.done - 1, 0)
      return { ...s, done: newDone }
    })
    setSubjects(updated)
    save('pharma_subjects', updated)
  }

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
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold">Matières</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {subjects.reduce((a,s)=>a+s.done,0)}/{subjects.reduce((a,s)=>a+s.total,0)} chapitres terminés · sauvegardé automatiquement 💾
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s, idx) => {
              const pct = Math.round((s.done / s.total) * 100)
              return (
                <div key={s.name} className="card hover:border-gray-300 transition-colors">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-xl flex-shrink-0">{s.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{s.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.done}/{s.total} chapitres</div>
                    </div>
                    <span className={`text-sm font-medium flex-shrink-0 ${tColor(pct)}`}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div className={`h-full rounded-full transition-all ${pColor(pct)}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button onClick={() => decrement(idx)} className="btn btn-sm" disabled={s.done === 0}>−</button>
                      <button onClick={() => increment(idx)} className="btn btn-sm btn-primary" disabled={s.done === s.total}>+ Chapitre ✓</button>
                    </div>
                    <div className="flex gap-1">
                      <Link href="/qcm" className="btn btn-sm">QCM</Link>
                      <Link href="/flashcards" className="btn btn-sm">🃏</Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
