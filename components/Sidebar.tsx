'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const NAV = [
  { href: '/dashboard',  label: 'Dashboard',    icon: '📊' },
  { href: '/subjects',   label: 'Matières',      icon: '📚' },
  { href: '/planning',   label: 'Planning',      icon: '📅' },
  { href: '/qcm',        label: 'QCM',           icon: '✅' },
  { href: '/flashcards', label: 'Flashcards',    icon: '🃏' },
  { href: '/stats',      label: 'Statistiques',  icon: '📈' },
  { href: '/badges',     label: 'Badges & XP',   icon: '🏆' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-52 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">💊</div>
        <span className="font-semibold text-sm">PharmInternat</span>
      </div>
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon }) => (
          <Link key={href} href={href} className={clsx(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mx-2 transition-all',
            pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
              ? 'bg-brand-50 text-brand-800 font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          )}>
            <span>{icon}</span>{label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
