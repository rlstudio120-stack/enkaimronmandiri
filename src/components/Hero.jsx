import React from 'react';

function Hero() {
  return (
    <div className="relative mb-32 mt-16">
      {/* Gambar Latar & Overlay Gelap */}
      <div className="relative bg-[#0f172a] pb-24 pt-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000')" }}
        ></div>
        
        {/* Konten Teks */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-10">
          <h2 className="text-[#f59e0b] font-bold tracking-widest text-sm mb-2 uppercase">
            Enka Imron Mandiri
          </h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-2xl">
            Perjalanan Anda,<br/>Amanah Kami
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-xl mb-8">
            Melayani perjalanan Domestik, Internasional, dan Umroh dengan pelayanan terbaik dan penuh amanah.
          </p>
          
          <div className="flex flex-wrap gap-6 text-white font-medium">
            <span className="flex items-center gap-2">🛡️ Terpercaya</span>
            <span className="flex items-center gap-2">💰 Harga Terbaik</span>
            <span className="flex items-center gap-2">⭐ Pelayanan Prima</span>
          </div>
        </div>
      </div>

      {/* Kotak Pencarian Mengambang */}
      <div className="absolute -bottom-24 left-4 right-4 md:left-8 md:right-8 max-w-7xl md:mx-auto z-20">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          {/* Tab Menu */}
          <div className="flex gap-6 border-b pb-4 mb-4">
            <button className="font-bold text-[#1e3a8a] border-b-2 border-[#1e3a8a] pb-2">✈️ Domestik</button>
            <button className="font-semibold text-gray-400 hover:text-gray-600 pb-2">🌐 Internasional</button>
            <button className="font-semibold text-gray-400 hover:text-gray-600 pb-2">🕋 Umroh</button>
          </div>
          
          {/* Form Pencarian */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Dari</label>
              <input type="text" placeholder="Jakarta (CGK)" className="border border-gray-300 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]"/>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Ke</label>
              <input type="text" placeholder="Bali (DPS)" className="border border-gray-300 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]"/>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Berangkat</label>
              <input type="date" className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]"/>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Penumpang</label>
              <select className="border border-gray-300 text-gray-600 rounded-md p-2.5 outline-none focus:border-[#1e3a8a]">
                <option>1 Dewasa</option>
                <option>2 Dewasa</option>
                <option>Keluarga (4 Orang)</option>
              </select>
            </div>
            <button className="bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-2.5 rounded-md transition duration-300">
              Cari Penerbangan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;