'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

const QUESTIONS = [
  { q: 'Quelle mesure d\'association est utilisée dans une étude cas-témoins ?', opts: ['Risque relatif', 'Odds ratio', 'Incidence cumulée', 'Prévalence'], ans: 1, exp: 'L\'odds ratio (OR) est utilisé car l\'incidence ne peut pas être directement mesurée dans une étude cas-témoins.' },
  { q: 'La sensibilité d\'un test diagnostique mesure :', opts: ['La probabilité d\'un résultat positif chez les malades', 'La probabilité d\'un résultat négatif chez les sains', 'La proportion de vrais négatifs', 'La valeur prédictive positive'], ans: 0, exp: 'Sensibilité = VP/(VP+FN). Elle reflète la capacité du test à détecter les vrais malades.' },
  { q: 'Plasmodium falciparum se distingue par :', opts: ['La présence de gamétocytes en faucille', 'Un accès bénin', 'La formation d\'hypnozoïtes', 'L\'absence de schizogonie'], ans: 0, exp: 'Les gamétocytes en faucille sont caractéristiques de P. falciparum.' },
  { q: 'La drépanocytose est due à une mutation du gène :', opts: ['HBB (chaîne β)', 'HBA1 (chaîne α)', 'G6PD', 'FVIII'], ans: 0, exp: 'Mutation Glu→Val en position 6 de la chaîne β (gène HBB). Hémoglobine S formée.' },
  { q: 'Le temps de Quick (TP) explore :', opts: ['La voie extrinsèque', 'La voie intrinsèque', 'Les plaquettes', 'La fibrinolyse'], ans: 0, exp: 'Le TP/INR explore la voie extrinsèque (facteurs VII, X, V, II, fibrinogène).' },
  { q: 'Candida albicans est :', opts: ['Une moisissure filamenteuse', 'Une levure dimorphique', 'Un basidiomycète', 'Un dermatophyte'], ans: 1, exp: 'Candida albicans est une levure dimorphique : levure à 37°C, mycélium à 25°C.' },
  { q: 'Le VGM est augmenté dans :', opts: ['La carence en fer', 'La thalassémie', 'La carence en B12', 'La polyglobulie'], ans: 2, exp: 'Macrocytose (VGM >100 fL) = carence en B12 ou folates, alcoolisme, hypothyroïdie.' },
  { q: 'Dans une étude de cohorte, on mesure en priorité :', opts: ['L\'odds ratio', 'Le risque relatif', 'La prévalence', 'Le NSN'], ans: 1, exp: 'La cohorte suit des sujets exposés vs non-exposés → permet de calculer le risque relatif.' },
  { q: 'Le traitement de 1ère intention du paludisme à P. falciparum non compliqué est :', opts: ['Chloroquine', 'Artémisinine-luméfantrine', 'Méfloquine', 'Primaquine'], ans: 1, exp: 'Les combinaisons à base d\'artémisinine (ACT) sont le traitement de référence.' },
  { q: 'L\'aspergillose invasive survient surtout chez :', opts: ['Les sujets immunocompétents', 'Les patients neutropéniques', 'Les nourrissons', 'Les femmes enceintes'], ans: 1, exp: 'L\'aspergillose invasive survient quasi-exclusivement chez les patients profondément immunodéprimés.' },
]

export default function QCMPage() {
  const [mode, setMode]       = useState<'home'|'quiz'|'results'>('home')
  const [idx, setIdx]         = useState(0)
  const [chosen, setChosen]   = useState<number|null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore]     = useState(0)
  const [wrong, setWrong]     = useState<number[]>([])

  function start() { setMode('quiz'); setIdx(0); setChosen(null); setAnswered(false); setScore(0); setWrong([]) }

  function select(i: number) {
    if (answered) return
    setChosen(i); setAnswered(true)
    if (QUESTIONS[idx].ans === i) setScore(s => s + 1)
    else setWrong(w => [...w, idx])
  }

  function next() {
    if (idx + 1 >= QUESTIONS.length) { setMode('results'); return }
    setIdx(i => i + 1); setChosen(null); setAnswered(false)
  }

  const q   = QUESTIONS[idx]
  const pct = Math.round((score / QUESTIONS.length) * 100)

  if (mode === 'results') return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6 flex items-center justify-center">
        <div className="card text-center max-w-md w-full">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4 ${pct >= 75 ? 'bg-green-50 text-green-600' : pct >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'}`}>
            {pct}%
          </div>
          <h2 className="text-lg font-semibold mb-1">Session terminée !</h2>
          <p className="text-gray-500 mb-2">{score}/{QUESTIONS.length} bonnes réponses</p>
          {wrong.length > 0 && (
            <div className="text-left mt-4 space-y-2 mb-4">
              <p className="text-xs font-medium text-red-600 mb-2">❌ Questions ratées :</p>
              {wrong.map(i => (
                <div key={i} className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-red-800 mb-1">{QUESTIONS[i].q}</p>
                  <p className="text-xs text-red-600">✓ {QUESTIONS[i].opts[QUESTIONS[i].ans]}</p>
                  <p className="text-xs text-red-500 mt-1">{QUESTIONS[i].exp}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <button onClick={() => setMode('home')} className="btn flex-1 justify-center">Retour</button>
            <button onClick={start} className="btn btn-primary flex-1 justify-center">Recommencer</button>
          </div>
        </div>
      </main>
    </div>
  )

  if (mode === 'quiz') return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-gray-500 mb-3">
            <span>Question {idx + 1}/{QUESTIONS.length}</span>
            <span className="text-green-600 font-medium">{score} correctes</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${((idx + 1) / QUESTIONS.length) * 100}%` }} />
          </div>
          <div className="card">
            <p className="text-sm font-medium text-gray-900 leading-relaxed mb-5">{q.q}</p>
            <div className="space-y-2 mb-4">
              {q.opts.map((opt, i) => (
                <div key={i} onClick={() => select(i)} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all text-sm
                  ${!answered ? 'border-gray-200 hover:border-brand-400 hover:bg-brand-50' : ''}
                  ${answered && i === q.ans ? 'bg-green-50 border-green-400 text-green-800' : ''}
                  ${answered && chosen === i && i !== q.ans ? 'bg-red-50 border-red-300 text-red-700' : ''}
                  ${answered && chosen !== i && i !== q.ans ? 'opacity-40 border-gray-100' : ''}
                `}>
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt}
                  {answered && i === q.ans && <span className="ml-auto">✓</span>}
                  {answered && chosen === i && i !== q.ans && <span className="ml-auto">✗</span>}
                </div>
              ))}
            </div>
            {answered && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800 leading-relaxed">{q.exp}</p>
              </div>
            )}
            <button onClick={answered ? next : () => select(-1)} className="btn btn-primary w-full justify-center">
              {idx + 1 >= QUESTIONS.length ? 'Voir les résultats' : 'Question suivante'} →
            </button>
          </div>
        </div>
      </main>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold">QCM</h1>
              <p className="text-sm text-gray-500 mt-0.5">{QUESTIONS.length} questions disponibles</p>
            </div>
            <button onClick={start} className="btn btn-primary">▶ Lancer le quiz</button>
          </div>
          <div className="space-y-2">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="card p-4 flex gap-3">
                <span className="text-xs text-gray-400 w-5 flex-shrink-0 mt-0.5">{i + 1}.</span>
                <p className="text-sm text-gray-800">{q.q}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
