import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { 
  MapPin, Clock, Users, Calendar, ChevronRight, 
  Plane, Bus, TrainFront, Ship, Car, Box, Star,
  ShieldCheck, Heart, Award, ThumbsUp, Gem, Zap, Smile, CheckCircle, Compass, Search, Building
} from "lucide-react";

const IconMap = { ShieldCheck, Star, Heart, Clock, Award, MapPin, ThumbsUp, Users, Gem, Bus, Plane, Box, Zap, Smile, CheckCircle, Compass };

const getTransportIcon = (jenis) => {
  if (!jenis) return Bus;
  const j = jenis.toLowerCase();
  if (j.includes("pesawat")) return Plane;
  if (j.includes("kereta")) return TrainFront;
  if (j.includes("kapal")) return Ship;
  if (j.includes("shuttle") || j.includes("jeep") || j.includes("mobil")) return Car;
  return Bus;
};

const defaultDomestikConfig = {
  heroSmallText: "Jelajahi Indonesia",
  heroSmallTextSize: "text-[10px] md:text-sm",
  heroTitle: "Destinasi Wisata Domestik Terbaik", 
  heroDesc: "Temukan keindahan alam dan budaya Indonesia melalui berbagai pilihan Open Trip dan Private Trip kami.", 
  heroBg: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2000",
  showBadges: "ya", d1Text: "Pemandu Profesional", d1Icon: "Users", d2Text: "Harga Transparan", d2Icon: "Star", d3Text: "Aman & Nyaman", d3Icon: "ShieldCheck",
  ctaTitle: "Ingin Menyesuaikan Isi Paket Ini?",
  ctaDesc: "Atau ingin membuat rute perjalanan impian Anda sendiri? Konsultasikan dengan tim kami untuk mewujudkan liburan yang tak terlupakan.",
  ctaBtnText: "Konsultasi via WhatsApp",
  ctaBtnLink: "https://wa.me/6281234567890",
  ctaBgColor: "bg-[#1e3a8a]"
};

