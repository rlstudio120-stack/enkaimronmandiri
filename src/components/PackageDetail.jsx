import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Calendar, Clock, Plane, ShieldCheck, MapPin, Ship, Train, ChevronDown, ChevronUp } from "lucide-react"; 

// --- KOMPONEN KHUSUS ACCORDION (BUKA-TUTUP) ---
const AccordionItem = ({ title, content, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  if (!content || content.trim() === "") return null; // Sembunyikan jika isi kosong

  return (
    <div className="border border-gray-200 rounded-2xl mb-4 overflow-hidden shadow-sm bg-white">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-full flex justify-between items-center p-5 md:px-6 transition-colors duration-300 ${isOpen ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
      >
        <h3 className={`font-bold text-lg ${isOpen ? 'text-blue-700' : 'text-gray-800'}`}>{title}</h3>
        <div className={`p-1.5 rounded-full ${isOpen ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {isOpen ? <ChevronUp size={20} className="text-blue-600" /> : <ChevronDown size={20} className="text-gray-500" />}
        </div>
      </button>
      
      {/* Animasi Buka Tutup (CSS Transisi) */}
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-5 md:p-6 border-t border-gray-100">
          <div className="prose max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};


function PackageDetail() {
  const { type, id } = useParams();
  const [paket, setPaket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const colName = type === "umroh" ? "paket_umroh" : "paket_domestik";
        const docRef = doc(db, colName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaket({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaket();
  }, [type, id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-xl text-blue-900">Memuat detail paket...</div>;
  if (!paket) return <div className="h-screen flex items-center justify-center font-bold text-xl text-red-600">Paket tidak ditemukan.</div>;

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

  const hubungiWhatsApp = () => {
    const nomorWA = "6281234567890"; // Ganti dengan nomor Admin
    const pesan = `Halo Admin Enka Imron Mandiri, saya tertarik untuk konsultasi mengenai paket *${paket.title}*. Bisa mohon info lebih lanjut?`;
    window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, "_blank");
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Navigasi Kembali */}
        <Link to={`/${type}`} className="inline-flex items-center text-gray-500 hover:text-blue-600 font-semibold mb-6 transition">
          ← Kembali ke Daftar Paket
        </Link>

        {/* HERO IMAGE FULL WIDTH */}
        <div className="w-full h-[300px] md:h-[450px] relative rounded-3xl overflow-hidden mb-8 shadow-sm border border-gray-100">
          <img src={paket.image} alt={paket.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {paket.tampilBadge !== "tidak" && paket.badge && (
            <div className="absolute top-6 left-6 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg bg-red-600">
              {paket.badge}
            </div>
          )}

          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-shadow-lg leading-tight">{paket.title}</h1>
            <p className="text-lg opacity-90 font-medium">Paket Perjalanan {type === 'umroh' ? 'Umroh' : 'Domestik'} Terbaik Bersama Kami</p>
          </div>
        </div>

        {/* LAYOUT GRID UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: INFO HOTEL & ACCORDION DESKRIPSI */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* KOTAK HOTEL (Khusus Umroh) */}
            {type === "umroh" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div className="border border-gray-200 rounded-2xl p-5 flex items-center gap-5 bg-white shadow-sm hover:shadow-md transition">
                  <div className="text-5xl drop-shadow-sm">🕋</div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-extrabold tracking-wider mb-1">Hotel Mekah</p>
                    <p className="font-bold text-gray-800 text-lg">
                      {paket.pakaiNamaHotel === "ya" && paket.hotelMekah ? paket.hotelMekah : `Hotel Bintang ${paket.bintangMekah || 5}`}
                    </p>
                    <p className="text-yellow-400 text-sm mt-1 tracking-widest drop-shadow-sm">{Array(Number(paket.bintangMekah || 5)).fill("⭐").join("")}</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-2xl p-5 flex items-center gap-5 bg-white shadow-sm hover:shadow-md transition">
                  <div className="text-5xl drop-shadow-sm">🕌</div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-extrabold tracking-wider mb-1">Hotel Madinah</p>
                    <p className="font-bold text-gray-800 text-lg">
                      {paket.pakaiNamaHotel === "ya" && paket.hotelMadinah ? paket.hotelMadinah : `Hotel Bintang ${paket.bintangMadinah || 5}`}
                    </p>
                    <p className="text-yellow-400 text-sm mt-1 tracking-widest drop-shadow-sm">{Array(Number(paket.bintangMadinah || 5)).fill("⭐").join("")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* AREA INFORMASI ACCORDION */}
            <div className="space-y-4">
              {/* Accordion 1: Informasi Paket (Selalu ada dan terbuka di awal) */}
              <AccordionItem title="Informasi Paket" content={paket.deskripsi} defaultOpen={true} />
              
              {/* Accordion Tambahan (Otomatis muncul jika Admin menambahkannya) */}
              {paket.informasiTambahan && paket.informasiTambahan.map((info, idx) => (
                <AccordionItem key={idx} title={info.judul || "Informasi Tambahan"} content={info.isi} />
              ))}
            </div>

          </div>

          {/* KOLOM KANAN: KARTU HARGA, FASILITAS, & WHATSAPP */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 sticky top-28">
              
              <div className="border-b border-gray-100 pb-5 mb-5">
                <p className="text-sm text-gray-500 font-semibold mb-1">Harga Paket Mulai</p>
                <h3 className="text-3xl font-extrabold text-[#f59e0b]">
                  {formatRupiah(paket.hargaOpenTrip || paket.hargaPrivateTrip || paket.price)}
                </h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Ringkasan Info</h4>
                
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600"><Calendar size={20} strokeWidth={2.5}/></div>
                  <div><p className="text-xs text-gray-500 font-medium">Jadwal Keberangkatan</p><p className="text-sm font-bold text-gray-800">{type === "umroh" ? formatWaktu(paket.tipeWaktu, paket.waktuInfo) : "Sesuai Jadwal"}</p></div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600"><Clock size={20} strokeWidth={2.5}/></div>
                  <div><p className="text-xs text-gray-500 font-medium">Durasi Perjalanan</p><p className="text-sm font-bold text-gray-800">{paket.duration}</p></div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">{type === "umroh" ? <Plane size={20} strokeWidth={2.5}/> : <Ship size={20} strokeWidth={2.5}/>}</div>
                  <div><p className="text-xs text-gray-500 font-medium">{type === "umroh" ? "Maskapai" : "Transportasi"}</p><p className="text-sm font-bold text-gray-800 uppercase">{paket.maskapai || paket.airline || paket.transport || "-"}</p></div>
                </div>

                {/* LOGIKA MENAMPILKAN KERETA CEPAT */}
                {paket.keretaCepat === "ya" && type === "umroh" && (
                  <div className="flex items-center gap-4 mt-2">
                    <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600 border border-purple-100">
                      <Train size={20} strokeWidth={2.5}/>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Fasilitas Premium</p>
                      <p className="text-sm font-bold text-gray-800">Kereta Cepat Haramain</p>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={hubungiWhatsApp} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/30 flex justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.005-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.05-.084-.182-.133-.38-.232"/></svg>
                Konsultasi WhatsApp
              </button>

              <div className="mt-4 bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-center gap-2 text-sm text-gray-600 font-medium">
                <ShieldCheck size={18} className="text-blue-500"/>
                Terjamin & Terpercaya
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageDetail;