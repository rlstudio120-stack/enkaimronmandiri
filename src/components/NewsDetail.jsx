import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Calendar, ArrowLeft, User, Tag } from "lucide-react";

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        // PERBAIKAN: Mengambil dari koleksi "berita" yang terpusat
        const docRef = doc(db, "berita", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBerita({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Gagal mengambil berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
    // Auto scroll ke atas saat halaman dibuka
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div>
      </div>
    );
  }

  // Tampilan jika data tidak ada di database
  if (!berita) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 pt-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Berita Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-8 max-w-md">Maaf, artikel yang Anda cari mungkin telah dihapus atau linknya salah.</p>
        <button onClick={() => navigate(-1)} className="bg-[#1e3a8a] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg">
          Kembali ke Halaman Sebelumnya
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tombol Kembali */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#1e3a8a] font-semibold mb-8 transition-colors">
          <ArrowLeft size={18} /> Kembali
        </button>

        {/* Kontainer Utama Berita */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-6 md:p-10">
          
          {/* Label Kategori & Tipe */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-blue-50 text-[#1e3a8a] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={14}/> {berita.category || "Berita"}
            </span>
            {/* Menampilkan asal divisi (Umroh/Domestik) */}
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
              Divisi {berita.tipe || "Umroh"}
            </span>
          </div>

          {/* Judul Berita */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {berita.title}
          </h1>

          {/* Metadata (Tanggal & Penulis) */}
          <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-8 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-1.5"><Calendar size={16} className="text-[#f59e0b]"/> {berita.date}</div>
            <div className="flex items-center gap-1.5"><User size={16} className="text-[#f59e0b]"/> Admin Enka Mandiri</div>
          </div>

          {/* Gambar Cover Berita */}
          {berita.image && (
            <div className="w-full h-[250px] md:h-[450px] rounded-2xl overflow-hidden mb-10 shadow-sm relative">
              <img src={berita.image} alt={berita.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Isi Konten Berita (HTML dari Jodit Editor) */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed
            prose-headings:text-[#1e3a8a] prose-headings:font-bold prose-a:text-[#f59e0b] hover:prose-a:text-yellow-600
            [&>p]:mb-6 [&>img]:rounded-xl [&>img]:my-6 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-2"
            dangerouslySetInnerHTML={{ __html: berita.text }} 
          />
        </div>

      </div>
    </div>
  );
}

export default NewsDetail;