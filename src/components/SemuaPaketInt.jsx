import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Clock, Users, Globe, Plane, TrainFront, Ship, Car } from "lucide-react";

const getTransportIcon = (jenis) => {
  switch(jenis) {
    case "Pesawat": return Plane;
    case "Kereta": return TrainFront;
    case "Kapal": return Ship;
    case "Shuttle": return Car;
    case "Jeep": return Car;
    default: return Plane;
  }
};

function SemuaPaketInt() {
  const [paketList, setPaketList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const snap = await getDocs(collection(db, "paket_internasional"));
        setPaketList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error("Gagal mengambil data:", error); } 
      finally { setLoading(false); }
    };
    fetchPaket(); window.scrollTo(0, 0);
  }, []);

  const formatRupiah = (angka) => { if (!angka) return "Rp 0"; return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka); };
  const badgeColors = { "Promo": "bg-red-500", "Reguler": "bg-blue-600", "Premium": "bg-purple-600", "VIP": "bg-[#f59e0b]" };

  const filteredPaket = paketList.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.negara && p.negara.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pt-20 pb-20 bg-slate-50 min-h-screen font-sans">
      <div className="relative bg-[#0f172a] pt-16 pb-36 md:pt-24 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a] via-[#1e3a8a]/80 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button onClick={() => navigate("/internasional")} className="inline-flex items-center gap-2 text-blue-200 hover:text-white font-medium mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm text-sm"><ArrowLeft size={16} /> Kembali ke Halaman Internasional</button>
          <div className="flex justify-center mb-4 text-[#f59e0b]"><Plane size={48}/></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-md">Katalog <span className="text-[#f59e0b]">Trip Luar Negeri</span></h1>
          <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">Temukan paket perjalanan internasional yang sesuai dengan impian liburan Anda.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 md:-mt-12 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-3 md:p-4 border border-gray-100 flex items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input type="text" placeholder="Cari nama paket atau kawasan negara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border-none rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-0 text-base font-medium transition-all bg-transparent" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!loading && paketList.length > 0 && (
          <div className="mb-6 text-gray-500 text-sm font-medium text-center md:text-left">Menampilkan <span className="font-bold text-[#1e3a8a]">{filteredPaket.length}</span> paket internasional.</div>
        )}

        {loading ? (
          <div className="flex justify-center h-40 items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div></div>
        ) : filteredPaket.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Paket Tidak Ditemukan</h3>
            <p className="text-gray-500">Tidak ada paket yang cocok dengan kata kunci tersebut.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPaket.map((item) => (
              <Link to={`/paket/internasional/${item.id}`} key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group cursor-pointer w-full">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>
                  {item.badge && item.badge !== "Tidak Ada" && (
                    <div className={`absolute top-4 left-4 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-lg ${badgeColors[item.badge] || 'bg-purple-600'}`}>{item.badge}</div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#1e3a8a] flex items-center gap-1.5"><Users size={12}/> {item.tipeTrip || "Open Trip"}</div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#f59e0b] mb-1.5 uppercase tracking-wide"><Globe size={12} /> {item.negara || item.daerah || "Internasional"}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#1e3a8a] transition-colors leading-snug">{item.title}</h3>
                  <div className="flex flex-wrap gap-y-2 gap-x-4 mb-5 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold w-full"><Clock size={14} className="text-[#1e3a8a] shrink-0" /> {item.duration || "1 Hari"}</div>
                    {(item.transportasi || []).slice(0, 3).map((tr, idx) => {
                      const TransportIcon = getTransportIcon(tr.jenis);
                      return (<div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold" title={tr.deskripsi}><TransportIcon size={14} className="text-[#1e3a8a] shrink-0" /> <span>{tr.jenis}</span></div>);
                    })}
                  </div>
                  <div className="flex flex-col mt-auto">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mulai Dari</p>
                    <div className="flex items-baseline gap-1 mb-4"><p className="text-xl font-extrabold text-[#1e3a8a]">{formatRupiah(item.price)}</p><span className="text-gray-500 text-xs font-semibold">/pax</span></div>
                    <div className="w-full text-center bg-[#f59e0b] group-hover:bg-yellow-600 text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">Lihat Detail</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SemuaPaketInt;