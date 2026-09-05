function UmrohCTA() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div className="relative bg-[#1e3a8a] rounded-2xl overflow-hidden py-12 px-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=1000')" }}
        ></div>
        <div className="relative z-10 mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-white mb-2">Siap Berangkat Umroh?</h2>
          <p className="text-gray-300">Percayakan perjalanan ibadah Anda bersama Enka Imron Mandiri.<br/>Kami siap melayani dengan amanah dan sepenuh hati.</p>
        </div>
        <div className="relative z-10">
          <button className="bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-md transition shadow-lg">
            Hubungi Kami Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

export default UmrohCTA;