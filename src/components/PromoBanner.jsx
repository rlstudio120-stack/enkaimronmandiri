import { Link } from "react-router-dom";

function PromoBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="bg-[#1e3a8a] rounded-2xl overflow-hidden relative flex flex-col md:flex-row items-center justify-between p-8 md:p-12 shadow-xl">
        
        {/* Latar Belakang Dekoratif (Efek Transparan) */}
        <div 
          className="absolute top-0 right-0 opacity-20 w-full md:w-1/2 h-full bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=1000')" }}
        ></div>
        
        {/* Teks Promo */}
        <div className="relative z-10 mb-8 md:mb-0 text-center md:text-left">
          <p className="text-[#f59e0b] font-bold tracking-widest text-sm mb-2 uppercase bg-white/10 inline-block px-3 py-1 rounded-full">
            Paket Umroh 2026 / 1447 H
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-snug">
            Berangkat Nyaman,<br/>Ibadah Lebih Khusyuk
          </h2>
          <Link to="/umroh" className="bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-md transition duration-300 shadow-lg">
            Lihat Paket Umroh
          </Link>
        </div>
        
        {/* Harga Promo */}
        <div className="relative z-10 flex flex-col items-center justify-center bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm">
          <div className="text-white text-center">
            <span className="block text-sm mb-1 font-medium">Mulai dari</span>
            <div className="text-5xl font-bold text-[#f59e0b] flex items-baseline gap-1">
              25 <span className="text-2xl font-semibold">Jt-an</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PromoBanner;