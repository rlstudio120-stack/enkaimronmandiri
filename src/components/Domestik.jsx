import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { 
  MapPin, Clock, Users, Calendar, ChevronRight, ChevronLeft,
  Plane, Bus, TrainFront, Ship, Car, Box, Star,
  ShieldCheck, Heart, Award, ThumbsUp, Gem, Zap, Smile, CheckCircle, Compass
} from "lucide-react";

const IconMap = { ShieldCheck, Star, Heart, Clock, Award, MapPin, ThumbsUp, Users, Gem, Bus, Plane, Globe: Box, Box, Zap, Smile, CheckCircle, Compass };

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

const defaultConfig = {
  heroSmallText: "Jelajahi Indonesia",
  heroSmallTextSize: "text-[10px] md:text-sm",
  heroTitle: "Destinasi Wisata Domestik Terbaik", 
  heroDesc: "Temukan keindahan alam dan budaya Indonesia melalui berbagai pilihan Open Trip dan Private Trip.", 
  heroBg: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2000",
  showBadges: "ya", d1Text: "Pemandu Profesional", d1Icon: "Users", d2Text: "Harga Transparan", d2Icon: "Star", d3Text: "Aman & Nyaman", d3Icon: "ShieldCheck",
  ctaTitle: "Ingin Menyesuaikan Isi Paket?",
  ctaDesc: "Atau ingin membuat rute perjalanan impian Anda sendiri? Konsultasikan dengan tim kami.",
  ctaBtnText: "Konsultasi via WhatsApp",
  ctaBtnLink: "https://wa.me/6281234567890",
  ctaBgColor: "bg-[#1e3a8a]"
};

