"use client"
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(7); // Start with a few for the grid

  useEffect(() => {
    async function fetchFootballNews() {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      // Strictly football/soccer filter
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

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-blue-900 animate-pulse">PREPARING DISPATCHES...</div>;

  const featured = articles[0];
  const mainFeed = articles.slice(1, visibleCount);
  const sideFeed = articles.slice(visibleCount, visibleCount + 8); // Side rumors

  return (
    <main className="bg-white">
      {/* 1. HERO - GOAL.COM STYLE FEATURE */}
      <section className="bg-blue-950 text-white p-6 md:p-16 border-b-8 border-blue-600">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="bg-red-600 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">Global Exclusive</span>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">{featured?.title}</h1>
            <p className="text-blue-200 text-lg line-clamp-2 font-medium">{featured?.description}</p>
            <a href={featured?.url} target="_blank" className="inline-block bg-white text-blue-900 px-10 py-4 rounded-full font-black hover:bg-blue-400 transition shadow-2xl">FULL STORY</a>
          </div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-blue-900">
            <img src={featured?.urlToImage} className="w-full h-[400px] object-cover" alt="" />
          </div>
        </div>
      </section>

      {/* 2. VIDEO SECTION */}
      <section className="bg-slate-50 py-16 px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black italic mb-8 flex items-center gap-3">
             <span className="w-2 h-8 bg-blue-600"></span> VIDEO & ANALYSIS
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-xl group cursor-pointer relative">
                <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition duration-700" alt="" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-900 shadow-2xl group-hover:bg-blue-600 group-hover:text-white transition">▶</div>
                </div>
                <div className="absolute bottom-6 left-6 text-white font-bold uppercase italic tracking-tighter">Match Highlights: Premier League Recap</div>
             </div>
             <div className="flex flex-col justify-center space-y-4">
                <h3 className="text-3xl font-black text-blue-900 italic uppercase">The Tactical Room</h3>
                <p className="text-slate-600 font-medium">From the Ronaldo strike at Al Nassr to tactical shifts in the Premier League, watch our February 2026 breakdown.</p>
                <button className="text-blue-600 font-black text-sm uppercase hover:underline">Watch All Highights →</button>
             </div>
          </div>
        </div>
      </section>

      {/* 3. GLOBAL FEED + SIDEBAR SECTION */}
      <section className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content (Columns 1-8) */}
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-black italic mb-10 text-blue-900 uppercase tracking-tighter border-b-4 border-blue-500 inline-block">The Global Feed</h2>
            <div className="grid md:grid-cols-2 gap-10">
              {mainFeed.map((article, i) => (
                <a key={i} href={article.url} target="_blank" className="group flex flex-col">
                  <div className="h-56 rounded-[2rem] overflow-hidden mb-4 border border-slate-100 shadow-sm">
                    <img src={article.urlToImage || 'https://via.placeholder.com/400x300'} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
                  </div>
                  <span className="text-[10px] font-black text-blue-600 uppercase mb-1">{article.source.name}</span>
                  <h3 className="text-lg font-bold leading-tight group-hover:text-blue-700 transition-colors">{article.title}</h3>
                </a>
              ))}
            </div>
            
            {/* Load More Button */}
            <div className="mt-16 text-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="bg-slate-900 text-white px-12 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition shadow-xl"
              >
                Load More Dispatches
              </button>
            </div>
          </div>

          {/* SIDEBAR (Columns 9-12) - THE TRANSFER CENTER */}
          <aside className="lg:col-span-4 border-l border-slate-100 pl-0 lg:pl-10">
            <div className="sticky top-24">
              <h2 className="text-xl font-black italic mb-8 text-red-600 uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> Transfer Center
              </h2>
              <div className="space-y-8">
                {sideFeed.map((rumor, i) => (
                  <a key={i} href={rumor.url} target="_blank" className="block group border-b border-slate-50 pb-6 last:border-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(rumor.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <h4 className="font-bold text-sm leading-tight group-hover:text-blue-600 transition-colors mt-1">{rumor.title}</h4>
                    <p className="text-slate-400 text-[10px] font-medium mt-2">Source: {rumor.source.name}</p>
                  </a>
                ))}
              </div>
              <div className="mt-10 bg-blue-50 p-6 rounded-3xl border border-blue-100">
                <h5 className="font-black text-blue-900 text-xs uppercase mb-2">Want Live Scores?</h5>
                <p className="text-blue-700 text-[10px] font-bold mb-4">Track every goal from 2,200+ leagues in real-time.</p>
                <a href="/scores" className="block text-center bg-blue-900 text-white py-3 rounded-full font-black text-[10px] uppercase">Open Dashboard</a>
              </div>
            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}