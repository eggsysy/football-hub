import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white pt-16 pb-8 px-6 border-t-[12px] border-blue-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-black italic tracking-tighter mb-4 text-white">GOALSTRKR</h2>
            <p className="text-blue-300 max-w-sm font-medium leading-relaxed">
              Real-time football intelligence for the 2026 season. From the Al-Nassr frontlines to the Premier League title race.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Explore</h4>
            <ul className="space-y-3 text-sm font-bold">
              <li><Link href="/" className="hover:text-blue-400 transition">Latest News</Link></li>
              <li><Link href="/scores" className="hover:text-blue-400 transition">Live Scores</Link></li>
              <li><Link href="/leagues" className="hover:text-blue-400 transition">Leagues</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Support</h4>
            <ul className="space-y-3 text-sm font-bold">
              <li className="hover:text-blue-400 cursor-pointer transition">Privacy Policy</li>
              <li className="hover:text-blue-400 cursor-pointer transition">Terms of Service</li>
              <li className="hover:text-blue-400 cursor-pointer transition">Contact Desk</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-blue-800 tracking-widest uppercase">
          <p>© 2026 GoalStrkr Media Group. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Powered by Football-API</span>
            <span>v1.0.4-stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
}