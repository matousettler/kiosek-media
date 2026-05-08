import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ApiResponse, NewsPost } from './types';

// Helper to strip HTML tags from perex
const stripHtml = (html: string | null | undefined) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
};

// Helper to format date to Czech style
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const months = [
    'ledna', 'února', 'března', 'dubna', 'května', 'června',
    'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'
  ];
  return `${parseInt(day)}. ${months[parseInt(month) - 1]} ${year}`;
};

export default function App() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Chyba při načítání dat');
        const data: ApiResponse = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nastala neočekávaná chyba');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Carousel logic: cycle through posts every 8 seconds
  useEffect(() => {
    if (posts.length <= 1) return;
    
    const cycleInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 8000);
    
    return () => clearInterval(cycleInterval);
  }, [posts]);

  return (
    <div className="h-screen w-screen bg-white text-charcoal flex flex-col overflow-hidden">
      {/* Visual Header */}
      <div className="w-full bg-[#f6f6f6] border-b border-gray-100 py-5 px-10 flex justify-between items-center shrink-0">
        <h1 className="text-xs font-black uppercase tracking-[0.5em] text-metadata">
          Aktuality ze školních médií
        </h1>
        <p className="text-xs font-black uppercase tracking-widest text-brand-red">
          Čtěte na webu školy
        </p>
      </div>

      <main className="flex-grow relative flex items-center justify-center p-6 md:p-12 lg:p-20">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4"
            >
              <Loader2 className="h-12 w-12 animate-spin text-brand-red" />
              <p className="font-extrabold text-metadata uppercase tracking-widest text-xs">Načítám čerstvé zprávy...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-red-50 p-16 text-center text-red-600 border border-red-100 max-w-2xl shadow-xl"
            >
              <p className="text-2xl font-black uppercase tracking-tight mb-4">Chyba spojení</p>
              <p className="text-lg opacity-80">Nepodařilo se načíst data pro digitální nástěnku.</p>
            </motion.div>
          ) : posts.length > 0 ? (
            <motion.div
              key={posts[currentIndex].id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-full h-full max-w-7xl max-h-[85vh]"
            >
              <NewsCard post={posts[currentIndex]} index={currentIndex} />
            </motion.div>
          ) : (
            <div className="text-metadata font-bold uppercase tracking-widest">Žádné aktuální zprávy</div>
          )}
        </AnimatePresence>

        {/* Progress indicators for signage */}
        {posts.length > 1 && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            {posts.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 w-2 rounded-full transition-all duration-500 ${
                  idx === currentIndex ? 'h-8 bg-brand-red' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Static banner with QR Code */}
      <div className="w-full bg-[#111827] text-white py-6 px-12 flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] mb-1">Více informací na webu</h2>
          <p className="text-gray-400 font-bold uppercase tracking-[0.15em] text-xs">smysluplnaskola.cz/skolni-media</p>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-lg">
          <QRCodeSVG 
            value="https://smysluplnaskola.cz/skolni-media" 
            size={90}
            level="H"
          />
        </div>
      </div>
    </div>
  );
}

function NewsCard({ post }: { post: NewsPost; index: number }) {
  const rawImageUrl = `https://smysluplnaskola.cz/files/posts/${post.id}/cover_image/${post.imagename}`;
  const imageUrl = `/proxy-img?url=${encodeURIComponent(rawImageUrl)}`;

  return (
    <div
      className="flex flex-col md:flex-row h-full w-full bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-2xl"
      id={`news-card-${post.id}`}
    >
      <div className="md:w-[45%] h-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={post.title} 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200`;
          }}
        />
      </div>

      <div className="flex flex-col p-12 md:p-20 md:w-[55%] justify-center">
        <div className="mb-6">
          <div className="w-2 h-8 bg-brand-red inline-block mr-5 align-middle"></div>
          <span className="text-sm font-black uppercase tracking-[0.3em] text-metadata align-middle">
            Nepřehlédněte
          </span>
        </div>
        
        <h2 className="mb-10 font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-charcoal">
          {post.title}
        </h2>
        
        <p className="mb-12 text-xl md:text-2xl font-medium leading-relaxed text-metadata/80 line-clamp-5">
          {stripHtml(post.perex)}
        </p>
        
        <div className="mt-8 pt-10 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xl font-bold text-metadata/60 uppercase tracking-widest">
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
