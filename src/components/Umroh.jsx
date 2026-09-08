import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { Calendar, Clock, Plane, Train } from "lucide-react"; // Menambahkan icon Train

// Import komponen UI bawaan Anda
import UmrohFeatures from "./UmrohFeatures";
import UmrohNews from "./UmrohNews";
import UmrohCTA from "./UmrohCTA";

function Umroh() {
  const [paket, setPaket] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const snapshot = await getDocs(collection(db, "paket_umroh"));
        const dataList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPaket(dataList);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaket();
  }, []);

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const formatWaktu = (tipe, waktu) => {
    if (!waktu) return "Belum ditentukan";
    if (tipe === "tanggal") {
      const dateObj = new Date(waktu);
      return dateObj.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return waktu;
  };

  // Memastikan warna badge sesuai dengan input Admin
  const badgeColors = {
    "bg-blue-600": "bg-blue-600",
    "bg-red-600": "bg-red-600",
    "bg-green-600": "bg-green-600",
    "bg-yellow-500": "bg-[#f59e0b]", // Kuning/Oranye
    "bg-purple-600": "bg-purple-600",
  };

  return (
    <div className="pt-20 bg-slate-50">
      
      {/* Bagian Hero Umroh */}
      <div className="relative bg-[#1e3a8a] pb-32 pt-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=2000')" }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-[#f59e0b] font-bold tracking-widest text-sm mb-3 uppercase">Umroh</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-2xl">
            Perjalanan Umroh Nyaman, Ibadah Makin Bermakna
          </h1>
          <p className="text-gray-200 text-lg max-w-xl mb-8">
            Kami hadir untuk memberikan pengalaman ibadah Umroh yang nyaman, aman, dan penuh keberkahan bersama Enka Imron Mandiri.
          </p>
          
          <div className="flex flex-wrap gap-6 text-white font-medium">
            <span className="flex items-center gap-2 text-sm md:text-base">🛡️ Amanah & Terpercaya</span>
            <span className="flex items-center gap-2 text-sm md:text-base">👥 Pembimbing Berpengalaman</span>
            <span className="flex items-center gap-2 text-sm md:text-base">⭐ Pelayanan Terbaik</span>
          </div>
        </div>
      </div>

      {/* Kotak Pencarian Paket Umroh */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-20 mb-12">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Tanggal Berangkat</label>
              <input type="date" className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]"/>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Durasi</label>
              <select className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]">
                <option>Pilih Durasi</option><option>9 Hari</option><option>12 Hari</option><option>14 Hari</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Maskapai</label>
              <select className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]">
                <option>Pilih Maskapai</option><option>Saudia Airlines</option><option>Garuda Indonesia</option><option>Lion Air</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Jumlah Jamaah</label>
              <select className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]">
                <option>1 Dewasa</option><option>2 Dewasa</option><option>3 Dewasa</option>
              </select>
            </div>
            <button className="bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-2.5 rounded-md transition duration-300">
              Cari Paket Umroh
            </button>
          </div>
        </div>
      </div>

      {/* --- GRID PAKET DINAMIS (4 KOLOM) --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-3">Pilihan Paket Umroh Terbaik</h2>
          <div className="w-20 h-1 bg-[#f59e0b] mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a] border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paket.map((item) => (
              <Link 
                to={`/paket/umroh/${item.id}`} 
                key={item.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group cursor-pointer"
              >
                {/* Gambar Proporsional & Badge */}
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50"></div>
                  
                  {item.tampilBadge !== "tidak" && item.badge && (
                    <div className={`absolute top-3 left-3 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md ${badgeColors[item.badgeColor] || 'bg-[#1e3a8a]'}`}>
                      {item.badge}
                    </div>
                  )}
                </div>

                {/* Konten Paket */}
                <div className="p-4 md:p-5 flex-1 flex flex-col">
                  <h3 className="text-[17px] font-bold text-gray-800 mb-3 line-clamp-2 leading-snug group-hover:text-[#1e3a8a] transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Grid Icon 2 Sisi (Warna Biru Seragam) */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-3 mb-5 flex-1 items-start">
                    
                    {/* SISI KIRI */}
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2 text-[11px] text-gray-600 font-semibold">
                        <Calendar size={14} className="text-[#1e3a8a] mt-0.5 shrink-0" />
                        <span className="line-clamp-2 leading-tight">{formatWaktu(item.tipeWaktu, item.waktuInfo)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-600 font-semibold">
                        <Clock size={14} className="text-[#1e3a8a] shrink-0" />
                        <span className="line-clamp-1">{item.duration}</span>
                      </div>
                    </div>

                    {/* SISI KANAN */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-gray-600 font-semibold">
                        <Plane size={14} className="text-[#1e3a8a] shrink-0" />
                        <span className="line-clamp-1 uppercase">{item.maskapai || "-"}</span>
                      </div>
                      {/* Tampil hanya jika Kereta Cepat dicentang 'ya' */}
                      {item.keretaCepat === "ya" && (
                        <div className="flex items-start gap-2 text-[11px] text-gray-600 font-semibold">
                          <Train size={14} className="text-[#1e3a8a] mt-0.5 shrink-0" />
                          <span className="line-clamp-2 leading-tight">Kereta Cepat</span>
                        </div>
                      )}
                    </div>
                    
                  </div>

                  {/* Harga & Tombol Selalu Tampil */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Harga Mulai</p>
                      <p className="text-lg font-extrabold text-[#f59e0b]">{formatRupiah(item.price)}</p>
                    </div>
                    
                    <div className="bg-[#f59e0b] group-hover:bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors duration-300 shadow-sm">
                      Detail
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && paket.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg">Belum ada paket umroh yang tersedia saat ini.</p>
          </div>
        )}
      </div>

      <UmrohFeatures />
      <UmrohNews />
      <UmrohCTA />
    </div>
  );
}

export default Umroh;