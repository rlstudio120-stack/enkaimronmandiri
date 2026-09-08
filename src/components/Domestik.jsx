import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { Clock, Ship, MapPin, Building, ShieldCheck, Star, Heart, Award, ThumbsUp, Users, Gem } from "lucide-react";

// Peta Ikon Dinamis
const IconMap = { ShieldCheck, Star, Heart, Clock, Award, MapPin, ThumbsUp, Users, Gem };

function Domestik() {
  const [daerahList, setDaerahList] = useState([]);
  const [paketTerbaru, setPaketTerbaru] = useState([]);
  const [mengapaList, setMengapaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Ambil Data Daerah
        const daerahSnap = await getDocs(collection(db, "destinasi_domestik"));
        setDaerahList(daerahSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // 2. Ambil Data 4 Paket Terbaru
        const paketSnap = await getDocs(collection(db, "paket_domestik"));
        const paketData = paketSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Mengambil 4 terakhir (jika ada timestamp bisa pakai query orderBy)
        setPaketTerbaru(paketData.slice(0, 4));

        // 3. Ambil Data Mengapa Kami
        const mengapaSnap = await getDocs(collection(db, "mengapa_kami"));
        setMengapaList(mengapaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const badgeColors = { "bg-blue-600": "bg-blue-600", "bg-red-600": "bg-red-600", "bg-green-600": "bg-green-600", "bg-yellow-500": "bg-[#f59e0b]", "bg-purple-600": "bg-purple-600" };

  return (
    <div className="pt-20 bg-slate-50">
      
      {/* Bagian Hero */}
      <div className="relative bg-[#1e3a8a] pb-32 pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2000')" }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-[#f59e0b] font-bold tracking-widest text-sm mb-3 uppercase">Domestik</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-2xl">Jelajahi Keindahan Indonesia</h1>
          <p className="text-gray-200 text-lg max-w-xl mb-8">Nikmati pengalaman perjalanan terbaik ke berbagai destinasi indah di Indonesia bersama Enka Imron Mandiri.</p>
        </div>
      </div>

      {/* Kotak Pencarian */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-20 mb-16">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col"><label className="text-sm font-semibold text-gray-600 mb-1">Dari</label><input type="text" placeholder="Pilih Kota Asal" className="border border-gray-300 rounded-md p-2.5 focus:border-[#1e3a8a]"/></div>
            <div className="flex flex-col"><label className="text-sm font-semibold text-gray-600 mb-1">Ke</label><input type="text" placeholder="Pilih Destinasi" className="border border-gray-300 rounded-md p-2.5 focus:border-[#1e3a8a]"/></div>
            <div className="flex flex-col"><label className="text-sm font-semibold text-gray-600 mb-1">Tanggal</label><input type="date" className="border border-gray-300 rounded-md p-2.5 focus:border-[#1e3a8a]"/></div>
            <div className="flex flex-col"><label className="text-sm font-semibold text-gray-600 mb-1">Peserta</label><select className="border border-gray-300 rounded-md p-2.5 focus:border-[#1e3a8a]"><option>1 Dewasa</option><option>2 Dewasa</option></select></div>
            <button className="bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-2.5 rounded-md">Cari Paket</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div></div>
      ) : (
        <>
          {/* 1. SEKSI DESTINASI POPULER */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-3">Destinasi Populer</h2>
              <div className="w-20 h-1 bg-[#f59e0b] mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {daerahList.map((daerah) => (
                <Link to={`/domestik/daerah/${daerah.title}`} key={daerah.id} className="relative h-40 md:h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all">
                  <img src={daerah.image} alt={daerah.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-white font-bold text-lg md:text-xl tracking-wide">{daerah.title}</h3>
                </Link>
              ))}
            </div>
          </div>

          {/* 2. SEKSI PAKET TERBARU */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Paket Wisata Terbaru</h2>
                <p className="text-gray-500 text-sm mt-1">Penawaran destinasi terbaik bulan ini</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paketTerbaru.map((item) => (
                <Link to={`/paket/domestik/${item.id}`} key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50"></div>
                    {item.badge && <div className={`absolute top-3 left-3 text-white text-[11px] font-bold px-3 py-1.5 rounded-full ${badgeColors[item.badgeColor] || 'bg-[#1e3a8a]'}`}>{item.badge}</div>}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-[17px] font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#1e3a8a] transition-colors">{item.title}</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-2 text-[11px] text-gray-600 font-semibold"><MapPin size={14} className="text-[#1e3a8a]"/> <span className="line-clamp-1">{item.daerah || "Wisata"}</span></div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-600 font-semibold"><Clock size={14} className="text-[#1e3a8a]"/> <span className="line-clamp-1">{item.duration}</span></div>
                    </div>
                    <div className="pt-3 border-t border-gray-100 mt-auto">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Mulai Dari</p>
                      <p className="text-lg font-extrabold text-[#f59e0b]">{formatRupiah(item.hargaOpenTrip || item.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. SEKSI MENGAPA MEMILIH KAMI */}
          <div className="bg-white py-20 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="text-center mb-14">
                <h2 className="text-3xl font-bold text-[#1e3a8a] mb-3">Mengapa Memilih Kami?</h2>
                <div className="w-20 h-1 bg-[#f59e0b] mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {mengapaList.map((fitur) => {
                  const DynamicIcon = IconMap[fitur.icon] || Star;
                  return (
                    <div key={fitur.id} className="bg-slate-50 rounded-2xl p-8 text-center hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
                      <div className="w-16 h-16 bg-blue-100 text-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-6">
                        <DynamicIcon size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{fitur.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{fitur.deskripsi}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Domestik;