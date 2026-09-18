import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Tag } from "lucide-react";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Mengambil semua data berita dari koleksi berita_umroh
        const newsSnap = await getDocs(collection(db, "berita_umroh"));
        const newsData = newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Urutkan berita berdasarkan tanggal secara manual (terbaru di atas)
        const sortedNews = newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNews(sortedNews);
      } catch (error) {
        console.error("Gagal mengambil data berita:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatWaktu = (waktu) => {
    if (!waktu) return "";
    const dateObj = new Date(waktu);
    return dateObj.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, '') : '';

  return (
    <div className="pt-20 bg-slate-50 min-h-screen">
      
      {/* HEADER HERO BERITA */}
      <div className="bg-[#0f172a] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/80 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <p className="text-[#f59e0b] font-bold tracking-widest text-[10px] md:text-sm mb-2 uppercase">Informasi & Pembaruan</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Berita & Kegiatan Jamaah</h1>
          <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto md:mx-0">
            Ikuti informasi terkini, kegiatan jamaah, serta edukasi manasik yang diselenggarakan oleh Enka Imron Mandiri.
          </p>
        </div>
      </div>

      {/* DAFTAR BERITA GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div>
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group flex flex-col">
                <Link to={`/berita/${item.id}`} className="relative h-56 overflow-hidden block">
                  <img src={item.image || "https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=800"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#1e3a8a] shadow-sm uppercase tracking-wide flex items-center gap-1.5">
                    <Tag size={12} /> {item.category || "Berita"}
                  </div>
                </Link>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs text-gray-500 font-semibold mb-3 flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#f59e0b]"/> {formatWaktu(item.date)}
                  </p>
                  <Link to={`/berita/${item.id}`}>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 leading-snug group-hover:text-[#1e3a8a] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {stripHtml(item.text)}
                  </p>
                  <Link to={`/berita/${item.id}`} className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#1e3a8a] hover:text-[#f59e0b] transition-colors">
                    Baca Selengkapnya <ChevronRight size={16}/>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg">Belum ada berita yang diterbitkan saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default News;