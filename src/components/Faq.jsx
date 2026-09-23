import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { MessageCircle, ChevronDown, ChevronUp, Search, Tent, MapPin, Globe, LayoutGrid } from "lucide-react";

function Faq() {
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const snap = await getDocs(collection(db, "faq"));
        setFaqList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Gagal mengambil data FAQ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (id) => setOpenAccordion(openAccordion === id ? null : id);

  const filteredFaq = faqList.filter(f => {
    const matchTab = activeTab === "Semua" || f.kategori === activeTab;
    const matchSearch = f.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-orange-100 text-[#f59e0b] rounded-full mb-6 shadow-inner"><MessageCircle size={40}/></div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1e3a8a] tracking-tight mb-4">Pusat Bantuan & FAQ</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">Temukan jawaban atas pertanyaan yang paling sering diajukan seputar layanan dan paket perjalanan kami.</p>
        </div>

        {/* Pencarian & Filter Navigasi */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-10 sticky top-20 z-30">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input type="text" placeholder="Ketikkan pertanyaan Anda di sini..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:bg-white focus:border-[#1e3a8a] text-sm transition-colors"/>
          </div>
          
          <div className="flex overflow-x-auto gap-2 hide-scrollbar pb-1">
            <button onClick={() => setActiveTab("Semua")} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === "Semua" ? "bg-[#1e3a8a] text-white shadow-md" : "text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"}`}><LayoutGrid size={16}/> Semua Topik</button>
            <button onClick={() => setActiveTab("Umum")} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === "Umum" ? "bg-[#1e3a8a] text-white shadow-md" : "text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"}`}><MessageCircle size={16}/> Umum</button>
            <button onClick={() => setActiveTab("Umroh")} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === "Umroh" ? "bg-[#1e3a8a] text-white shadow-md" : "text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"}`}><Tent size={16}/> Seputar Umroh</button>
            <button onClick={() => setActiveTab("Domestik")} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === "Domestik" ? "bg-[#1e3a8a] text-white shadow-md" : "text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"}`}><MapPin size={16}/> Trip Domestik</button>
            <button onClick={() => setActiveTab("Internasional")} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === "Internasional" ? "bg-[#1e3a8a] text-white shadow-md" : "text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"}`}><Globe size={16}/> Trip Internasional</button>
          </div>
        </div>

        {/* List Accordion FAQ */}
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#1e3a8a]"></div></div>
        ) : filteredFaq.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-500">Belum ada pertanyaan di kategori ini.</div>
        ) : (
          <div className="space-y-4">
            {filteredFaq.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <button onClick={() => toggleAccordion(item.id)} className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none group bg-white">
                  <div className="flex flex-col pr-4">
                    <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider mb-1">{item.kategori}</span>
                    <span className={`font-bold text-base transition-colors ${openAccordion === item.id ? "text-[#1e3a8a]" : "text-gray-800 group-hover:text-[#1e3a8a]"}`}>{item.pertanyaan}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openAccordion === item.id ? "bg-blue-100 text-[#1e3a8a]" : "bg-slate-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500"}`}>
                    {openAccordion === item.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                  </div>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openAccordion === item.id ? "max-h-[500px] opacity-100 border-t border-gray-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-6 bg-slate-50/50 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap border-l-4 border-[#f59e0b]">
                    {item.jawaban}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Faq;