function Features() {
  const features = [
    {
      title: "Amanah & Terpercaya",
      desc: "Berizin resmi, berpengalaman dan terpercaya.",
      icon: "🛡️"
    },
    {
      title: "Harga Kompetitif",
      desc: "Harga terbaik dengan fasilitas berkualitas.",
      icon: "🏷️"
    },
    {
      title: "Pelayanan Profesional",
      desc: "Tim profesional siap membantu perjalanan Anda.",
      icon: "👥"
    },
    {
      title: "Pembayaran Mudah",
      desc: "Berbagai metode pembayaran yang aman dan mudah.",
      icon: "💳"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="text-center mb-12">
        <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-2">Kenapa Memilih Kami?</h3>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">
          Keunggulan Enka Imron Mandiri
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-4 items-start p-4 hover:bg-white hover:shadow-lg rounded-xl transition duration-300">
            <div className="bg-blue-50 text-[#1e3a8a] text-2xl w-14 h-14 rounded-full flex items-center justify-center shrink-0">
              {feature.icon}
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1e3a8a] mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;