import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Home, ArrowLeft, Tent, MapPin, Globe } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Halaman Tidak Ditemukan (404) | Enka Imron Mandiri";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen font-sans flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center relative overflow-hidden">
        
        {/* Dekorasi Latar Belakang Halus */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full opacity-70 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-50 rounded-full opacity-70 pointer-events-none"></div>

        <div className="relative z-10">
          {/* Ikon Kompas Berputar Halus */}
          <div className="w-20 h-20 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
            <Compass size={44} className="text-[#f59e0b] animate-pulse" />
          </div>

          {/* Angka 404 */}
          <p className="text-xs md:text-sm font-extrabold text-[#f59e0b] uppercase tracking-widest mb-2">
            Error 404 • Destinasi Tidak Ditemukan
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] mb-4 leading-tight">
            Sepertinya Rute Perjalanan Ini Tidak Tersedia
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
            Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau alamat URL yang Anda ketikkan kurang tepat.
          </p>

          {/* Tombol Aksi Utama */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a] font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft size={18} /> Halaman Sebelumnya
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-colors"
            >
              <Home size={18} /> Kembali ke Beranda
            </Link>
          </div>

          {/* Jalan Pintas ke 3 Divisi Utama */}
          <div className="border-t border-gray-100 pt-6">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
              Atau Jelajahi Layanan Utama Kami
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/umroh"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-gray-700 hover:text-[#1e3a8a] font-bold text-xs border border-gray-100 transition-colors"
              >
                <Tent size={16} className="text-[#f59e0b]" /> Paket Umroh
              </Link>
              <Link
                to="/domestik"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-gray-700 hover:text-[#1e3a8a] font-bold text-xs border border-gray-100 transition-colors"
              >
                <MapPin size={16} className="text-emerald-500" /> Trip Domestik
              </Link>
              <Link
                to="/internasional"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-gray-700 hover:text-[#1e3a8a] font-bold text-xs border border-gray-100 transition-colors"
              >
                <Globe size={16} className="text-purple-500" /> Internasional
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default NotFound;