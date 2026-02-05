"use client"
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(11); // Show 1 hero + 10 grid items

  useEffect(() => {
    async function fetchFootballNews() {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      const query = encodeURIComponent('football OR soccer OR "transfer rumors"');
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=40&apiKey=${apiKey}`
        );
        const data = await res.json();
        setArticles(data.articles || []);
      } finally {
        setLoading(false);
      }
    }
    fetchFootballNews();
  }, []);

  if (loading) return (
    <div className="h-screen w-full bg-[#111F35] flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-[#F63049] border-t-transparent rounded-full animate-spin"></div>
      <div className="text-white font-sans font-bold text-sm tracking-[0.3em] uppercase animate-pulse">
        Initializing GoalStrkr...
      </div>
    </div>
  );

  const hero = articles[0];
  const gridNews = articles.slice(1, visibleCount);
  const sidebarNews = articles.slice(visibleCount, visibleCount + 5);

  return (
    <main className="min-h-screen bg-[#111F35] text-white font-sans selection:bg-[#F63049] selection:text-white overflow-x-hidden">
      
      {/* 1. MATCHDAY TICKER - The "Live" Feel */}
      <div className="bg-[#0f1b2d] border-b border-white/5 h-12 flex items-center overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 bg-[#F63049] px-4 flex items-center z-10 font-black text-xs uppercase tracking-widest text-white shadow-[4px_0_24px_rgba(246,48,73,0.4)]">
          Live Wire
        </div>
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 pl-32 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#F63049] animate-pulse"></span> Man Utd vs Liverpool: 2-2 (78')</span>
          <span className="flex items-center gap-2 text-white">Mbappé Medical Passed</span>
          <span className="flex items-center gap-2">Chelsea Bid Rejected</span>
          <span className="flex items-center gap-2 text-[#D02752]">Breaking: Conte Sacked</span>
        </div>
      </div>

      {/* 2. CINEMATIC HERO SECTION */}
      <section className="relative w-full h-[85vh] overflow-hidden group">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src={hero?.urlToImage} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-[2000ms] ease-out" 
            alt="Hero" 
          />
        </div>
        
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111F35] via-[#111F35]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#111F35]/90 via-transparent to-transparent"></div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 z-20 flex flex-col justify-end h-full max-w-5xl">
          <div className="overflow-hidden mb-6">
            <span className="inline-block bg-gradient-to-r from-[#F63049] to-[#D02752] text-white text-xs font-black uppercase px-4 py-2 rounded-sm tracking-[0.2em] transform transition-transform duration-500 hover:translate-x-2 cursor-default shadow-[0_0_20px_rgba(246,48,73,0.5)]">
              Feature Story
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black leading-[0.9] mb-8 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-lg">
            {hero?.title}
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl leading-relaxed border-l-4 border-[#F63049] pl-6 mb-10 backdrop-blur-sm bg-black/10 p-4 rounded-r-xl">
            {hero?.description}
          </p>
          <a href={hero?.url} target="_blank" className="group/btn relative w-fit overflow-hidden rounded-full bg-white px-10 py-4 text-[#111F35] transition-all hover:bg-[#F63049] hover:text-white hover:shadow-[0_0_40px_rgba(246,48,73,0.6)]">
            <span className="relative z-10 font-black text-xs uppercase tracking-[0.25em]">Read Full Dispatch</span>
          </a>
        </div>
      </section>

      {/* 3. THE MOSAIC GRID */}
      <section className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Headlines <span className="text-[#F63049] text-6xl">.</span>
          </h2>
          <div className="hidden md:flex gap-4">
             <button className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#F63049] hover:border-[#F63049] transition-all">←</button>
             <button className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#F63049] hover:border-[#F63049] transition-all">→</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Grid Area (Columns 1-9) */}
          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[350px]">
            {gridNews.map((article, i) => {
              // PATTERN: Every 3rd item spans 2 columns (0, 3, 6...)
              const isLarge = i === 0 || i === 3 || i === 4; 
              
              return (
                <a 
                  key={i} 
                  href={article.url} 
                  target="_blank" 
                  className={`group relative rounded-3xl overflow-hidden bg-[#1A2C4B] border border-white/5 hover:border-[#F63049]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ${isLarge ? 'md:col-span-2' : 'md:col-span-1'}`}
                >
                  {/* Image with zoom effect */}
                  <img 
                    src={article.urlToImage || 'https://via.placeholder.com/600x400'} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40" 
                    alt="" 
                  />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1626] via-[#0d1626]/40 to-transparent p-8 flex flex-col justify-end">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-3 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <span className="bg-[#F63049] text-[9px] font-bold uppercase px-2 py-0.5 rounded text-white">{article.source.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className={`font-black uppercase leading-[0.95] tracking-tight text-white ${isLarge ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Sidebar Area (Columns 10-12) */}
          <div className="md:col-span-3 space-y-8">
            {/* Rumor Widget */}
            <div className="bg-[#15233b] rounded-3xl p-8 border border-white/5 sticky top-8">
               <h4 className="text-[#F63049] font-black text-xs uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-[#F63049] animate-pulse"></span>
                 Transfer Hub
               </h4>
               <div className="space-y-8 relative">
                  {/* Connecting Line */}
                  <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#F63049] to-transparent opacity-30"></div>
                  
                  {sidebarNews.map((news, i) => (
                    <a key={i} href={news.url} target="_blank" className="group block relative pl-6">
                      <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-[#111F35] border border-[#F63049] group-hover:bg-[#F63049] transition-colors z-10"></div>
                      <p className="text-xs text-slate-400 font-mono mb-1">{new Date(news.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <h5 className="font-bold text-sm leading-snug text-slate-200 group-hover:text-[#F63049] transition-colors line-clamp-2">
                        {news.title}
                      </h5>
                    </a>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-3 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#111F35] transition-all">
                 View All Transfers
               </button>
            </div>
          </div>

        </div>

        {/* Load More Trigger */}
        <div className="mt-20 flex flex-col items-center justify-center gap-4">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Showing {visibleCount} Dispatches</p>
          <button 
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="w-16 h-16 rounded-full border-2 border-[#F63049] text-[#F63049] flex items-center justify-center hover:bg-[#F63049] hover:text-white transition-all duration-300 hover:scale-110 shadow-[0_0_30px_rgba(246,48,73,0.3)]"
          >
            <span className="text-2xl font-light">↓</span>
          </button>
        </div>

      </section>
    </main>
  );
}