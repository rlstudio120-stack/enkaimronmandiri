import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Clock, Ship, MapPin, Building } from "lucide-react";

function DomestikDaerah() {
  const { namaDaerah } = useParams();
  const [paket, setPaket] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaketByDaerah = async () => {
      try {
        const q = query(collection(db, "paket_domestik"), where("daerah", "==", namaDaerah));
        const snapshot = await getDocs(q);
        setPaket(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaketByDaerah();
  }, [namaDaerah]);

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const badgeColors = { "bg-blue-600": "bg-blue-600", "bg-red-600": "bg-red-600", "bg-green-600": "bg-green-600", "bg-yellow-500": "bg-[#f59e0b]", "bg-purple-600": "bg-purple-600" };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <Link to="/domestik" className="text-gray-500 hover:text-[#1e3a8a] font-medium mb-6 inline-block transition">
          ← Kembali ke Destinasi Domestik
        </Link>

        <div className="bg-[#1e3a8a] rounded-3xl p-10 mb-10 text-center shadow-lg relative overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
           <h1 className="text-3xl md:text-5xl font-bold text-white relative z-10 mb-2">Paket Wisata di {namaDaerah}</h1>
           <p className="text-blue-200 relative z-10">Temukan petualangan terbaik Anda di wilayah {namaDaerah}</p>
        </div>

        {loading ? (
          <div className="flex justify-center h-40 items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div></div>
        ) : paket.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Paket</h3>
            <p className="text-gray-500">Saat ini belum ada paket wisata yang tersedia untuk {namaDaerah}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paket.map((item) => (
              <Link to={`/paket/domestik/${item.id}`} key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  {item.badge && <div className={`absolute top-3 left-3 text-white text-[11px] font-bold px-3 py-1.5 rounded-full ${badgeColors[item.badgeColor] || 'bg-[#1e3a8a]'}`}>{item.badge}</div>}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-[17px] font-bold text-gray-800 mb-3 line-clamp-2">{item.title}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 font-semibold"><Clock size={14} className="text-[#1e3a8a]"/> {item.duration}</div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 font-semibold"><Building size={14} className="text-[#1e3a8a]"/> <span className="line-clamp-1">{item.hotel || "-"}</span></div>
                  </div>
                  <div className="pt-3 border-t border-gray-100 mt-auto">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Mulai Dari</p>
                    <p className="text-lg font-extrabold text-[#f59e0b]">{formatRupiah(item.hargaOpenTrip || item.price)}</p>
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

export default DomestikDaerah;