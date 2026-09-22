import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { 
  MapPin, Clock, Users, Calendar, ChevronRight, 
  Plane, Building, Box, Star, ShieldCheck, Heart, Award, ThumbsUp, Gem, Bus, TrainFront, Search
} from "lucide-react";

const IconMap = { ShieldCheck, Star, Heart, Clock, Award, MapPin, ThumbsUp, Users, Gem, Bus, Plane, Building, TrainFront };

const defaultUmrohConfig = {
  heroSmallText: "Perjalanan Ibadah",
  heroSmallTextSize: "text-[10px] md:text-sm",
  heroTitle: "Perjalanan Umroh Nyaman,\nIbadah Makin Bermakna", 
  heroDesc: "Kami hadir untuk memberikan pengalaman ibadah Umroh yang nyaman.", 
  heroBg: "https://images.unsplash.com/photo-1565552643982-b5e13d9646b9?q=80&w=2000",
  heroTitleSize: "text-[32px] md:text-5xl lg:text-6xl",
  heroBgPos: "bg-center",
  f1Text: "Amanah & Terpercaya", f1Icon: "ShieldCheck", 
  f2Text: "Pembimbing Berpengalaman", f2Icon: "Users", 
  f3Text: "Pelayanan Terbaik", f3Icon: "Star",
  ctaBg: "", ctaTitle: "Siap Berangkat Umroh?", 
  ctaDesc: "Percayakan perjalanan ibadah Anda bersama Enka Imron Mandiri.", 
  ctaBtnText: "Hubungi Kami Sekarang", ctaBtnLink: "https://wa.me/6281234567890", 
  ctaBgColor: "bg-[#0f172a]", ctaBgPos: "object-center"
};

