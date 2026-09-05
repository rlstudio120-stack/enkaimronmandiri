import { Link } from "react-router-dom";

function UmrohNews() {
  const news = [
    {
      date: "25 Mei 2026",
      title: "Keberangkatan Jamaah Umroh Enka Imron Mandiri Mei 2026",
      desc: "Alhamdulillah, jamaah umroh Enka Imron Mandiri telah diberangkatkan dengan lancar dan penuh keberkahan.",
      image: "https://images.unsplash.com/photo-1574515550269-e5658e47f7d9?q=80&w=600"
    },
    {
      date: "18 Mei 2026",
      title: "Kegiatan City Tour Thaif Bersama Jamaah Umroh",
      desc: "Jamaah menikmati perjalanan city tour ke Thaif dengan penuh suka cita dan kebersamaan.",
      image: "https://images.unsplash.com/photo-1580227918349-8c909c00df0b?q=80&w=600"
    },
    {
      date: "10 Mei 2026",
      title: "Kajian & Manasik Umroh Sebelum Keberangkatan",
      desc: "Pembekalan manasik umroh untuk mempersiapkan ibadah yang lebih nyaman dan sesuai sunnah.",
      image: "https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Berita & Kegiatan Umroh</h2>
        <Link to="/" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1">
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
              <Link to="/" className="text-[#1e3a8a] font-semibold text-sm hover:text-[#f59e0b]">
                Baca Selengkapnya ➔
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UmrohNews;