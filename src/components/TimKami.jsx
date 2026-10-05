import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Users, Award, ShieldCheck, MapPin, Globe, Star, Quote } from "lucide-react";

function TimKami() {
  const [config, setConfig] = useState({
    heroTitle: "Struktur & Tim Kami",
    heroDesc: "Berkenalan dengan orang-orang hebat di balik layanan prima Enka Imron Mandiri yang siap mendampingi dan melayani perjalanan Anda sepenuh hati.",
    heroBg: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000",
    layoutPT: "Grid",
  });
  
  const [tim, setTim] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Struktur & Tim Kami | Enka Imron Mandiri";
    const fetchTimData = async () => {
      try {
        const configSnap = await getDoc(doc(db, "settings", "tim_kami"));
        if (configSnap.exists()) setConfig((prev) => ({ ...prev, ...configSnap.data() }));

        const timSnap = await getDocs(collection(db, "struktur_tim"));
        const dataTim = timSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Urutkan berdasarkan angka 'urutan' dari yang terkecil (1, 2, 3...)
        dataTim.sort((a, b) => (Number(a.urutan) || 99) - (Number(b.urutan) || 99));
        setTim(dataTim);
      } catch (error) {
        console.error("Gagal mengambil data tim:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimData();
    window.scrollTo(0, 0);
  }, []);

  // Fungsi pengelompokan divisi
  const filterTim = (divisiTarget) => tim.filter(t => t.divisi === divisiTarget && t.status !== "Nonaktif");

  // Komponen Kartu Profil (Modern Card)
  const ProfileCard = ({ person }) => (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group text-center relative pt-12 pb-6 px-6 mt-12">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 group-hover:scale-110 transition-transform duration-500">
        <img 
          src={person.image || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} 
          alt={person.nama} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-bold text-[#1e3a8a] mt-4 mb-1">{person.nama}</h3>
      <p className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider mb-4">{person.jabatan}</p>
      
      {person.quote && (
        <div className="mt-auto pt-4 border-t border-gray-50">
          <Quote size={16} className="text-gray-200 mx-auto mb-2" />
          <p className="text-[11px] text-gray-500 italic leading-relaxed line-clamp-3">"{person.quote}"</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="pt-20 bg-slate-50 min-h-screen overflow-x-hidden">
      
      {/* HERO SECTION */}
      <div className="relative bg-[#0f172a] pt-16 pb-32 md:pt-24 md:pb-36">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: `url('${config.heroBg}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#1e3a8a]/80 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <Users size={16} className="text-[#f59e0b]" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Struktur & Tim Kami</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight whitespace-pre-wrap">{config.heroTitle}</h1>
          <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">{config.heroDesc}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a] border-t-transparent"></div></div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-16 md:-mt-20 mb-24 space-y-24">
          
          {/* DIVISI 1: STRUKTUR PT */}
          {filterTim("Struktur PT").length > 0 && (
            <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
              <div className="text-center mb-16 md:mb-20">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a] flex items-center justify-center gap-3"><Award className="text-[#f59e0b]" size={32}/> Manajemen Inti PT</h2>
                <div className="w-24 h-1 bg-[#f59e0b] mx-auto mt-4 rounded-full"></div>
              </div>
              
              {/* LOGIKA PEMILIHAN LAYOUT (BAGAN vs GRID) */}
              {config.layoutPT === "Bagan" ? (
                <div className="flex flex-col items-center relative">
                  {/* LEVEL 1 (Direktur / Urutan 1) */}
                  <div className="w-full flex justify-center mb-16 relative">
                     {filterTim("Struktur PT").filter(p => p.urutan === "1").map(person => (
                        <div key={person.id} className="w-full max-w-xs z-10"><ProfileCard person={person} /></div>
                     ))}
                     {/* Garis vertikal utama ke bawah (Hanya muncul jika ada bawahan) */}
                     {filterTim("Struktur PT").length > 1 && (
                       <div className="absolute top-[100%] left-1/2 w-0.5 h-16 bg-blue-200 -translate-x-1/2"></div>
                     )}
                  </div>

                  {/* LEVEL 2 (Manajer/Staf / Urutan selain 1) */}
                  <div className="w-full flex flex-wrap justify-center gap-x-6 gap-y-16 relative">
                     {/* Garis horizontal pembagi cabang (Hanya untuk Laptop/Desktop) */}
                     {filterTim("Struktur PT").filter(p => p.urutan !== "1").length > 1 && (
                       <div className="absolute -top-16 left-[20%] right-[20%] h-0.5 bg-blue-200 hidden md:block"></div>
                     )}
                     
                     {filterTim("Struktur PT").filter(p => p.urutan !== "1").map(person => (
                        <div key={person.id} className="w-full sm:w-[calc(50%-12px)] md:w-64 z-10 relative">
                           {/* Garis vertikal cabang yang terhubung ke kotak (Hanya untuk Laptop/Desktop) */}
                           <div className="absolute -top-16 left-1/2 w-0.5 h-16 bg-blue-200 -translate-x-1/2 hidden md:block"></div>
                           <ProfileCard person={person} />
                        </div>
                     ))}
                  </div>
                </div>
              ) : (
                /* LAYOUT GRID STANDAR (Berjajar biasa tanpa garis cabang) */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
                  {filterTim("Struktur PT").map(person => (
                     <div key={person.id} className="w-full"><ProfileCard person={person} /></div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* DIVISI 2: PEMBIMBING UMROH */}
          {filterTim("Pembimbing Umroh").length > 0 && (
            <section>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a] flex items-center justify-center gap-3"><Star className="text-[#f59e0b]" size={32}/> Pembimbing Ibadah Umroh</h2>
                <p className="text-gray-500 text-sm mt-3">Para Asatidz dan Kyai yang siap mendampingi kekhusyukan ibadah Anda.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8">
                {filterTim("Pembimbing Umroh").map(person => <ProfileCard key={person.id} person={person} />)}
              </div>
            </section>
          )}

          {/* DIVISI 3: TOUR LEADER */}
          {filterTim("Tour Leader").length > 0 && (
            <section>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a] flex items-center justify-center gap-3"><Globe className="text-[#f59e0b]" size={32}/> Tour Leader Berpengalaman</h2>
                <p className="text-gray-500 text-sm mt-3">Pemandu wisata profesional untuk perjalanan domestik maupun internasional Anda.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8">
                {filterTim("Tour Leader").map(person => <ProfileCard key={person.id} person={person} />)}
              </div>
            </section>
          )}

          {/* DIVISI 4 & 5: TIM HANDLING & TIM WISATA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filterTim("Tim Handling (Mekah/Madinah)").length > 0 && (
              <section className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-extrabold text-[#1e3a8a] flex items-center justify-center md:justify-start gap-2"><MapPin className="text-[#f59e0b]" size={24}/> Tim Handling Saudi</h2>
                  <p className="text-gray-600 text-xs mt-2">Memastikan kelancaran hotel, transportasi, dan konsumsi di Tanah Suci.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {filterTim("Tim Handling (Mekah/Madinah)").map(person => <ProfileCard key={person.id} person={person} />)}
                </div>
              </section>
            )}

            {filterTim("Tim Wisata / Operasional").length > 0 && (
              <section className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-extrabold text-[#1e3a8a] flex items-center justify-center md:justify-start gap-2"><ShieldCheck className="text-blue-600" size={24}/> Tim Wisata & Operasional</h2>
                  <p className="text-gray-600 text-xs mt-2">Tim handal yang memastikan kelancaran perjalanan wisata, pelayanan jamaah, administrasi, hingga teknis lapangan.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {filterTim("Tim Wisata / Operasional").map(person => <ProfileCard key={person.id} person={person} />)}
                </div>
              </section>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default TimKami;