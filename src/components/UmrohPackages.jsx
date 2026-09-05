import { Link } from "react-router-dom";

function UmrohPackages() {
  const packages = [
    {
      badge: "Terlaris",
      badgeColor: "bg-[#f59e0b]",
      title: "Umroh Reguler 9 Hari",
      duration: "9 Hari",
      airline: "Lion Air",
      hotel: "Hotel ⭐ 3",
      price: "Rp 24.900.000",
      image: "https://images.unsplash.com/photo-1591814220202-b9e73d4d7dc2?q=80&w=600"
    },
    {
      badge: "Promo",
      badgeColor: "bg-pink-500",
      title: "Umroh Plus Thaif 12 Hari",
      duration: "12 Hari",
      airline: "Saudia Airlines",
      hotel: "Hotel ⭐ 4",
      price: "Rp 29.900.000",
      image: "https://images.unsplash.com/photo-1580227918349-8c909c00df0b?q=80&w=600"
    },
    {
      badge: "Best Seller",
      badgeColor: "bg-[#1e3a8a]",
      title: "Umroh VIP 13 Hari",
      duration: "13 Hari",
      airline: "Garuda Indonesia",
      hotel: "Hotel ⭐ 5",
      price: "Rp 36.900.000",
      image: "https://images.unsplash.com/photo-1583392437651-7f98fb7267f5?q=80&w=600"
    },
    {
      badge: "Private Group",
      badgeColor: "bg-green-600",
      title: "Umroh Private 14 Hari",
      duration: "14 Hari",
      airline: "Saudia Airlines",
      hotel: "Hotel ⭐ 5",
      price: "Rp 38.900.000",
      image: "https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      
      {/* Judul Bagian */}
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">
          Paket Umroh Pilihan
        </h2>
        <Link to="/umroh" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition duration-300">
          Lihat Semua Paket ➔
        </Link>
      </div>

      {/* Grid Kartu Paket */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, index) => (
          <div key={index} className="bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden flex flex-col group">
            
            {/* Gambar & Label (Badge) */}
            <div className="h-48 relative overflow-hidden">
              <img 
                src={pkg.image} 
                alt={pkg.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md ${pkg.badgeColor}`}>
                {pkg.badge}
              </div>
            </div>
            
            {/* Detail Paket */}
            <div className="p-5 flex-grow flex flex-col">
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">{pkg.title}</h3>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 mb-6 flex-grow">
                <div className="flex items-center gap-1">
                  <span>📅</span> {pkg.duration}
                </div>
                <div className="flex items-center gap-1">
                  <span>✈️</span> {pkg.airline}
                </div>
                <div className="flex items-center gap-1 col-span-2">
                  <span>🏨</span> {pkg.hotel}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <span className="text-xs text-gray-500 block mb-1">Mulai dari</span>
                <div className="text-[#f59e0b] font-bold text-xl mb-4">
                  {pkg.price} <span className="text-sm text-gray-500 font-normal">/pax</span>
                </div>
                <button className="w-full bg-[#f59e0b] hover:bg-yellow-600 text-white font-semibold py-2.5 rounded-md transition duration-300">
                  Lihat Detail
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
      
      {/* Tombol Lihat Semua Paket (Khusus HP) */}
      <div className="mt-8 text-center md:hidden">
         <Link to="/umroh" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] transition duration-300">
          Lihat Semua Paket ➔
        </Link>
      </div>
      
    </div>
  );
}

export default UmrohPackages;