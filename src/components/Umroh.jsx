import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { 
  Calendar, Clock, Plane, Train, MapPin, ShieldCheck, 
  Users, Star, Heart, Award, ThumbsUp, Gem, Bus, Globe, Box, 
  Zap, Smile, CheckCircle, Compass, ChevronRight 
} from "lucide-react";

const IconMap = { ShieldCheck, Star, Heart, Clock, Award, MapPin, ThumbsUp, Users, Gem, Bus, Plane, Globe, Box, Zap, Smile, CheckCircle, Compass };

const defaultUmrohConfig = {
  heroTitle: "Perjalanan Umroh Nyaman,\nIbadah Makin Bermakna", heroDesc: "Kami hadir untuk memberikan pengalaman ibadah Umroh yang nyaman, aman, dan penuh keberkahan bersama Enka Imron Mandiri.", heroBg: "https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=2000",
  heroTitleSize: "text-[32px] md:text-5xl lg:text-6xl", heroBgPos: "bg-center",
  f1Text: "Amanah & Terpercaya", f1Icon: "ShieldCheck", f2Text: "Pembimbing Berpengalaman", f2Icon: "Users", f3Text: "Pelayanan Terbaik", f3Icon: "Star",
  ctaBg: "https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=800", ctaTitle: "Siap Berangkat Umroh?", ctaDesc: "Percayakan perjalanan ibadah Anda bersama Enka Imron Mandiri. Kami siap melayani dengan amanah dan sepenuh hati.", 
  ctaBtnText: "Hubungi Kami Sekarang", ctaBtnLink: "#", ctaBgColor: "bg-[#0f172a]", ctaBgPos: "object-center"
};