function Domestik() {
  const [config, setConfig] = useState(defaultConfig);
  const [daerahList, setDaerahList] = useState([]);
  const [paketTerbaru, setPaketTerbaru] = useState([]);
  const [keunggulanList, setKeunggulanList] = useState([]);
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Slideshow Mobile
  const [paketSlide, setPaketSlide] = useState(0);
  const [beritaSlide, setBeritaSlide] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const configSnap = await getDoc(doc(db, "settings", "domestik"));
        if (configSnap.exists()) setConfig({ ...defaultConfig, ...configSnap.data() });

        const daerahSnap = await getDocs(collection(db, "destinasi_domestik"));
        const allDaerah = daerahSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDaerahList(allDaerah.filter(d => d.status !== "Nonaktif")); 

        const paketSnap = await getDocs(collection(db, "paket_domestik"));
        const paketData = paketSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPaketTerbaru(paketData.slice(0, 4));

        const keunggulanSnap = await getDocs(collection(db, "keunggulan_domestik"));
        setKeunggulanList(keunggulanSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const qBerita = query(collection(db, "berita"), where("tipe", "==", "Domestik"));
        const beritaSnap = await getDocs(qBerita);
        setBeritaList(beritaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 4)); // Ambil 4 berita
      } catch (error) { console.error("Gagal mengambil data:", error); } finally { setLoading(false); }
    };
    fetchAllData(); window.scrollTo(0, 0);
  }, []);

  // Efek Auto-Slide untuk Mobile (Setiap 4 Detik)
  useEffect(() => {
    const interval = setInterval(() => {
      if (paketTerbaru.length > 1) setPaketSlide((prev) => (prev + 1) % paketTerbaru.length);
      if (beritaList.length > 1) setBeritaSlide((prev) => (prev + 1) % beritaList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [paketTerbaru.length, beritaList.length]);

  const formatRupiah = (angka) => { if (!angka) return "Rp 0"; return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka); };
  const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, '') : '';
  const badgeColors = { "Promo": "bg-red-500", "Reguler": "bg-blue-600", "Premium": "bg-purple-600", "VIP": "bg-[#f59e0b]" };

  const getCtaGradient = (bgColor) => {
    switch(bgColor) {
      case "bg-[#1e3a8a]": return "from-[#1e3a8a]/95 via-[#1e3a8a]/70 to-transparent";
      case "bg-[#f59e0b]": return "from-[#f59e0b]/95 via-[#f59e0b]/70 to-transparent";
      case "bg-emerald-800": return "from-emerald-800/95 via-emerald-800/70 to-transparent";
      case "bg-black": return "from-black/95 via-black/70 to-transparent";
      default: return "from-[#0f172a]/95 via-[#0f172a]/70 to-transparent";
    }
  };

  // KOMPONEN KARTU PAKET (Agar bisa digunakan di Desktop & Mobile tanpa duplikasi)
  const renderPaketCard = (item) => (
    <Link to={`/paket/domestik/${item.id}`} key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group cursor-pointer w-full">
      <div className="relative h-48 overflow-hidden">
        <img src={item.image || "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=800"} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>
        {item.badge && item.badge !== "Tidak Ada" && (
          <div className={`absolute top-4 left-4 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-lg backdrop-blur-md bg-opacity-80 border border-white/30 ${badgeColors[item.badge] || item.badgeColor || 'bg-purple-600'}`}>{item.badge}</div>
        )}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#1e3a8a] flex items-center gap-1.5 shadow-sm"><Users size={12}/> {item.tipeTrip || "Open Trip"}</div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#f59e0b] mb-1.5 uppercase tracking-wide"><MapPin size={12} /> {item.daerah || "Indonesia"}</div>
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#1e3a8a] transition-colors leading-snug">{item.title}</h3>
        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-5 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold w-full"><Clock size={14} className="text-[#1e3a8a] shrink-0" /> {item.duration || "1 Hari"}</div>
          {(item.transportasi || []).slice(0, 3).map((tr, idx) => {
            const TransportIcon = getTransportIcon(tr.jenis);
            return (<div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold" title={tr.deskripsi}><TransportIcon size={14} className="text-[#1e3a8a] shrink-0" /> <span>{tr.jenis}</span></div>);
          })}
          {(!item.transportasi || item.transportasi.length === 0) && item.transport && (
             <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold"><Bus size={14} className="text-[#1e3a8a] shrink-0" /> <span className="line-clamp-1">{item.transport}</span></div>
          )}
        </div>
        <div className="flex flex-col mt-auto">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mulai Dari</p>
          <div className="flex items-baseline gap-1 mb-4"><p className="text-xl font-extrabold text-[#1e3a8a]">{formatRupiah(item.price || item.hargaOpenTrip || item.hargaPrivateTrip)}</p><span className="text-gray-500 text-xs font-semibold">/pax</span></div>
          <div className="w-full text-center bg-[#f59e0b] group-hover:bg-yellow-600 text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">Lihat Detail</div>
        </div>
      </div>
    </Link>
  );

  // KOMPONEN KARTU BERITA
  const renderBeritaCard = (item) => (
    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group flex flex-col w-full">
      <Link to={`/berita/${item.id}`} className="relative h-48 overflow-hidden block">
        <img src={item.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{item.category || "Tips"}</span>
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
      
      {/* 1. HERO SECTION DINAMIS */}
      <div className="relative bg-[#0f172a] pt-16 pb-32 md:pt-24 md:pb-28">
        <div className={`absolute inset-0 bg-cover ${config.heroBgPos || 'bg-center'}`} style={{ backgroundImage: `url('${config.heroBg || defaultConfig.heroBg}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/90 via-[#1e3a8a]/60 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          {config.heroSmallText && (
            <p className={`text-[#f59e0b] font-bold tracking-widest ${config.heroSmallTextSize || 'text-[10px] md:text-sm'} mb-2 md:mb-3 uppercase`}>{config.heroSmallText}</p>
          )}
          <h1 className={`${config.heroTitleSize || 'text-[32px] md:text-5xl lg:text-6xl'} font-bold text-white mb-3 md:max-w-2xl leading-tight whitespace-pre-wrap`}>{config.heroTitle}</h1>
          <p className="text-blue-100 text-[13px] md:text-lg max-w-[260px] md:max-w-xl mb-6 leading-relaxed whitespace-pre-wrap">{config.heroDesc}</p>

          {/* 3 IKON KEUNGGULAN (Hidden di Mobile) */}
          {config.showBadges !== "tidak" && (
            <div className="hidden md:flex flex-wrap items-center gap-6 mt-10">
              {[{ text: config.d1Text, iconStr: config.d1Icon }, { text: config.d2Text, iconStr: config.d2Icon }, { text: config.d3Text, iconStr: config.d3Icon }].map((item, index) => {
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
          )}
        </div>
      </div>

      {/* 2. KOTAK PENCARIAN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 md:-mt-16 mb-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col relative"><label className="text-xs font-semibold text-gray-500 mb-1 ml-1">Dari Kota</label><div className="relative"><MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" /><input type="text" placeholder="Contoh: Surabaya" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-sm font-semibold"/></div></div>
            <div className="flex flex-col relative"><label className="text-xs font-semibold text-gray-500 mb-1 ml-1">Ke Destinasi</label><div className="relative"><Compass size={16} className="absolute left-3 top-3.5 text-gray-400" /><input type="text" placeholder="Contoh: Malang" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-sm font-semibold"/></div></div>
            <div className="flex flex-col relative"><label className="text-xs font-semibold text-gray-500 mb-1 ml-1">Tanggal</label><div className="relative"><Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" /><input type="date" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-sm font-semibold text-gray-700"/></div></div>
            <div className="flex flex-col relative"><label className="text-xs font-semibold text-gray-500 mb-1 ml-1">Jumlah Peserta</label><div className="relative"><Users size={16} className="absolute left-3 top-3.5 text-gray-400" /><select className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-sm font-semibold appearance-none bg-white"><option>1 Dewasa</option><option>Group / Rombongan</option></select></div></div>
            <button className="bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-yellow-500/30">Cari Paket Trip</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a] border-t-transparent"></div></div>
      ) : (
        <>
          {/* 3. DESTINASI POPULER (Sama Seperti Umroh, Max 4 dengan Link di Kanan) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
              <div>
                <p className="text-xs md:text-sm font-bold text-gray-400 tracking-widest uppercase mb-1 md:mb-2">Eksplorasi</p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a]">Destinasi Populer</h2>
              </div>
              {daerahList.length > 4 && (
                <Link to="/domestik/destinasi" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition">
                  Lihat Semua Destinasi <ChevronRight size={18}/>
                </Link>
              )}
            </div>
            
            {daerahList.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                 {/* Batasi hanya 4 destinasi */}
                 {daerahList.slice(0, 4).map((daerah) => (
                   <Link to={`/domestik/daerah/${daerah.title}`} key={daerah.id} className="relative h-40 md:h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all">
                     <img src={daerah.image || "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=800"} alt={daerah.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                     <h3 className="absolute bottom-4 left-4 text-white font-bold text-lg md:text-xl tracking-wide">{daerah.title}</h3>
                   </Link>
                 ))}
               </div>
            ) : (<div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">Belum ada destinasi aktif saat ini.</div>)}
            
            {/* Tombol Mobile jika destinasi > 4 */}
            {daerahList.length > 4 && (
              <div className="mt-8 flex justify-center md:hidden">
                <Link to="/domestik/destinasi" className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm bg-blue-50 py-3 px-6 rounded-xl">Lihat Semua Destinasi <ChevronRight size={18}/></Link>
              </div>
            )}
          </div>

          {/* 4. PENAWARAN PAKET TERBARU */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Penawaran Paket Terbaru</h2>
              {paketTerbaru.length > 4 && (
                <Link to="/domestik" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition">
                  Lihat Semua Paket <ChevronRight size={18}/>
                </Link>
              )}
            </div>
            
            {paketTerbaru.length > 0 ? (
               <>
                 {/* DESKTOP VIEW: Grid 4 Kolom */}
                 <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {paketTerbaru.map((item) => renderPaketCard(item))}
                 </div>
                 
                 {/* MOBILE VIEW: Slideshow 1 Kartu */}
                 <div className="block sm:hidden relative pb-10">
                   <div className="overflow-hidden rounded-2xl shadow-lg relative">
                     {renderPaketCard(paketTerbaru[paketSlide])}
                   </div>
                   {/* Navigasi Dots Mobile */}
                   <div className="flex justify-center gap-2 mt-4 absolute bottom-0 left-0 right-0">
                     {paketTerbaru.map((_, idx) => (
                       <button key={idx} onClick={() => setPaketSlide(idx)} className={`h-2 rounded-full transition-all ${paketSlide === idx ? "bg-[#1e3a8a] w-6" : "bg-gray-300 w-2"}`}></button>
                     ))}
                   </div>
                 </div>
                 
                 {/* Tombol Lihat Semua Paket (Mobile) */}
                 {paketTerbaru.length > 1 && (
                    <div className="mt-8 flex justify-center sm:hidden">
                      <Link to="/domestik" className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm bg-blue-50 py-3 px-6 rounded-xl w-full justify-center">Lihat Paket Lainnya <ChevronRight size={18}/></Link>
                    </div>
                 )}
               </>
            ) : (<div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">Belum ada paket wisata terbaru.</div>)}
          </div>

          {/* 5. BERITA & TIPS LOKAL (Letaknya dibawah Paket) */}
          {beritaList.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
              <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Berita & Info Domestik</h2>
                {beritaList.length > 3 && (
                  <Link to="/berita" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition">
                    Lihat Semua Berita <ChevronRight size={18}/>
                  </Link>
                )}
              </div>
              
              {/* DESKTOP VIEW: Grid 3 Kolom */}
              <div className="hidden sm:grid sm:grid-cols-3 gap-6">
                {beritaList.slice(0,3).map((item) => renderBeritaCard(item))}
              </div>

              {/* MOBILE VIEW: Slideshow 1 Kartu */}
              <div className="block sm:hidden relative pb-10">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  {renderBeritaCard(beritaList[beritaSlide])}
                </div>
                {/* Navigasi Dots Mobile */}
                <div className="flex justify-center gap-2 mt-4 absolute bottom-0 left-0 right-0">
                  {beritaList.map((_, idx) => (
                    <button key={idx} onClick={() => setBeritaSlide(idx)} className={`h-2 rounded-full transition-all ${beritaSlide === idx ? "bg-[#1e3a8a] w-6" : "bg-gray-300 w-2"}`}></button>
                  ))}
                </div>
              </div>

              {/* Tombol Lihat Semua Berita (Mobile) */}
              {beritaList.length > 1 && (
                <div className="mt-8 flex justify-center sm:hidden">
                  <Link to="/berita" className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm bg-blue-50 py-3 px-6 rounded-xl w-full justify-center">Lihat Berita Lainnya <ChevronRight size={18}/></Link>
                </div>
              )}
            </div>
          )}

          {/* 6. KEUNGGULAN DOMESTIK */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <div className="text-center mb-12"><h2 className="text-2xl md:text-2xl font-extrabold text-[#1e3a8a]">Mengapa Liburan<br className="md:hidden"/> Bersama Enka Wisata Madura?</h2></div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {keunggulanList.length > 0 ? keunggulanList.map((fitur) => {
                const DynamicIcon = IconMap[fitur.icon] || Star;
                return (
                  <div key={fitur.id} className="flex flex-col items-center text-center max-w-[180px] group">
                    <div className="w-16 h-16 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-lg mb-4 group-hover:-translate-y-1 transition-transform"><DynamicIcon size={28} /></div>
                    <h4 className="text-[14px] md:text-base font-bold text-[#1e3a8a] mb-2 leading-tight">{fitur.title}</h4>
                    <p className="text-gray-500 text-[11px] md:text-xs leading-relaxed">{fitur.deskripsi}</p>
                  </div>
                );
              }) : (<div className="w-full text-center text-gray-400 text-sm">Keunggulan perjalanan belum ditambahkan.</div>)}
            </div>
          </div>

          {/* 7. BANNER CTA CUSTOM TRIP */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className={`relative rounded-3xl overflow-hidden shadow-xl min-h-[200px] md:min-h-[250px] flex items-center ${config.ctaBgColor || 'bg-[#1e3a8a]'}`}>
              <div className="absolute inset-0 w-full h-full"><img src={config.ctaBg || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000"} className={`w-full h-full object-cover ${config.ctaBgPos || 'object-center'}`} /></div>
              <div className={`absolute inset-0 bg-gradient-to-r ${getCtaGradient(config.ctaBgColor || 'bg-[#1e3a8a]')}`}></div>
              <div className="relative z-10 w-full md:w-2/3 p-8 md:p-12 text-left">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-snug">{config.ctaTitle || "Ingin Menyesuaikan Isi Paket?"}</h2>
                <p className="text-blue-100 mb-6 text-sm md:text-base max-w-xl leading-relaxed">{config.ctaDesc || "Atau ingin membuat rute perjalanan impian Anda sendiri? Konsultasikan dengan tim kami."}</p>
                <Link to={config.ctaBtnLink || "https://wa.me/6281234567890"} target="_blank" className="inline-block bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-colors text-sm md:text-base">{config.ctaBtnText || "Konsultasi via WhatsApp"}</Link>
              </div>
            </div>
          </div>
          
        </>
      )}
    </div>
  );
}

export default Domestik;