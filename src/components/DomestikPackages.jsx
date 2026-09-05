import { Link } from "react-router-dom";

function DomestikPackages() {
  const packages = [
    { badge: "Terlaris", badgeColor: "bg-[#f59e0b]", title: "Bali 4 Hari 3 Malam", duration: "4 Hari 3 Malam", transport: "Pesawat", hotel: "Hotel ⭐ 4", price: "Rp 1.950.000", image: "https://images.unsplash.com/photo-1537996194494-10c920214fd5?q=80&w=600" },
    { badge: "Promo", badgeColor: "bg-pink-500", title: "Yogyakarta 3 Hari 2 Malam", duration: "3 Hari 2 Malam", transport: "Kereta Api", hotel: "Hotel ⭐ 3", price: "Rp 1.250.000", image: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?q=80&w=600" },
    { badge: "New", badgeColor: "bg-blue-600", title: "Labuan Bajo 4 Hari 3 Malam", duration: "4 Hari 3 Malam", transport: "Kapal Phinisi floresHoliday", hotel: "Cabin AC", price: "Rp 3.950.000", image: "https://images.unsplash.com/photo-1516690553959-71a414d6b9b6?q=80&w=600" },
    { badge: "Eksklusif", badgeColor: "bg-green-600", title: "Lombok 3 Hari 2 Malam", duration: "3 Hari 2 Malam", transport: "Pesawat", hotel: "Hotel ⭐ 4", price: "Rp 3.650.000", image: "https://images.unsplash.com/photo-1572059002053-8cc5ad2f4a38?q=80&w=600" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Paket Wisata Domestik</h2>
        <Link to="/domestik" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition">
          Lihat Semua Paket ➔
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, index) => (
          <div key={index} className="bg-white rounded-2xl shadow hover:shadow-xl transition border border-gray-100 overflow-hidden flex flex-col group">
            <div className="h-48 relative overflow-hidden">
              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md ${pkg.badgeColor}`}>{pkg.badge}</div>
            </div>
            <div className="p-5 flex-grow flex flex-col">
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">{pkg.title}</h3>
              <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-600 mb-6 flex-grow">
                <div className="flex items-center gap-2"><span>📅</span> {pkg.duration}</div>
                <div className="flex items-center gap-2"><span>🚢</span> {pkg.transport}</div>
                <div className="flex items-center gap-2"><span>🏨</span> {pkg.hotel}</div>
              </div>
              <div className="border-t pt-4">
                <span className="text-xs text-gray-500 block mb-1">Mulai dari</span>
                <div className="text-[#f59e0b] font-bold text-xl mb-4">{pkg.price} <span className="text-sm text-gray-500 font-normal">/orang</span></div>
                <button className="w-full bg-[#f59e0b] hover:bg-yellow-600 text-white font-semibold py-2.5 rounded-md transition">Lihat Detail</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DomestikPackages;