function Umroh() {
  const [paket, setPaket] = useState([]);
  const [news, setNews] = useState([]);
  const [keunggulan, setKeunggulan] = useState([]);
  const [config, setConfig] = useState(defaultUmrohConfig);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUmrohData = async () => {
      try {
        const configSnap = await getDoc(doc(db, "settings", "umroh"));
        if (configSnap.exists()) setConfig({ ...defaultUmrohConfig, ...configSnap.data() });

        const paketSnap = await getDocs(collection(db, "paket_umroh"));
        setPaket(paketSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const keunggulanSnap = await getDocs(collection(db, "keunggulan_umroh"));
        setKeunggulan(keunggulanSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const newsSnap = await getDocs(collection(db, "berita_umroh"));
        setNews(newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error("Gagal mengambil data umroh:", error); } 
      finally { setLoading(false); }
    };
    fetchUmrohData();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatRupiah = (angka) => { if (!angka) return "Rp 0"; return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka); };
  const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, '') : '';
  const badgeColors = { "bg-blue-600": "bg-blue-600", "bg-red-600": "bg-red-600", "bg-green-600": "bg-green-600", "bg-yellow-500": "bg-[#f59e0b]", "bg-purple-600": "bg-purple-600" };

  const F1Icon = IconMap[config.f1Icon] || ShieldCheck;
  const F2Icon = IconMap[config.f2Icon] || Users;
  const F3Icon = IconMap[config.f3Icon] || Star;

  const getCtaGradient = (bgColor) => {
    switch(bgColor) {
      case "bg-[#1e3a8a]": return "from-[#1e3a8a]/95 via-[#1e3a8a]/70 to-transparent";
      case "bg-[#f59e0b]": return "from-[#f59e0b]/95 via-[#f59e0b]/70 to-transparent";
      case "bg-emerald-800": return "from-emerald-800/95 via-emerald-800/70 to-transparent";
      case "bg-black": return "from-black/95 via-black/70 to-transparent";
      default: return "from-[#0f172a]/95 via-[#0f172a]/70 to-transparent";
    }
  };

  return (
    <div className="pt-20 bg-slate-50 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-[#0f172a] pt-16 pb-36 md:pt-24 md:pb-28">
        <div className={`absolute inset-0 bg-cover ${config.heroBgPos || 'bg-center'}`} style={{ backgroundImage: `url('${config.heroBg || defaultUmrohConfig.heroBg}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/90 via-[#1e3a8a]/40 to-transparent md:from-[#1e3a8a] md:via-[#1e3a8a]/70 md:via-35% md:to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <p className="text-[#f59e0b] font-bold tracking-widest text-[10px] md:text-sm mb-2 md:mb-3 uppercase">UMROH</p>
          <h1 className={`leading-[1.2] font-bold text-white mb-3 md:mb-4 md:max-w-2xl whitespace-pre-wrap ${config.heroTitleSize || 'text-[32px] md:text-5xl lg:text-6xl'}`}>
            {config.heroTitle}
          </h1>
          <p className="text-blue-100 text-[13px] md:text-lg max-w-[260px] md:max-w-xl mb-6 md:mb-8 leading-relaxed whitespace-pre-wrap">{config.heroDesc}</p>
          <div className="hidden md:flex flex-wrap gap-6 text-white font-medium text-base mb-2">
            {config.f1Text && <span className="flex items-center gap-1.5"><F1Icon size={18} className="text-[#f59e0b]" /> {config.f1Text}</span>}
            {config.f2Text && <span className="flex items-center gap-1.5"><F2Icon size={18} className="text-[#f59e0b]" /> {config.f2Text}</span>}
            {config.f3Text && <span className="flex items-center gap-1.5"><F3Icon size={18} className="text-[#f59e0b]" /> {config.f3Text}</span>}
          </div>
        </div>
      </div>

      {/* 2. PENCARIAN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 md:-mt-12 mb-16 md:mb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end">
            <div className="flex flex-col relative"><label className="text-xs font-semibold text-gray-500 mb-1 ml-1">Tanggal Berangkat</label><div className="relative"><Calendar size={18} className="absolute left-3 top-3 text-gray-400" /><input type="date" className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 focus:outline-none focus:border-[#1e3a8a] text-sm font-semibold text-gray-700"/></div></div>
            <div className="flex flex-col relative"><label className="text-xs font-semibold text-gray-500 mb-1 ml-1">Durasi</label><div className="relative"><Clock size={18} className="absolute left-3 top-3 text-gray-400" /><select className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 focus:outline-none focus:border-[#1e3a8a] text-sm font-semibold text-gray-700 appearance-none bg-white"><option>Pilih Durasi</option><option>9 Hari</option><option>12 Hari</option><option>14 Hari</option></select></div></div>
            <div className="flex flex-col relative"><label className="text-xs font-semibold text-gray-500 mb-1 ml-1">Jumlah Jamaah</label><div className="relative"><Users size={18} className="absolute left-3 top-3 text-gray-400" /><select className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 focus:outline-none focus:border-[#1e3a8a] text-sm font-semibold text-gray-700 appearance-none bg-white"><option>1 Dewasa</option><option>2 Dewasa</option><option>3 Dewasa</option></select></div></div>
            <button className="w-full bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition text-sm md:text-base shadow-lg shadow-yellow-500/30">Cari Paket Umroh</button>
          </div>
        </div>
      </div>

      {/* 3. PAKET UMROH */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-[#1e3a8a]">Paket Umroh Pilihan</h2>
          {paket.length > 4 && (
            <Link to="/semua-paket-umroh" className="text-[#1e3a8a] font-bold text-sm flex items-center gap-1 hover:text-[#f59e0b] transition-colors">Lihat Semua Paket <ChevronRight size={16}/></Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a] border-t-transparent"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paket.slice(0, 4).map((item) => (
              <Link to={`/paket/umroh/${item.id}`} key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                  {item.tampilBadge !== "tidak" && item.badge && (<div className={`absolute top-4 left-4 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-md ${badgeColors[item.badgeColor] || 'bg-[#1e3a8a]'}`}>{item.badge}</div>)}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-[#1e3a8a] mb-1 line-clamp-1">{item.title}</h3>
                  <p className="text-[#1e3a8a] font-bold text-sm mb-4">{item.duration}</p>
                  
                  <div className="grid grid-cols-2 gap-x-2 gap-y-3 mb-6 flex-1 items-start border-b border-gray-100 pb-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><Calendar size={14} className="shrink-0 text-[#1e3a8a]" /><span className="line-clamp-1">{item.duration}</span></div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><Box size={14} className="shrink-0 text-[#1e3a8a]" /><span className="line-clamp-1">Hotel <Star size={10} className="inline text-[#f59e0b] ml-0.5" fill="currentColor"/> {item.bintangMekah}</span></div>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><Plane size={14} className="shrink-0 text-[#1e3a8a]" /><span className="line-clamp-1">{item.maskapai || "-"}</span></div>
                      {item.keretaCepat === "ya" && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><Train size={14} className="shrink-0 text-[#1e3a8a]" /><span className="line-clamp-1">Kereta Cepat</span></div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col mt-auto">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mulai dari</p>
                    <div className="flex items-baseline gap-1 mb-4">
                      <p className="text-xl font-extrabold text-[#1e3a8a]">{formatRupiah(item.price)}</p>
                      <span className="text-gray-500 text-xs font-semibold">/pax</span>
                    </div>
                    <div className="w-full text-center bg-[#f59e0b] group-hover:bg-yellow-600 text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">Lihat Detail</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 4. KEUNGGULAN UMROH */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12"><h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a]">Keunggulan Umroh<br/>Bersama Enka Imron Mandiri</h2></div>
        {!isMobile && (
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {(keunggulan.length > 0 ? keunggulan : [
              { id: 1, title: "Amanah & Terpercaya", icon: "ShieldCheck", deskripsi: "Berizin resmi melayani jamaah." },
              { id: 2, title: "Pembimbing Berpengalaman", icon: "Users", deskripsi: "Muthowif berpengalaman." }
            ]).map((fitur) => {
              const DynamicIcon = IconMap[fitur.icon] || Star;
              return (
                <div key={fitur.id} className="flex flex-col items-center text-center max-w-[160px] group">
                  <div className="w-16 h-16 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-lg mb-4 group-hover:-translate-y-1 transition-transform"><DynamicIcon size={28} /></div>
                  <h4 className="text-[13px] md:text-sm font-bold text-[#1e3a8a] mb-2 leading-tight">{fitur.title}</h4>
                  <p className="text-gray-500 text-[11px] md:text-xs leading-relaxed">{fitur.deskripsi}</p>
                </div>
              );
            })}
          </div>
        )}
        {isMobile && (
          <div className="flex flex-wrap justify-center gap-y-6 gap-x-2">
            {(keunggulan.length > 0 ? keunggulan : []).map((fitur) => {
              const DynamicIcon = IconMap[fitur.icon] || Star;
              const count = keunggulan.length; const isEven = count === 4 || count === 2; 
              return (
                <div key={fitur.id} className={`flex ${isEven ? 'w-[47%] flex-row text-left gap-2' : 'w-[30%] flex-col text-center gap-1.5'} items-center`}>
                  <div className="w-12 h-12 shrink-0 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center shadow-md"><DynamicIcon size={24} strokeWidth={1.5} /></div>
                  <span className="text-[10px] font-bold text-[#1e3a8a] leading-tight">{fitur.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. BERITA & KEGIATAN UMROH (LINK SUDAH DIPERBARUI KE /berita) */}
      {news.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-[#1e3a8a]">Berita & Kegiatan Umroh</h2>
            <Link to="/berita" className="hidden md:flex items-center gap-1 text-[#1e3a8a] font-bold text-sm hover:text-[#f59e0b] transition">
              Lihat Semua Berita <ChevronRight size={16}/>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group flex flex-col">
                <Link to={`/berita/${item.id}`} className="relative h-48 overflow-hidden block">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-[11px] text-gray-500 font-semibold mb-2 flex items-center gap-1.5">
                    <Calendar size={12} className="text-gray-400"/> {item.date}
                  </p>
                  <Link to={`/berita/${item.id}`}>
                    <h3 className="text-base font-bold text-[#1e3a8a] mb-2 leading-snug line-clamp-2 hover:text-[#f59e0b] transition-colors">{item.title}</h3>
                  </Link>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">{stripHtml(item.text)}</p>
                  <Link to={`/berita/${item.id}`} className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-[#1e3a8a] hover:text-[#f59e0b] transition-colors">
                    Baca Selengkapnya <ChevronRight size={14}/>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Link to="/berita" className="mt-6 md:hidden flex items-center justify-center gap-1 text-[#1e3a8a] font-bold text-sm py-2">
            Lihat Semua Berita <ChevronRight size={16}/>
          </Link>
        </div>
      )}

      {/* 6. CALL TO ACTION PROMO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className={`relative rounded-3xl overflow-hidden shadow-xl min-h-[200px] md:min-h-[250px] flex items-center ${config.ctaBgColor || 'bg-[#0f172a]'}`}>
          <div className="absolute inset-0 w-full h-full">
            <img src={config.ctaBg || defaultUmrohConfig.ctaBg} className={`w-full h-full object-cover ${config.ctaBgPos || 'object-center'}`} />
          </div>
          <div className={`absolute inset-0 bg-gradient-to-r ${getCtaGradient(config.ctaBgColor)}`}></div>
          
          <div className="relative z-10 w-full md:w-2/3 p-8 md:p-12 text-left">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-snug">{config.ctaTitle}</h2>
            <p className="text-blue-100 mb-6 text-sm md:text-base max-w-lg leading-relaxed">{config.ctaDesc}</p>
            <Link to={config.ctaBtnLink} className="inline-block bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-colors text-sm md:text-base">
              {config.ctaBtnText}
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Umroh;