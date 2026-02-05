import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0b121e] text-white pt-20 pb-10 border-t-4 border-[#F63049] relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F63049] rounded-full filter blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 lg:gap-20 pb-16 border-b border-white/5">
          
          {/* COLUMN 1: BRAND */}
          <div className="md:col-span-1 space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">
              GoalStrkr<span className="text-[#F63049]">.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              The premier digital intelligence hub for the modern football fanatic. Covering 2,000+ leagues with real-time precision.
            </p>
            <div className="flex gap-4">
               {['Tw', 'Ig', 'Yt'].map((social) => (
                 <div key={social} className="w-8 h-8 rounded bg-[#1A2C4B] flex items-center justify-center text-[10px] font-black uppercase text-slate-300 hover:bg-[#F63049] hover:text-white cursor-pointer transition-all">
                   {social}
                 </div>
               ))}
            </div>
          </div>

          {/* COLUMN 2: NAVIGATION */}
          <div>
            <h4 className="text-[#F63049] text-[10px] font-black uppercase tracking-[0.2em] mb-6">Coordinates</h4>
            <ul className="space-y-4">
              {['Live Scores', 'Premier League', 'La Liga', 'Transfer Market', 'Tactical Analysis'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-400 text-xs font-bold uppercase tracking-wide hover:text-white hover:translate-x-1 inline-block transition-transform">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: LEGAL */}
          <div>
            <h4 className="text-[#F63049] text-[10px] font-black uppercase tracking-[0.2em] mb-6">Protocol</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Press Kit'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-400 text-xs font-bold uppercase tracking-wide hover:text-white hover:translate-x-1 inline-block transition-transform">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER WIDGET */}
          <div className="md:col-span-1">
            <h4 className="text-white text-sm font-black uppercase tracking-widest mb-2">Join The Squad</h4>
            <p className="text-xs text-slate-500 mb-6">Get the tactical briefing delivered to your inbox every morning.</p>
            
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="ENTER EMAIL ADDRESS" 
                className="bg-[#1A2C4B] border border-white/10 text-white text-xs font-bold px-4 py-3 rounded outline-none focus:border-[#F63049] placeholder:text-slate-600 tracking-wider"
              />
              <button className="bg-[#F63049] text-white py-3 rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#d02752] transition-colors shadow-lg shadow-[#F63049]/20">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            © 2026 GoalStrkr Media. EST 2024.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}