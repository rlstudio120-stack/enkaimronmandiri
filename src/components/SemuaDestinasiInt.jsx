import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Globe, MapPin } from "lucide-react";

function SemuaDestinasiInt() {
  const [daerahList, setDaerahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDaerah = async () => {
      try {
        const snap = await getDocs(collection(db, "destinasi_internasional"));
        const allDaerah = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDaerahList(allDaerah.filter(d => d.status !== "Nonaktif"));
      } catch (error) { console.error("Gagal mengambil data destinasi:", error); } 
      finally { setLoading(false); }
    };
    fetchDaerah(); window.scrollTo(0, 0);
  }, []);

  const filteredDaerah = daerahList.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="pt-20 pb-20 bg-slate-50 min-h-screen font-sans">
      <div className="relative bg-[#0f172a] pt-16 pb-36 md:pt-24 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a] via-[#1e3a8a]/80 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button onClick={() => navigate("/internasional")} className="inline-flex items-center gap-2 text-blue-200 hover:text-white font-medium mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm text-sm"><ArrowLeft size={16} /> Kembali ke Halaman Internasional</button>
          <div className="flex justify-center mb-4 text-[#f59e0b]"><Globe size={48}/></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-md">Katalog <span className="text-[#f59e0b]">Kawasan & Negara</span></h1>
          <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">Jelajahi berbagai pilihan kawasan dan negara wisata terbaik di seluruh dunia bersama kami.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 md:-mt-12 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-3 md:p-4 border border-gray-100 flex items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input type="text" placeholder="Cari kawasan atau negara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border-none rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-0 text-base font-medium transition-all bg-transparent" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!loading && daerahList.length > 0 && (
          <div className="mb-6 text-gray-500 text-sm font-medium text-center md:text-left">Menampilkan <span className="font-bold text-[#1e3a8a]">{filteredDaerah.length}</span> kawasan populer.</div>
        )}

        {loading ? (
          <div className="flex justify-center h-40 items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div></div>
        ) : filteredDaerah.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Kawasan Tidak Ditemukan</h3>
            <p className="text-gray-500">Tidak ada destinasi yang cocok dengan kata kunci tersebut.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredDaerah.map((daerah) => (
              <Link to={`/internasional/destinasi/${daerah.title}`} key={daerah.id} className="relative h-48 md:h-64 rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all border border-white">
                <img src={daerah.image} alt={daerah.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-1.5 text-[#f59e0b] mb-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300"><MapPin size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Eksplorasi</span></div>
                  <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-wide drop-shadow-md">{daerah.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SemuaDestinasiInt;