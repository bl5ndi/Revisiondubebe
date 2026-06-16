import Sidebar from '@/components/Sidebar'

const STATS = [
  { subj: 'Épidémiologie',            progress: 75, score: 78, qcm: 24, time: '4h30' },
  { subj: 'Chimie analytique',         progress: 60, score: 72, qcm: 18, time: '6h'   },
  { subj: 'Biochimie Rein / Os',       progress: 45, score: 65, qcm: 12, time: '3h20' },
  { subj: 'Immunologie / Génétique',   progress: 55, score: 70, qcm: 16, time: '4h'   },
  { subj: 'Hématologie',               progress: 30, score: 58, qcm: 8,  time: '2h'   },
  { subj: 'Cœur / Lipides / Diabète',  progress: 40, score: 63, qcm: 15, time: '3h45' },
  { subj: 'Pharmacocinétique',         progress: 50, score: 68, qcm: 10, time: '3h'   },
  { subj: 'Parasitologie / Mycologie', progress: 25, score: 55, qcm: 6,  time: '1h30' },
  { subj: 'Santé publique',            progress: 80, score: 82, qcm: 20, time: '5h'   },
  { subj: 'Thérapeutique',             progress: 42, score: 67, qcm: 11, time: '3h10' },
]

function pColor(p: number) {
  return p >= 70 ? 'bg-green-500' : p >= 40 ? 'bg-brand-600' : 'bg-red-400'
}
function sColor(s: number) {
  return s >= 75 ? 'text-green-600' : s >= 60 ? 'text-amber-600' : 'text-red-500'
}

export default function StatsPage() {
  const totalQCM = STATS.reduce((a, s) => a + s.qcm, 0)
  const avgScore = Math.round(STATS.reduce((a, s) => a + s.score, 0) / STATS.length)
  const avgProg  = Math.round(STATS.reduce((a, s) => a + s.progress, 0) / STATS.length)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-xl font-semibold">Statistiques</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Progression moy.',  value: `${avgProg}%`,  icon: '📊', color: 'text-brand-600' },
              { label: 'Score moyen QCM',   value: `${avgScore}%`, icon: '✅', color: sColor(avgScore) },
              { label: 'QCM réalisés',      value: totalQCM,       icon: '🎯', color: 'text-gray-900'  },
              { label: 'XP total',          value: '1 240',        icon: '⭐', color: 'text-amber-600' },
            ].map(m => (
              <div key={m.label} className="card p-4 text-center">
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className={`text-2xl font-semibold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-gray-400 mt-1">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="font-medium text-gray-900 mb-4">Progression par matière</h2>
            <div className="space-y-3">
              {STATS.sort((a, b) => b.progress - a.progress).map(s => (
                <div key={s.subj} className="flex items-center gap-4">
                  <div className="w-40 text-xs font-medium text-gray-700 truncate flex-shrink-0">{s.subj}</div>
                  <div className="flex-1">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pColor(s.progress)}`} style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                  <div className="w-10 text-right text-xs font-medium text-gray-700">{s.progress}%</div>
                  <div className={`w-10 text-right text-xs font-medium ${sColor(s.score)}`}>{s.score}%</div>
                  <div className="w-12 text-right text-xs text-gray-400">{s.qcm} QCM</div>
                  <div className="w-12 text-right text-xs text-gray-400">{s.time}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-8 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
              <span>Progression</span><span>Score QCM</span><span>Nb QCM</span><span>Temps</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
