import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { 
  MapPin, Clock, Users, Calendar, ChevronRight, 
  Plane, Bus, TrainFront, Ship, Car, Box, Star,
  ShieldCheck, Heart, Award, ThumbsUp, Gem, Zap, Smile, CheckCircle, Compass
} from "lucide-react";

// Pemetaan Ikon untuk "Mengapa Kami"
const IconMap = { ShieldCheck, Star, Heart, Clock, Award, MapPin, ThumbsUp, Users, Gem, Bus, Plane, Globe: Box, Box, Zap, Smile, CheckCircle, Compass };

// Pemetaan Ikon Transportasi Dinamis
const getTransportIcon = (jenis) => {
  switch(jenis) {
    case "Pesawat": return Plane;
    case "Kereta": return TrainFront;
    case "Kapal": return Ship;
    case "Shuttle": return Car;
    case "Jeep": return Car;
    default: return Bus;
  }
};

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

        // 2. Ambil Data Paket Terbaru (Diambil semua dulu, lalu di slice)
        const paketSnap = await getDocs(collection(db, "paket_domestik"));
        const paketData = paketSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    window.scrollTo(0, 0);
  }, []);

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="pt-20 bg-slate-50 min-h-screen overflow-x-hidden">
      
      {/* HERO SECTION DOMESTIK */}
      <div className="relative bg-[#0f172a] pt-16 pb-32 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2000')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/90 via-[#1e3a8a]/60 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <p className="text-[#f59e0b] font-bold tracking-widest text-[10px] md:text-sm mb-2 md:mb-3 uppercase">Jelajahi Indonesia</p>
          <h1 className="text-[32px] md:text-5xl lg:text-6xl font-bold text-white mb-3 md:max-w-2xl leading-tight">
            Destinasi Wisata Domestik Terbaik
          </h1>
          <p className="text-blue-100 text-[13px] md:text-lg max-w-xl mb-6 leading-relaxed">
            Temukan keindahan alam dan budaya Indonesia melalui berbagai pilihan Open Trip dan Private Trip bersama Enka Imron Mandiri.
          </p>
        </div>
      </div>

      {/* KOTAK PENCARIAN */}
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
            
            {daerahList.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                 {daerahList.map((daerah) => (
                   <Link to={`/domestik/daerah/${daerah.title}`} key={daerah.id} className="relative h-40 md:h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all">
                     <img src={daerah.image || "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=800"} alt={daerah.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                     <h3 className="absolute bottom-4 left-4 text-white font-bold text-lg md:text-xl tracking-wide">{daerah.title}</h3>
                   </Link>
                 ))}
               </div>
            ) : (
                <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">Belum ada data destinasi daerah.</div>
            )}
          </div>

          {/* 2. SEKSI PAKET TERBARU */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Paket Wisata Terbaru</h2>
                <p className="text-gray-500 text-sm mt-1">Penawaran destinasi terbaik bulan ini</p>
              </div>
            </div>
            
            {paketTerbaru.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {paketTerbaru.map((item) => (
                   <Link to={`/paket/domestik/${item.id}`} key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group">
                     
                     <div className="relative h-48 overflow-hidden">
                       <img src={item.image || "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=800"} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>
                       {item.badge && <div className={`absolute top-4 left-4 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-md ${item.badgeColor || 'bg-purple-600'}`}>{item.badge}</div>}
                       <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#1e3a8a] flex items-center gap-1.5 shadow-sm">
                         <Users size={12}/> {item.tipeTrip || "Open Trip"}
                       </div>
                     </div>

                     <div className="p-5 flex-1 flex flex-col">
                       <div className="flex items-center gap-1 text-[11px] font-bold text-[#f59e0b] mb-1.5 uppercase tracking-wide">
                         <MapPin size={12} /> {item.daerah || "Indonesia"}
                       </div>
                       
                       <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#1e3a8a] transition-colors leading-snug">{item.title}</h3>
                       
                       <div className="flex flex-wrap gap-y-2 gap-x-4 mb-5 border-b border-gray-100 pb-4">
                         <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold w-full">
                           <Clock size={14} className="text-[#1e3a8a] shrink-0" /> {item.duration || "1 Hari"}
                         </div>
                         
                         {/* Iterasi Ikon Transportasi */}
                         {(item.transportasi || []).slice(0, 3).map((tr, idx) => {
                           const TransportIcon = getTransportIcon(tr.jenis);
                           return (
                             <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold" title={tr.deskripsi}>
                               <TransportIcon size={14} className="text-[#1e3a8a] shrink-0" />
                               <span>{tr.jenis}</span>
                             </div>
                           );
                         })}
                         {/* Fallback jika tidak ada array transportasi (untuk kompatibilitas data lama) */}
                         {(!item.transportasi || item.transportasi.length === 0) && item.transport && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                               <Bus size={14} className="text-[#1e3a8a] shrink-0" />
                               <span className="line-clamp-1">{item.transport}</span>
                             </div>
                         )}
                       </div>

                       <div className="flex flex-col mt-auto">
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mulai Dari</p>
                         <div className="flex items-baseline gap-1 mb-4">
                           <p className="text-xl font-extrabold text-[#1e3a8a]">{formatRupiah(item.price || item.hargaOpenTrip || item.hargaPrivateTrip)}</p>
                           <span className="text-gray-500 text-xs font-semibold">/pax</span>
                         </div>
                         <div className="w-full text-center bg-[#f59e0b] group-hover:bg-yellow-600 text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                           Lihat Detail
                         </div>
                       </div>
                     </div>
                   </Link>
                 ))}
               </div>
            ) : (
                <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">Belum ada paket wisata domestik terbaru.</div>
            )}
          </div>

          {/* 3. SEKSI MENGAPA MEMILIH KAMI */}
          <div className="bg-white py-20 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="text-center mb-14">
                <h2 className="text-3xl font-bold text-[#1e3a8a] mb-3">Mengapa Memilih Kami?</h2>
                <div className="w-20 h-1 bg-[#f59e0b] mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {mengapaList.length > 0 ? mengapaList.map((fitur) => {
                  const DynamicIcon = IconMap[fitur.icon] || Star;
                  return (
                    <div key={fitur.id} className="bg-slate-50 rounded-2xl p-8 text-center hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
                      <div className={`w-16 h-16 ${fitur.color || 'bg-[#1e3a8a]'} text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md`}>
                        <DynamicIcon size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{fitur.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{fitur.deskripsi}</p>
                    </div>
                  );
                }) : (
                    <div className="col-span-3 text-center py-10 text-gray-500">Data keunggulan belum ditambahkan.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Domestik;