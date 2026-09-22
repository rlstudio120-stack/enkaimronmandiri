import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import { 
  MapPin, Clock, Users, ChevronRight, 
  Plane, Bus, TrainFront, Ship, Car
} from "lucide-react";

// Pemetaan Ikon Transportasi Dinamis
const getTransportIcon = (jenis) => {
  switch(jenis) {
    case "Pesawat": return Plane;
    case "Kereta": return TrainFront;
    case "Kapal": return Ship;
    case "Shuttle": return Car;
    case "Jeep": return Car;
    default: return Bus;
  }
};

function DomestikPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Ambil 4 paket terakhir saja agar tidak menumpuk di tampilan
        const q = query(collection(db, "paket_domestik"), limit(4));
        const querySnapshot = await getDocs(q);
        setPackages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Paket Wisata Domestik</h2>
        <Link to="/domestik" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition">
          Lihat Semua Paket <ChevronRight size={18}/>
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-10 text-gray-500">Mengambil data paket domestik...</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-slate-50 rounded-xl border border-gray-200">Belum ada paket domestik yang ditambahkan.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <Link to={`/paket/domestik/${pkg.id}`} key={pkg.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group cursor-pointer">
              
              <div className="h-48 relative overflow-hidden">
                <img src={pkg.image || "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=800"} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>
                
                {/* PERBAIKAN BADGE TRANSPARAN & LOGIKA 'TIDAK ADA' */}
                {pkg.badge && pkg.badge !== "Tidak Ada" && (
                  <div className={`absolute top-4 left-4 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-lg backdrop-blur-md bg-opacity-80 border border-white/30 ${pkg.badgeColor || 'bg-purple-600'}`}>
                    {pkg.badge}
                  </div>
                )}

                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#1e3a8a] flex items-center gap-1.5 shadow-sm">
                  <Users size={12}/> {pkg.tipeTrip || "Open Trip"}
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#f59e0b] mb-1.5 uppercase tracking-wide">
                   <MapPin size={12} /> {pkg.daerah || "Indonesia"}
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#1e3a8a] transition-colors leading-snug">{pkg.title}</h3>
                
                <div className="flex flex-wrap gap-y-2 gap-x-4 mb-5 border-b border-gray-100 pb-4">
                   <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold w-full">
                     <Clock size={14} className="text-[#1e3a8a] shrink-0" /> {pkg.duration || "1 Hari"}
                   </div>
                   
                   {/* Iterasi Ikon Transportasi */}
                   {(pkg.transportasi || []).slice(0, 3).map((tr, idx) => {
                     const TransportIcon = getTransportIcon(tr.jenis);
                     return (
                       <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold" title={tr.deskripsi}>
                         <TransportIcon size={14} className="text-[#1e3a8a] shrink-0" />
                         <span>{tr.jenis}</span>
                       </div>
                     );
                   })}
                   
                   {/* Fallback jika tidak ada array transportasi */}
                   {(!pkg.transportasi || pkg.transportasi.length === 0) && pkg.transport && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                         <Bus size={14} className="text-[#1e3a8a] shrink-0" />
                         <span className="line-clamp-1">{pkg.transport}</span>
                       </div>
                   )}
                </div>
                
                <div className="flex flex-col mt-auto">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mulai dari</span>
                  <div className="flex items-baseline gap-1 mb-4">
                     <p className="text-xl font-extrabold text-[#1e3a8a]">{formatRupiah(pkg.price || pkg.hargaOpenTrip || pkg.hargaPrivateTrip)}</p>
                     <span className="text-gray-500 text-xs font-semibold">/pax</span>
                  </div>
                  <div className="w-full text-center bg-[#f59e0b] group-hover:bg-yellow-600 text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                    Lihat Detail
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-8 flex justify-center md:hidden">
        <Link to="/domestik" className="flex items-center gap-2 text-[#1e3a8a] font-bold text-sm bg-blue-50 py-3 px-6 rounded-xl">
          Lihat Semua Paket <ChevronRight size={18}/>
        </Link>
      </div>
    </div>
  );
}

export default DomestikPackages;