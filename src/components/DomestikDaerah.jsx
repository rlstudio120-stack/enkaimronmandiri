import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { 
  Clock, Ship, MapPin, Building, ArrowLeft, Search, Filter, 
  Users, Plane, Bus, TrainFront, Car, Box, Star
} from "lucide-react";

// Pemetaan Ikon Transportasi Dinamis (Cerdas & Seragam)
const getTransportIcon = (jenis) => {
  if (!jenis) return Bus;
  const j = jenis.toLowerCase();
  if (j.includes("pesawat") || j.includes("flight")) return Plane;
  if (j.includes("kereta")) return TrainFront;
  if (j.includes("kapal") || j.includes("boat")) return Ship;
  if (j.includes("shuttle") || j.includes("jeep") || j.includes("mobil")) return Car;
  return Bus;
};

function DomestikDaerah() {
  const { namaDaerah } = useParams();
  const [paket, setPaket] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Fitur Pencarian & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTrip, setFilterTrip] = useState("Semua");

  useEffect(() => {
    const fetchPaket = async () => {
      setLoading(true);
      try {
        let snapshot;
        // Jika ada namaDaerah (klik per kota), filter berdasarkan daerah.
        // Jika tidak ada namaDaerah (klik "Lihat Semua Paket"), ambil semua paket domestik!
        if (namaDaerah) {
          const q = query(collection(db, "paket_domestik"), where("daerah", "==", namaDaerah));
          snapshot = await getDocs(q);
        } else {
          snapshot = await getDocs(collection(db, "paket_domestik"));
        }
        setPaket(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaket();
    window.scrollTo(0, 0);
  }, [namaDaerah]);

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const badgeColors = { 
    "Promo": "bg-red-500", 
    "Reguler": "bg-blue-600", 
    "Premium": "bg-purple-600", 
    "VIP": "bg-[#f59e0b]" 
  };

  // Logika Filter Data (Bisa cari nama paket maupun nama daerah)
  const filteredPaket = paket.filter((item) => {
    const textTarget = `${item.title || ""} ${item.daerah || ""}`.toLowerCase();
    const matchSearch = textTarget.includes(searchQuery.toLowerCase());
    const matchFilter = filterTrip === "Semua" ? true : (item.tipeTrip || "Open Trip") === filterTrip;
    return matchSearch && matchFilter;
  });

  return (
    <div className="pt-20 pb-20 bg-slate-50 min-h-screen font-sans">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-[#0f172a] pt-16 pb-36 md:pt-24 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2000')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a] via-[#1e3a8a]/80 to-transparent"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/domestik" className="inline-flex items-center gap-2 text-blue-200 hover:text-white font-medium mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm text-sm">
            <ArrowLeft size={16} /> Kembali ke Domestik
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-md">
            {namaDaerah ? (
              <>Trip <span className="text-[#f59e0b]">{namaDaerah}</span></>
            ) : (
              <>Semua Paket <span className="text-[#f59e0b]">Domestik</span></>
            )}
          </h1>
          <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            {namaDaerah 
              ? `Eksplorasi keindahan dan petualangan seru di wilayah ${namaDaerah}. Temukan paket Open Trip maupun Private Trip yang sesuai dengan gaya liburan Anda.`
              : "Jelajahi seluruh pilihan paket wisata Nusantara terbaik kami, mulai dari Open Trip hemat hingga Private Trip eksklusif bersama rombongan Anda."}
          </p>
        </div>
      </div>

      {/* 2. KOTAK PENCARIAN & FILTER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-14 md:-mt-16 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100 flex flex-col md:flex-row gap-4">
          
          {/* Input Pencarian */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={namaDaerah ? "Cari nama paket wisata di area ini..." : "Cari nama paket atau daerah tujuan..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] text-sm font-medium transition-all"
            />
          </div>
          
          {/* Dropdown Filter */}
          <div className="w-full md:w-64 relative">
            <Filter className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <select 
              value={filterTrip}
              onChange={(e) => setFilterTrip(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] text-sm font-medium bg-white appearance-none cursor-pointer transition-all"
            >
              <option value="Semua">Semua Jenis Trip</option>
              <option value="Open Trip">Open Trip (Gabungan)</option>
              <option value="Private Trip">Private Trip (Grup)</option>
            </select>
          </div>
          
        </div>
      </div>

      {/* 3. DAFTAR PAKET WISATA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!loading && paket.length > 0 && (
          <div className="mb-6 text-gray-500 text-sm font-medium">
            Menampilkan <span className="font-bold text-[#1e3a8a]">{filteredPaket.length}</span> paket wisata.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center h-40 items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div></div>
        ) : paket.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Paket</h3>
            <p className="text-gray-500">Saat ini belum ada paket wisata yang tersedia.</p>
          </div>
        ) : filteredPaket.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Pencarian Tidak Ditemukan</h3>
            <p className="text-gray-500">Tidak ada paket yang cocok dengan kata kunci "{searchQuery}" atau filter yang dipilih.</p>
            <button onClick={() => { setSearchQuery(""); setFilterTrip("Semua"); }} className="mt-4 text-[#1e3a8a] font-bold hover:underline">Reset Pencarian</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPaket.map((item) => (
              <Link to={`/paket/domestik/${item.id}`} key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group cursor-pointer w-full h-full">
                
                {/* ================= 1. BAGIAN FOTO ================= */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img src={item.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800"} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
                  
                  {/* POSISI ATAS: Jenis Paket (Badge Promo/Reguler dll) */}
                  {item.badge && item.badge !== "Tidak Ada" && item.badge.trim() !== "" && (
                    <div className={`absolute top-4 left-4 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-sm ${badgeColors[item.badge] || item.badgeColor || 'bg-[#1e3a8a]'}`}>
                      {item.badge}
                    </div>
                  )}
                  
                  {/* POSISI BAWAH: Tipe Trip (Open Trip / Private Trip) */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[#1e3a8a] flex items-center gap-1.5 shadow-sm">
                    <Users size={12}/> {item.tipeTrip || "Open Trip"}
                  </div>
                </div>

                {/* ================= 2. BAGIAN KONTEN BAWAH FOTO ================= */}
                <div className="p-5 flex-1 flex flex-col">
                  
                  {/* URUTAN 1: Daerah */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#f59e0b] mb-1.5 uppercase tracking-wide">
                    <MapPin size={12} /> {item.daerah || namaDaerah || "Domestik"}
                  </div>
                  
                  {/* URUTAN 2: Judul */}
                  <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-[#1e3a8a] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  
                  {/* URUTAN 3: Ikon-Ikon (Seimbang Kiri-Kanan & 1 Warna) */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-3 mb-5 border-b border-gray-100 pb-5">
                    {/* Durasi */}
                    <div className="flex items-start gap-1.5 text-xs text-gray-600 font-semibold">
                      <Clock size={14} className="text-[#1e3a8a] shrink-0 mt-0.5" /> 
                      <span className="line-clamp-2">{item.duration || "Durasi Fleksibel"}</span>
                    </div>
                    
                    {/* Transportasi Dinamis (Hanya Tampilkan Deskripsi User) */}
                    {(item.transportasi || []).map((tr, idx) => {
                      const TransportIcon = getTransportIcon(tr.jenis);
                      return (
                        <div key={`trans-${idx}`} className="flex items-start gap-1.5 text-xs text-gray-600 font-semibold" title={tr.deskripsi || tr.jenis}>
                          <TransportIcon size={14} className="text-[#1e3a8a] shrink-0 mt-0.5" /> 
                          <span className="line-clamp-2">{tr.deskripsi ? tr.deskripsi : tr.jenis}</span>
                        </div>
                      );
                    })}
                    
                    {/* Hotel (Ikon Building & Nama Hotel) */}
                    {item.hotel && (
                      <div className="flex items-start gap-1.5 text-xs text-gray-600 font-semibold">
                        <Building size={14} className="text-[#1e3a8a] shrink-0 mt-0.5" /> 
                        <span className="line-clamp-2">{item.hotel}</span>
                      </div>
                    )}
                  </div>

                  {/* URUTAN 4 & 5: Harga dan Tombol Aksi */}
                  <div className="flex flex-col mt-auto">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mulai Dari</p>
                    <div className="flex items-baseline gap-1 mb-4">
                      <p className="text-xl font-extrabold text-[#1e3a8a]">
                        {formatRupiah(item.price || item.hargaOpenTrip || item.hargaPrivateTrip)}
                      </p>
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
        )}
      </div>
    </div>
  );
}

export default DomestikDaerah;