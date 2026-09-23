import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Scale, FileText } from "lucide-react";

function SyaratKetentuan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "syarat"));
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
  if (!data) return <div className="min-h-screen flex justify-center items-center pt-20 text-gray-500">Syarat & Ketentuan belum diatur.</div>;

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 text-[#1e3a8a] rounded-full mb-6 shadow-inner"><Scale size={40}/></div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-4">{data.judul || "Syarat & Ketentuan"}</h1>
          <p className="text-gray-500 text-sm md:text-base">Pembaruan Terakhir: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none p-10"><FileText size={200}/></div>
          <div className="relative z-10 text-gray-700 leading-relaxed text-sm md:text-base
            [&>p]:mb-5 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#1e3a8a] [&>h3]:mb-4 [&>h3]:mt-10 [&>h3]:border-b [&>h3]:pb-2 [&>h3]:border-gray-100
            [&>ul]:list-decimal [&>ul]:pl-6 [&>ul]:mb-5 [&>ul>li]:mb-3"
            dangerouslySetInnerHTML={{ __html: data.isi }} />
        </div>
      </div>
    </div>
  );
}

export default SyaratKetentuan;