import UmrohPackages from "./UmrohPackages";
import UmrohFeatures from "./UmrohFeatures";
import UmrohNews from "./UmrohNews";
import UmrohCTA from "./UmrohCTA";
function Umroh() {
  return (
    <div className="pt-20">
      {/* Bagian Hero Umroh */}
      <div className="relative bg-[#1e3a8a] pb-32 pt-20 overflow-hidden">
        {/* Gambar Latar Ka'bah */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=2000')" }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-[#f59e0b] font-bold tracking-widest text-sm mb-3 uppercase">
            Umroh
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-2xl">
            Perjalanan Umroh Nyaman, Ibadah Makin Bermakna
          </h1>
          <p className="text-gray-200 text-lg max-w-xl mb-8">
            Kami hadir untuk memberikan pengalaman ibadah Umroh yang nyaman, aman, dan penuh keberkahan bersama Enka Imron Mandiri.
          </p>
          
          <div className="flex flex-wrap gap-6 text-white font-medium">
            <span className="flex items-center gap-2 text-sm md:text-base">🛡️ Amanah & Terpercaya</span>
            <span className="flex items-center gap-2 text-sm md:text-base">👥 Pembimbing Berpengalaman</span>
            <span className="flex items-center gap-2 text-sm md:text-base">⭐ Pelayanan Terbaik</span>
          </div>
        </div>
      </div>

      {/* Kotak Pencarian Paket Umroh */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-20 mb-16">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Tanggal Berangkat</label>
              <input type="date" className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]"/>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Durasi</label>
              <select className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]">
                <option>Pilih Durasi</option>
                <option>9 Hari</option>
                <option>12 Hari</option>
                <option>14 Hari</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Maskapai</label>
              <select className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]">
                <option>Pilih Maskapai</option>
                <option>Saudia Airlines</option>
                <option>Garuda Indonesia</option>
                <option>Lion Air</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Jumlah Jamaah</label>
              <select className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]">
                <option>1 Dewasa</option>
                <option>2 Dewasa</option>
                <option>3 Dewasa</option>
              </select>
            </div>
            <button className="bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-2.5 rounded-md transition duration-300">
              Cari Paket Umroh
            </button>
          </div>
        </div>
      </div>
      <UmrohPackages/>
      <UmrohFeatures />
      <UmrohNews />
      <UmrohCTA />
    </div>
  );
}

export default Umroh;