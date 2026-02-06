"use client"
import React, { useEffect, useState } from 'react';

interface Article {
  urlToImage?: string;
  source: {
    name: string;
  };
  publishedAt: string;
  title: string;
  description?: string;
  url: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(13);

  useEffect(() => {
    async function fetchFootballNews() {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      const query = encodeURIComponent('football OR soccer OR "Premier League"');
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
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-1 bg-[#F63049] animate-pulse"></div>
      <div className="text-white font-black text-xs uppercase tracking-[0.3em] animate-pulse">
        Initializing Briefing...
      </div>
    </div>
  );

  const hero = articles[0];
  const subHero = articles.slice(1, 4);
  const standardGrid = articles.slice(4, visibleCount);

  return (
    <main className="min-h-screen px-6 md:px-8 pb-24 bg-[#111F35]">
      
      {/* 1. HERO SECTION: "The Front Page" */}
      {hero && (
        <section className="max-w-[1400px] mx-auto mb-16 border-b border-white/10 pb-16">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
            
            {/* Main Headline Image (Columns 1-8) */}
            <div className="lg:col-span-8 group cursor-pointer">
              <div className="relative h-[500px] w-full bg-black border-t-4 border-[#F63049]">
                <img 
                  src={hero.urlToImage} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                  alt="Hero" 
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0b1422] to-transparent p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-[#F63049] text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest">
                      Lead Story
                    </span>
                    <span className="text-slate-300 text-[10px] font-bold uppercase tracking-wider border-l border-white/30 pl-3">
                      {hero.source.name}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] text-white group-hover:text-[#F63049] transition-colors duration-300">
                    {hero.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Sub-Headlines Sidebar (Columns 9-12) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#F63049]"></div>
                <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Top Developments</h3>
              </div>
              
              {subHero.map((news, i) => (
                <a key={i} href={news.url} target="_blank" className="group flex-1 bg-[#15233b] border border-white/5 hover:border-[#F63049] p-5 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[#F63049] text-[9px] font-black uppercase tracking-wider">{news.source.name}</span>
                      <span className="text-slate-500 text-[9px] font-mono">{new Date(news.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <h3 className="text-white font-bold text-sm leading-snug group-hover:text-[#F63049] transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                  </div>
                  <div className="w-full h-[1px] bg-white/10 mt-4 group-hover:bg-[#F63049]/50"></div>
                </a>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 2. THE NEWS GRID: Sharp, Dark, Professional */}
      <section className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Global Dispatch <span className="text-[#F63049]">.</span>
          </h2>
          <div className="hidden md:block w-full h-[1px] bg-white/10 ml-8 mb-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardGrid.map((article, i) => (
            <a 
              key={i} 
              href={article.url} 
              target="_blank" 
              className="group bg-[#15233b] border border-white/5 hover:border-[#F63049] transition-colors flex flex-col h-full"
            >
              {/* Image Section - Fixed Height, Sharp Corners */}
              <div className="h-56 w-full overflow-hidden relative border-b border-white/5">
                <img 
                  src={article.urlToImage || 'https://via.placeholder.com/600x400'} 
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" 
                  alt="" 
                />
                <div className="absolute top-0 right-0 bg-black/80 text-white text-[9px] font-mono px-2 py-1">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Text Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  <span className="text-[#F63049] text-[10px] font-black uppercase tracking-widest">
                    {article.source.name}
                  </span>
                </div>
                <h3 className="text-lg font-bold uppercase leading-tight text-white mb-4 group-hover:text-[#F63049] transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mt-auto">
                  {article.description}
                </p>
                
                {/* 'Read More' pseudo-button */}
                <div className="mt-6 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest group-hover:text-[#F63049]">
                  Read Full Report <span className="text-lg leading-3">›</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Load More Control */}
        <div className="mt-16 border-t border-white/10 pt-10 text-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 9)}
            className="bg-transparent border border-[#F63049] text-[#F63049] px-12 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-[#F63049] hover:text-white transition-all"
          >
            Load More Intelligence
          </button>
        </div>
      </section>
    </main>
  );
}