import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { 
  MapPin, Calendar, Users, Plane, Globe, Box, 
  ShieldCheck, Star, Heart, Clock, Award, ThumbsUp, Gem, Bus, ChevronLeft, ChevronRight, Tent,
  Zap, Smile, CheckCircle, Compass
} from "lucide-react";

const IconMap = { ShieldCheck, Star, Heart, Clock, Award, MapPin, ThumbsUp, Users, Gem, Bus, Tent, Plane, Globe, Box, Zap, Smile, CheckCircle, Compass };

const defaultTestimoni = [
  { id: 1, name: "Ahmad Fauzi", service: "Paket Umroh", text: "Pelayanan sangat memuaskan, mulai dari keberangkatan sampai kembali ke tanah air. Terima kasih Enka Imron Mandiri.", img: "https://randomuser.me/api/portraits/men/32.jpg", stars: 5 },
  { id: 2, name: "Siti Aisyah", service: "Tour Internasional", text: "Trip ke Turki sangat berkesan, hotel nyaman, tour leader ramah dan sangat membantu.", img: "https://randomuser.me/api/portraits/women/44.jpg", stars: 5 },
  { id: 3, name: "Budi Hartono", service: "Penerbangan Domestik", text: "Booking mudah, harga bersaing, dan pelayanan cepat. Pasti akan gunakan lagi.", img: "https://randomuser.me/api/portraits/men/86.jpg", stars: 5 }
];

