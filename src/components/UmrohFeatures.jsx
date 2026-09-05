function UmrohFeatures() {
  const features = [
    { title: "Amanah & Terpercaya", desc: "Berizin resmi dan berpengalaman dalam melayani jamaah.", icon: "📋" },
    { title: "Pembimbing Berpengalaman", desc: "Muthowif dan muthowifah berpengalaman yang siap membimbing ibadah Anda.", icon: "👳" },
    { title: "Hotel Nyaman", desc: "Pilihan hotel terbaik di Mekkah & Madinah sesuai standar kenyamanan.", icon: "🏨" },
    { title: "Maskapai Terbaik", desc: "Bekerjasama dengan maskapai terpercaya untuk perjalanan yang aman dan nyaman.", icon: "✈️" },
    { title: "Pelayanan Prima", desc: "Tim kami siap membantu Anda sebelum, selama, hingga setelah perjalanan.", icon: "🤝" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-gray-100">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-2">
          Keunggulan Umroh<br/>Bersama Enka Imron Mandiri
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="bg-[#1e3a8a] text-white text-3xl w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg">
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

export default UmrohFeatures;