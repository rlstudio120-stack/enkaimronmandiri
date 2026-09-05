import { Link } from "react-router-dom";

function DomestikDestinations() {
  const destinations = [
    { title: "Bali", desc: "Pulau dewata dengan pantai indah, budaya yang kaya, dan keindahan alam memukau.", price: "Rp 1.250.000", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=600" },
    { title: "Yogyakarta", desc: "Kota budaya dan sejarah dengan beragam destinasi wisata menarik.", price: "Rp 950.000", image: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?q=80&w=600" },
    { title: "Labuan Bajo", desc: "Keindahan alam eksotis, komodo, dan laut biru yang menakjubkan.", price: "Rp 2.750.000", image: "https://images.unsplash.com/photo-1516690553959-71a414d6b9b6?q=80&w=600" },
    { title: "Lombok", desc: "Pulau indah dengan pantai menawan dan Gunung Rinjani yang megah.", price: "Rp 1.750.000", image: "https://images.unsplash.com/photo-1572059002053-8cc5ad2f4a38?q=80&w=600" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 pt-8">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Destinasi Populer</h2>
        <Link to="/domestik" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition duration-300">
          Lihat Semua Destinasi ➔
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((dest, index) => (
          <div key={index} className="bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden flex flex-col group">
            <div className="h-48 overflow-hidden">
              <img src={dest.image} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-5 flex-grow flex flex-col">
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-2">{dest.title}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow">{dest.desc}</p>
              <div className="border-t pt-3 mt-auto">
                <span className="text-xs text-gray-500 block">Mulai dari</span>
                <div className="text-[#1e3a8a] font-bold text-lg">{dest.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DomestikDestinations;