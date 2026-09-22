import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 fixed w-full top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* LOGO ENKA IMRON MANDIRI (Desain Baru) */}
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu} className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center font-bold text-xl border-2 border-[#f59e0b] shadow-sm">
                EIM
              </div>
              <div className="flex flex-col justify-center mt-1">
                <span className="font-extrabold text-[#1e3a8a] text-[16px] md:text-lg block leading-none mb-1.5 tracking-wide">ENKA IMRON MANDIRI</span>
                <span className="font-bold text-gray-400 text-[8px] md:text-[9px] tracking-widest block leading-none uppercase">Travel Domestik &bull; Internasional &bull; Umroh</span>
              </div>
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-bold text-sm transition-colors ${isActive('/') ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}>Beranda</Link>
            <Link to="#" className="font-bold text-sm text-gray-500 hover:text-[#1e3a8a] transition-colors">Tentang Kami</Link>
            <Link to="/umroh" className={`font-bold text-sm transition-colors ${isActive('/umroh') ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}>Umroh</Link>
            <Link to="/domestik" className={`font-bold text-sm transition-colors ${isActive('/domestik') ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}>Domestik</Link>
            <Link to="#" className="font-bold text-sm text-gray-500 hover:text-[#1e3a8a] transition-colors">Promo</Link>
            <Link to="#" className="bg-[#f59e0b] hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-yellow-500/20">Hubungi Kami</Link>
          </div>

          {/* Tombol Hamburger Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-[#1e3a8a] focus:outline-none p-2 rounded-lg bg-gray-50 transition"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      <div className={`md:hidden absolute w-full bg-white border-b border-gray-100 shadow-2xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-5 pt-3 pb-8 space-y-2 flex flex-col">
          <Link to="/" onClick={closeMenu} className={`block px-4 py-3.5 rounded-xl font-bold text-[15px] ${isActive('/') ? 'bg-blue-50 text-[#1e3a8a]' : 'text-gray-600'}`}>Beranda</Link>
          <Link to="#" onClick={closeMenu} className="block px-4 py-3.5 rounded-xl font-bold text-[15px] text-gray-600 hover:bg-slate-50">Tentang Kami</Link>
          <Link to="/domestik" onClick={closeMenu} className={`block px-4 py-3.5 rounded-xl font-bold text-[15px] ${isActive('/domestik') ? 'bg-blue-50 text-[#1e3a8a]' : 'text-gray-600 hover:bg-slate-50'}`}>Paket Domestik</Link>
          <Link to="/umroh" onClick={closeMenu} className={`block px-4 py-3.5 rounded-xl font-bold text-[15px] ${isActive('/umroh') ? 'bg-blue-50 text-[#1e3a8a]' : 'text-gray-600 hover:bg-slate-50'}`}>Paket Umroh</Link>
          <Link to="#" onClick={closeMenu} className="block px-4 py-3.5 rounded-xl font-bold text-[15px] text-gray-600 hover:bg-slate-50">Promo Terbaru</Link>
          <div className="pt-5 mt-3 border-t border-gray-100">
            <Link to="#" onClick={closeMenu} className="block text-center bg-[#f59e0b] hover:bg-yellow-600 text-white px-5 py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-yellow-500/20">Hubungi Kami via WhatsApp</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;