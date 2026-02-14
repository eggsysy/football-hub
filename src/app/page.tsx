"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Manrope, Sora } from "next/font/google";

const headingFont = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

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

interface NewsApiResponse {
  articles?: Array<{
    urlToImage?: string | null;
    source?: {
      name?: string | null;
    };
    publishedAt?: string;
    title?: string;
    description?: string | null;
    url?: string;
  }>;
}

type RawArticle = NonNullable<NewsApiResponse["articles"]>[number];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Unknown Date"
    : dateFormatter.format(parsedDate);
}

function formatTime(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "--:--"
    : timeFormatter.format(parsedDate);
}

function normalizeArticle(article: RawArticle): Article | null {
  if (!article?.url || !article?.title || article.title === "[Removed]") {
    return null;
  }

  return {
    urlToImage: article.urlToImage || undefined,
    source: {
      name: article.source?.name?.trim() || "Unknown Source",
    },
    publishedAt: article.publishedAt || new Date().toISOString(),
    title: article.title.trim(),
    description: article.description?.trim() || undefined,
    url: article.url,
  };
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const fetchFootballNews = useCallback(async () => {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    const query = encodeURIComponent(
      'football OR soccer OR "Premier League" OR "Champions League"'
    );

    if (!apiKey) {
      setError("Missing API key. Add NEXT_PUBLIC_NEWS_API_KEY to continue.");
      setArticles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=40&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = (await response.json()) as NewsApiResponse;
      const normalizedArticles =
        data.articles?.map(normalizeArticle).filter(Boolean) || [];

      const uniqueArticles = Array.from(
        new Map(normalizedArticles.map((article) => [article.url, article])).values()
      );

      setArticles(uniqueArticles);
    } catch {
      setError("Unable to load live headlines right now. Please try again.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFootballNews();
  }, [fetchFootballNews]);

  const leadStory = articles[0];
  const radarStories = articles.slice(1, 5);
  const latestCoverage = articles.slice(5, visibleCount + 5);
  const hasMore = articles.length > visibleCount + 5;

  const sourcePills = useMemo(
    () => Array.from(new Set(articles.map((article) => article.source.name))).slice(0, 7),
    [articles]
  );

  if (loading) {
    return (
      <div className={`flex h-[60vh] flex-col items-center justify-center gap-4 ${bodyFont.className}`}>
        <div className="h-1 w-20 animate-pulse bg-[#F63049]" />
        <div className="animate-pulse text-xs font-black uppercase tracking-[0.3em] text-white">
          Curating Today&apos;s Football Briefing...
        </div>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <main className={`min-h-screen bg-[#111F35] px-6 pb-24 md:px-10 ${bodyFont.className}`}>
        <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#13233b] to-[#0e1a2f] p-8 text-center">
          <h1 className={`text-2xl font-black uppercase tracking-tight text-white ${headingFont.className}`}>
            Matchday Briefing Unavailable
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            {error ||
              "No stories were returned right now. Refresh to pull the latest football headlines."}
          </p>
          <button
            onClick={() => void fetchFootballNews()}
            className="mt-8 rounded-full border border-[#F63049] px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#F63049] transition-all hover:bg-[#F63049] hover:text-white"
          >
            Retry Feed
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={`relative min-h-screen overflow-hidden bg-[#0f1b30] px-6 pb-24 md:px-10 ${bodyFont.className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(246,48,73,0.16),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.14),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl space-y-10">
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#142541] via-[#101d32] to-[#0d1728] p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.03)_32%,transparent_62%)]" />
          <div className="relative">
            <p className="inline-flex rounded-full border border-[#F63049]/40 bg-[#F63049]/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-[#ff8b9b]">
              Editorial Livewire
            </p>

            <h1 className={`mt-5 max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl ${headingFont.className}`}>
              A sharper football homepage built for informed fans and fast decisions.
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
              Premium coverage, clear hierarchy, and zero clutter. Browse the biggest stories first,
              then move into deeper reporting from top football desks worldwide.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {sourcePills.map((source) => (
                <span
                  key={source}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-200"
                >
                  {source}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {leadStory && (
                <a
                  href={leadStory.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#F63049] px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-all hover:bg-[#e12944]"
                >
                  Read Lead Story
                </a>
              )}
              <button
                onClick={() => void fetchFootballNews()}
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-200 transition-colors hover:border-white/40 hover:text-white"
              >
                Refresh Briefing
              </button>
            </div>
          </div>
        </section>

        {leadStory && (
          <section className="grid gap-6 lg:grid-cols-12">
            <a
              href={leadStory.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#13233b] lg:col-span-7"
            >
              <div className="relative h-[360px] w-full md:h-[500px]">
                {leadStory.urlToImage ? (
                  <img
                    src={leadStory.urlToImage}
                    alt={leadStory.title}
                    className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a2f50] to-[#0c1728] text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
                    Image Unavailable
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1322] via-[#0a1322]/70 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-9">
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span className="rounded bg-[#F63049] px-2 py-1 font-black text-white">Lead Story</span>
                    <span className="text-slate-300">{leadStory.source.name}</span>
                    <span className="text-slate-500">{formatDate(leadStory.publishedAt)}</span>
                  </div>
                  <h2 className={`max-w-4xl text-2xl font-bold leading-tight text-white md:text-4xl ${headingFont.className}`}>
                    {leadStory.title}
                  </h2>
                </div>
              </div>
            </a>

            <aside className="rounded-3xl border border-white/10 bg-[#101d32]/80 p-5 lg:col-span-5 md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#F63049]" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Editor&apos;s Radar</h3>
              </div>

              <div className="space-y-3">
                {radarStories.map((story, index) => (
                  <a
                    key={story.url}
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[38px_1fr] gap-3 rounded-2xl border border-white/10 bg-[#152846]/70 p-4 transition-colors hover:border-[#F63049]/70"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[10px] font-black tracking-[0.14em] text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#ff7a8d]">
                          {story.source.name}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                          {formatTime(story.publishedAt)}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-white transition-colors group-hover:text-[#ff9aa8]">
                        {story.title}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </aside>
          </section>
        )}

        <section className="rounded-3xl border border-white/10 bg-[#101d32]/70 p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className={`text-2xl font-bold leading-tight text-white md:text-3xl ${headingFont.className}`}>
              Latest Coverage
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Updated {formatDate(articles[0].publishedAt)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {latestCoverage.map((article, index) => (
              <a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#13233b]/80 transition-all hover:-translate-y-0.5 hover:border-[#F63049] ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden border-b border-white/10 ${
                    index === 0 ? "h-64 md:h-72" : "h-48"
                  }`}
                >
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a2f50] to-[#0c1728] text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                      No Image
                    </div>
                  )}
                  <div className="absolute right-3 top-3 rounded bg-black/70 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-200">
                    {formatDate(article.publishedAt)}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F63049]">
                    {article.source.name}
                  </div>
                  <h3
                    className={`mt-3 font-bold leading-tight text-white transition-colors group-hover:text-[#ff9aa8] ${
                      index === 0 ? `text-2xl ${headingFont.className}` : "text-lg"
                    }`}
                  >
                    {article.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">
                    {article.description ||
                      "Open this report for complete matchday context and source analysis."}
                  </p>
                  <div className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors group-hover:text-[#F63049]">
                    Open Full Report
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-7 text-center">
            <button
              onClick={() => setVisibleCount((count) => count + 9)}
              disabled={!hasMore}
              className="rounded-full border border-[#F63049] px-10 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#F63049] transition-all hover:bg-[#F63049] hover:text-white disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500 disabled:hover:bg-transparent"
            >
              {hasMore ? "Load More Coverage" : "All Stories Loaded"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
