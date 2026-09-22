import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, ChevronRight, Tag, BookOpen, Search, Filter } from "lucide-react";

function News() {
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Fitur Filter & Pencarian
  const [filterDivisi, setFilterDivisi] = useState("Semua");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const q = query(collection(db, "berita"));
        const snapshot = await getDocs(q);
        
        const beritaData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Urutkan dari yang terbaru secara lokal
        beritaData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setBeritaList(beritaData);
      } catch (error) {
        console.error("Gagal mengambil berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
    window.scrollTo(0, 0);
  }, []);

  const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, '') : '';

  // Logika Filter Multi-Kriteria (Divisi + Kategori + Pencarian Teks)
  const filteredBerita = beritaList.filter((item) => {
    const matchDivisi = filterDivisi === "Semua" ? true : (item.tipe || "Umroh") === filterDivisi;
    const matchCategory = filterCategory === "Semua" ? true : (item.category || "Berita") === filterCategory;
    
    // Pencarian mencakup Judul dan Isi Artikel
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = item.title.toLowerCase().includes(searchLower) || stripHtml(item.text).toLowerCase().includes(searchLower);
    
    return matchDivisi && matchCategory && matchSearch;
  });

  return (
    <div className="pt-20 pb-20 bg-slate-50 min-h-screen font-sans">
      
      {/* 1. HERO SECTION PUSAT BERITA */}
      <div className="relative bg-[#0f172a] pt-16 pb-36 md:pt-24 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2000')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a] via-[#1e3a8a]/80 to-transparent"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-blue-200 hover:text-white font-medium mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm text-sm">
            <ArrowLeft size={16} /> Kembali
          </button>
          <div className="flex justify-center mb-4 text-[#f59e0b]"><BookOpen size={40}/></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-md">
            Pusat Berita & <span className="text-[#f59e0b]">Inspirasi</span>
          </h1>
          <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Ikuti terus pembaruan informasi keberangkatan jamaah, promo paket wisata, hingga tips liburan menarik bersama Enka Imron Mandiri.
          </p>

          {/* FILTER DIVISI (UMROH / DOMESTIK / INTERNASIONAL) */}
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 inline-flex flex-wrap justify-center gap-1 shadow-lg">
            {["Semua", "Umroh", "Domestik", "Internasional"].map((divisi) => (
              <button 
                key={divisi}
                onClick={() => setFilterDivisi(divisi)} 
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filterDivisi === divisi ? "bg-white text-[#1e3a8a] shadow-md" : "text-white/80 hover:bg-white/20"}`}
              >
                {divisi === "Semua" ? "Semua" : divisi}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. KOTAK PENCARIAN & FILTER KATEGORI (MENGAMBANG) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-14 md:-mt-16 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100 flex flex-col md:flex-row gap-4">
          
          {/* Input Pencarian */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari artikel, tips, atau promo..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] text-sm font-medium transition-all"
            />
          </div>
          
          {/* Dropdown Filter Kategori */}
          <div className="w-full md:w-64 relative">
            <Filter className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] text-sm font-medium bg-white appearance-none cursor-pointer transition-all"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Berita">Berita & Pengumuman</option>
              <option value="Kegiatan Jamaah">Kegiatan Peserta</option>
              <option value="Promo & Info">Promo Khusus</option>
              <option value="Tips Liburan">Tips Perjalanan</option>
            </select>
          </div>
          
        </div>
      </div>

      {/* 3. KONTEN BERITA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Indikator Hasil Pencarian */}
        {!loading && beritaList.length > 0 && (
          <div className="mb-6 text-gray-500 text-sm font-medium">
            Menampilkan <span className="font-bold text-[#1e3a8a]">{filteredBerita.length}</span> artikel.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center h-40 items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div>
          </div>
        ) : beritaList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Artikel</h3>
            <p className="text-gray-500">Saat ini belum ada berita atau artikel yang diterbitkan di database.</p>
          </div>
        ) : filteredBerita.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Pencarian Tidak Ditemukan</h3>
            <p className="text-gray-500">Tidak ada artikel yang cocok dengan kata kunci "{searchQuery}" atau filter yang dipilih.</p>
            <button onClick={() => { setSearchQuery(""); setFilterCategory("Semua"); setFilterDivisi("Semua"); }} className="mt-4 text-[#1e3a8a] font-bold hover:underline">Reset Pencarian</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBerita.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col">
                <Link to={`/berita/${item.id}`} className="relative h-56 overflow-hidden block">
                  <img src={item.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Label Kategori */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 text-[10px] font-bold text-[#1e3a8a] uppercase tracking-wider">
                    <Tag size={12}/> {item.category || "Berita"}
                  </div>
                  
                  {/* Indikator Divisi di Kanan Atas */}
                  <div className={`absolute top-4 right-4 text-white px-3 py-1.5 rounded-lg shadow-sm text-[10px] font-bold uppercase tracking-wider ${item.tipe === 'Domestik' ? 'bg-emerald-600' : item.tipe === 'Internasional' ? 'bg-purple-600' : 'bg-[#f59e0b]'}`}>
                    {item.tipe || "Umroh"}
                  </div>
                </Link>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[12px] text-gray-400 font-semibold flex items-center gap-1.5"><Calendar size={14} className="text-[#1e3a8a]"/> {item.date}</p>
                  </div>
                  
                  <Link to={`/berita/${item.id}`}>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 leading-snug line-clamp-2 group-hover:text-[#1e3a8a] transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                    {stripHtml(item.text)}
                  </p>
                  
                  <Link to={`/berita/${item.id}`} className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-[#1e3a8a] hover:text-[#f59e0b] transition-colors border-t border-gray-100 pt-4">
                    Baca Selengkapnya <ChevronRight size={16}/>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default News;