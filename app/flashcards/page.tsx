'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

const CARDS = [
  { front: 'Définition d\'un biais de confusion', back: 'Variable liée à la fois à l\'exposition ET à la maladie. Elle fausse l\'association mesurée. Ex : l\'âge dans une étude tabac/cancer.', subj: 'Épidémiologie' },
  { front: 'Formule de la sensibilité', back: 'Se = VP / (VP + FN). Proportion de vrais malades correctement détectés par le test.', subj: 'Épidémiologie' },
  { front: 'Cycle du Plasmodium — phase hépatique', back: 'Sporozoïtes → foie → schizogonie hépatique → mérozoïtes → invasion des GR. P. vivax/ovale forment des hypnozoïtes dormants.', subj: 'Parasitologie' },
  { front: 'Traitement paludisme P. falciparum', back: 'ACT (Artémisinine-Combination Therapy) = artémisinine-luméfantrine (Riamet) en 1ère intention pour les formes non compliquées.', subj: 'Parasitologie' },
  { front: 'Classification des anémies selon le VGM', back: 'Microcytaire (<80) : carence fer, thalassémie. Normocytaire (80-100) : hémorragie, hémolyse. Macrocytaire (>100) : carences B12/folates.', subj: 'Hématologie' },
  { front: 'Définition de la CIVD', back: 'Coagulation intravasculaire disséminée = activation systémique de la coagulation → thromboses microcirculatoires + consommation des facteurs → hémorragies. Urgence vitale.', subj: 'Hématologie' },
  { front: 'Équation de Henderson-Hasselbalch', back: 'pH = pKa + log([A-]/[AH]). Utilisée pour calculer le pH d\'un tampon à partir des concentrations des formes acide/base.', subj: 'Biochimie' },
  { front: 'Marqueurs biologiques de la fonction rénale', back: 'Créatininémie (↑ si GFR↓), DFG estimé (CKD-EPI, MDRD), urée sanguine. La créatinine dépend de la masse musculaire.', subj: 'Biochimie' },
]

export default function FlashcardsPage() {
  const [idx, setIdx]     = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [easy, setEasy]   = useState(0)
  const [hard, setHard]   = useState(0)

  function rate(isEasy: boolean) {
    if (isEasy) setEasy(e => e + 1); else setHard(h => h + 1)
    setFlipped(false)
    setIdx(i => (i + 1) % CARDS.length)
  }

  const card = CARDS[idx]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">Flashcards</h1>
            <div className="flex gap-2">
              <span className="pill bg-green-50 text-green-700">✅ {easy} faciles</span>
              <span className="pill bg-red-50 text-red-700">😕 {hard} difficiles</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mb-3">{idx + 1} / {CARDS.length} · {card.subj}</div>
          <div className="h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full" style={{ width: `${(idx / CARDS.length) * 100}%` }} />
          </div>

          <div
            onClick={() => setFlipped(f => !f)}
            className={`card min-h-52 flex flex-col items-center justify-center text-center cursor-pointer mb-6 transition-all ${flipped ? 'bg-brand-50 border-brand-200' : 'hover:border-gray-300'}`}
          >
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {flipped ? '💡 Réponse' : '❓ Question'}
            </div>
            <p className="text-base font-medium text-gray-900 leading-relaxed px-4 max-w-lg">
              {flipped ? card.back : card.front}
            </p>
            {!flipped && <p className="text-sm text-gray-400 mt-4">Cliquez pour révéler la réponse</p>}
          </div>

          {flipped ? (
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => rate(false)} className="btn justify-center py-3 border-red-200 text-red-600 hover:bg-red-50 flex-col gap-1">
                <span className="text-xl">😕</span><span className="text-xs">À revoir</span>
              </button>
              <button onClick={() => rate(false)} className="btn justify-center py-3 border-amber-200 text-amber-600 hover:bg-amber-50 flex-col gap-1">
                <span className="text-xl">🤔</span><span className="text-xs">Difficile</span>
              </button>
              <button onClick={() => rate(true)} className="btn justify-center py-3 border-green-200 text-green-600 hover:bg-green-50 flex-col gap-1">
                <span className="text-xl">😊</span><span className="text-xs">Facile</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => { setFlipped(false); setIdx(i => Math.max(0, i - 1)) }} className="btn flex-1 justify-center">← Précédente</button>
              <button onClick={() => { setFlipped(false); setIdx(i => (i + 1) % CARDS.length) }} className="btn flex-1 justify-center">Suivante →</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
