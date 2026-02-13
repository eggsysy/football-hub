"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path ? "text-[#F63049]" : "text-slate-300 hover:text-white";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111F35]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative w-8 h-8 bg-[#F63049] transform -skew-x-12 rounded-sm flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
             <span className="font-black text-white text-lg transform skew-x-12">G</span>
          </div>
          <span className="text-xl md:text-2xl font-black italic tracking-tighter text-white uppercase group-hover:text-slate-200 transition-colors">
            GoalStrkr
            <span className="text-[#F63049]">.</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {['/', '/scores', '/leagues', '/favorites'].map((path) => {
            const label = path === '/' ? 'Briefing' : path.replace('/', '');
            return (
              <Link 
                key={path} 
                href={path} 
                className={`text-xs font-bold uppercase tracking-[0.15em] transition-all hover:scale-105 ${isActive(path)}`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* ACTION BUTTON */}
        <div className="flex items-center gap-6">
           {/* Search Icon */}
           <button className="text-slate-400 hover:text-white transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </button>
           
           <Link href="/login" className="hidden md:block bg-gradient-to-r from-[#F63049] to-[#D02752] text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(246,48,73,0.5)] transition-shadow">
             Sign In
           </Link>
        </div>

      </div>
    </nav>
  );
}