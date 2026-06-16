import Sidebar from '@/components/Sidebar'

const EARNED = [
  { icon: '🎓', name: 'Premier pas',     desc: 'Premier chapitre terminé', xp: 50  },
  { icon: '🔥', name: '5 jours de suite', desc: 'Réviser 5 jours consécutifs', xp: 75 },
  { icon: '📊', name: 'Première série',  desc: '10 QCM réalisés', xp: 50          },
  { icon: '⚡', name: 'Mille points',    desc: 'Atteindre 1 000 XP', xp: 100     },
  { icon: '🌐', name: 'Expert santé pub', desc: 'Progression > 75% en Santé publique', xp: 200 },
]

const LOCKED = [
  { icon: '🌟', name: '7 jours de suite', desc: 'Réviser 7 jours consécutifs', xp: 150  },
  { icon: '💪', name: '30 jours de suite', desc: 'Réviser 30 jours consécutifs', xp: 500 },
  { icon: '🧬', name: 'Expert immuno',    desc: 'Progression > 75% en Immunologie', xp: 200 },
  { icon: '🏆', name: '100 QCM',          desc: '100 QCM réalisés', xp: 300            },
  { icon: '📚', name: 'Polyvalent',       desc: 'Toutes matières > 50%', xp: 200        },
  { icon: '🎯', name: 'Quasi parfait',    desc: 'Score > 90% à un QCM', xp: 100         },
  { icon: '👑', name: 'Expert',           desc: 'Atteindre 5 000 XP', xp: 300           },
  { icon: '🏅', name: 'Examen parfait',   desc: '100% à un examen blanc', xp: 500       },
]

const XP_HISTORY = [
  { reason: 'QCM Épidémiologie — 8/10',       xp: 16, date: 'Aujourd\'hui' },
  { reason: 'Flashcards Parasitologie × 10',  xp: 10, date: 'Aujourd\'hui' },
  { reason: 'Série 5 jours',                  xp: 20, date: 'Hier'         },
  { reason: 'Chapitre terminé — Hématologie', xp: 10, date: 'Hier'         },
  { reason: 'Examen blanc Santé publique',     xp: 20, date: '13 juin'      },
  { reason: 'Badge débloqué : Mille points',  xp: 100, date: '12 juin'     },
]

const xp    = 1240
const level = Math.max(1, Math.floor(1 + Math.sqrt(xp / 100)))
const nextXP = Math.pow(level, 2) * 100
const prevXP = Math.pow(level - 1, 2) * 100
const pct    = Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100)

const LEVEL_TITLES: Record<number, string> = {
  1: 'Étudiant', 2: 'Apprenti', 3: 'Stagiaire', 4: 'Interne junior',
  5: 'Interne', 6: 'Interne senior', 7: 'Résident', 8: 'Chef de clinique',
  9: 'Spécialiste', 10: 'Expert',
}

export default function BadgesPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-xl font-semibold">Badges & XP</h1>

          {/* Level card */}
          <div className="card flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-3xl font-bold text-brand-600 flex-shrink-0">
              {level}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{LEVEL_TITLES[level] ?? 'Expert'}</div>
              <div className="text-sm text-gray-500">Niveau {level} → {level + 1}</div>
              <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden w-48">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-1">{xp - prevXP} / {nextXP - prevXP} XP</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-semibold">⭐ {xp.toLocaleString('fr-FR')}</div>
              <div className="text-sm text-gray-400">XP total</div>
              <div className="text-red-400 font-medium mt-1">🔥 5 jours de suite</div>
            </div>
          </div>

          {/* Earned */}
          <div>
            <h2 className="font-medium text-gray-900 mb-3">🏅 Badges obtenus ({EARNED.length})</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {EARNED.map(b => (
                <div key={b.name} className="card p-4 text-center bg-brand-50 border-brand-100">
                  <div className="text-3xl mb-2">{b.icon}</div>
                  <div className="text-xs font-medium text-gray-800">{b.name}</div>
                  <div className="text-[10px] text-gray-500 mt-1">{b.desc}</div>
                  <div className="text-xs text-amber-600 font-medium mt-1">+{b.xp} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* Locked */}
          <div>
            <h2 className="font-medium text-gray-900 mb-3">🔒 À débloquer ({LOCKED.length})</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {LOCKED.map(b => (
                <div key={b.name} className="card p-4 text-center opacity-40">
                  <div className="text-3xl mb-2 grayscale">{b.icon}</div>
                  <div className="text-xs font-medium text-gray-500">{b.name}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{b.desc}</div>
                  <div className="text-xs text-gray-400 mt-1">+{b.xp} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* XP History */}
          <div className="card">
            <h2 className="font-medium text-gray-900 mb-4">Historique XP récent</h2>
            <div className="space-y-2">
              {XP_HISTORY.map((e, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <span className="text-sm text-gray-700">{e.reason}</span>
                    <span className="text-xs text-gray-400 ml-2">{e.date}</span>
                  </div>
                  <span className="pill bg-amber-50 text-amber-700">+{e.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
