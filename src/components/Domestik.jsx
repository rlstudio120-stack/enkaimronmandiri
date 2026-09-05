import DomestikDestinations from "./DomestikDestinations";
import DomestikPackages from "./DomestikPackages";
import DomestikNews from "./DomestikNews";
import DomestikFeatures from "./DomestikFeatures";

function Domestik() {
  return (
    <div className="pt-20">
      {/* Bagian Hero Domestik */}
      <div className="relative bg-[#1e3a8a] pb-32 pt-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2000')" }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-[#f59e0b] font-bold tracking-widest text-sm mb-3 uppercase">Domestik</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-2xl">
            Jelajahi Keindahan Indonesia
          </h1>
          <p className="text-gray-200 text-lg max-w-xl mb-8">
            Nikmati pengalaman perjalanan terbaik ke berbagai destinasi indah di Indonesia bersama Enka Imron Mandiri.
          </p>
          <div className="flex flex-wrap gap-6 text-white font-medium">
            <span className="flex items-center gap-2">📍 Destinasi Pilihan</span>
            <span className="flex items-center gap-2">💰 Harga Terbaik</span>
            <span className="flex items-center gap-2">⭐ Layanan Profesional</span>
          </div>
        </div>
      </div>

      {/* Kotak Pencarian */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-20 mb-8">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Dari</label>
              <input type="text" placeholder="Pilih Kota Asal" className="border border-gray-300 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]"/>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Ke</label>
              <input type="text" placeholder="Pilih Destinasi" className="border border-gray-300 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]"/>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Tanggal Berangkat</label>
              <input type="date" className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]"/>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Jumlah Peserta</label>
              <select className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]">
                <option>1 Dewasa</option>
                <option>2 Dewasa</option>
                <option>Group (4 Orang ++)</option>
              </select>
            </div>
            <button className="bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-2.5 rounded-md transition duration-300">
              Cari Paket
            </button>
          </div>
        </div>
      </div>

      <DomestikDestinations />
      <DomestikPackages />
      <DomestikNews />
      <DomestikFeatures />
      
    </div>
  );
}

export default Domestik;