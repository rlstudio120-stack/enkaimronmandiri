import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import SharePackage from "./SharePackage";
import { 
  Clock, Calendar, ArrowLeft, ChevronRight, 
  Plane, Building, TrainFront, ChevronDown, ChevronUp, Star,
  FileImage, ZoomIn, Download, X
} from "lucide-react";

const formatWaNumber = (num) => {
  if (!num) return "";
  let clean = num.toString().replace(/\D/g, "");
  if (clean.startsWith("0")) clean = "62" + clean.slice(1);
  return clean;
};

function DetailUmroh() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paket, setPaket] = useState(null);
  const [config, setConfig] = useState(null); 
  const [waNumber, setWaNumber] = useState("6281234567890");
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "paket_umroh", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaket({ id: docSnap.id, ...docSnap.data() });
          document.title = `${docSnap.data().title} | Enka Imron Mandiri`;
        }
        
        const configSnap = await getDoc(doc(db, "settings", "umroh"));
        if (configSnap.exists()) {
          setConfig(configSnap.data());
        }

        const idSnap = await getDoc(doc(db, "settings", "identitas"));
        if (idSnap.exists()) {
          const d = idSnap.data();
          const targetWa = formatWaNumber(d.noWaUmroh) || formatWaNumber(d.noWa) || "6281234567890";
          setWaNumber(targetWa);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const toggleAccordion = (index) => setOpenAccordion(openAccordion === index ? null : index);

  const getCtaGradient = (bgColor) => {
    switch(bgColor) {
      case "bg-[#1e3a8a]": return "from-[#1e3a8a]/95 via-[#1e3a8a]/70 to-transparent";
      case "bg-[#f59e0b]": return "from-[#f59e0b]/95 via-[#f59e0b]/70 to-transparent";
      case "bg-emerald-800": return "from-emerald-800/95 via-emerald-800/70 to-transparent";
      case "bg-black": return "from-black/95 via-black/70 to-transparent";
      default: return "from-[#0f172a]/95 via-[#0f172a]/70 to-transparent";
    }
  };

  const badgeColors = { "Promo": "bg-red-500", "Reguler": "bg-blue-600", "Premium": "bg-purple-600", "VIP": "bg-[#f59e0b]" };

  const renderStars = (count) => {
    return Array.from({ length: parseInt(count) || 0 }).map((_, i) => (
      <Star key={i} size={12} className="text-[#f59e0b] fill-current" />
    ));
  };

  // Fungsi Download Gambar Flyer Langsung ke Perangkat
  const handleDownloadImage = async (imgUrl, title) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Brosur-${(title || "Paket").replace(/\s+/g, "-")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(imgUrl, "_blank");
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div></div>;
  if (!paket) return <div className="min-h-screen flex flex-col justify-center items-center pt-20"><h2 className="text-2xl font-bold mb-4">Paket Tidak Ditemukan</h2><button onClick={() => navigate(-1)} className="bg-[#1e3a8a] text-white px-6 py-2 rounded-xl">Kembali</button></div>;

  const infoKeberangkatan = paket.tipeWaktu === "bulan" ? `Bulan ${paket.waktuInfo || "-"}` : (paket.waktuInfo || "-");
  const pesanPaket = `Assalamu'alaikum Admin Umroh Enka Imron Mandiri, saya tertarik untuk berkonsultasi mengenai paket ibadah umroh:\n\n*Nama Paket:* ${paket.title}\n*Keberangkatan:* ${infoKeberangkatan}\n*Durasi:* ${paket.duration || "9 Hari"}\n*Maskapai:* ${paket.maskapai || "-"}\n\nMohon informasi lebih lanjut mengenai ketersediaan seat dan persyaratannya. Terima kasih.`;
  const linkWaPaket = `https://wa.me/${waNumber}?text=${encodeURIComponent(pesanPaket)}`;

  const pesanCta = `Assalamu'alaikum Admin Umroh Enka Imron Mandiri, saya sedang melihat paket *${paket.title}* dan ingin berkonsultasi lebih lanjut mengenai pendaftaran ibadah umroh.`;
  const linkWaCta = `https://wa.me/${waNumber}?text=${encodeURIComponent(pesanCta)}`;

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#1e3a8a] font-bold mb-6 transition-colors">
          <ArrowLeft size={18} /> Kembali ke Pilihan Paket
        </button>

        {/* HERO GAMBAR COVER */}
        <div className="relative w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden mb-10 shadow-lg bg-[#0f172a] group">
          <img src={paket.image} alt={paket.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/40 to-transparent"></div>
          
          {/* Tombol Pojok Kanan Atas: Perbesar Cover / Lihat Brosur */}
          <div className="absolute top-5 right-5 flex gap-2 z-10">
            {paket.flyer && (
              <button 
                onClick={() => setLightboxImg(paket.flyer)} 
                className="bg-[#f59e0b] hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
              >
                <FileImage size={16} /> Lihat Flyer Promosi
              </button>
            )}
            <button 
              onClick={() => setLightboxImg(paket.image)} 
              className="bg-black/40 hover:bg-black/70 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-all"
              title="Perbesar Gambar Cover"
            >
              <ZoomIn size={16} /> <span className="hidden sm:inline">Perbesar Foto</span>
            </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Clock size={14}/> {paket.duration || "9 Hari"}
              </span>
              
              {paket.badge && paket.badge !== "Tidak Ada" && (
                <span className={`text-white px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm ${badgeColors[paket.badge] || paket.badgeColor || 'bg-purple-600'}`}>
                  {paket.badge}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">{paket.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-[#1e3a8a] mb-6 border-b pb-4">Rincian Perjalanan Ibadah</h3>
              <div className="text-gray-700 leading-relaxed text-sm md:text-base 
                [&>p]:mb-4 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-[#1e3a8a] [&>h3]:mb-3 [&>h3]:mt-6
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ul>li]:mb-1.5"
                dangerouslySetInnerHTML={{ __html: paket.deskripsi }} />
            </div>

            {paket.informasiTambahan && paket.informasiTambahan.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-6">Informasi Tambahan</h3>
                <div className="space-y-3">
                  {paket.informasiTambahan.map((info, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => toggleAccordion(index)} className="w-full bg-slate-50 hover:bg-slate-100 px-6 py-4 flex justify-between items-center transition-colors outline-none text-left">
                        <span className="font-bold text-gray-800 text-sm">{info.judul}</span>
                        {openAccordion === index ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                      </button>
                      <div className={`transition-all duration-300 ${openAccordion === index ? "max-h-[1000px] opacity-100 border-t border-gray-200" : "max-h-0 opacity-0 overflow-hidden"}`}>
                        <div className="p-6 text-sm text-gray-600 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1" dangerouslySetInnerHTML={{ __html: info.isi }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 sticky top-28">
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 border-b border-gray-100 pb-4">Fasilitas Paket</h3>
              
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-2.5 rounded-xl text-[#1e3a8a]"><Calendar size={20}/></div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Keberangkatan</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5 capitalize">
                      {infoKeberangkatan}
                    </p>
                  </div>
                </div>

                {paket.maskapai && (
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-2.5 rounded-xl text-[#1e3a8a]"><Plane size={20}/></div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Maskapai Penerbangan</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{paket.maskapai}</p>
                    </div>
                  </div>
                )}

                {(paket.hotelMekah || paket.bintangMekah) && (
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-2.5 rounded-xl text-[#1e3a8a]"><Building size={20}/></div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Hotel Mekah</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5 flex items-center gap-2">
                        {paket.pakaiNamaHotel !== "tidak" && paket.hotelMekah ? paket.hotelMekah : "Setaraf Bintang"} 
                        <span className="flex">{renderStars(paket.bintangMekah || 5)}</span>
                      </p>
                    </div>
                  </div>
                )}

                {(paket.hotelMadinah || paket.bintangMadinah) && (
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-2.5 rounded-xl text-[#1e3a8a]"><Building size={20}/></div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Hotel Madinah</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5 flex items-center gap-2">
                        {paket.pakaiNamaHotel !== "tidak" && paket.hotelMadinah ? paket.hotelMadinah : "Setaraf Bintang"}
                        <span className="flex">{renderStars(paket.bintangMadinah || 5)}</span>
                      </p>
                    </div>
                  </div>
                )}

                {paket.keretaCepat === "ya" && (
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-2.5 rounded-xl text-[#1e3a8a]"><TrainFront size={20}/></div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Transportasi Khusus</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">Kereta Cepat Haramain</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center border-t border-gray-100 pt-6 mb-6">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Harga Mulai Dari</p>
                <div className="flex justify-center items-baseline gap-1">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#f59e0b]">{formatRupiah(paket.price)}</h2>
                  <span className="text-gray-500 text-sm font-semibold">/pax</span>
                </div>
              </div>
              
              <div className="space-y-3">
             <a href={linkWaPaket} target="_blank" rel="noopener noreferrer" className="w-full bg-[#0d9118] hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 transition-colors text-sm md:text-base flex items-center justify-center gap-2">
               Konsultasi via WA <ChevronRight size={18}/>
             </a>

             {paket.flyer && (
               <button 
                 onClick={() => setLightboxImg(paket.flyer)} 
                 className="w-full bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] border border-blue-200 font-bold py-3.5 rounded-xl transition-colors text-xs md:text-sm flex items-center justify-center gap-2"
               >
                 <FileImage size={18} className="text-[#f59e0b]" /> Lihat Brosur / Flyer Paket
               </button>
             )}

             {/* TOMBOL BAGIKAN PAKET */}
             <SharePackage 
               title={paket.title} 
               price={paket.price} 
               duration={paket.duration || "9 Hari"} 
               kategori="Paket Ibadah Umroh" 
               infoTambahan={`Keberangkatan: ${infoKeberangkatan}`} 
             />
           </div>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          <div className={`relative rounded-3xl overflow-hidden shadow-xl min-h-[200px] md:min-h-[250px] flex items-center ${config?.ctaBgColor || 'bg-[#1e3a8a]'}`}>
            <div className="absolute inset-0 w-full h-full">
              <img src={config?.ctaBg || "https://images.unsplash.com/photo-1565552643982-b5e13d9646b9?q=80&w=2000"} className={`w-full h-full object-cover ${config?.ctaBgPos || 'object-center'}`} />
            </div>
            <div className={`absolute inset-0 bg-gradient-to-r ${getCtaGradient(config?.ctaBgColor || 'bg-[#1e3a8a]')}`}></div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>
            
            <div className="relative z-10 w-full md:w-2/3 p-8 md:p-12 text-left">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-snug">
                {config?.ctaTitle || "Siap Berangkat Umroh?"}
              </h2>
              <p className="text-blue-100 mb-6 text-sm md:text-base max-w-xl leading-relaxed">
                {config?.ctaDesc || "Percayakan perjalanan ibadah Anda bersama Enka Imron Mandiri. Kami siap melayani dengan amanah dan sepenuh hati."}
              </p>
              <a href={linkWaCta} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-colors text-sm md:text-base">
                {config?.ctaBtnText || "Hubungi Kami Sekarang"}
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ================= MODAL POP-UP LIGHTBOX FLYER / FOTO ================= */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)} 
          className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-y-auto"
        >
          <div className="flex items-center gap-3 mb-4 z-10" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => handleDownloadImage(lightboxImg, paket.title)} 
              className="bg-[#f59e0b] hover:bg-yellow-500 text-black font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2 shadow-lg transition"
            >
              <Download size={18} /> Download Brosur
            </button>
            <button 
              onClick={() => setLightboxImg(null)} 
              className="bg-white/10 hover:bg-red-500 text-white p-2.5 rounded-xl transition border border-white/20"
              title="Tutup"
            >
              <X size={20} />
            </button>
          </div>
          <div className="max-w-3xl w-full flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightboxImg} 
              alt="Brosur Paket" 
              className="max-h-[82vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10" 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailUmroh;