import { Link } from "react-router-dom";

function Services() {
  const services = [
    {
      title: "DOMESTIK",
      description: "Jelajahi keindahan Indonesia dengan berbagai pilihan destinasi terbaik.",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000",
      icon: "✈️",
      linkText: "Lihat Destinasi ➔",
      linkTo: "/domestik"
    },
    {
      title: "INTERNASIONAL",
      description: "Nikmati pengalaman berharga ke berbagai negara dengan pelayanan berkelas.",
      image: "https://images.unsplash.com/photo-1647427060118-4911c9821b82?q=80&w=1000",
      icon: "🌐",
      linkText: "Lihat Destinasi ➔",
      linkTo: "/domestik"
    },
    {
      title: "UMROH",
      description: "Perjalanan ibadah yang nyaman dan aman bersama pembimbing berpengalaman.",
      image: "https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=1000",
      icon: "🕋",
      linkText: "Lihat Paket Umroh ➔",
      linkTo: "/umroh"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="text-center mb-12">
        <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-2">Layanan Kami</h3>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">
          Tiga Layanan Utama untuk<br/>Perjalanan Terbaik Anda
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group hover:shadow-xl transition duration-300">
            
            {/* Wadah relatif agar ikon bisa mengambang di antara gambar dan teks */}
            <div className="relative">
              
              {/* Wadah khusus gambar (hanya ini yang dipotong/overflow-hidden) */}
              <div className="h-56 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
              </div>

              {/* Ikon kini aman karena berada di luar wadah yang terpotong */}
              <div className="absolute -bottom-6 left-6 z-10 bg-[#1e3a8a] w-12 h-12 rounded-full flex items-center justify-center text-xl text-white border-4 border-white shadow-sm">
                {service.icon}
              </div>
            </div>

            <div className="p-8 pt-10 flex-grow flex flex-col">
              <h4 className="text-xl font-bold text-[#1e3a8a] mb-3">{service.title}</h4>
              <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
              <Link to={service.linkTo} className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] transition duration-300 flex items-center gap-2">
                {service.linkText}
              </Link>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;