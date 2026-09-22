import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; 

function UmrohPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "paket_umroh"));
        const dataPaket = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setPackages(dataPaket);
      } catch (error) {
        console.error("Error mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">
          Paket Umroh Pilihan
        </h2>
        <Link to="/umroh/paket" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] hidden md:flex items-center gap-1 transition duration-300">
          Lihat Semua Paket ➔
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 font-semibold">Mengambil data paket terbaru...</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Belum ada paket umroh yang tersedia.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden flex flex-col group">
              
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md ${pkg.badgeColor}`}>
                  {pkg.badge}
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">{pkg.title}</h3>
                
                {/* Area Detail Paket yang Sudah Diperbarui */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 mb-6 flex-grow">
                  <div className="flex items-center gap-1"><span>📅</span> {pkg.duration}</div>
                  <div className="flex items-center gap-1"><span>✈️</span> {pkg.airline}</div>
                  <div className="flex items-center gap-1 col-span-2"><span>🏨</span> {pkg.hotel}</div>
                  
                  {/* Fasilitas Tambahan (Akan muncul jika datanya diisi di Firebase) */}
                  {pkg.jumlahUmroh && (
                    <div className="flex items-center gap-1 col-span-2"><span>🕋</span> Umroh {pkg.jumlahUmroh}</div>
                  )}
                  {pkg.fasilitas && (
                    <div className="flex items-center gap-1 col-span-2"><span>🚄</span> {pkg.fasilitas}</div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <span className="text-xs text-gray-500 block mb-1">Mulai dari</span>
                  <div className="text-[#f59e0b] font-bold text-xl mb-4">
                    {pkg.price} <span className="text-sm text-gray-500 font-normal">/pax</span>
                  </div>
                  <Link to={`/paket/umroh/${pkg.id}`} className="block text-center w-full bg-[#f59e0b] hover:bg-yellow-600 text-white font-semibold py-2.5 rounded-md transition duration-300">
  Lihat Detail
</Link>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center md:hidden">
         <Link to="/umroh/paket" className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] transition duration-300">
          Lihat Semua Paket ➔
        </Link>
      </div>
    </div>
  );
}

export default UmrohPackages;