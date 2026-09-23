import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, query } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { 
  MapPin, Clock, Users, Calendar, ChevronRight, ChevronLeft,
  Plane, Bus, TrainFront, Ship, Car, Box, Star, Tent,
  ShieldCheck, Heart, Award, ThumbsUp, Gem, Zap, Smile, 
  CheckCircle, Compass, Globe, Search, MessageSquare, MessageCircle
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
  const [activeTab, setActiveTab] = useState("Tanya Paket");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [config, setConfig] = useState(defaultConfig);
  const [layananList, setLayananList] = useState(defaultLayanan);
  const [mengapaList, setMengapaList] = useState([]);
  const [testimoniList, setTestimoniList] = useState(defaultTestimoni);
  const navigate = useNavigate();

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

  const formatRupiah = (angka) => { if (!angka) return "Rp 0"; return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka); };

  const getPromoGradient = (bgColor) => {
    switch(bgColor) {
      case "bg-[#1e3a8a]": return "from-transparent via-[#1e3a8a]/80 to-[#1e3a8a] md:via-[#1e3a8a]/60";
      case "bg-[#f59e0b]": return "from-transparent via-[#f59e0b]/80 to-[#f59e0b] md:via-[#f59e0b]/60";
      case "bg-emerald-800": return "from-transparent via-emerald-800/80 to-emerald-800 md:via-emerald-800/60";
      case "bg-black": return "from-transparent via-black/80 to-black md:via-black/60";
      default: return "from-transparent via-[#0f172a]/80 to-[#0f172a] md:via-[#0f172a]/60";
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: parseInt(count) || 5 }).map((_, i) => (
      <Star key={i} size={16} className="text-[#f59e0b] fill-current" />
    ));
  };

  // FUNGSI PENCARIAN BERANDA (MENGARAHKAN KE HALAMAN DIVISI YANG SESUAI)
  const handleSearchSubmit = () => {
    if (activeTab === "Domestik") navigate("/domestik");
    else if (activeTab === "Internasional") navigate("/internasional");
    else if (activeTab === "Umroh") navigate("/umroh");
  };

  return (
    <div className="font-sans bg-white pt-20 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-[#0f172a] pt-16 pb-36 md:pt-24 md:pb-28">
        <div className={`absolute inset-0 bg-cover ${config.heroBgPos || 'bg-center'}`} style={{ backgroundImage: `url('${config.heroBg || defaultConfig.heroBg}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/90 via-[#1e3a8a]/40 to-transparent md:from-[#1e3a8a] md:via-[#1e3a8a]/70 md:via-35% md:to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <p className="text-[#f59e0b] font-bold tracking-widest text-[10px] md:text-sm mb-2 md:mb-3 uppercase">
            Enka Imron Mandiri
          </p>
          <h1 className={`leading-[1.2] font-bold text-white mb-3 md:mb-4 md:max-w-2xl whitespace-pre-wrap ${config.heroTitleSize || 'text-[32px] md:text-5xl lg:text-6xl'}`}>
            {config.heroTitle}
          </h1>
          <p className="text-blue-100 text-[13px] md:text-lg max-w-[260px] md:max-w-xl mb-6 md:mb-8 leading-relaxed whitespace-pre-wrap">
            {config.heroDesc}
          </p>
          
          {/* PERBAIKAN: Gaya 3 Ikon Disamakan dengan Halaman Lain (Glassmorphism) */}
          {config.showBadges === "ya" && (
            <div className="hidden md:flex flex-wrap items-center gap-6 mt-6 mb-2">
              {[{ text: config.b1Text, iconStr: config.b1Icon }, { text: config.b2Text, iconStr: config.b2Icon }, { text: config.b3Text, iconStr: config.b3Icon }].map((item, index) => {
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

     {/* 2. KOTAK KONSULTASI & PERENCANAAN PERJALANAN (PENGGANTI PENCARIAN) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-24 md:-mt-20 mb-16 md:mb-20">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex bg-[#1e3a8a]">
            {["Tanya Paket", "Custom Trip", "Bantuan CS"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3.5 md:py-4 text-xs md:text-base font-bold flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 transition-colors ${activeTab === tab ? "bg-white text-[#1e3a8a] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative" : "bg-[#1d47ad] text-white hover:bg-[#1d4ed8]"}`}>
                {tab === "Tanya Paket" && <Search size={18} />}
                {tab === "Custom Trip" && <MapPin size={18} />}
                {tab === "Bantuan CS" && <MessageSquare size={18} />}
                <span>{tab}</span>
              </button>
            ))}
          </div>
          
          <div className="p-5 md:p-8">
            {activeTab === "Tanya Paket" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end">
                <div className="flex flex-col relative">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nama Anda</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input id="waNama" type="text" placeholder="Contoh: Budi" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/>
                  </div>
                </div>
                <div className="flex flex-col relative md:col-span-2">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Destinasi yang Dicari</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input id="waTujuan" type="text" placeholder="Contoh: Paket Umroh Agustus / Trip Bali" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/>
                  </div>
                </div>
                <button onClick={() => {
                  const nama = document.getElementById('waNama').value || 'Calon Jamaah';
                  const tujuan = document.getElementById('waTujuan').value || 'paket wisata Anda';
                  const pesan = `Halo tim Enka Imron Mandiri, perkenalkan saya *${nama}*. Saya sedang mencari informasi dan rekomendasi terkait *${tujuan}*. Bisa tolong dibantu?`;
                  window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(pesan)}`, '_blank');
                }} className="w-full bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-2.5 md:py-3 rounded-xl transition text-sm md:text-base shadow-lg shadow-yellow-500/30 flex justify-center items-center gap-2">
                  <Smile size={18}/> Tanya Sekarang
                </button>
              </div>
            )}

            {activeTab === "Custom Trip" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end">
                <div className="flex flex-col relative md:col-span-2">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Rencana Tujuan Rombongan</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input id="customTujuan" type="text" placeholder="Contoh: Tour Jawa Bali / Eropa Barat" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/>
                  </div>
                </div>
                <div className="flex flex-col relative">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Jumlah Rombongan</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input id="customPeserta" type="number" placeholder="Contoh: 30 Orang" className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#1e3a8a] text-xs md:text-sm font-semibold"/>
                  </div>
                </div>
                <button onClick={() => {
                  const tujuan = document.getElementById('customTujuan').value || 'destinasi pilihan saya';
                  const peserta = document.getElementById('customPeserta').value || 'beberapa';
                  const pesan = `Halo, saya ingin berkonsultasi untuk membuat *Custom Trip / Private Tour* ke *${tujuan}* untuk rombongan sebanyak *${peserta} orang*. Bagaimana prosedurnya?`;
                  window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(pesan)}`, '_blank');
                }} className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2.5 md:py-3 rounded-xl transition text-sm md:text-base shadow-lg shadow-blue-900/30 flex justify-center items-center gap-2">
                  <Compass size={18}/> Buat Rute Kustom
                </button>
              </div>
            )}

            {activeTab === "Bantuan CS" && (
              <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 p-4 md:p-6 rounded-xl border border-blue-100">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a8a] text-sm md:text-base">Butuh Bantuan Langsung?</h4>
                    <p className="text-xs md:text-sm text-gray-600">Tim Customer Service kami siap membantu merencanakan perjalanan Anda atau menjawab pertanyaan seputar fasilitas dan dokumen.</p>
                  </div>
                </div>
                <button onClick={() => {
                  window.open(`https://wa.me/6281234567890?text=${encodeURIComponent("Halo Admin Enka Imron Mandiri, saya butuh bantuan informasi terkait layanan travel Anda.")}`, '_blank');
                }} className="w-full md:w-auto bg-[#25D366] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition text-sm shadow-lg shadow-green-500/30 flex justify-center items-center gap-2 shrink-0 whitespace-nowrap">
                  <MessageCircle size={18}/> Chat Admin (Online)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. LAYANAN KAMI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
        <div className="text-center mb-8 md:mb-12"><p className="text-xs md:text-sm font-bold text-gray-400 tracking-widest uppercase mb-1 md:mb-2">Layanan Kami</p><h2 className="text-2xl md:text-4xl font-extrabold text-[#1e3a8a]">Tiga Layanan Utama</h2></div>
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {layananList.slice(0, 3).map(layanan => {
            const IconRender = IconMap[layanan.icon] || Globe;
            return (
              <div key={layanan.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group relative flex flex-col"><div className="h-48 overflow-hidden"><img src={layanan.image || defaultConfig.promoBg} alt={layanan.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div><div className={`absolute top-40 left-6 text-white p-3 rounded-xl shadow-lg border-4 border-white ${layanan.color || 'bg-[#1e3a8a]'}`}><IconRender size={24}/></div><div className="pt-12 pb-6 px-6 flex-1 flex flex-col"><h3 className="text-xl font-bold text-gray-800 mb-2 uppercase tracking-wide">{layanan.title}</h3><p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{layanan.deskripsi}</p><Link to={layanan.link || "#"} className="text-[#1e3a8a] font-bold text-sm flex items-center gap-2 hover:text-[#f59e0b] transition-colors">Lihat Destinasi <span className="text-lg">→</span></Link></div></div>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-2 md:hidden max-w-sm mx-auto">
          {layananList.slice(0, 3).map(layanan => {
            const IconRender = IconMap[layanan.icon] || Globe;
            return (<Link key={layanan.id} to={layanan.link || "#"} className="flex flex-col items-center group"><div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-md mb-2 ${layanan.color || 'bg-[#1e3a8a]'}`}><IconRender size={30} strokeWidth={1.5}/></div><span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">{layanan.title}</span></Link>);
          })}
        </div>
      </div>

      {/* 4. PROMO BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
        <div className={`relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl flex items-center min-h-[140px] md:min-h-[220px] ${config.promoBgColor || 'bg-[#0f172a]'}`}>
          <div className="absolute inset-0 w-full h-full">
            <img src={config.promoBg || defaultConfig.promoBg} className={`w-full h-full object-cover ${config.promoBgPos || 'object-center'}`} />
          </div>
          
          <div className={`absolute inset-0 bg-gradient-to-r ${getPromoGradient(config.promoBgColor)}`}></div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>
          
          <div className="relative z-10 w-full p-5 md:p-10 flex flex-row items-center justify-end gap-3 md:gap-8 ml-auto">
            <div className="flex flex-col items-start text-left max-w-[160px] md:max-w-md">
              <p className="text-[#f59e0b] font-bold tracking-widest text-[8px] md:text-xs uppercase mb-0.5 md:mb-1">{config.promoSmall}</p>
              <h3 className="text-[13px] md:text-3xl font-bold text-white mb-2 md:mb-4 leading-tight whitespace-pre-wrap">{config.promoTitle}</h3>
              <Link to={config.promoLink || "/umroh"} className="inline-block bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-1.5 px-3 md:py-3 md:px-6 rounded-md md:rounded-xl text-[9px] md:text-base transition shadow-lg">
                {config.promoBtn}
              </Link>
            </div>
            <div className="bg-[#1e3a8a]/70 border border-blue-500/30 p-3 md:p-6 rounded-lg md:rounded-xl flex flex-col items-center justify-center shrink-0 backdrop-blur-sm min-w-[90px] md:min-w-[180px]">
              <p className="text-blue-200 text-[8px] md:text-sm font-semibold uppercase tracking-widest mb-0.5 md:mb-1">Mulai Dari</p>
              <h4 className="text-lg md:text-5xl font-extrabold text-[#f59e0b]">{formatRupiah(config.promoPrice)} <span className="text-[9px] md:text-lg font-bold">/pax</span></h4>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MENGAPA KAMI */}
      <div className="bg-slate-50 border-t border-gray-100 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16"><p className="text-xs md:text-sm font-bold text-gray-400 tracking-widest uppercase mb-1 md:mb-2">Mengapa Memilih Kami?</p><h2 className="text-2xl md:text-4xl font-extrabold text-[#1e3a8a]">Keunggulan Kami</h2></div>
          {!isMobile && (
            <div className="grid grid-cols-4 gap-8">
              {(mengapaList.length > 0 ? mengapaList : []).map((fitur) => {
                const DynamicIcon = IconMap[fitur.icon] || Star;
                return (
                  <div key={fitur.id} className="flex gap-4 items-start group"><div className={`w-14 h-14 shrink-0 text-white rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${fitur.color || 'bg-[#1e3a8a]'}`}><DynamicIcon size={28} /></div><div><h4 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{fitur.title}</h4><p className="text-gray-500 text-xs leading-relaxed">{fitur.deskripsi}</p></div></div>
                );
              })}
            </div>
          )}
          {isMobile && (
            <div className="flex flex-wrap justify-center gap-y-6 gap-x-2">
              {(mengapaList.length > 0 ? mengapaList : []).map((fitur) => {
                const DynamicIcon = IconMap[fitur.icon] || Star;
                const count = mengapaList.length; const isEven = count === 4 || count === 2; 
                return (
                  <div key={fitur.id} className={`flex ${isEven ? 'w-[47%] flex-row text-left gap-2' : 'w-[30%] flex-col text-center gap-1.5'} items-center`}><div className={`w-12 h-12 shrink-0 text-white rounded-xl flex items-center justify-center shadow-md ${fitur.color || 'bg-[#1e3a8a]'}`}><DynamicIcon size={24} strokeWidth={1.5} /></div><span className="text-[10px] font-bold text-gray-800 leading-tight">{fitur.title}</span></div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 6. TESTIMONIALS */}
      <div className="bg-white py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16"><p className="text-xs md:text-sm font-bold text-gray-400 tracking-widest uppercase mb-1 md:mb-2">Testimoni</p><h2 className="text-2xl md:text-4xl font-extrabold text-[#1e3a8a]">Apa Kata Jamaah Kami?</h2></div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentTestimonials.map((testi) => (
                <div key={testi.id} className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-gray-100 relative shadow-sm hover:shadow-md transition">
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 text-5xl md:text-6xl text-gray-200 font-serif leading-none">"</div>
                  <div className="flex items-center gap-4 mb-4 md:mb-6"><img src={testi.img} alt={testi.name} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white shadow-sm" /><div><h4 className="text-sm md:text-base font-bold text-gray-800">{testi.name}</h4><p className="text-[10px] md:text-xs text-gray-500 mb-1">{testi.service}</p><div className="flex text-[#f59e0b]">{Array.from({ length: Number(testi.stars || 5) }).map((_, i) => (<Star key={i} size={12} fill="currentColor"/>))}</div></div></div>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed relative z-10">{testi.text}</p>
                </div>
              ))}
            </div>
            {totalSlides > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} disabled={currentSlide === 0} className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center disabled:opacity-30 transition outline-none"><ChevronLeft size={20}/></button>
                <div className="flex gap-2">{Array.from({ length: totalSlides }).map((_, idx) => (<button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-2 h-2 rounded-full outline-none ${currentSlide === idx ? 'bg-[#1e3a8a] w-4' : 'bg-gray-300'} transition-all duration-300`}></button>))}</div>
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