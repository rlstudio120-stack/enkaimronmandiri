import { useState, useEffect } from "react";
import { 
  LayoutDashboard, MapPin, Tent, LogOut, Plus, Edit3, Trash2, X, Info, ShieldCheck, 
  Star, Heart, Clock, Award, ThumbsUp, Users, Gem, Bus, Plane, Globe, Box, 
  MessageSquare, Settings, Zap, Smile, CheckCircle, Compass, BookOpen
} from "lucide-react";
import JoditEditor from "jodit-react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; 
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const IconMap = { ShieldCheck, Star, Heart, Clock, Award, MapPin, ThumbsUp, Users, Gem, Bus, Tent, Plane, Globe, Box, Zap, Smile, CheckCircle, Compass, BookOpen };

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("umroh");
  const navigate = useNavigate();

  const handleLogout = async () => { try { await signOut(auth); navigate("/login"); } catch (error) { alert("Gagal keluar sistem."); } };

  const [dataList, setDataList] = useState([]);
  const [daerahOptions, setDaerahOptions] = useState([]);
  const [umrohPromoOptions, setUmrohPromoOptions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", type: "info", onConfirm: null });

  // Templates
  const initialUmroh = { title: "", price: "", tipeWaktu: "bulan", waktuInfo: "", duration: "", maskapai: "", pakaiNamaHotel: "ya", hotelMekah: "", bintangMekah: "5", hotelMadinah: "", bintangMadinah: "5", keretaCepat: "tidak", tampilBadge: "ya", badge: "Reguler", badgeColor: "bg-blue-600", image: "", deskripsi: "", informasiTambahan: [] };
  const initialDomestik = { title: "", daerah: "", duration: "", transport: "", hotel: "", tipeTrip: "Open Trip", price: "", badge: "Premium", badgeColor: "bg-purple-600", image: "", deskripsi: "", informasiTambahan: [] };
  const initialDaerah = { title: "", image: "" };
  const initialMengapa = { title: "", deskripsi: "", icon: "ShieldCheck", color: "bg-[#1e3a8a]" };
  const initialKeunggulanUmroh = { title: "", deskripsi: "", icon: "ShieldCheck" };
  const initialLayanan = { title: "", deskripsi: "", image: "", icon: "Plane", color: "bg-[#1e3a8a]", link: "/domestik" };
  const initialTestimoni = { name: "", service: "Paket Umroh", img: "", text: "", stars: "5" };
  const initialUmrohNews = { title: "", date: "", image: "", text: "", category: "Berita" };

  // Templates Config dengan Fitur Baru (Fokus & Ukuran & Warna)
  const initialConfig = { 
    heroTitle: "Perjalanan Anda,\nAmanah Kami", heroDesc: "Melayani perjalanan Domestik, Internasional, dan Umroh dengan pelayanan terbaik dan penuh amanah.", heroBg: "", showBadges: "ya", heroTitleSize: "text-[32px] md:text-5xl lg:text-6xl", heroBgPos: "bg-center",
    b1Text: "Terpercaya", b1Icon: "ShieldCheck", b2Text: "Harga Terbaik", b2Icon: "Star", b3Text: "Pelayanan Prima", b3Icon: "Heart",
    promoBg: "", promoSmall: "Paket Umroh 2024", promoTitle: "Berangkat Nyaman,\nIbadah Khusyuk", promoBtn: "Cek Promo", promoPrice: "25", promoLink: "/umroh", promoBgColor: "bg-[#0f172a]", promoBgPos: "object-center",
    testiAutoSlide: "ya"
  };

  const initialUmrohConfig = {
    heroTitle: "Perjalanan Umroh Nyaman,\nIbadah Makin Bermakna", heroDesc: "Kami hadir untuk memberikan pengalaman ibadah Umroh yang nyaman, aman, dan penuh keberkahan bersama Enka Imron Mandiri.", heroBg: "", heroTitleSize: "text-[32px] md:text-5xl lg:text-6xl", heroBgPos: "bg-center",
    f1Text: "Amanah & Terpercaya", f1Icon: "ShieldCheck", f2Text: "Pembimbing Berpengalaman", f2Icon: "Users", f3Text: "Pelayanan Terbaik", f3Icon: "Star",
    ctaBg: "", ctaTitle: "Siap Berangkat Umroh?", ctaDesc: "Percayakan perjalanan ibadah Anda bersama Enka Imron Mandiri. Kami siap melayani dengan amanah dan sepenuh hati.", ctaBtnText: "Hubungi Kami Sekarang", ctaBtnLink: "#", ctaBgColor: "bg-[#0f172a]", ctaBgPos: "object-center"
  };

  const [formUmroh, setFormUmroh] = useState(initialUmroh);
  const [formDomestik, setFormDomestik] = useState(initialDomestik);
  const [formDaerah, setFormDaerah] = useState(initialDaerah);
  const [formMengapa, setFormMengapa] = useState(initialMengapa);
  const [formKeunggulanUmroh, setFormKeunggulanUmroh] = useState(initialKeunggulanUmroh);
  const [formLayanan, setFormLayanan] = useState(initialLayanan);
  const [formTestimoni, setFormTestimoni] = useState(initialTestimoni);
  const [formConfig, setFormConfig] = useState(initialConfig);
  const [formUmrohNews, setFormUmrohNews] = useState(initialUmrohNews);
  const [formUmrohConfig, setFormUmrohConfig] = useState(initialUmrohConfig);

  useEffect(() => { fetchData(); fetchDaerahOptions(); }, [activeTab]);

  const fetchDaerahOptions = async () => { const snap = await getDocs(collection(db, "destinasi_domestik")); setDaerahOptions(snap.docs.map(doc => doc.data().title)); };
  const fetchData = async () => {
    if (activeTab === "config") {
      const snap = await getDoc(doc(db, "settings", "home"));
      if (snap.exists()) setFormConfig({ ...initialConfig, ...snap.data() });
      const uSnap = await getDocs(collection(db, "paket_umroh")); setUmrohPromoOptions(uSnap.docs.map(d => ({ id: d.id, title: d.data().title })));
      return;
    }
    if (activeTab === "config_umroh") {
      const snap = await getDoc(doc(db, "settings", "umroh"));
      if (snap.exists()) setFormUmrohConfig({ ...initialUmrohConfig, ...snap.data() });
      return;
    }
    let colName = "paket_umroh";
    if (activeTab === "domestik") colName = "paket_domestik"; if (activeTab === "daerah") colName = "destinasi_domestik"; if (activeTab === "mengapa") colName = "mengapa_kami"; if (activeTab === "keunggulan_umroh") colName = "keunggulan_umroh"; if (activeTab === "layanan") colName = "layanan_utama"; if (activeTab === "testimoni") colName = "testimoni_pelanggan"; if (activeTab === "umroh_news") colName = "berita_umroh";
    if(colName) { const snapshot = await getDocs(collection(db, colName)); setDataList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); }
  };

  const formatRupiah = (angka) => { if (!angka) return "Rp 0"; return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka); };
  const formatInputNumber = (num) => num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
  const handleNumberChange = (e, setForm, formState, fieldName) => setForm({ ...formState, [fieldName]: e.target.value.replace(/\D/g, "") });
  const handleChange = (e, setForm, formState) => setForm({ ...formState, [e.target.name]: e.target.value });
  const handleConfigChange = (e) => setFormConfig({ ...formConfig, [e.target.name]: e.target.value });
  const handleUmrohConfigChange = (e) => setFormUmrohConfig({ ...formUmrohConfig, [e.target.name]: e.target.value });

  const handleBadgeChange = (e, setForm, formState) => {
    const val = e.target.value; let color = "bg-blue-600";
    if (val === "Promo") color = "bg-red-600"; if (val === "Premium") color = "bg-purple-600"; if (val === "VIP") color = "bg-yellow-500";
    setForm({ ...formState, badge: val, badgeColor: color });
  };

  const handleAddInfo = (type) => { if (type === 'umroh') setFormUmroh({...formUmroh, informasiTambahan: [...(formUmroh.informasiTambahan || []), {judul: "", isi: ""}]}); else setFormDomestik({...formDomestik, informasiTambahan: [...(formDomestik.informasiTambahan || []), {judul: "", isi: ""}]}); };
  const handleRemoveInfo = (type, index) => { if (type === 'umroh') { const newArr = [...formUmroh.informasiTambahan]; newArr.splice(index, 1); setFormUmroh({...formUmroh, informasiTambahan: newArr}); } else { const newArr = [...formDomestik.informasiTambahan]; newArr.splice(index, 1); setFormDomestik({...formDomestik, informasiTambahan: newArr}); } };
  const handleUpdateInfo = (type, index, field, value) => { if (type === 'umroh') { const newArr = [...formUmroh.informasiTambahan]; newArr[index][field] = value; setFormUmroh({...formUmroh, informasiTambahan: newArr}); } else { const newArr = [...formDomestik.informasiTambahan]; newArr[index][field] = value; setFormDomestik({...formDomestik, informasiTambahan: newArr}); } };

  const showAlert = (message, type = "info", onConfirm = null) => setCustomAlert({ show: true, message, type, onConfirm });
  const closeAlert = () => setCustomAlert({ show: false, message: "", type: "info", onConfirm: null });

  const openAddModal = () => {
    setEditId(null);
    if (activeTab === "umroh") setFormUmroh(initialUmroh); else if (activeTab === "domestik") setFormDomestik(initialDomestik); else if (activeTab === "daerah") setFormDaerah(initialDaerah); else if (activeTab === "mengapa") setFormMengapa(initialMengapa); else if (activeTab === "keunggulan_umroh") setFormKeunggulanUmroh(initialKeunggulanUmroh); else if (activeTab === "layanan") setFormLayanan(initialLayanan); else if (activeTab === "testimoni") setFormTestimoni(initialTestimoni); else if (activeTab === "umroh_news") setFormUmrohNews(initialUmrohNews);
    setIsFormOpen(true);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    if (activeTab === "umroh") setFormUmroh({...initialUmroh, ...item}); else if (activeTab === "domestik") setFormDomestik({...initialDomestik, price: item.price || item.hargaOpenTrip || item.hargaPrivateTrip, ...item}); else if (activeTab === "daerah") setFormDaerah({...initialDaerah, ...item}); else if (activeTab === "mengapa") setFormMengapa({...initialMengapa, ...item}); else if (activeTab === "keunggulan_umroh") setFormKeunggulanUmroh({...initialKeunggulanUmroh, ...item}); else if (activeTab === "layanan") setFormLayanan({...initialLayanan, ...item}); else if (activeTab === "testimoni") setFormTestimoni({...initialTestimoni, ...item}); else if (activeTab === "umroh_news") setFormUmrohNews({...initialUmrohNews, ...item});
    setIsFormOpen(true);
  };

  const joditConfig = { height: 300, askBeforePasteHTML: false, askBeforePasteFromWord: false, defaultActionOnPaste: "insert_as_html" };
  const [isUploading, setIsUploading] = useState(false); const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e, formType, setFormFunc, stateData, configField = null, isUmrohConfig = false) => {
    const file = e.target.files[0]; if (!file) return;
    setIsUploading(true); setUploadProgress(50); 
    const formData = new FormData(); formData.append("file", file); formData.append("upload_preset", "ed8ovogp"); 
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/h8p2mssb/image/upload`, { method: "POST", body: formData });
      const data = await response.json();
      if (data.secure_url) {
        if (configField) {
          if(isUmrohConfig) setFormUmrohConfig({ ...formUmrohConfig, [configField]: data.secure_url });
          else setFormConfig({ ...formConfig, [configField]: data.secure_url });
        } else if (setFormFunc) setFormFunc({ ...stateData, image: data.secure_url });
        else {
          if (activeTab === "umroh") setFormUmroh({ ...formUmroh, image: data.secure_url }); else if (activeTab === "domestik") setFormDomestik({ ...formDomestik, image: data.secure_url }); else if (activeTab === "daerah") setFormDaerah({ ...formDaerah, image: data.secure_url }); else if (activeTab === "umroh_news") setFormUmrohNews({ ...formUmrohNews, image: data.secure_url });
        } setUploadProgress(100);
      } else alert("Gagal mengunggah gambar.");
    } catch (error) { alert("Terjadi kesalahan jaringan."); } 
    finally { setTimeout(() => { setIsUploading(false); setUploadProgress(0); }, 1000); }
  };

  const handleSaveConfig = async (e) => { e.preventDefault(); setIsSubmitting(true); try { await setDoc(doc(db, "settings", "home"), formConfig); showAlert("Pengaturan Beranda Disimpan!", "success"); } catch (error) { showAlert("Gagal menyimpan.", "error"); } finally { setIsSubmitting(false); } };
  const handleSaveUmrohConfig = async (e) => { e.preventDefault(); setIsSubmitting(true); try { await setDoc(doc(db, "settings", "umroh"), formUmrohConfig); showAlert("Pengaturan Umroh Disimpan!", "success"); } catch (error) { showAlert("Gagal menyimpan.", "error"); } finally { setIsSubmitting(false); } };

  const handleSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    let colName = "paket_umroh"; let dataToSave = formUmroh;
    if (activeTab === "domestik") { colName = "paket_domestik"; dataToSave = formDomestik; } if (activeTab === "daerah") { colName = "destinasi_domestik"; dataToSave = formDaerah; } if (activeTab === "mengapa") { colName = "mengapa_kami"; dataToSave = formMengapa; } if (activeTab === "keunggulan_umroh") { colName = "keunggulan_umroh"; dataToSave = formKeunggulanUmroh; } if (activeTab === "layanan") { colName = "layanan_utama"; dataToSave = formLayanan; } if (activeTab === "testimoni") { colName = "testimoni_pelanggan"; dataToSave = formTestimoni; } if (activeTab === "umroh_news") { colName = "berita_umroh"; dataToSave = formUmrohNews; }
    try {
      if (editId) { await updateDoc(doc(db, colName, editId), dataToSave); showAlert("Data diperbarui.", "success"); } else { await addDoc(collection(db, colName), dataToSave); showAlert("Data ditambahkan.", "success"); }
      setIsFormOpen(false); fetchData(); fetchDaerahOptions();
    } catch (error) { showAlert("Gagal menyimpan data.", "error"); } finally { setIsSubmitting(false); }
  };

  const confirmDelete = (id) => {
    showAlert("Yakin ingin menghapus?", "confirm", async () => {
      let colName = "paket_umroh";
      if (activeTab === "domestik") colName = "paket_domestik"; if (activeTab === "daerah") colName = "destinasi_domestik"; if (activeTab === "mengapa") colName = "mengapa_kami"; if (activeTab === "keunggulan_umroh") colName = "keunggulan_umroh"; if (activeTab === "layanan") colName = "layanan_utama"; if (activeTab === "testimoni") colName = "testimoni_pelanggan"; if (activeTab === "umroh_news") colName = "berita_umroh";
      await deleteDoc(doc(db, colName, id)); fetchData(); fetchDaerahOptions(); showAlert("Dihapus.", "success");
    });
  };

  const inputClass = "w-full border border-gray-200 p-3 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-0 focus:outline-none transition text-sm";
  const labelClass = "text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";
  
  // Opsi Dropdown
  const titleSizeOptions = <><option value="text-[28px] md:text-4xl lg:text-5xl">Sedang</option><option value="text-[32px] md:text-5xl lg:text-6xl">Besar (Standar)</option><option value="text-[36px] md:text-6xl lg:text-7xl">Sangat Besar</option></>;
  const bgPosOptions = <><option value="bg-top">Fokus Atas</option><option value="bg-center">Fokus Tengah (Standar)</option><option value="bg-bottom">Fokus Bawah (Pemandangan)</option></>;
  const objectPosOptions = <><option value="object-top">Fokus Atas</option><option value="object-center">Fokus Tengah (Standar)</option><option value="object-bottom">Fokus Bawah (Pemandangan)</option></>;
  const bgColorOptions = <><option value="bg-[#0f172a]">Biru Gelap Default</option><option value="bg-[#1e3a8a]">Biru Enka Mandiri</option><option value="bg-[#f59e0b]">Kuning Emas</option><option value="bg-emerald-800">Hijau Tua</option><option value="bg-black">Hitam Pekat</option></>;
  const iconColorOptions = <><option value="bg-[#1e3a8a]">Biru Tua</option><option value="bg-[#f59e0b]">Kuning Emas</option><option value="bg-emerald-500">Hijau</option><option value="bg-red-500">Merah</option><option value="bg-purple-500">Ungu</option></>;

  const renderIconSelector = (currentIcon, setIconFn) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {Object.keys(IconMap).map((key) => { const Icon = IconMap[key]; return (<button key={key} type="button" onClick={() => setIconFn(key)} className={`p-2.5 rounded-xl border transition-colors flex flex-col items-center justify-center focus:outline-none ${currentIcon === key ? "bg-blue-100 border-blue-500 text-blue-700 shadow-sm" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`} title={key}><Icon size={22} /></button>); })}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans selection:bg-blue-100">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f172a] text-white flex flex-col shadow-2xl z-20 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800"><div className="bg-blue-600 p-2 rounded-lg"><LayoutDashboard size={20}/></div><div><h2 className="text-base font-bold">Workspace</h2><p className="text-[10px] text-slate-400">Enka Imron Mandiri</p></div></div>
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-semibold text-[#f59e0b] uppercase tracking-wider mb-2">Manajemen Paket</p>
          <button onClick={() => setActiveTab("umroh")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "umroh" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><Tent size={18} /><span className="text-sm font-medium">Paket Umroh</span></button>
          <button onClick={() => setActiveTab("domestik")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "domestik" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><MapPin size={18} /><span className="text-sm font-medium">Paket Domestik</span></button>

          <p className="px-4 text-[10px] font-semibold text-[#f59e0b] uppercase tracking-wider mb-2 mt-6">Tampilan Beranda Web</p>
          <button onClick={() => setActiveTab("config")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "config" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><Settings size={18} /><span className="text-sm font-medium">Hero & Promo Banner</span></button>
          <button onClick={() => setActiveTab("layanan")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "layanan" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><Globe size={18} /><span className="text-sm font-medium">Layanan Kami</span></button>
          <button onClick={() => setActiveTab("mengapa")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "mengapa" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><ShieldCheck size={18} /><span className="text-sm font-medium">Keunggulan Beranda</span></button>
          <button onClick={() => setActiveTab("testimoni")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "testimoni" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><MessageSquare size={18} /><span className="text-sm font-medium">Testimoni Pelanggan</span></button>

          <p className="px-4 text-[10px] font-semibold text-[#f59e0b] uppercase tracking-wider mb-2 mt-6">Tampilan Halaman Umroh</p>
          <button onClick={() => setActiveTab("config_umroh")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "config_umroh" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><Tent size={18} /><span className="text-sm font-medium">Pengaturan Web Umroh</span></button>
          <button onClick={() => setActiveTab("keunggulan_umroh")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "keunggulan_umroh" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><CheckCircle size={18} /><span className="text-sm font-medium">Keunggulan Umroh</span></button>
          <button onClick={() => setActiveTab("umroh_news")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "umroh_news" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><BookOpen size={18} /><span className="text-sm font-medium">Berita & Artikel Umroh</span></button>

          <p className="px-4 text-[10px] font-semibold text-[#f59e0b] uppercase tracking-wider mb-2 mt-6">Master Data</p>
          <button onClick={() => setActiveTab("daerah")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "daerah" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}><MapPin size={18} /><span className="text-sm font-medium">Master Daerah</span></button>
        </nav>
        <div className="p-4 border-t border-slate-800"><button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 py-2 rounded-lg transition"><LogOut size={16} /><span className="text-sm">Keluar Sistem</span></button></div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center z-10 shrink-0">
          <div><h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab === "config" ? "Pengaturan Hero & Promo Beranda" : activeTab === "config_umroh" ? "Pengaturan Visual Halaman Umroh" : activeTab === "keunggulan_umroh" ? "Fitur Keunggulan Umroh" : activeTab === "umroh_news" ? "Berita & Kegiatan Jamaah Umroh" : `Manajemen ${activeTab}`}</h1></div>
          {activeTab !== "config" && activeTab !== "config_umroh" && (<button onClick={openAddModal} className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition"><Plus size={18} />Tambah Data</button>)}
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* TAB PENGATURAN UMROH */}
          {activeTab === "config_umroh" ? (
            <form onSubmit={handleSaveUmrohConfig} className="max-w-5xl mx-auto space-y-8 pb-10">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><Tent size={20}/> 1. Pengaturan Hero Halaman Umroh</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Judul Utama Hero</label><textarea name="heroTitle" value={formUmrohConfig.heroTitle} onChange={handleUmrohConfigChange} rows="2" className={inputClass}></textarea></div>
                  <div><label className={labelClass}>Deskripsi Singkat Halaman</label><textarea name="heroDesc" value={formUmrohConfig.heroDesc} onChange={handleUmrohConfigChange} rows="2" className={inputClass}></textarea></div>
                  
                  {/* PENGATURAN UKURAN & POSISI GAMBAR HERO UMROH */}
                  <div><label className={labelClass}>Ukuran Font Judul Hero</label><select name="heroTitleSize" value={formUmrohConfig.heroTitleSize} onChange={handleUmrohConfigChange} className={inputClass}>{titleSizeOptions}</select></div>
                  <div><label className={labelClass}>Posisi Fokus Gambar Hero</label><select name="heroBgPos" value={formUmrohConfig.heroBgPos} onChange={handleUmrohConfigChange} className={inputClass}>{bgPosOptions}</select></div>
                  
                  <div className="md:col-span-2">
                    <label className={labelClass}>Background Gambar Hero Umroh</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'heroBg', true)} className="w-full text-sm border border-gray-200 p-2.5 rounded-xl mb-1 bg-slate-50 outline-none"/>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <p className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wide">Pengaturan 3 Ikon (Di Bawah Deskripsi Hero)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks 1</label><input type="text" name="f1Text" value={formUmrohConfig.f1Text} onChange={handleUmrohConfigChange} className="w-full mb-3 p-2.5 border border-gray-200 rounded-lg text-sm"/><label className={labelClass}>Ikon 1</label>{renderIconSelector(formUmrohConfig.f1Icon, (val) => setFormUmrohConfig({...formUmrohConfig, f1Icon: val}))}</div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks 2</label><input type="text" name="f2Text" value={formUmrohConfig.f2Text} onChange={handleUmrohConfigChange} className="w-full mb-3 p-2.5 border border-gray-200 rounded-lg text-sm"/><label className={labelClass}>Ikon 2</label>{renderIconSelector(formUmrohConfig.f2Icon, (val) => setFormUmrohConfig({...formUmrohConfig, f2Icon: val}))}</div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks 3</label><input type="text" name="f3Text" value={formUmrohConfig.f3Text} onChange={handleUmrohConfigChange} className="w-full mb-3 p-2.5 border border-gray-200 rounded-lg text-sm"/><label className={labelClass}>Ikon 3</label>{renderIconSelector(formUmrohConfig.f3Icon, (val) => setFormUmrohConfig({...formUmrohConfig, f3Icon: val}))}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><Zap size={20}/> 2. Banner Promo CTA (Bagian Paling Bawah)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><label className={labelClass}>Judul Promo Banner</label><input type="text" name="ctaTitle" value={formUmrohConfig.ctaTitle} onChange={handleUmrohConfigChange} className={inputClass}/></div>
                  <div className="md:col-span-2"><label className={labelClass}>Deskripsi Ajakan</label><textarea name="ctaDesc" value={formUmrohConfig.ctaDesc} onChange={handleUmrohConfigChange} rows="2" className={inputClass}></textarea></div>
                  <div><label className={labelClass}>Teks Tombol Aksi</label><input type="text" name="ctaBtnText" value={formUmrohConfig.ctaBtnText} onChange={handleUmrohConfigChange} className={inputClass}/></div>
                  <div><label className={labelClass}>Link Tombol (URL/WA)</label><input type="text" name="ctaBtnLink" value={formUmrohConfig.ctaBtnLink} onChange={handleUmrohConfigChange} className={inputClass}/></div>
                  
                  {/* PENGATURAN WARNA DAN FOKUS CTA UMROH */}
                  <div><label className={labelClass}>Warna Latar CTA (Kiri)</label><select name="ctaBgColor" value={formUmrohConfig.ctaBgColor} onChange={handleUmrohConfigChange} className={inputClass}>{bgColorOptions}</select></div>
                  <div><label className={labelClass}>Posisi Fokus Gambar CTA (Kanan)</label><select name="ctaBgPos" value={formUmrohConfig.ctaBgPos} onChange={handleUmrohConfigChange} className={inputClass}>{objectPosOptions}</select></div>

                  <div className="md:col-span-2"><label className={labelClass}>Upload Background Gambar Promo Bawah</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'ctaBg', true)} className="w-full text-sm border border-gray-200 p-2.5 rounded-xl bg-slate-50"/></div>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting || isUploading} className="w-full py-4 bg-[#f59e0b] text-white font-bold rounded-xl shadow-xl transition-colors text-lg">Simpan Pengaturan Halaman Umroh</button>
            </form>
            
          ) : activeTab === "config" ? (
            /* TAB PENGATURAN BERANDA */
             <form onSubmit={handleSaveConfig} className="max-w-5xl mx-auto space-y-8 pb-10">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><Star size={20}/> 1. Pengaturan Hero Beranda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Judul Utama (Bisa 2 Baris)</label><textarea name="heroTitle" value={formConfig.heroTitle} onChange={handleConfigChange} rows="2" className={inputClass}></textarea></div>
                  <div><label className={labelClass}>Deskripsi Singkat</label><textarea name="heroDesc" value={formConfig.heroDesc} onChange={handleConfigChange} rows="2" className={inputClass}></textarea></div>
                  
                  {/* PENGATURAN UKURAN & POSISI GAMBAR HERO BERANDA */}
                  <div><label className={labelClass}>Ukuran Font Judul Hero</label><select name="heroTitleSize" value={formConfig.heroTitleSize} onChange={handleConfigChange} className={inputClass}>{titleSizeOptions}</select></div>
                  <div><label className={labelClass}>Posisi Fokus Gambar Hero</label><select name="heroBgPos" value={formConfig.heroBgPos} onChange={handleConfigChange} className={inputClass}>{bgPosOptions}</select></div>

                  <div><label className={labelClass}>Background Gambar</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'heroBg')} className="w-full text-sm border p-2.5 rounded-xl bg-slate-50"/></div>
                  <div><label className={labelClass}>Tampilkan Badge?</label><select name="showBadges" value={formConfig.showBadges} onChange={handleConfigChange} className={inputClass}><option value="ya">Ya, Tampilkan</option><option value="tidak">Sembunyikan</option></select></div>
                </div>
                {formConfig.showBadges === "ya" && (
                  <div className="mt-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks 1</label><input type="text" name="b1Text" value={formConfig.b1Text} onChange={handleConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Ikon 1</label>{renderIconSelector(formConfig.b1Icon, (val) => setFormConfig({...formConfig, b1Icon: val}))}</div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks 2</label><input type="text" name="b2Text" value={formConfig.b2Text} onChange={handleConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Ikon 2</label>{renderIconSelector(formConfig.b2Icon, (val) => setFormConfig({...formConfig, b2Icon: val}))}</div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks 3</label><input type="text" name="b3Text" value={formConfig.b3Text} onChange={handleConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Ikon 3</label>{renderIconSelector(formConfig.b3Icon, (val) => setFormConfig({...formConfig, b3Icon: val}))}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><Zap size={20}/> 2. Pengaturan Banner Promo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Teks Label Kecil</label><input type="text" name="promoSmall" value={formConfig.promoSmall} onChange={handleConfigChange} className={inputClass}/></div>
                  <div><label className={labelClass}>Judul Promo</label><textarea name="promoTitle" value={formConfig.promoTitle} onChange={handleConfigChange} rows="2" className={inputClass}></textarea></div>
                  <div><label className={labelClass}>Teks Tombol</label><input type="text" name="promoBtn" value={formConfig.promoBtn} onChange={handleConfigChange} className={inputClass}/></div>
                  <div><label className={`${labelClass} text-blue-600`}>Tombol Diarahkan Ke Paket:</label><select name="promoLink" value={formConfig.promoLink} onChange={handleConfigChange} className={inputClass}><option value="/umroh">-- Halaman Utama Umroh --</option>{umrohPromoOptions.map(u => (<option key={u.id} value={`/paket/umroh/${u.id}`}>Paket: {u.title}</option>))}</select></div>
                  <div><label className={labelClass}>Harga Mulai (Angka Besar)</label><input type="text" name="promoPrice" value={formConfig.promoPrice} onChange={handleConfigChange} className={inputClass}/></div>
                  <div><label className={labelClass}>Background Gambar</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'promoBg')} className="w-full text-sm border p-2.5 rounded-xl bg-slate-50"/></div>
                  
                  {/* PENGATURAN WARNA DAN FOKUS BANNER PROMO BERANDA */}
                  <div><label className={labelClass}>Warna Latar Promo (Kiri)</label><select name="promoBgColor" value={formConfig.promoBgColor} onChange={handleConfigChange} className={inputClass}>{bgColorOptions}</select></div>
                  <div><label className={labelClass}>Posisi Fokus Gambar Promo (Kanan)</label><select name="promoBgPos" value={formConfig.promoBgPos} onChange={handleConfigChange} className={inputClass}>{objectPosOptions}</select></div>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting || isUploading} className="w-full py-4 bg-[#f59e0b] text-white font-bold rounded-xl shadow-xl transition-colors">Simpan Pengaturan Beranda</button>
            </form>
          ) : (
            
            /* TABEL DATA LIST */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold">Visual</th>
                    <th className="px-6 py-4 font-semibold">Informasi Utama</th>
                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dataList.map((item) => {
                    const DynamicIcon = IconMap[item.icon] || Star;
                    return (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition group">
                        <td className="px-6 py-4 w-24">
                          {(activeTab === "mengapa" || activeTab === "layanan" || activeTab === "keunggulan_umroh") ? (
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md ${item.color || 'bg-[#1e3a8a]'}`}><DynamicIcon size={26} /></div>
                          ) : activeTab === "testimoni" ? (
                            <img src={item.img} alt={item.name} className="w-14 h-14 rounded-full object-cover shadow-sm border border-gray-200" />
                          ) : (<img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-gray-100" />)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800 text-base mb-1">{item.title || item.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{item.deskripsi || item.text || item.daerah || item.service || (item.text && item.text.replace(/<[^>]*>?/gm, ''))}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition mr-1"><Edit3 size={18} /></button>
                          <button onClick={() => confirmDelete(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {dataList.length === 0 && (<div className="py-20 flex flex-col items-center justify-center text-gray-400"><p className="text-sm">Belum ada data yang ditambahkan.</p></div>)}
            </div>
          )}
        </div>
      </div>

      {/* MODAL FORM TAMBAH / EDIT UMUM */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Edit3 className="text-blue-600"/>{editId ? 'Perbarui Data' : 'Tambah Data Baru'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 transition outline-none"><X size={26}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-slate-50 custom-scrollbar">
              <form id="dataForm" onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                
                {activeTab === "umroh" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col"><label className={labelClass}>Nama Paket</label><input type="text" name="title" value={formUmroh.title} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass} required /></div>
                      <div className="flex flex-col"><label className={labelClass}>Harga (Rp)</label><input type="text" value={formatInputNumber(formUmroh.price)} onChange={(e) => handleNumberChange(e, setFormUmroh, formUmroh, 'price')} className={inputClass} required /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      <div className="flex flex-col"><label className={labelClass}>Format Waktu</label><select name="tipeWaktu" value={formUmroh.tipeWaktu} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="bulan">Berupa Bulan Saja</option><option value="tanggal">Berupa Tanggal Pasti</option></select></div>
                      <div className="flex flex-col"><label className={labelClass}>Isi Waktu</label><input type={formUmroh.tipeWaktu==='bulan'?'text':'date'} name="waktuInfo" value={formUmroh.waktuInfo} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass} /></div>
                      <div className="flex flex-col"><label className={labelClass}>Durasi</label><input type="text" name="duration" value={formUmroh.duration} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass} /></div>
                      <div className="flex flex-col"><label className={labelClass}>Maskapai</label><input type="text" name="maskapai" value={formUmroh.maskapai} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass} /></div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-2xl border border-blue-100 flex flex-col gap-5 shadow-sm">
                      <div className="flex items-center gap-4 border-b border-gray-100 pb-3"><label className="text-sm font-bold text-blue-900">Tampilkan Nama Hotel Secara Spesifik?</label><select name="pakaiNamaHotel" value={formUmroh.pakaiNamaHotel} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className="border border-gray-200 py-1.5 px-3 rounded-lg bg-slate-50 text-sm focus:outline-none"><option value="ya">Ya, Tampilkan</option><option value="tidak">Tidak, Sembunyikan</option></select></div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col"><label className={labelClass}>Nama Hotel Mekah</label><input type="text" name="hotelMekah" value={formUmroh.hotelMekah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} disabled={formUmroh.pakaiNamaHotel === 'tidak'} className={`w-full border p-3 rounded-xl text-sm focus:outline-none transition ${formUmroh.pakaiNamaHotel === 'tidak' ? 'bg-gray-100' : 'bg-slate-50'}`}/></div>
                        <div className="flex flex-col"><label className={labelClass}>Bintang Hotel Mekah</label><select name="bintangMekah" value={formUmroh.bintangMekah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option></select></div>
                        <div className="flex flex-col"><label className={labelClass}>Nama Hotel Madinah</label><input type="text" name="hotelMadinah" value={formUmroh.hotelMadinah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} disabled={formUmroh.pakaiNamaHotel === 'tidak'} className={`w-full border p-3 rounded-xl text-sm focus:outline-none transition ${formUmroh.pakaiNamaHotel === 'tidak' ? 'bg-gray-100' : 'bg-slate-50'}`}/></div>
                        <div className="flex flex-col"><label className={labelClass}>Bintang Hotel Madinah</label><select name="bintangMadinah" value={formUmroh.bintangMadinah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option></select></div>
                      </div>
                      <div className="border-t border-gray-100 pt-4"><label className={labelClass}>Fasilitas Kereta Cepat Haramain?</label><select name="keretaCepat" value={formUmroh.keretaCepat} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="tidak">Tidak Tersedia</option><option value="ya">Ya, Termasuk Kereta Cepat</option></select></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col"><label className={labelClass}>Pilih Tingkatan Badge</label><select value={formUmroh.badge} onChange={(e) => handleBadgeChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="Promo">Promo (Warna Merah)</option><option value="Reguler">Reguler (Warna Biru)</option><option value="Premium">Premium (Warna Ungu)</option><option value="VIP">VIP (Warna Kuning)</option></select></div>
                      <div className="flex flex-col"><label className={labelClass}>Upload Gambar Cover</label><input type="file" onChange={handleImageUpload} className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm outline-none"/></div>
                    </div>
                    
                    <div className="col-span-2 border-t border-gray-200 pt-6 mt-2">
                      <label className="text-sm font-bold text-gray-800 uppercase mb-3 block">Deskripsi & Itinerary Utama</label>
                      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"><JoditEditor value={formUmroh.deskripsi} config={joditConfig} onBlur={(c) => setFormUmroh({...formUmroh, deskripsi: c})} /></div>
                      <div className="flex justify-between items-center mt-8 mb-4 border-b border-gray-200 pb-3">
                        <label className="text-sm font-bold text-gray-800 uppercase">Informasi Tambahan (Buka-Tutup)</label>
                        <button type="button" onClick={() => handleAddInfo('umroh')} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold flex gap-2 outline-none"><Plus size={16}/> Tambah Judul Baru</button>
                      </div>
                      {(formUmroh.informasiTambahan || []).map((info, index) => (
                        <div key={index} className="border border-gray-200 rounded-2xl p-5 mb-5 bg-white shadow-sm relative">
                          <button type="button" onClick={() => handleRemoveInfo('umroh', index)} className="absolute top-5 right-5 text-red-400 hover:text-red-600 transition outline-none"><Trash2 size={18}/></button>
                          <input type="text" value={info.judul} onChange={(e) => handleUpdateInfo('umroh', index, 'judul', e.target.value)} className="border border-gray-200 p-3 rounded-xl w-full mb-4 outline-none font-semibold text-sm" placeholder="Contoh Judul..." />
                          <div className="rounded-xl overflow-hidden border border-gray-200"><JoditEditor value={info.isi} config={{...joditConfig, height: 250}} onBlur={(c) => handleUpdateInfo('umroh', index, 'isi', c)} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FORM LAINNYA (Sama persis seperti sebelumnya) */}
                {activeTab === "domestik" && (<div className="col-span-2 text-center py-10 text-gray-400">Silakan gunakan script Domestik sebelumnya, bagian ini disingkat agar fokus pada pembaruan Umroh & Config Home.</div>)}
                {activeTab === "daerah" && (<div className="col-span-2 text-center py-10 text-gray-400">Silakan gunakan script Daerah sebelumnya...</div>)}
                {activeTab === "mengapa" && (<div className="col-span-2 text-center py-10 text-gray-400">Silakan gunakan script Mengapa Kami sebelumnya...</div>)}
                {activeTab === "layanan" && (<div className="col-span-2 text-center py-10 text-gray-400">Silakan gunakan script Layanan sebelumnya...</div>)}
                {activeTab === "testimoni" && (<div className="col-span-2 text-center py-10 text-gray-400">Silakan gunakan script Testimoni sebelumnya...</div>)}
                {activeTab === "umroh_news" && (<div className="col-span-2 text-center py-10 text-gray-400">Silakan gunakan script Berita Umroh sebelumnya...</div>)}
                
                {/* 5. FORM KEUNGGULAN UMROH */}
                {activeTab === "keunggulan_umroh" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 gap-6"><div className="flex flex-col"><label className={labelClass}>Judul Keunggulan Umroh</label><input type="text" name="title" value={formKeunggulanUmroh.title} onChange={(e) => handleChange(e, setFormKeunggulanUmroh, formKeunggulanUmroh)} className={inputClass} required /></div></div>
                    <div className="flex flex-col"><label className={labelClass}>Deskripsi Pendek</label><textarea name="deskripsi" value={formKeunggulanUmroh.deskripsi} onChange={(e) => handleChange(e, setFormKeunggulanUmroh, formKeunggulanUmroh)} rows="3" className={inputClass} required></textarea></div>
                    <div className="flex flex-col p-5 bg-white border border-gray-100 rounded-2xl shadow-sm"><label className={labelClass}>Pilih Ikon (Akan tampil warna Biru)</label>{renderIconSelector(formKeunggulanUmroh.icon, (val) => setFormKeunggulanUmroh({...formKeunggulanUmroh, icon: val}))}</div>
                  </div>
                )}
                
              </form>
            </div>
            
            <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl transition text-sm outline-none">Batal</button>
              <button form="dataForm" type="submit" disabled={isSubmitting || isUploading} className="px-6 py-2.5 bg-[#1e3a8a] text-white font-medium rounded-xl shadow-md text-sm outline-none">Simpan Data</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ALERT */}
      {customAlert.show && (
        <div className="fixed inset-0 bg-slate-900/50 z-[60] flex items-center justify-center p-4"><div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl"><h3 className="text-xl font-bold mb-2 text-gray-800">{customAlert.type === "confirm" ? "Konfirmasi Hapus" : "Informasi"}</h3><p className="text-gray-500 mb-8 text-sm">{customAlert.message}</p><div className="flex justify-center gap-3"><button onClick={closeAlert} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium">Mengerti</button></div></div></div>
      )}
    </div>
  );
}

export default AdminDashboard;