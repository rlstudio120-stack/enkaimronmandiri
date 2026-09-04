import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#1e3a8a] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 border-b border-white/20 pb-12">
          
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">
              ENKA IMRON<br/><span className="text-[#f59e0b] text-sm">MANDIRI</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm">
              Melayani perjalanan Domestik, Internasional, dan Umroh dengan penuh amanah dan profesionalisme.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Layanan</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/domestik" className="hover:text-[#f59e0b] transition">Domestik</Link></li>
              <li><Link to="/domestik" className="hover:text-[#f59e0b] transition">Internasional</Link></li>
              <li><Link to="/umroh" className="hover:text-[#f59e0b] transition">Umroh</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Informasi</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-[#f59e0b] transition">Tentang Kami</Link></li>
              <li><Link to="/" className="hover:text-[#f59e0b] transition">Syarat & Ketentuan</Link></li>
              <li><Link to="/" className="hover:text-[#f59e0b] transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Kontak Kami</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Jl. Raya Condet No. 18<br/>Jakarta Timur 13530</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>0812-1234-5678</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2026 Enka Imron Mandiri. All rights reserved.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="text-[#f59e0b] text-xl">🏛️</span>
            <span>Berizin Resmi Kemenag RI No. 1234 Tahun 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;