function Domestik() {
  const [config, setConfig] = useState(defaultDomestikConfig);
  const [daerahList, setDaerahList] = useState([]);
  const [paket, setPaket] = useState([]);
  const [keunggulanList, setKeunggulanList] = useState([]);
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Slideshow & Pencarian
  const [paketSlide, setPaketSlide] = useState(0);
  const [beritaSlide, setBeritaSlide] = useState(0);
  const [searchDaerah, setSearchDaerah] = useState("");
  const [searchTipe, setSearchTipe] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const configSnap = await getDoc(doc(db, "settings", "domestik"));
        if (configSnap.exists()) setConfig({ ...defaultDomestikConfig, ...configSnap.data() });

        const daerahSnap = await getDocs(collection(db, "destinasi_domestik"));
        const allDaerah = daerahSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDaerahList(allDaerah.filter(d => d.status !== "Nonaktif")); 

        const paketSnap = await getDocs(collection(db, "paket_domestik"));
        setPaket(paketSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const keunggulanSnap = await getDocs(collection(db, "keunggulan_domestik"));
        setKeunggulanList(keunggulanSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const qBerita = query(collection(db, "berita"), where("tipe", "==", "Domestik"));
        const beritaSnap = await getDocs(qBerita);
        setBeritaList(beritaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
      } catch (error) { 
        console.error("Gagal mengambil data:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchAllData(); 
    window.scrollTo(0, 0);
  }, []);

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

  // LOGIKA PENCARIAN DOMESTIK
  const displayedPaket = paket.filter(pkg => {
    const textSearch = pkg.daerah + " " + pkg.title;
    const matchDaerah = searchDaerah === "" || textSearch.toLowerCase().includes(searchDaerah.toLowerCase());
    const matchTipe = searchTipe === "" || (pkg.badge === searchTipe);
    return matchDaerah && matchTipe;
  });

  const paketTampilGrid = displayedPaket.slice(0, 4);
  const beritaTampilGrid = beritaList.slice(0, 3);

  useEffect(() => {
    const interval = setInterval(() => {
      if (paketTampilGrid.length > 1) setPaketSlide((prev) => (prev + 1) % paketTampilGrid.length);
      if (beritaTampilGrid.length > 1) setBeritaSlide((prev) => (prev + 1) % beritaTampilGrid.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [paketTampilGrid.length, beritaTampilGrid.length]);

  const renderPaketCard = (item) => (
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
          <MapPin size={12} /> {item.daerah || "Domestik"}
        </div>
        
        {/* URUTAN 2: Judul */}
        <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-[#1e3a8a] transition-colors leading-snug">
          {item.title}
        </h3>
        
        {/* URUTAN 3: Ikon-Ikon (Mengisi Kiri-Kanan Otomatis) */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 mb-5 border-b border-gray-100 pb-5">
          {/* Durasi */}
          <div className="flex items-start gap-1.5 text-xs text-gray-600 font-semibold">
            <Clock size={14} className="text-[#1e3a8a] shrink-0 mt-0.5" /> 
            <span className="line-clamp-2">{item.duration || "Durasi Fleksibel"}</span>
          </div>
          
          {/* Transportasi Dinamis (Perbaikan: Hanya Tampilkan Deskripsi User) */}
          {(item.transportasi || []).map((tr, idx) => {
            const TransportIcon = getTransportIcon(tr.jenis);
            return (
              <div key={`trans-${idx}`} className="flex items-start gap-1.5 text-xs text-gray-600 font-semibold" title={tr.deskripsi || tr.jenis}>
                <TransportIcon size={14} className="text-[#1e3a8a] shrink-0 mt-0.5" /> 
                <span className="line-clamp-2">{tr.deskripsi ? tr.deskripsi : tr.jenis}</span>
              </div>
            );
          })}

          {/* Hotel (Tampil jika admin mengisinya) */}
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
  );

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
      
      <div className="relative bg-[#0f172a] pt-16 pb-32 md:pt-24 md:pb-28">
        <div className={`absolute inset-0 bg-cover ${config.heroBgPos || 'bg-center'}`} style={{ backgroundImage: `url('${config.heroBg || defaultDomestikConfig.heroBg}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/90 via-[#1e3a8a]/60 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          {config.heroSmallText && (
            <p className={`text-[#f59e0b] font-bold tracking-widest ${config.heroSmallTextSize || 'text-[10px] md:text-sm'} mb-2 md:mb-3 uppercase`}>{config.heroSmallText}</p>
          )}
          <h1 className={`${config.heroTitleSize || 'text-[32px] md:text-5xl lg:text-6xl'} font-bold text-white mb-3 md:max-w-2xl leading-tight whitespace-pre-wrap`}>{config.heroTitle}</h1>
          <p className="text-blue-100 text-[13px] md:text-lg max-w-[260px] md:max-w-xl mb-6 leading-relaxed whitespace-pre-wrap">{config.heroDesc}</p>

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

      {/* KOTAK PENCARIAN BERFUNGSI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 md:-mt-16 mb-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col relative">
              <label className="text-xs font-semibold text-gray-500 mb-1 ml-1">Daerah / Nama Paket Tujuan</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input type="text" placeholder="Contoh: Bali, Bromo..." value={searchDaerah} onChange={(e) => setSearchDaerah(e.target.value)} className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-sm font-semibold"/>
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
            <button onClick={() => { if(!searchDaerah && !searchTipe) alert("Pilih kategori atau ketikkan daerah tujuan untuk mencari!") }} className="bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2">
              <Search size={18} /> Cari Paket
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a] border-t-transparent"></div></div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
              <div>
                <p className="text-xs md:text-sm font-bold text-gray-400 tracking-widest uppercase mb-1 md:mb-2">Jelajahi Indonesia</p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a]">Daerah Destinasi Populer</h2>
              </div>
              {daerahList.length > 4 && (
                <Link to="/domestik/destinasi" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition">
                  Lihat Semua Destinasi <ChevronRight size={18}/>
                </Link>
              )}
            </div>
            
            {daerahList.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                 {daerahList.slice(0, 4).map((daerah) => (
                   <Link to={`/domestik/daerah/${daerah.title}`} key={daerah.id} className="relative h-40 md:h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all">
                     <img src={daerah.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800"} alt={daerah.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                     <h3 className="absolute bottom-4 left-4 text-white font-bold text-lg md:text-xl tracking-wide">{daerah.title}</h3>
                   </Link>
                 ))}
               </div>
            ) : (<div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">Belum ada daerah destinasi yang aktif.</div>)}
            
            {daerahList.length > 4 && (
              <div className="mt-8 flex justify-center md:hidden">
                <Link to="/domestik/destinasi" className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm bg-blue-50 py-3 px-6 rounded-xl">Lihat Semua Destinasi <ChevronRight size={18}/></Link>
              </div>
            )}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Penawaran Paket Terbaru</h2>
              
              {/* PERBAIKAN LINK SEMUA PAKET */}
              {(paket.length > 4 || displayedPaket.length > 2) && (
                <Link to="/domestik/paket" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition">
                  Lihat Semua Paket <ChevronRight size={18}/>
                </Link>
              )}
            </div>
            
            {displayedPaket.length > 0 ? (
               <>
                 <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {paketTampilGrid.map((item) => renderPaketCard(item))}
                 </div>
                 
                 <div className="block sm:hidden relative pb-10">
                   <div className="overflow-hidden rounded-2xl shadow-lg relative">
                     {renderPaketCard(paketTampilGrid[paketSlide] || displayedPaket[0])}
                   </div>
                   <div className="flex justify-center gap-2 mt-4 absolute bottom-0 left-0 right-0">
                     {paketTampilGrid.map((_, idx) => (
                       <button key={idx} onClick={() => setPaketSlide(idx)} className={`h-2 rounded-full transition-all ${paketSlide === idx ? "bg-[#1e3a8a] w-6" : "bg-gray-300 w-2"}`}></button>
                     ))}
                   </div>
                 </div>

                 {displayedPaket.length > 1 && (
                    <div className="mt-8 flex justify-center sm:hidden">
                      <Link to="/domestik/paket" className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm bg-blue-50 py-3 px-6 rounded-xl w-full justify-center">Lihat Semua Paket <ChevronRight size={18}/></Link>
                    </div>
                 )}
               </>
            ) : (
               <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
                 Tidak ditemukan paket wisata yang cocok dengan pencarian Anda. <br/>
                 <button onClick={() => { setSearchDaerah(""); setSearchTipe(""); }} className="text-[#1e3a8a] font-bold mt-2">Reset Pencarian</button>
               </div>
            )}
          </div>

          {beritaList.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
              <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Tips & Inspirasi Liburan</h2>
                
                {/* PERBAIKAN LINK SEMUA BERITA */}
                {beritaList.length > 3 && (
                  <Link to="/berita" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition">
                    Lihat Semua Berita <ChevronRight size={18}/>
                  </Link>
                )}
              </div>
              
              <div className="hidden sm:grid sm:grid-cols-3 gap-6">
                {beritaTampilGrid.map((item) => renderBeritaCard(item))}
              </div>

              <div className="block sm:hidden relative pb-10">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  {renderBeritaCard(beritaTampilGrid[beritaSlide] || beritaList[0])}
                </div>
                <div className="flex justify-center gap-2 mt-4 absolute bottom-0 left-0 right-0">
                  {beritaTampilGrid.map((_, idx) => (
                     <button key={idx} onClick={() => setBeritaSlide(idx)} className={`h-2 rounded-full transition-all ${beritaSlide === idx ? "bg-[#1e3a8a] w-6" : "bg-gray-300 w-2"}`}></button>
                  ))}
                </div>
              </div>

              {beritaList.length > 1 && (
                <div className="mt-8 flex justify-center sm:hidden">
                  <Link to="/berita" className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm bg-blue-50 py-3 px-6 rounded-xl w-full justify-center">Lihat Semua Berita <ChevronRight size={18}/></Link>
                </div>
              )}
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <div className="text-center mb-12"><h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a]">Mengapa Liburan<br className="md:hidden"/> Bersama Enka Mandiri?</h2></div>
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

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className={`relative rounded-3xl overflow-hidden shadow-xl min-h-[200px] md:min-h-[250px] flex items-center ${config.ctaBgColor || 'bg-[#1e3a8a]'}`}>
              <div className="absolute inset-0 w-full h-full"><img src={config.ctaBg || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2000"} className={`w-full h-full object-cover ${config.ctaBgPos || 'object-center'}`} /></div>
              <div className={`absolute inset-0 bg-gradient-to-r ${getCtaGradient(config.ctaBgColor || 'bg-[#1e3a8a]')}`}></div>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>
              <div className="relative z-10 w-full md:w-2/3 p-8 md:p-12 text-left">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-snug">{config.ctaTitle || "Ingin Menyesuaikan Isi Paket Ini?"}</h2>
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