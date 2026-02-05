"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  
  // Inside your navItems array
const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Scores', path: '/scores' }, // Add this!
  { name: 'Leagues', path: '/leagues' },
  { name: 'Favorites', path: '/favorites' },
  { name: 'Profile', path: '/profile' },
]

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-black italic text-blue-800 tracking-tighter">
          GOALSTRKR
        </Link>
        
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path}
              className={`text-sm font-bold transition ${
                pathname === item.path ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}