const defaultLayanan = [
  { id: '1', title: 'Domestik', deskripsi: 'Jelajahi keindahan Indonesia dengan berbagai pilihan destinasi terbaik.', icon: 'Plane', color: 'bg-[#1e3a8a]', link: '/domestik', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=800' },
  { id: '2', title: 'Internasional', deskripsi: 'Nikmati pengalaman berharga ke berbagai negara dengan pelayanan berkelas.', icon: 'Globe', color: 'bg-[#1e3a8a]', link: '#', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800' },
  { id: '3', title: 'Umroh', deskripsi: 'Perjalanan ibadah yang nyaman dan aman bersama pembimbing berpengalaman.', icon: 'Box', color: 'bg-[#f59e0b]', link: '/umroh', image: 'https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=800' }
];

const defaultConfig = {
  heroTitle: "Perjalanan Anda,\nAmanah Kami", heroDesc: "Melayani perjalanan Domestik, Internasional, dan Umroh dengan pelayanan terbaik dan penuh amanah.", heroBg: "https://images.unsplash.com/photo-1512453979436-5a5369ce9e12?q=80&w=2000", showBadges: "ya",
  b1Text: "Terpercaya", b1Icon: "ShieldCheck", b2Text: "Harga Terbaik", b2Icon: "Star", b3Text: "Pelayanan Prima", b3Icon: "Heart",
  promoSmall: "Paket Umroh 2024", promoTitle: "Berangkat Nyaman,\nIbadah Khusyuk", promoBtn: "Cek Promo", promoPrice: "25", promoLink: "/umroh", promoBg: "https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=800",
  testiAutoSlide: "ya"
};

function Home() {
  const [activeTab, setActiveTab] = useState("Domestik");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [config, setConfig] = useState(defaultConfig);
  const [layananList, setLayananList] = useState(defaultLayanan);
  const [mengapaList, setMengapaList] = useState([]);
  const [testimoniList, setTestimoniList] = useState(defaultTestimoni);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const configSnap = await getDoc(doc(db, "settings", "home"));
        if (configSnap.exists()) setConfig({ ...defaultConfig, ...configSnap.data() });

        const laySnap = await getDocs(collection(db, "layanan_utama"));
        if (!laySnap.empty) setLayananList(laySnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const mengSnap = await getDocs(collection(db, "mengapa_kami"));
        setMengapaList(mengSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const testSnap = await getDocs(collection(db, "testimoni_pelanggan"));
        if (!testSnap.empty) setTestimoniList(testSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        
      } catch (error) { console.error("Gagal mengambil data dinamis:", error); }
    };
    fetchAllData();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerSlide = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(testimoniList.length / itemsPerSlide);
  const currentTestimonials = testimoniList.slice(currentSlide * itemsPerSlide, (currentSlide + 1) * itemsPerSlide);

  useEffect(() => {
    if (config.testiAutoSlide === "ya" && totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
      }, 4000); 
      return () => clearInterval(interval);
    }
  }, [config.testiAutoSlide, totalSlides]);

  const B1Icon = IconMap[config.b1Icon] || ShieldCheck;
  const B2Icon = IconMap[config.b2Icon] || Star;
  const B3Icon = IconMap[config.b3Icon] || Heart;

  return (
    <div className="font-sans bg-white pt-20 overflow-x-hidden">
      
      {/* ==================== 1. HERO SECTION (GRADASI DISETEL ULANG) ==================== */}
      <div className="relative bg-[#0f172a] pt-16 pb-36 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${config.heroBg || defaultConfig.heroBg}')` }}></div>
        
        {/* Gradasi Biru: 
            Di HP, gradasi memudar dari kiri (teks) ke kanan (gambar terbongkar utuh).
            Di PC, gradasi berhenti sangat awal (35%) sehingga gambar tengah 100% jernih.
        */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/90 via-[#1e3a8a]/40 to-transparent md:from-[#1e3a8a] md:via-[#1e3a8a]/70 md:via-35% md:to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <p className="text-[#f59e0b] font-bold tracking-widest text-[10px] md:text-sm mb-2 md:mb-3 uppercase">
            Enka Imron Mandiri
          </p>
          
          <h1 className="text-[32px] leading-[1.2] md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4 md:max-w-2xl whitespace-pre-wrap">
            {config.heroTitle}
          </h1>
          
          <p className="text-blue-100 text-[13px] md:text-lg max-w-[260px] md:max-w-xl mb-6 md:mb-8 leading-relaxed whitespace-pre-wrap">
            {config.heroDesc}
          </p>
          
          {config.showBadges === "ya" && (
            <div className="hidden md:flex flex-wrap gap-6 text-white font-medium text-base mb-2">
              {config.b1Text && <span className="flex items-center gap-1.5"><B1Icon size={18} className="text-[#f59e0b]"/> {config.b1Text}</span>}
              {config.b2Text && <span className="flex items-center gap-1.5"><B2Icon size={18} className="text-[#f59e0b]"/> {config.b2Text}</span>}
              {config.b3Text && <span className="flex items-center gap-1.5"><B3Icon size={18} className="text-[#f59e0b]"/> {config.b3Text}</span>}
            </div>
          )}
        </div>
      </div>

      {/* ==================== 2. KOTAK PENCARIAN ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 md:-mt-16 mb-16 md:mb-20">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex bg-[#2449b1]">
            {["Domestik", "Internasional", "Umroh"].map((tab) => (
              <button 
                key={tab} onClick={() => setActiveTab(tab)} 
                className={`flex-1 py-3.5 md:py-4 text-xs md:text-base font-bold flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 transition-colors ${
                  activeTab === tab 
                    ? "bg-white text-[#1e3a8a] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative" 
                    : "bg-[#2449b1] text-white hover:bg-[#1d4ed8]"
                }`}
              >
                {tab === "Domestik" && <MapPin size={18} />}{tab === "Internasional" && <Globe size={18} />}{tab === "Umroh" && <Box size={18} />}
                <span>{tab}</span>
              </button>
            ))}
          </div>
          
          <div className="p-5 md:p-8">
            {activeTab === "Domestik" && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 items-end">
                <div className="flex flex-col relative"><label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Dari Kota</label><div className="relative"><MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" /><input type="text" placeholder="Contoh: Jakarta" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/></div></div>
                <div className="flex flex-col relative"><label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Tujuan Daerah</label><div className="relative"><MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" /><input type="text" placeholder="Contoh: Labuan Bajo" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/></div></div>
                <div className="flex flex-col relative"><label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Bulan / Tanggal</label><div className="relative"><Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" /><input type="date" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/></div></div>
                <div className="flex flex-col relative"><label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Jumlah Peserta</label><div className="relative"><Users size={16} className="absolute left-3 top-3.5 text-gray-400" /><select className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold bg-white appearance-none"><option>1 Orang (Open Trip)</option><option>Group (Private Trip)</option></select></div></div>
                <button className="w-full bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-2.5 md:py-3 rounded-xl transition text-sm md:text-base shadow-lg shadow-yellow-500/30">Cari Paket Trip</button>
              </div>
            )}
            {activeTab === "Internasional" && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 items-end">
                <div className="flex flex-col relative md:col-span-2"><label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Negara Tujuan</label><div className="relative"><Globe size={16} className="absolute left-3 top-3.5 text-gray-400" /><input type="text" placeholder="Contoh: Turki, Jepang, Eropa..." className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/></div></div>
                <div className="flex flex-col relative"><label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Bulan Rencana</label><div className="relative"><Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" /><input type="month" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/></div></div>
                <div className="flex flex-col relative"><label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Jumlah Peserta</label><div className="relative"><Users size={16} className="absolute left-3 top-3.5 text-gray-400" /><input type="number" placeholder="Contoh: 2" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/></div></div>
                <button className="w-full bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-2.5 md:py-3 rounded-xl transition text-sm md:text-base shadow-lg shadow-yellow-500/30">Cari Tour Mancanegara</button>
              </div>
            )}
            {activeTab === "Umroh" && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 items-end">
                <div className="flex flex-col relative md:col-span-2"><label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Pilih Jenis Paket</label><div className="relative"><Box size={16} className="absolute left-3 top-3.5 text-gray-400" /><select className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold bg-white appearance-none"><option>Semua Paket Umroh</option><option>Umroh Reguler</option><option>Umroh Plus (Turki/Aqsa)</option><option>Umroh VIP</option></select></div></div>
                <div className="flex flex-col relative"><label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Bulan Keberangkatan</label><div className="relative"><Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" /><input type="month" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/></div></div>
                <div className="flex flex-col relative"><label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Jumlah Jamaah</label><div className="relative"><Users size={16} className="absolute left-3 top-3.5 text-gray-400" /><input type="number" placeholder="Contoh: 1" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/></div></div>
                <button className="w-full bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-2.5 md:py-3 rounded-xl transition text-sm md:text-base shadow-lg shadow-yellow-500/30">Cari Paket Umroh</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== 3. LAYANAN KAMI ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs md:text-sm font-bold text-gray-400 tracking-widest uppercase mb-1 md:mb-2">Layanan Kami</p>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#1e3a8a]">Tiga Layanan Utama</h2>
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {layananList.slice(0, 3).map(layanan => {
            const IconRender = IconMap[layanan.icon] || Globe;
            return (
              <div key={layanan.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group relative flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img src={layanan.image || defaultConfig.promoBg} alt={layanan.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className={`absolute top-40 left-6 text-white p-3 rounded-xl shadow-lg border-4 border-white ${layanan.color || 'bg-[#1e3a8a]'}`}>
                  <IconRender size={24}/>
                </div>
                <div className="pt-12 pb-6 px-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase tracking-wide">{layanan.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{layanan.deskripsi}</p>
                  <Link to={layanan.link || "#"} className="text-[#1e3a8a] font-bold text-sm flex items-center gap-2 hover:text-[#f59e0b] transition-colors">
                    Lihat Destinasi <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-2 md:hidden max-w-sm mx-auto">
          {layananList.slice(0, 3).map(layanan => {
            const IconRender = IconMap[layanan.icon] || Globe;
            return (
              <Link key={layanan.id} to={layanan.link || "#"} className="flex flex-col items-center group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-md mb-2 ${layanan.color || 'bg-[#1e3a8a]'}`}>
                  <IconRender size={30} strokeWidth={1.5}/>
                </div>
                <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">{layanan.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ==================== 4. PROMO BANNER (TINGGI & LAYOUT DISETEL ULANG) ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
        {/* Tinggi disesuaikan (min-h-[140px] untuk mobile, min-h-[220px] untuk PC) */}
        <div className="bg-[#0f172a] rounded-2xl md:rounded-3xl overflow-hidden relative shadow-xl flex items-center min-h-[140px] md:min-h-[220px]">
          
          {/* Gambar Background (Tetap full namun tertutup gradasi di sisi kanan) */}
          <div className="absolute inset-0 w-full h-full">
            <img src={config.promoBg || defaultConfig.promoBg} alt="Promo" className="w-full h-full object-cover object-center" />
          </div>
          
          {/* Efek Memudar dari Transparan (Kiri) ke Biru Gelap Solid (Kanan) menutupi teks */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0f172a]/80 to-[#0f172a] md:via-[#0f172a]/60 md:to-[#0f172a]"></div>
          
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>
          
          {/* Layout Satu Baris (Flex Row) Teks Berdampingan dengan Kotak Harga */}
          <div className="relative z-10 w-full p-5 md:p-10 flex flex-row items-center justify-end gap-3 md:gap-8 ml-auto">
            
            {/* Teks didorong ke kanan agar dekat dengan Kotak Harga */}
            <div className="flex flex-col items-start text-left max-w-[160px] md:max-w-md">
              <p className="text-[#f59e0b] font-bold tracking-widest text-[8px] md:text-xs uppercase mb-0.5 md:mb-1">{config.promoSmall}</p>
              <h3 className="text-[13px] md:text-3xl font-bold text-white mb-2 md:mb-4 leading-tight whitespace-pre-wrap">{config.promoTitle}</h3>
              <Link to={config.promoLink || "/umroh"} className="inline-block bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-1.5 px-3 md:py-3 md:px-6 rounded-md md:rounded-xl text-[9px] md:text-base transition shadow-lg">
                {config.promoBtn}
              </Link>
            </div>
            
            {/* Kotak Harga diposisikan di SEBELAH KANAN TEKS (Bukan melebar ke bawah) */}
            <div className="bg-[#1e3a8a]/70 border border-blue-500/30 p-3 md:p-6 rounded-lg md:rounded-xl flex flex-col items-center justify-center shrink-0 backdrop-blur-sm min-w-[90px] md:min-w-[180px]">
              <p className="text-blue-200 text-[8px] md:text-sm font-semibold uppercase tracking-widest mb-0.5 md:mb-1">Mulai Dari</p>
              <h4 className="text-lg md:text-5xl font-extrabold text-[#f59e0b]">{config.promoPrice} <span className="text-[9px] md:text-lg font-bold">Jt-an</span></h4>
            </div>
            
          </div>
        </div>
      </div>

      {/* ==================== 5. MENGAPA KAMI ==================== */}
      <div className="bg-slate-50 border-t border-gray-100 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs md:text-sm font-bold text-gray-400 tracking-widest uppercase mb-1 md:mb-2">Mengapa Memilih Kami?</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#1e3a8a]">Keunggulan Kami</h2>
          </div>
          
          {!isMobile && (
            <div className="grid grid-cols-4 gap-8">
              {(mengapaList.length > 0 ? mengapaList : []).map((fitur) => {
                const DynamicIcon = IconMap[fitur.icon] || Star;
                return (
                  <div key={fitur.id} className="flex gap-4 items-start group">
                    <div className={`w-14 h-14 shrink-0 text-white rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${fitur.color || 'bg-[#1e3a8a]'}`}>
                      <DynamicIcon size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{fitur.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{fitur.deskripsi}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isMobile && (
            <div className="flex flex-wrap justify-center gap-y-6 gap-x-2">
              {(mengapaList.length > 0 ? mengapaList : []).map((fitur) => {
                const DynamicIcon = IconMap[fitur.icon] || Star;
                const count = mengapaList.length;
                const isEven = count === 4 || count === 2; 
                return (
                  <div key={fitur.id} className={`flex ${isEven ? 'w-[47%] flex-row text-left gap-2' : 'w-[30%] flex-col text-center gap-1.5'} items-center`}>
                    <div className={`w-12 h-12 shrink-0 text-white rounded-xl flex items-center justify-center shadow-md ${fitur.color || 'bg-[#1e3a8a]'}`}>
                      <DynamicIcon size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-800 leading-tight">{fitur.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ==================== 6. TESTIMONIALS ==================== */}
      <div className="bg-white py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs md:text-sm font-bold text-gray-400 tracking-widest uppercase mb-1 md:mb-2">Testimoni</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#1e3a8a]">Apa Kata Jamaah Kami?</h2>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentTestimonials.map((testi) => (
                <div key={testi.id} className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-gray-100 relative shadow-sm hover:shadow-md transition">
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 text-5xl md:text-6xl text-gray-200 font-serif leading-none">"</div>
                  <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <img src={testi.img} alt={testi.name} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-gray-800">{testi.name}</h4>
                      <p className="text-[10px] md:text-xs text-gray-500 mb-1">{testi.service}</p>
                      <div className="flex text-[#f59e0b]">
                        {Array.from({ length: Number(testi.stars || 5) }).map((_, i) => (
                          <Star key={i} size={12} fill="currentColor"/>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed relative z-10">{testi.text}</p>
                </div>
              ))}
            </div>

            {totalSlides > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} disabled={currentSlide === 0} className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center disabled:opacity-30 transition outline-none"><ChevronLeft size={20}/></button>
                <div className="flex gap-2">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-2 h-2 rounded-full outline-none ${currentSlide === idx ? 'bg-[#1e3a8a] w-4' : 'bg-gray-300'} transition-all duration-300`}></button>
                  ))}
                </div>
                <button onClick={() => setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1))} disabled={currentSlide === totalSlides - 1} className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center disabled:opacity-30 transition outline-none"><ChevronRight size={20}/></button>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Home;