function Umroh() {
  const [config, setConfig] = useState(defaultUmrohConfig);
  const [paket, setPaket] = useState([]);
  const [keunggulan, setKeunggulan] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Slideshow Mobile & Pencarian
  const [beritaSlide, setBeritaSlide] = useState(0);
  const [searchWaktu, setSearchWaktu] = useState("");
  const [searchTipe, setSearchTipe] = useState("");

  useEffect(() => {
    const fetchUmrohData = async () => {
      try {
        const configSnap = await getDoc(doc(db, "settings", "umroh"));
        if (configSnap.exists()) setConfig({ ...defaultUmrohConfig, ...configSnap.data() });

        const paketSnap = await getDocs(collection(db, "paket_umroh"));
        setPaket(paketSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const keunggulanSnap = await getDocs(collection(db, "keunggulan_umroh"));
        setKeunggulan(keunggulanSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const qBerita = query(collection(db, "berita"), where("tipe", "==", "Umroh"));
        const newsSnap = await getDocs(qBerita);
        setNews(newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { 
        console.error("Gagal mengambil data umroh:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchUmrohData();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (news.length > 1) setBeritaSlide((prev) => (prev + 1) % news.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [news.length]);

  const formatRupiah = (angka) => { if (!angka) return "Rp 0"; return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka); };
  const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, '') : '';
  const badgeColors = { "Promo": "bg-red-500", "Reguler": "bg-blue-600", "Premium": "bg-purple-600", "VIP": "bg-[#f59e0b]" };

  // FUNGSI BARU: Mengubah format tanggal (MM/DD/YYYY atau YYYY-MM-DD) menjadi format Indonesia
  const formatTanggalIndo = (tanggalString) => {
    if (!tanggalString) return "";
    const dateObj = new Date(tanggalString);
    if (isNaN(dateObj.getTime())) return tanggalString; // Kembalikan teks asli jika bukan format tanggal
    
    const bulanIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return `${dateObj.getDate()} ${bulanIndo[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  };

  const getCtaGradient = (bgColor) => {
    switch(bgColor) {
      case "bg-[#1e3a8a]": return "from-[#1e3a8a]/95 via-[#1e3a8a]/70 to-transparent";
      case "bg-[#f59e0b]": return "from-[#f59e0b]/95 via-[#f59e0b]/70 to-transparent";
      case "bg-emerald-800": return "from-emerald-800/95 via-emerald-800/70 to-transparent";
      case "bg-black": return "from-black/95 via-black/70 to-transparent";
      default: return "from-[#0f172a]/95 via-[#0f172a]/70 to-transparent";
    }
  };

  const displayedPaket = paket.filter(pkg => {
    const matchWaktu = searchWaktu === "" || (pkg.waktuInfo && pkg.waktuInfo.toLowerCase().includes(searchWaktu.toLowerCase()));
    const matchTipe = searchTipe === "" || (pkg.badge === searchTipe);
    return matchWaktu && matchTipe;
  });

  const renderPaketCard = (pkg) => (
    <Link to={`/paket/umroh/${pkg.id}`} key={pkg.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group cursor-pointer w-full">
      <div className="relative h-48 overflow-hidden">
        <img src={pkg.image || "https://images.unsplash.com/photo-1565552643982-b5e13d9646b9?q=80&w=800"} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>
        
        {/* Badge (Promo/VIP/dsb) tetap dipertahankan */}
        {pkg.badge && pkg.badge !== "Tidak Ada" && pkg.badge.trim() !== "" && (
          <div className={`absolute top-4 left-4 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-md ${badgeColors[pkg.badge] || pkg.badgeColor || 'bg-blue-600'}`}>
            {pkg.badge}
          </div>
        )}
        
        {/* BAGIAN INDIKATOR DURASI DI ATAS FOTO SUDAH DIHAPUS DI SINI */}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#f59e0b] mb-1.5 uppercase tracking-wide">
          {pkg.tipeWaktu === 'bulan' ? `Bulan ${pkg.waktuInfo}` : formatTanggalIndo(pkg.waktuInfo)}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-[#1e3a8a] transition-colors leading-snug">{pkg.title}</h3>
        
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 mb-5 border-b border-gray-100 pb-5 text-[11px] md:text-xs text-gray-600 font-semibold">
          <div className="flex items-center gap-1.5"><Clock size={14} className="text-[#1e3a8a] shrink-0" /> <span className="line-clamp-1">{pkg.duration || "9 Hari"}</span></div>
          {pkg.maskapai && (
            <div className="flex items-center gap-1.5"><Plane size={14} className="text-[#1e3a8a] shrink-0" /> <span className="line-clamp-1">{pkg.maskapai}</span></div>
          )}
          <div className="flex items-center gap-1.5"><Building size={14} className="text-[#1e3a8a] shrink-0" /> <span className="line-clamp-1">Mekah: ⭐{pkg.bintangMekah || 5}</span></div>
          <div className="flex items-center gap-1.5"><Building size={14} className="text-[#1e3a8a] shrink-0" /> <span className="line-clamp-1">Madinah: ⭐{pkg.bintangMadinah || 5}</span></div>
          
          {pkg.keretaCepat === "ya" && (
            <div className="flex items-center gap-1.5 col-span-2 mt-1"><TrainFront size={14} className="text-[#1e3a8a] shrink-0" /> <span className="line-clamp-1">Kereta Cepat Haramain</span></div>
          )}
        </div>
        
        <div className="flex flex-col mt-auto">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mulai dari</span>
          <div className="flex items-baseline gap-1 mb-4">
            <p className="text-xl font-extrabold text-[#1e3a8a]">{formatRupiah(pkg.price)}</p>
            <span className="text-gray-500 text-xs font-semibold">/pax</span>
          </div>
          <div className="w-full text-center bg-[#f59e0b] group-hover:bg-yellow-600 text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
            Lihat Detail
          </div>
        </div>
      </div>
    </Link>
  );

  const renderBeritaCard = (item) => (
    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group flex flex-col w-full">
      <Link to={`/berita/${item.id}`} className="relative h-48 overflow-hidden block">
        <img src={item.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{item.category || "Berita"}</span>
          <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5"><Calendar size={12}/> {item.date}</p>
        </div>
        <Link to={`/berita/${item.id}`}><h3 className="text-base font-bold text-[#1e3a8a] mb-2 leading-snug line-clamp-2 hover:text-[#f59e0b] transition-colors">{item.title}</h3></Link>
        <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">{stripHtml(item.text)}</p>
        <Link to={`/berita/${item.id}`} className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-[#1e3a8a] hover:text-[#f59e0b] transition-colors">Baca Artikel <ChevronRight size={14}/></Link>
      </div>
    </div>
  );

  return (
    <div className="pt-20 bg-slate-50 min-h-screen overflow-x-hidden">
      
      <div className="relative bg-[#0f172a] pt-16 pb-32 md:pt-24 md:pb-28">
        <div className={`absolute inset-0 bg-cover ${config.heroBgPos || 'bg-center'}`} style={{ backgroundImage: `url('${config.heroBg || defaultUmrohConfig.heroBg}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/90 via-[#1e3a8a]/60 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          {config.heroSmallText && (
            <p className={`text-[#f59e0b] font-bold tracking-widest ${config.heroSmallTextSize || 'text-[10px] md:text-sm'} mb-2 md:mb-3 uppercase`}>{config.heroSmallText}</p>
          )}
          <h1 className={`${config.heroTitleSize || 'text-[32px] md:text-5xl lg:text-6xl'} font-bold text-white mb-3 md:max-w-2xl leading-tight whitespace-pre-wrap`}>{config.heroTitle}</h1>
          <p className="text-blue-100 text-[13px] md:text-lg max-w-[260px] md:max-w-xl mb-6 leading-relaxed whitespace-pre-wrap">{config.heroDesc}</p>

          <div className="hidden md:flex flex-wrap items-center gap-6 mt-10">
            {[{ text: config.f1Text, iconStr: config.f1Icon }, { text: config.f2Text, iconStr: config.f2Icon }, { text: config.f3Text, iconStr: config.f3Icon }].map((item, index) => {
              if (!item.text) return null;
              const IconComp = IconMap[item.iconStr] || Star;
              return (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 shadow-sm">
                  <div className="bg-[#f59e0b] p-2 rounded-full text-white"><IconComp size={16} /></div>
                  <span className="text-white font-bold text-sm tracking-wide">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 md:-mt-16 mb-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col relative md:col-span-2">
              <label className="text-xs font-semibold text-gray-500 mb-1 ml-1">Bulan / Keberangkatan</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input type="text" placeholder="Contoh: September, Ramadhan..." value={searchWaktu} onChange={(e) => setSearchWaktu(e.target.value)} className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-sm font-semibold"/>
              </div>
            </div>
            <div className="flex flex-col relative">
              <label className="text-xs font-semibold text-gray-500 mb-1 ml-1">Kategori Paket</label>
              <div className="relative">
                <Star size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <select value={searchTipe} onChange={(e) => setSearchTipe(e.target.value)} className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-sm font-semibold appearance-none bg-white">
                  <option value="">Semua Kategori</option>
                  <option value="Promo">Promo</option>
                  <option value="Reguler">Reguler</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>
            <button onClick={() => { if(!searchWaktu && !searchTipe) alert("Pilih kategori atau ketikkan bulan untuk mencari!") }} className="bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2">
              <Search size={18} /> Cari Paket
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a] border-t-transparent"></div></div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-24">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Paket Umroh Pilihan</h2>
              {(paket.length > 4 || displayedPaket.length > 2) && (
                <Link to="/umroh/paket" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition">
                  Lihat Semua Paket <ChevronRight size={18}/>
                </Link>
              )}
            </div>
            
            {displayedPaket.length > 0 ? (
               <>
                 <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {displayedPaket.slice(0, 4).map((pkg) => renderPaketCard(pkg))}
                 </div>
                 
                 <div className="grid sm:hidden grid-cols-1 gap-6">
                   {displayedPaket.slice(0, 2).map((pkg) => renderPaketCard(pkg))}
                 </div>
                 
                 {displayedPaket.length > 2 && (
                    <div className="mt-8 flex justify-center sm:hidden">
                      <Link to="/umroh/paket" className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm bg-blue-50 py-3 px-6 rounded-xl w-full justify-center">Lihat Semua Paket <ChevronRight size={18}/></Link>
                    </div>
                 )}
               </>
            ) : (
               <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
                 Tidak ditemukan paket yang sesuai dengan pencarian Anda. <br/>
                 <button onClick={() => { setSearchWaktu(""); setSearchTipe(""); }} className="text-[#1e3a8a] font-bold mt-2">Reset Pencarian</button>
               </div>
            )}
          </div>

          {news.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
              <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Berita & Kegiatan</h2>
                {news.length > 3 && (
                  <Link to="/berita" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition">
                    Lihat Semua Berita <ChevronRight size={18}/>
                  </Link>
                )}
              </div>
              
              <div className="hidden sm:grid sm:grid-cols-3 gap-6">
                {news.slice(0, 3).map((item) => renderBeritaCard(item))}
              </div>

              <div className="block sm:hidden relative pb-10">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  {renderBeritaCard(news[beritaSlide])}
                </div>
                <div className="flex justify-center gap-2 mt-4 absolute bottom-0 left-0 right-0">
                  {news.map((_, idx) => (
                    <button key={idx} onClick={() => setBeritaSlide(idx)} className={`h-2 rounded-full transition-all ${beritaSlide === idx ? "bg-[#1e3a8a] w-6" : "bg-gray-300 w-2"}`}></button>
                  ))}
                </div>
              </div>

              {news.length > 1 && (
                <div className="mt-8 flex justify-center sm:hidden">
                  <Link to="/berita" className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm bg-blue-50 py-3 px-6 rounded-xl w-full justify-center">Lihat Semua Berita <ChevronRight size={18}/></Link>
                </div>
              )}
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <div className="text-center mb-12"><h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a]">Mengapa Memilih Kami?</h2></div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {keunggulan.length > 0 ? keunggulan.map((fitur) => {
                const DynamicIcon = IconMap[fitur.icon] || Star;
                return (
                  <div key={fitur.id} className="flex flex-col items-center text-center max-w-[180px] group">
                    <div className="w-16 h-16 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-lg mb-4 group-hover:-translate-y-1 transition-transform"><DynamicIcon size={28} /></div>
                    <h4 className="text-[14px] md:text-base font-bold text-[#1e3a8a] mb-2 leading-tight">{fitur.title}</h4>
                    <p className="text-gray-500 text-[11px] md:text-xs leading-relaxed">{fitur.deskripsi}</p>
                  </div>
                );
              }) : (<div className="w-full text-center text-gray-400 text-sm">Keunggulan belum ditambahkan.</div>)}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className={`relative rounded-3xl overflow-hidden shadow-xl min-h-[200px] md:min-h-[250px] flex items-center ${config.ctaBgColor || 'bg-[#1e3a8a]'}`}>
              <div className="absolute inset-0 w-full h-full"><img src={config.ctaBg || defaultUmrohConfig.heroBg} className={`w-full h-full object-cover ${config.ctaBgPos || 'object-center'}`} /></div>
              <div className={`absolute inset-0 bg-gradient-to-r ${getCtaGradient(config.ctaBgColor || 'bg-[#1e3a8a]')}`}></div>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>
              <div className="relative z-10 w-full md:w-2/3 p-8 md:p-12 text-left">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-snug">{config.ctaTitle || "Siap Berangkat Umroh?"}</h2>
                <p className="text-blue-100 mb-6 text-sm md:text-base max-w-xl leading-relaxed">{config.ctaDesc || "Percayakan perjalanan ibadah Anda bersama Enka Imron Mandiri."}</p>
                <Link to={config.ctaBtnLink || "https://wa.me/6281234567890"} target="_blank" className="inline-block bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-colors text-sm md:text-base">{config.ctaBtnText || "Hubungi Kami"}</Link>
              </div>
            </div>
          </div>
          
        </>
      )}
    </div>
  );
}

export default Umroh;