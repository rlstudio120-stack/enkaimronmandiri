import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Calendar, Tag, ArrowLeft } from "lucide-react";

function NewsDetail() {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "berita_umroh", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Berita tidak ditemukan!");
          setArticle(null);
        }
      } catch (error) {
        console.error("Gagal memuat berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0); // Scroll otomatis ke atas saat halaman dibuka
  }, [id]);

  const formatWaktu = (waktu) => {
    if (!waktu) return "";
    const dateObj = new Date(waktu);
    return dateObj.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-32 pb-20 text-center min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Berita Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">Maaf, artikel yang Anda cari mungkin telah dihapus atau linknya salah.</p>
        <Link to="/berita" className="bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold">Kembali ke Daftar Berita</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigasi Kembali */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#1e3a8a] font-semibold mb-8 transition-colors">
          <ArrowLeft size={20} /> Kembali
        </button>

        {/* Header Artikel */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-500 mb-4">
            <span className="bg-blue-50 text-[#1e3a8a] px-3 py-1.5 rounded-lg flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
              <Tag size={14}/> {article.category || "Berita"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#f59e0b]"/> {formatWaktu(article.date)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>
        </div>

        {/* Gambar Utama Artikel */}
        <div className="w-full h-[250px] md:h-[450px] rounded-2xl overflow-hidden shadow-md mb-12">
          <img src={article.image || "https://images.unsplash.com/photo-1565552643952-2508825c868c?q=80&w=2000"} alt={article.title} className="w-full h-full object-cover object-center" />
        </div>

        {/* Konten Artikel (Merender HTML dari Jodit Editor) */}
        {/* Class khusus Tailwind ini digunakan agar HTML buatan Admin tampil rapi (bold, list, paragraf) */}
        <div 
          className="text-gray-700 leading-relaxed text-base md:text-lg 
            [&>p]:mb-6 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-[#1e3a8a] [&>h1]:mb-4 [&>h1]:mt-8
            [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#1e3a8a] [&>h2]:mb-4 [&>h2]:mt-8
            [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:mt-6
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2
            [&>strong]:text-gray-900 [&>a]:text-[#1e3a8a] [&>a]:underline
            [&>img]:rounded-xl [&>img]:w-full [&>img]:my-6 [&>img]:shadow-sm"
          dangerouslySetInnerHTML={{ __html: article.text }} 
        />
        
        {/* Footer Artikel */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-semibold">Diterbitkan oleh Enka Imron Mandiri</p>
          <div className="flex gap-3">
            {/* Tombol Bagikan Sederhana (Opsional) */}
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link berhasil disalin!"); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition">
              Salin Link
            </button>
            <Link to="/berita" className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-md">
              Artikel Lainnya
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default NewsDetail;