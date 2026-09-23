import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Target, Compass, Award } from "lucide-react";

function TentangKami() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "tentang"));
        if (snap.exists()) setData(snap.data());
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div></div>;
  if (!data) return <div className="min-h-screen flex justify-center items-center pt-20 text-gray-500">Halaman belum diatur.</div>;

  return (
    <div className="pt-20 bg-slate-50 min-h-screen font-sans overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-[#0f172a] py-24 md:py-32">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url('${data.image || "https://images.unsplash.com/photo-1512453979436-5a5369ce9e12?q=80&w=2000"}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#1e3a8a]/60 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 text-[#f59e0b] shadow-lg border border-white/20"><Award size={32}/></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight">{data.heroTitle || "Tentang Kami"}</h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap">{data.heroDesc}</p>
        </div>
      </div>

      {/* Visi & Misi Cards (Glassmorphism overlap) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-16 md:-mt-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Compass size={32} /></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Visi Kami</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{data.visi}</p>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-orange-50 text-[#f59e0b] rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Target size={32} /></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Misi Kami</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-left w-full pl-4">{data.misi}</p>
          </div>
        </div>
      </div>

      {/* Sejarah / Profil Lengkap */}
      {data.deskripsi && data.deskripsi !== "<p><br></p>" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-8 border-b border-gray-100 pb-6 text-center">Sejarah & Profil Perusahaan</h2>
            <div className="text-gray-700 leading-loose text-base md:text-lg 
              [&>p]:mb-5 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#1e3a8a] [&>h3]:mb-4 [&>h3]:mt-8
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul>li]:mb-2"
              dangerouslySetInnerHTML={{ __html: data.deskripsi }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TentangKami;