import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { 
  Menu, X, ChevronDown, Tent, MapPin, Globe, FileText, MessageCircle, Info, 
  ShieldCheck, Clock, Star, Heart, Award, ThumbsUp, Users, Gem, Bus, Plane, 
  Box, Zap, Smile, CheckCircle, Compass, BookOpen, Ship, TrainFront, Building, 
  Banknote, Coins, Wallet, CircleDollarSign, Map, Calendar, Milestone, Route, 
  Camera, Phone, Mail, Sun, Moon, Coffee, ShoppingBag, Utensils, Wifi, Landmark, Ticket 
} from "lucide-react";

const IconMap = { 
  ShieldCheck, Star, Heart, Clock, Award, MapPin, ThumbsUp, Users, Gem, Bus, 
  Tent, Plane, Globe, Box, Zap, Smile, CheckCircle, Compass, BookOpen, Ship, 
  TrainFront, FileText, Building, Banknote, Coins, Wallet, CircleDollarSign, 
  Map, Calendar, Milestone, Route, Camera, Phone, Mail, Sun, Moon, Coffee, 
  ShoppingBag, Utensils, Wifi, Landmark, Ticket 
};

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState("");
  const [identitas, setIdentitas] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchIdentitas = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "identitas"));
        let data = {
          namaBesar: "ENKA IMRON MANDIRI",
          tagline: "Travel Domestik • Internasional • Umroh",
          taglineSize: "text-[8px] md:text-[9px]",
          lisensi: "Berizin Resmi Kemenag RI No. 1234 Tahun 2024",
          lisensiIcon: "ShieldCheck",
          topBarKanan: "Layanan Pelanggan: 08.00 - 17.00 WIB",
          topBarKananIcon: "Clock",
          logoNavbar: "",
          logoFooter: "",
          faviconMode: "logoNavbar",
          customFavicon: ""
        };
        if (snap.exists()) {
          data = { ...data, ...snap.data() };
        }
        setIdentitas(data);

        const favUrl = data.faviconMode === "logoFooter" ? data.logoFooter 
                     : data.faviconMode === "custom" ? data.customFavicon 
                     : data.logoNavbar;
        if (favUrl) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = favUrl;
        }
      } catch (error) { 
        console.error("Gagal mengambil identitas:", error); 
      }
    };
    fetchIdentitas();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setMobileMenuOpen("");
  }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path) => location.pathname === path;
  const toggleMobileDropdown = (menu) => setMobileMenuOpen(mobileMenuOpen === menu ? "" : menu);

  const LeftTopIcon = IconMap[identitas?.lisensiIcon] || ShieldCheck;
  const RightTopIcon = IconMap[identitas?.topBarKananIcon] || Clock;

  return (
    <>
      <nav className="fixed w-full top-0 z-[100] shadow-sm flex flex-col">
        
        {/* ================= TOP BAR (PITA BIRU ATAS DINAMIS) ================= */}
        {identitas && (
          <div className="bg-[#1e3a8a] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-[10px] md:text-xs flex justify-between items-center">
              <div className="flex items-center gap-1.5 max-w-[65%] truncate">
                <LeftTopIcon size={14} className="text-[#f59e0b] shrink-0"/>
                <span className="truncate font-medium">{identitas.lisensi}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <RightTopIcon size={14} className="text-[#f59e0b] shrink-0"/>
                <span className="font-medium">{identitas.topBarKanan}</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= MAIN NAVBAR ================= */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              
              {/* LOGO DINAMIS */}
              <div className="flex items-center">
                <Link to="/" onClick={closeMenu} className="flex-shrink-0 flex items-center gap-3">
                  {identitas?.logoNavbar ? (
                    <img src={identitas.logoNavbar} alt="Logo" className="h-12 md:h-14 object-contain drop-shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center font-bold text-xl border-2 border-[#f59e0b] shadow-sm">
                      {identitas?.namaBesar ? identitas.namaBesar.charAt(0) : "E"}
                    </div>
                  )}
                  <div className="flex flex-col justify-center mt-1">
                    <span className="font-extrabold text-[#1e3a8a] text-[16px] md:text-lg block leading-none mb-1.5 tracking-wide">
                      {identitas?.namaBesar || "ENKA IMRON MANDIRI"}
                    </span>
                    <span className={`font-bold text-gray-400 ${identitas?.taglineSize || 'text-[8px] md:text-[9px]'} tracking-widest block leading-none uppercase`}>
                      {identitas?.tagline}
                    </span>
                  </div>
                </Link>
              </div>

              {/* MENU DESKTOP */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className={`font-bold text-sm transition-colors ${isActive('/') ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}>Beranda</Link>
                <div className="relative group">
                  <button className={`flex items-center gap-1 font-bold text-sm transition-colors py-2 ${['/umroh', '/domestik', '/internasional'].includes(location.pathname) ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}>Paket Perjalanan <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" /></button>
                  <div className="absolute top-full left-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"><div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col py-2"><Link to="/umroh" className="px-5 py-3 hover:bg-blue-50 hover:text-[#1e3a8a] flex items-center gap-3 text-sm font-semibold text-gray-600 transition-colors"><Tent size={18} className="text-[#f59e0b]"/> Paket Umroh</Link><Link to="/domestik" className="px-5 py-3 hover:bg-blue-50 hover:text-[#1e3a8a] flex items-center gap-3 text-sm font-semibold text-gray-600 transition-colors"><MapPin size={18} className="text-emerald-500"/> Trip Domestik</Link><Link to="/internasional" className="px-5 py-3 hover:bg-blue-50 hover:text-[#1e3a8a] flex items-center gap-3 text-sm font-semibold text-gray-600 transition-colors"><Globe size={18} className="text-purple-500"/> Trip Internasional</Link></div></div>
                </div>
                <div className="relative group">
                  <button className={`flex items-center gap-1 font-bold text-sm transition-colors py-2 ${['/berita', '/faq', '/syarat'].includes(location.pathname) ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}>Pusat Informasi <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" /></button>
                  <div className="absolute top-full left-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"><div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col py-2"><Link to="/berita" className="px-5 py-3 hover:bg-blue-50 hover:text-[#1e3a8a] flex items-center gap-3 text-sm font-semibold text-gray-600 transition-colors"><FileText size={18} className="text-blue-500"/> Berita & Artikel</Link><Link to="/faq" className="px-5 py-3 hover:bg-blue-50 hover:text-[#1e3a8a] flex items-center gap-3 text-sm font-semibold text-gray-600 transition-colors"><MessageCircle size={18} className="text-orange-500"/> Tanya Jawab (FAQ)</Link><Link to="/syarat" className="px-5 py-3 hover:bg-blue-50 hover:text-[#1e3a8a] flex items-center gap-3 text-sm font-semibold text-gray-600 transition-colors"><Info size={18} className="text-gray-400"/> Syarat & Ketentuan</Link></div></div>
                </div>
                <Link to="/tentang" className={`font-bold text-sm transition-colors ${isActive('/tentang') ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}>Tentang Kami</Link>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="bg-[#f59e0b] hover:bg-yellow-500 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-yellow-500/20 flex items-center gap-2"><MessageCircle size={18} /> Hubungi Kami</a>
              </div>

              {/* TOMBOL HAMBURGER MOBILE */}
              <div className="flex items-center md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-[#1e3a8a] focus:outline-none p-2 rounded-lg bg-gray-50 transition">
                  {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MENU MOBILE */}
        <div className={`md:hidden absolute w-full bg-white border-b border-gray-100 shadow-2xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[80vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`} style={{ top: "100%" }}>
          <div className="px-5 pt-3 pb-8 space-y-2 flex flex-col">
            <Link to="/" onClick={closeMenu} className={`block px-4 py-3.5 rounded-xl font-bold text-[15px] ${isActive('/') ? 'bg-blue-50 text-[#1e3a8a]' : 'text-gray-600 hover:bg-slate-50'}`}>Beranda</Link>
            <div className="bg-slate-50 rounded-xl overflow-hidden"><button onClick={() => toggleMobileDropdown('paket')} className="w-full px-4 py-3.5 font-bold text-[15px] text-gray-600 flex justify-between items-center focus:outline-none">Paket Perjalanan <ChevronDown size={16} className={`transition-transform duration-300 ${mobileMenuOpen === 'paket' ? 'rotate-180 text-[#f59e0b]' : 'text-gray-400'}`} /></button><div className={`transition-all duration-300 ${mobileMenuOpen === 'paket' ? 'max-h-60' : 'max-h-0'}`}><div className="px-4 pb-3 space-y-1"><Link to="/umroh" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white hover:text-[#1e3a8a]"><Tent size={16} className="text-[#f59e0b]"/> Paket Umroh</Link><Link to="/domestik" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white hover:text-[#1e3a8a]"><MapPin size={16} className="text-emerald-500"/> Trip Domestik</Link><Link to="/internasional" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white hover:text-[#1e3a8a]"><Globe size={16} className="text-purple-500"/> Trip Internasional</Link></div></div></div>
            <div className="bg-slate-50 rounded-xl overflow-hidden"><button onClick={() => toggleMobileDropdown('info')} className="w-full px-4 py-3.5 font-bold text-[15px] text-gray-600 flex justify-between items-center focus:outline-none">Pusat Informasi <ChevronDown size={16} className={`transition-transform duration-300 ${mobileMenuOpen === 'info' ? 'rotate-180 text-[#f59e0b]' : 'text-gray-400'}`} /></button><div className={`transition-all duration-300 ${mobileMenuOpen === 'info' ? 'max-h-60' : 'max-h-0'}`}><div className="px-4 pb-3 space-y-1"><Link to="/berita" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white hover:text-[#1e3a8a]"><FileText size={16} className="text-blue-500"/> Berita & Artikel</Link><Link to="/faq" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white hover:text-[#1e3a8a]"><MessageCircle size={16} className="text-orange-500"/> Tanya Jawab (FAQ)</Link><Link to="/syarat" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white hover:text-[#1e3a8a]"><Info size={16} className="text-gray-400"/> Syarat & Ketentuan</Link></div></div></div>
            <Link to="/tentang" onClick={closeMenu} className={`block px-4 py-3.5 rounded-xl font-bold text-[15px] ${isActive('/tentang') ? 'bg-blue-50 text-[#1e3a8a]' : 'text-gray-600 hover:bg-slate-50'}`}>Tentang Kami</Link>
            <div className="pt-5 mt-3 border-t border-gray-100"><a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-center bg-[#f59e0b] hover:bg-yellow-500 text-black px-5 py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-yellow-500/20"><MessageCircle size={20} /> Hubungi via WhatsApp</a></div>
          </div>
        </div>
      </nav>

      {/* SPACER TOP BAR: Otomatis mendorong seluruh halaman di bawahnya agar tidak tertutup Pita Biru */}
      {identitas && <div className="h-8 md:h-9 w-full bg-[#0f172a]"></div>}
    </>
  );
}

export default Navbar;