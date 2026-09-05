function DomestikFeatures() {
  const features = [
    { title: "Berpengalaman", desc: "Lebih dari 10 tahun melayani perjalanan wisata di Indonesia.", icon: "🎯" },
    { title: "Harga Kompetitif", desc: "Harga terbaik dengan kualitas layanan terbaik.", icon: "🏷️" },
    { title: "Paket Lengkap", desc: "Pilihan paket lengkap sesuai kebutuhan Anda.", icon: "📦" },
    { title: "Layanan 24/7", desc: "Tim kami siap membantu Anda kapan pun dibutuhkan.", icon: "🕒" },
    { title: "Aman & Terpercaya", desc: "Legalitas lengkap dan terpercaya.", icon: "🛡️" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 mb-16 border-t border-gray-100">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">
          Mengapa Memilih Kami?
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4">
            <div className="bg-blue-50 text-[#1e3a8a] text-2xl w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
              {feature.icon}
            </div>
            <h4 className="font-bold text-[#1e3a8a] mb-2">{feature.title}</h4>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DomestikFeatures;