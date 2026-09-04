function Testimonials() {
  const testimonials = [
    {
      name: "Ahmad Fauzi",
      package: "Paket Umroh",
      text: "Pelayanan sangat memuaskan, mulai dari keberangkatan sampai kembali ke tanah air. Terima kasih Enka Imron Mandiri.",
      image: "https://i.pravatar.cc/150?img=11"
    },
    {
      name: "Siti Aisyah",
      package: "Tour Internasional",
      text: "Trip ke Turki sangat berkesan, hotel nyaman, tour leader ramah dan sangat membantu.",
      image: "https://i.pravatar.cc/150?img=5"
    },
    {
      name: "Rudi Hartono",
      package: "Penerbangan Domestik",
      text: "Booking mudah, harga bersaing dan pelayanan cepat. Pasti akan gunakan lagi untuk perjalanan berikutnya.",
      image: "https://i.pravatar.cc/150?img=12"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 mb-16">
      <div className="text-center mb-12">
        <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-2">Testimoni</h3>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">
          Apa Kata Jamaah & Pelanggan Kami?
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testi, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <img src={testi.image} alt={testi.name} className="w-14 h-14 rounded-full object-cover shadow-sm"/>
              <div>
                <h4 className="font-bold text-[#1e3a8a]">{testi.name}</h4>
                <p className="text-sm text-gray-500">{testi.package}</p>
                <div className="text-[#f59e0b] text-sm mt-1">★★★★★</div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed italic">"{testi.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;