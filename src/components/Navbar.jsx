import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">
        {/* Bagian Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-[#1e3a8a]">
            ENKA IMRON<br/><span className="text-yellow-500 text-sm">MANDIRI</span>
          </div>
        </Link>
        
        {/* Bagian Menu Navigasi Desktop */}
        <div className="hidden md:flex gap-6 items-center font-medium text-gray-700">
          <Link to="/" className="hover:text-[#1e3a8a]">Beranda</Link>
          <Link to="/umroh" className="hover:text-[#1e3a8a]">Umroh</Link>
          <Link to="/domestik" className="hover:text-[#1e3a8a]">Domestik</Link>
          <Link to="/domestik" className="hover:text-[#1e3a8a]">Internasional</Link>
        </div>

        {/* Tombol Hubungi Kami */}
        <button className="bg-[#f59e0b] hover:bg-yellow-600 text-white px-6 py-2 rounded-md font-semibold hidden md:block">
          Hubungi Kami
        </button>

        {/* Ikon Menu Mobile (Hamburger) */}
        <div className="md:hidden text-2xl text-[#1e3a8a] cursor-pointer">
          ☰
        </div>
      </div>
    </nav>
  );
}

export default Navbar;