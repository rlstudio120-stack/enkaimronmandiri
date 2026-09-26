import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { MapPin, Phone, Mail, MessageCircle, Globe } from "lucide-react";

// KOMPONEN IKON SOSIAL MEDIA (Custom SVG Tahan Banting, termasuk TikTok)
const Facebook = ({ size = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>);
const Instagram = ({ size = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);
const Twitter = ({ size = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>);
const Youtube = ({ size = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>);
const Linkedin = ({ size = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>);
const Tiktok = ({ size = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path><path d="M15 8v8a4 4 0 0 1-4 4"></path><path d="M15 4v4a4 4 0 0 0 4 4h1"></path></svg>);

const SocialIcons = { Facebook, Instagram, Twitter, Youtube, Linkedin, Tiktok };
const ContactIcons = { Alamat: MapPin, Telepon: Phone, Email: Mail };

const formatWaNumber = (num) => {
  if (!num) return "";
  let clean = num.toString().replace(/\D/g, "");
  if (clean.startsWith("0")) clean = "62" + clean.slice(1);
  return clean;
};

function Footer() {
  const [footerData, setFooterData] = useState(null);
  const [identitas, setIdentitas] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const snapFooter = await getDoc(doc(db, "settings", "footer"));
        const snapIdentitas = await getDoc(doc(db, "settings", "identitas"));
        
        if (snapIdentitas.exists()) setIdentitas(snapIdentitas.data());
        
        if (snapFooter.exists()) {
          setFooterData(snapFooter.data());
        } else {
          setFooterData({
            desc: "Melayani perjalanan Domestik, Internasional, dan Umroh dengan penuh amanah dan profesionalisme.",
            socials: [],
            contacts: [{ tipe: "Alamat", isi: "Jl. Raya Condet No. 18, Jakarta Timur 13530" }, { tipe: "Telepon", isi: "0812-1234-5678" }],
            copyright: "© 2026 Enka Imron Mandiri. All rights reserved."
          });
        }
      } catch (error) { console.error("Gagal mengambil data footer:", error); } finally { setLoading(false); }
    };
    fetchAllData();
  }, []);

  if (loading) return <footer className="bg-[#1e3a8a] text-white pt-10 pb-8 min-h-[300px] flex items-center justify-center"><div className="animate-pulse">Memuat informasi...</div></footer>;

  // Logika Pintar: Menyesuaikan Nomor WA Berdasarkan Halaman yang Sedang Dibuka
  const getActiveWaLink = () => {
    const path = location.pathname;
    const mainWa = formatWaNumber(identitas?.noWa) || "6281234567890";
    let targetWa = mainWa;
    let divisiText = "layanan paket perjalanan";

    if (path.includes("umroh")) {
      targetWa = formatWaNumber(identitas?.noWaUmroh) || mainWa;
      divisiText = "program perjalanan Ibadah Umroh";
    } else if (path.includes("domestik")) {
      targetWa = formatWaNumber(identitas?.noWaDomestik) || mainWa;
      divisiText = "paket wisata Domestik";
    } else if (path.includes("internasional")) {
      targetWa = formatWaNumber(identitas?.noWaInternasional) || mainWa;
      divisiText = "paket wisata Internasional";
    }

    const msg = `Halo Admin ${identitas?.namaBesar || "Enka Imron Mandiri"}, saya ingin berkonsultasi mengenai ${divisiText} Anda.`;
    return `https://wa.me/${targetWa}?text=${encodeURIComponent(msg)}`;
  };

  const activeWaLink = getActiveWaLink();

  return (
    <footer className="bg-[#1e3a8a] text-white pt-12 md:pt-16 pb-8 border-t-[6px] border-[#f59e0b]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* ===================== TAMPILAN SMARTPHONE (MOBILE) ===================== */}
        <div className="md:hidden flex flex-col items-center text-center space-y-6 mb-8 border-b border-white/10 pb-8">
          
          {/* Logo & Nama Sejajar untuk Mobile */}
          <div className="flex items-center justify-center gap-3 text-left">
            {identitas?.logoFooter && (
              <img src={identitas.logoFooter} alt="Logo" className="h-12 object-contain drop-shadow-md shrink-0" />
            )}
            <div className="text-lg font-extrabold text-white leading-tight">
              {identitas?.namaBesar || "ENKA IMRON MANDIRI"} <br/>
              <span className="text-[#f59e0b] text-[10px] tracking-widest uppercase mt-0.5 block">
                {identitas?.tagline || "Travel Domestik • Internasional • Umroh"}
              </span>
            </div>
          </div>
          
          <p className="text-blue-200 text-sm leading-relaxed max-w-[280px] whitespace-pre-wrap">{footerData.desc}</p>

          {footerData.socials && footerData.socials.length > 0 && (
            <div className="flex gap-4 justify-center">
              {footerData.socials.map((soc, idx) => {
                const IconComp = SocialIcons[soc.platform] || Globe;
                return (<a key={idx} href={soc.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#f59e0b] hover:scale-110 transition-all"><IconComp size={18} /></a>);
              })}
            </div>
          )}
          
          {/* TOMBOL WA MOBILE DINAMIS */}
          <a href={activeWaLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-[280px] bg-[#f59e0b] hover:bg-yellow-500 text-black font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors">
            <MessageCircle size={18} /> Hubungi Kami
          </a>
        </div>

        {/* ===================== TAMPILAN LAPTOP/DESKTOP ===================== */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10 border-b border-white/10 pb-12">
          <div className="lg:col-span-2 pr-8">
            
            {/* Logo & Nama Sejajar untuk Desktop */}
            <div className="flex items-center gap-4 mb-6">
              {identitas?.logoFooter && (
                <img src={identitas.logoFooter} alt="Logo" className="h-14 object-contain drop-shadow-md shrink-0" />
              )}
              <div className="text-xl font-extrabold text-white leading-tight">
                {identitas?.namaBesar || "ENKA IMRON MANDIRI"} <br/>
                <span className="text-[#f59e0b] text-[10px] tracking-widest uppercase mt-1 block">
                  {identitas?.tagline || "Travel Domestik • Internasional • Umroh"}
                </span>
              </div>
            </div>
            
            <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-sm whitespace-pre-wrap">{footerData.desc}</p>
            {footerData.socials && footerData.socials.length > 0 && (
              <div className="flex gap-3">
                {footerData.socials.map((soc, idx) => {
                  const IconComp = SocialIcons[soc.platform] || Globe;
                  return (<a key={idx} href={soc.link} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-[#f59e0b] hover:-translate-y-1 transition-all"><IconComp size={16} /></a>);
                })}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-bold text-lg mb-5 text-white">Layanan</h4>
            <ul className="space-y-3 text-sm text-blue-200">
              <li><Link to="/domestik" className="hover:text-[#f59e0b] hover:translate-x-1 inline-block transition-all">Trip Domestik</Link></li>
              <li><Link to="/internasional" className="hover:text-[#f59e0b] hover:translate-x-1 inline-block transition-all">Trip Internasional</Link></li>
              <li><Link to="/umroh" className="hover:text-[#f59e0b] hover:translate-x-1 inline-block transition-all">Paket Umroh</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-5 text-white">Informasi</h4>
            <ul className="space-y-3 text-sm text-blue-200">
              <li><Link to="/tentang" className="hover:text-[#f59e0b] hover:translate-x-1 inline-block transition-all">Tentang Kami</Link></li>
              <li><Link to="/syarat" className="hover:text-[#f59e0b] hover:translate-x-1 inline-block transition-all">Syarat & Ketentuan</Link></li>
              <li><Link to="/faq" className="hover:text-[#f59e0b] hover:translate-x-1 inline-block transition-all">Tanya Jawab (FAQ)</Link></li>
              <li><Link to="/berita" className="hover:text-[#f59e0b] hover:translate-x-1 inline-block transition-all">Berita & Artikel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-5 text-white">Kontak Kami</h4>
            <ul className="space-y-4 text-sm text-blue-200">
              {(footerData.contacts || []).map((kontak, idx) => {
                const IconComp = ContactIcons[kontak.tipe] || MapPin;
                return (<li key={idx} className="flex items-start gap-3"><div className="mt-0.5 text-[#f59e0b]"><IconComp size={16} /></div><span className="leading-relaxed whitespace-pre-wrap">{kontak.isi}</span></li>);
              })}
            </ul>
          </div>
        </div>

        {/* ===================== COPYRIGHT ===================== */}
        <div className="flex justify-center items-center text-xs md:text-sm text-blue-300 pt-2">
          <p className="text-center">{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;