import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function PackageDetail() {
  // Mengambil tipe (umroh/domestik) dan ID paket dari URL URL
  const { type, id } = useParams(); 
  const [paket, setPaket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const colName = type === "umroh" ? "paket_umroh" : "paket_domestik";
        const docRef = doc(db, colName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPaket(docSnap.data());
        } else {
          console.log("Data tidak ditemukan!");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, type]);

  if (loading) return <div className="pt-32 pb-20 text-center text-xl font-semibold text-gray-500">Memuat detail paket...</div>;
  if (!paket) return <div className="pt-32 pb-20 text-center text-xl font-semibold text-red-500">Paket tidak ditemukan.</div>;

  return (
    <div className="pt-20 bg-gray-50 min-h-screen pb-20">
      {/* Header Gambar */}
      <div className="w-full h-80 md:h-[400px] relative">
        <img src={paket.image} alt={paket.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">{paket.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Detail Utama */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-white text-sm font-bold px-4 py-1.5 rounded-md shadow-sm ${paket.badgeColor}`}>
                {paket.badge}
              </span>
              <span className="text-gray-500 font-medium">{paket.duration}</span>
            </div>

            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4 border-b pb-2">Informasi Paket</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700 mb-8">
              {paket.airline && <div className="flex gap-2 items-center"><span>✈️</span> Maskapai: <b>{paket.airline}</b></div>}
              {paket.transport && <div className="flex gap-2 items-center"><span>🚢</span> Transportasi: <b>{paket.transport}</b></div>}
              {paket.hotel && <div className="flex gap-2 items-center"><span>🏨</span> Penginapan: <b>{paket.hotel}</b></div>}
              {paket.jumlahUmroh && <div className="flex gap-2 items-center"><span>🕋</span> Jumlah Umroh: <b>{paket.jumlahUmroh}</b></div>}
              {paket.fasilitas && <div className="flex gap-2 items-center col-span-2"><span>✨</span> Fasilitas: <b>{paket.fasilitas}</b></div>}
            </div>

            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4 border-b pb-2">Deskripsi Lengkap</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              *(Nantinya kita bisa menambahkan fitur editor teks di Halaman Admin agar Anda bisa mengetik Itinerary Harian atau Syarat & Ketentuan lengkap di bagian ini secara dinamis).*
            </p>
          </div>

          {/* Kolom Kanan: Harga & Booking */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit sticky top-28 border-t-4 border-[#f59e0b]">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Ringkasan Biaya</h3>
            
            <div className="space-y-4 mb-8">
              {paket.hargaOpenTrip && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-800 font-semibold mb-1">Harga Open Trip</p>
                  <p className="text-2xl font-bold text-[#1e3a8a]">{paket.hargaOpenTrip} <span className="text-sm font-normal text-gray-500">/orang</span></p>
                </div>
              )}
              {paket.hargaPrivateTrip && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <p className="text-sm text-green-800 font-semibold mb-1">Harga Private Trip</p>
                  <p className="text-2xl font-bold text-green-700">{paket.hargaPrivateTrip} <span className="text-sm font-normal text-gray-500">/group</span></p>
                </div>
              )}
              {!paket.hargaOpenTrip && !paket.hargaPrivateTrip && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mulai dari</p>
                  <p className="text-3xl font-bold text-[#f59e0b]">{paket.price}</p>
                </div>
              )}
            </div>

            <button className="w-full bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg mb-3">
              Konsultasi via WhatsApp
            </button>
            <Link to={`/${type}`} className="block text-center text-[#1e3a8a] font-semibold hover:underline mt-4">
              Kembali ke Daftar Paket
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PackageDetail;