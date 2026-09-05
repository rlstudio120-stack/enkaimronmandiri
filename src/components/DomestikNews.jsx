import { Link } from "react-router-dom";

function DomestikNews() {
  const news = [
    {
      date: "20 Mei 2026",
      title: "Kegiatan Famtrip Enka Imron Mandiri ke Labuan Bajo",
      desc: "Kegiatan perjalanan edukasi untuk meningkatkan kualitas layanan dan menjelajahi destinasi terbaik bersama armada kapal phinisi FloresHoliday.",
      image: "https://images.unsplash.com/photo-1516690553959-71a414d6b9b6?q=80&w=600"
    },
    {
      date: "10 Mei 2026",
      title: "Enka Imron Mandiri Hadir di Garuda Travel Fair 2026",
      desc: "Dapatkan penawaran spesial paket wisata domestik hanya di event Garuda Travel Fair tahun ini.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600"
    },
    {
      date: "02 Mei 2026",
      title: "Tips Liburan Nyaman ke Destinasi Domestik Favorit",
      desc: "Persiapan, tips, dan rekomendasi agar liburan Anda semakin berkesan dan menyenangkan bersama keluarga.",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Berita & Kegiatan</h2>
        <Link to="/" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition">
          Lihat Semua Berita ➔
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl shadow hover:shadow-lg transition border border-gray-100 overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-5">
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1"><span>📅</span> {item.date}</div>
              <h3 className="font-bold text-[#1e3a8a] mb-2 leading-tight">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.desc}</p>
              <Link to="/" className="text-[#1e3a8a] font-semibold text-sm hover:text-[#f59e0b] transition">
                Baca Selengkapnya ➔
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DomestikNews;