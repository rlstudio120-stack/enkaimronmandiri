import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { 
  MapPin, Globe, Clock, Users, Plane, Building, TrainFront, 
  Bus, Ship, Car, ChevronRight, CheckCircle, AlertCircle, Flame 
} from "lucide-react";

const getTransportIcon = (jenis) => {
  if (!jenis) return Bus;
  const j = jenis.toLowerCase();
  if (j.includes("pesawat") || j.includes("flight")) return Plane;
  if (j.includes("kereta")) return TrainFront;
  if (j.includes("kapal") || j.includes("boat")) return Ship;
  if (j.includes("shuttle") || j.includes("jeep") || j.includes("mobil")) return Car;
  return Bus;
};

const formatTanggalIndo = (tanggalString) => {
  if (!tanggalString) return "";
  const dateObj = new Date(tanggalString);
  if (isNaN(dateObj.getTime())) return tanggalString;
  const bulanIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${dateObj.getDate()} ${bulanIndo[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
};

function RelatedPackages({ currentId, division, currentArea }) {
  const [relatedList, setRelatedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const collectionMap = {
    umroh: "paket_umroh",
    domestik: "paket_domestik",
    internasional: "paket_internasional",
  };

  const catalogLinkMap = {
    umroh: "/umroh/paket",
    domestik: "/domestik/paket",
    internasional: "/internasional/paket",
  };

  const titleMap = {
    umroh: "Pilihan Paket Umroh Lainnya",
    domestik: "Rekomendasi Paket Domestik Lainnya",
    internasional: "Rekomendasi Tour Internasional Lainnya",
  };

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      try {
        const colName = collectionMap[division] || "paket_umroh";
        const snap = await getDocs(collection(db, colName));
        const allItems = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.id !== currentId);

        // Urutkan: Prioritaskan daerah/negara yang sama terlebih dahulu, lalu paket yang tidak Full Booked
        const sorted = allItems.sort((a, b) => {
          const areaA = a.daerah || a.negara || "";
          const areaB = b.daerah || b.negara || "";
          const matchA = currentArea && areaA === currentArea ? 1 : 0;
          const matchB = currentArea && areaB === currentArea ? 1 : 0;
          if (matchA !== matchB) return matchB - matchA;

          const fullA = a.statusKuota === "Full Booked" ? 1 : 0;
          const fullB = b.statusKuota === "Full Booked" ? 1 : 0;
          return fullA - fullB;
        });

        setRelatedList(sorted.slice(0, 4));
      } catch (err) {
        console.error("Gagal memuat rekomendasi paket:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentId) fetchRelated();
  }, [currentId, division, currentArea]);

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const badgeColors = {
    Promo: "bg-red-500",
    Reguler: "bg-blue-600",
    Premium: "bg-purple-600",
    VIP: "bg-[#f59e0b]",
  };

  // Jika sedang memuat atau tidak ada paket lain, tidak perlu tampilkan apa-apa
  if (loading || relatedList.length === 0) return null;

  return (
    <div className="mt-16 md:mt-20 pt-12 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <p className="text-xs font-extrabold text-[#f59e0b] uppercase tracking-widest mb-1">
            Eksplorasi Lebih Banyak
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a]">
            {titleMap[division]}
          </h2>
        </div>
        <Link
          to={catalogLinkMap[division]}
          className="inline-flex items-center gap-1 text-sm font-bold text-[#1e3a8a] hover:text-[#f59e0b] transition-colors"
        >
          Lihat Semua Paket <ChevronRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedList.map((item) => {
          const showKuota = item.tampilKuota !== "tidak";
          const isFullBooked = showKuota && item.statusKuota === "Full Booked";
          const isTerbatas = showKuota && item.statusKuota === "Terbatas";

          return (
            <Link
              to={`/paket/${division}/${item.id}`}
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group cursor-pointer w-full h-full"
            >
              {/* 1. BAGIAN FOTO */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1565552643982-b5e13d9646b9?q=80&w=800"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>

                {/* Badge Kategori (Kiri Atas) */}
                {item.badge && item.badge !== "Tidak Ada" && item.badge.trim() !== "" && (
                  <div className={`absolute top-4 left-4 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-sm ${badgeColors[item.badge] || item.badgeColor || "bg-[#1e3a8a]"}`}>
                    {item.badge}
                  </div>
                )}

                {/* Label Status Kuota (Kanan Atas) */}
                {showKuota && (
                  <div className="absolute top-4 right-4">
                    {isFullBooked ? (
                      <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle size={12} /> Full Booked
                      </span>
                    ) : isTerbatas ? (
                      <span className="bg-amber-500 text-black text-[10px] font-extrabold px-2.5 py-1.5 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1 animate-pulse">
                        <Flame size={12} /> {item.sisaSeat || "Terbatas"}
                      </span>
                    ) : (
                      <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle size={12} /> Tersedia
                      </span>
                    )}
                  </div>
                )}

                {/* Tipe Trip untuk Domestik & Internasional */}
                {division !== "umroh" && (
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[#1e3a8a] flex items-center gap-1.5 shadow-sm">
                    <Users size={12} /> {item.tipeTrip || "Open Trip"}
                  </div>
                )}
              </div>

              {/* 2. BAGIAN KONTEN */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Sub-label atas judul */}
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#f59e0b] mb-1.5 uppercase tracking-wide">
                  {division === "umroh" ? (
                    item.tipeWaktu === "bulan" ? `Bulan ${item.waktuInfo || "-"}` : formatTanggalIndo(item.waktuInfo)
                  ) : division === "domestik" ? (
                    <><MapPin size={12} /> {item.daerah || "Domestik"}</>
                  ) : (
                    <><Globe size={12} /> {item.negara || item.daerah || "Internasional"}</>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-[#1e3a8a] transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Ikon Fasilitas */}
                {division === "umroh" ? (
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 mb-5 border-b border-gray-100 pb-5 text-[11px] md:text-xs text-gray-600 font-semibold">
                    <div className="flex items-center gap-1.5"><Clock size={14} className="text-[#1e3a8a] shrink-0" /> <span className="line-clamp-1">{item.duration || "9 Hari"}</span></div>
                    {item.maskapai && (
                      <div className="flex items-center gap-1.5"><Plane size={14} className="text-[#1e3a8a] shrink-0" /> <span className="line-clamp-1">{item.maskapai}</span></div>
                    )}
                    <div className="flex items-center gap-1.5"><Building size={14} className="text-[#1e3a8a] shrink-0" /> <span className="line-clamp-1">Mekah: ⭐{item.bintangMekah || 5}</span></div>
                    <div className="flex items-center gap-1.5"><Building size={14} className="text-[#1e3a8a] shrink-0" /> <span className="line-clamp-1">Madinah: ⭐{item.bintangMadinah || 5}</span></div>
                    {item.keretaCepat === "ya" && (
                      <div className="flex items-center gap-1.5 col-span-2 mt-1"><TrainFront size={14} className="text-[#1e3a8a] shrink-0" /> <span className="line-clamp-1">Kereta Cepat Haramain</span></div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-3 mb-5 border-b border-gray-100 pb-5">
                    <div className="flex items-start gap-1.5 text-xs text-gray-600 font-semibold">
                      <Clock size={14} className="text-[#1e3a8a] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{item.duration || "Durasi Fleksibel"}</span>
                    </div>
                    {(item.transportasi || []).map((tr, idx) => {
                      const TransportIcon = getTransportIcon(tr.jenis);
                      return (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600 font-semibold">
                          <TransportIcon size={14} className="text-[#1e3a8a] shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{tr.deskripsi ? tr.deskripsi : tr.jenis}</span>
                        </div>
                      );
                    })}
                    {item.hotel && (
                      <div className="flex items-start gap-1.5 text-xs text-gray-600 font-semibold">
                        <Building size={14} className="text-[#1e3a8a] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item.hotel}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Harga & Tombol */}
                <div className="flex flex-col mt-auto">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mulai Dari</p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <p className="text-xl font-extrabold text-[#1e3a8a]">
                      {formatRupiah(item.price || item.hargaOpenTrip || item.hargaPrivateTrip)}
                    </p>
                    <span className="text-gray-500 text-xs font-semibold">/pax</span>
                  </div>
                  <div className={`w-full text-center text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm ${
                    isFullBooked ? "bg-slate-600 group-hover:bg-slate-700" : "bg-[#f59e0b] group-hover:bg-yellow-600"
                  }`}>
                    {isFullBooked ? "Full Booked • Lihat Detail" : "Lihat Detail"}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default RelatedPackages;