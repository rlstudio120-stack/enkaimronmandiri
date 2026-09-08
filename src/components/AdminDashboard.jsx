import { useState, useEffect } from "react";
import { 
  LayoutDashboard, MapPin, Tent, LogOut, Plus, 
  Edit3, Trash2, X, CheckCircle, AlertTriangle, Info,
  ShieldCheck, Star, Heart, Clock, Award, ThumbsUp, Users, Gem, Bus
} from "lucide-react";
import JoditEditor from "jodit-react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; 
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const IconMap = { ShieldCheck, Star, Heart, Clock, Award, MapPin, ThumbsUp, Users, Gem, Bus };

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("umroh");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await signOut(auth); navigate("/login"); } 
    catch (error) { alert("Gagal keluar sistem."); }
  };

  const [dataList, setDataList] = useState([]);
  const [daerahOptions, setDaerahOptions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", type: "info", onConfirm: null });

  const initialUmroh = { title: "", price: "", tipeWaktu: "bulan", waktuInfo: "", duration: "", maskapai: "", pakaiNamaHotel: "ya", hotelMekah: "", bintangMekah: "5", hotelMadinah: "", bintangMadinah: "5", keretaCepat: "tidak", jumlahUmroh: "", tampilBadge: "ya", badge: "Reguler", badgeColor: "bg-blue-600", image: "", deskripsi: "", informasiTambahan: [] };
  const initialDomestik = { title: "", daerah: "", duration: "", transport: "", hotel: "", tipeTrip: "Open Trip", price: "", badge: "Premium", badgeColor: "bg-purple-600", image: "", deskripsi: "", informasiTambahan: [] };
  const initialDaerah = { title: "", image: "" };
  const initialMengapa = { title: "", deskripsi: "", icon: "ShieldCheck" };

  const [formUmroh, setFormUmroh] = useState(initialUmroh);
  const [formDomestik, setFormDomestik] = useState(initialDomestik);
  const [formDaerah, setFormDaerah] = useState(initialDaerah);
  const [formMengapa, setFormMengapa] = useState(initialMengapa);

  useEffect(() => { 
    fetchData(); 
    fetchDaerahOptions(); 
  }, [activeTab]);

  const fetchDaerahOptions = async () => {
    const snap = await getDocs(collection(db, "destinasi_domestik"));
    setDaerahOptions(snap.docs.map(doc => doc.data().title));
  };

  const fetchData = async () => {
    let colName = "paket_umroh";
    if (activeTab === "domestik") colName = "paket_domestik";
    if (activeTab === "daerah") colName = "destinasi_domestik";
    if (activeTab === "mengapa") colName = "mengapa_kami";
    const snapshot = await getDocs(collection(db, colName));
    setDataList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const formatInputNumber = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleNumberChange = (e, setForm, formState, fieldName) => {
    const val = e.target.value.replace(/\D/g, "");
    setForm({ ...formState, [fieldName]: val });
  };

  const handleChange = (e, setForm, formState) => setForm({ ...formState, [e.target.name]: e.target.value });

  const handleBadgeChange = (e, setForm, formState) => {
    const val = e.target.value;
    let color = "bg-blue-600";
    if (val === "Promo") color = "bg-red-600";
    if (val === "Premium") color = "bg-purple-600";
    if (val === "VIP") color = "bg-yellow-500";
    setForm({ ...formState, badge: val, badgeColor: color });
  };

  const handleAddInfo = (type) => {
    if (type === 'umroh') setFormUmroh({...formUmroh, informasiTambahan: [...(formUmroh.informasiTambahan || []), {judul: "", isi: ""}]});
    else setFormDomestik({...formDomestik, informasiTambahan: [...(formDomestik.informasiTambahan || []), {judul: "", isi: ""}]});
  };
  const handleRemoveInfo = (type, index) => {
    if (type === 'umroh') { const newArr = [...formUmroh.informasiTambahan]; newArr.splice(index, 1); setFormUmroh({...formUmroh, informasiTambahan: newArr}); }
    else { const newArr = [...formDomestik.informasiTambahan]; newArr.splice(index, 1); setFormDomestik({...formDomestik, informasiTambahan: newArr}); }
  };
  const handleUpdateInfo = (type, index, field, value) => {
    if (type === 'umroh') { const newArr = [...formUmroh.informasiTambahan]; newArr[index][field] = value; setFormUmroh({...formUmroh, informasiTambahan: newArr}); }
    else { const newArr = [...formDomestik.informasiTambahan]; newArr[index][field] = value; setFormDomestik({...formDomestik, informasiTambahan: newArr}); }
  };

  const showAlert = (message, type = "info", onConfirm = null) => setCustomAlert({ show: true, message, type, onConfirm });
  const closeAlert = () => setCustomAlert({ show: false, message: "", type: "info", onConfirm: null });

  const openAddModal = () => {
    setEditId(null);
    if (activeTab === "umroh") setFormUmroh(initialUmroh);
    else if (activeTab === "domestik") setFormDomestik(initialDomestik);
    else if (activeTab === "daerah") setFormDaerah(initialDaerah);
    else setFormMengapa(initialMengapa);
    setIsFormOpen(true);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    if (activeTab === "umroh") setFormUmroh({...initialUmroh, ...item});
    else if (activeTab === "domestik") setFormDomestik({...initialDomestik, price: item.price || item.hargaOpenTrip || item.hargaPrivateTrip, ...item});
    else if (activeTab === "daerah") setFormDaerah({...initialDaerah, ...item});
    else setFormMengapa({...initialMengapa, ...item});
    setIsFormOpen(true);
  };

  const joditConfig = { height: 300, askBeforePasteHTML: false, askBeforePasteFromWord: false, defaultActionOnPaste: "insert_as_html" };

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const IMGBB_API_KEY = "268adcfe4ba6f66170f40d0e3fdda6ae";
    setIsUploading(true); setUploadProgress(50); 
    const formData = new FormData(); formData.append("image", file);
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await response.json();
      if (data.success) {
        if (activeTab === "umroh") setFormUmroh({ ...formUmroh, image: data.data.url });
        else if (activeTab === "domestik") setFormDomestik({ ...formDomestik, image: data.data.url });
        else if (activeTab === "daerah") setFormDaerah({ ...formDaerah, image: data.data.url });
        setUploadProgress(100);
      } else alert("Gagal mengunggah gambar ke server.");
    } catch (error) { alert("Terjadi kesalahan jaringan."); } 
    finally { setTimeout(() => { setIsUploading(false); setUploadProgress(0); }, 1000); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let colName = "paket_umroh";
    let dataToSave = formUmroh;
    
    if (activeTab === "domestik") { colName = "paket_domestik"; dataToSave = formDomestik; }
    if (activeTab === "daerah") { colName = "destinasi_domestik"; dataToSave = formDaerah; }
    if (activeTab === "mengapa") { colName = "mengapa_kami"; dataToSave = formMengapa; }

    try {
      if (editId) { await updateDoc(doc(db, colName, editId), dataToSave); showAlert("Data diperbarui.", "success"); } 
      else { await addDoc(collection(db, colName), dataToSave); showAlert("Data ditambahkan.", "success"); }
      setIsFormOpen(false); fetchData(); fetchDaerahOptions();
    } catch (error) { showAlert("Gagal menyimpan data.", "error"); } 
    finally { setIsSubmitting(false); }
  };

  const confirmDelete = (id) => {
    showAlert("Yakin ingin menghapus?", "confirm", async () => {
      let colName = "paket_umroh";
      if (activeTab === "domestik") colName = "paket_domestik";
      if (activeTab === "daerah") colName = "destinasi_domestik";
      if (activeTab === "mengapa") colName = "mengapa_kami";
      await deleteDoc(doc(db, colName, id));
      fetchData(); fetchDaerahOptions(); showAlert("Dihapus.", "success");
    });
  };

  const inputClass = "w-full border border-gray-200 p-3 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition text-sm";
  const labelClass = "text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans selection:bg-blue-100">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f172a] text-white flex flex-col shadow-2xl z-20 relative">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg"><LayoutDashboard size={20} className="text-white"/></div>
          <div><h2 className="text-base font-bold tracking-wide">Workspace</h2><p className="text-[10px] text-slate-400">Enka Imron Mandiri</p></div>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Manajemen Paket</p>
          <button onClick={() => setActiveTab("umroh")} className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 ${activeTab === "umroh" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}><Tent size={18} /><span className="text-sm font-medium">Paket Umroh</span></button>
          <button onClick={() => setActiveTab("domestik")} className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 ${activeTab === "domestik" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}><MapPin size={18} /><span className="text-sm font-medium">Paket Domestik</span></button>

          <p className="px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Tampilan Web</p>
          <button onClick={() => setActiveTab("daerah")} className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 ${activeTab === "daerah" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}><MapPin size={18} /><span className="text-sm font-medium">Master Daerah</span></button>
          <button onClick={() => setActiveTab("mengapa")} className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 ${activeTab === "mengapa" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}><Star size={18} /><span className="text-sm font-medium">Mengapa Kami</span></button>
        </nav>
        <div className="p-4 border-t border-slate-800"><button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 py-2 rounded-lg transition"><LogOut size={16} /><span className="text-sm font-medium">Keluar Sistem</span></button></div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center z-10 shadow-sm">
          <div><h1 className="text-2xl font-bold text-gray-800">{activeTab === "umroh" ? "Daftar Paket Umroh" : activeTab === "domestik" ? "Daftar Paket Domestik" : activeTab === "daerah" ? "Master Daerah Populer" : "Fitur Mengapa Kami"}</h1></div>
          <button onClick={openAddModal} className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-800 transition"><Plus size={18} />Tambah Data</button>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100"><th className="px-6 py-4 font-semibold">Visual</th><th className="px-6 py-4 font-semibold">Informasi Utama</th>{activeTab !== "daerah" && activeTab !== "mengapa" && <th className="px-6 py-4 font-semibold">Harga Mulai</th>}<th className="px-6 py-4 font-semibold text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dataList.map((item) => {
                  const DynamicIcon = IconMap[item.icon] || Star;
                  return (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition group">
                      <td className="px-6 py-4 w-24">
                        {activeTab === "mengapa" ? (
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><DynamicIcon size={24} /></div>
                        ) : (<img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-gray-100" />)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800 text-base mb-1">{item.title}</div>
                        {activeTab === "mengapa" && <div className="text-xs text-gray-500 line-clamp-1">{item.deskripsi}</div>}
                        {activeTab === "domestik" && <div className="text-xs text-gray-500 flex gap-3"><span className="bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded">📍 {item.daerah || "Belum Set Daerah"}</span></div>}
                      </td>
                      {activeTab !== "daerah" && activeTab !== "mengapa" && (
                        <td className="px-6 py-4"><span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">{formatRupiah(item.price || item.hargaOpenTrip || item.hargaPrivateTrip)}</span></td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition mr-1"><Edit3 size={18} /></button>
                        <button onClick={() => confirmDelete(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {dataList.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-gray-400"><Info size={40} className="mb-3 opacity-30" /><p className="text-sm">Belum ada data yang ditambahkan.</p></div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Edit3 className="text-blue-600"/>{editId ? 'Perbarui Data' : 'Tambah Data Baru'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 transition"><X size={24}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-slate-50">
              <form id="dataForm" onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                
                {/* 1. FORM UMROH */}
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
                        <div className="flex flex-col"><label className={labelClass}>Nama Hotel Mekah</label><input type="text" name="hotelMekah" value={formUmroh.hotelMekah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} disabled={formUmroh.pakaiNamaHotel === 'tidak'} placeholder="Contoh: Pullman ZamZam" className={`w-full border border-gray-200 p-3 rounded-xl text-sm transition ${formUmroh.pakaiNamaHotel === 'tidak' ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100' : 'bg-slate-50 focus:bg-white focus:border-blue-400 outline-none'}`}/></div>
                        <div className="flex flex-col"><label className={labelClass}>Bintang Hotel Mekah</label><select name="bintangMekah" value={formUmroh.bintangMekah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="5">⭐⭐⭐⭐⭐ (Bintang 5)</option><option value="4">⭐⭐⭐⭐ (Bintang 4)</option><option value="3">⭐⭐⭐ (Bintang 3)</option><option value="2">⭐⭐ (Bintang 2)</option><option value="1">⭐ (Bintang 1)</option></select></div>
                        <div className="flex flex-col"><label className={labelClass}>Nama Hotel Madinah</label><input type="text" name="hotelMadinah" value={formUmroh.hotelMadinah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} disabled={formUmroh.pakaiNamaHotel === 'tidak'} placeholder="Contoh: Anwar Al Madinah" className={`w-full border border-gray-200 p-3 rounded-xl text-sm transition ${formUmroh.pakaiNamaHotel === 'tidak' ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100' : 'bg-slate-50 focus:bg-white focus:border-blue-400 outline-none'}`}/></div>
                        <div className="flex flex-col"><label className={labelClass}>Bintang Hotel Madinah</label><select name="bintangMadinah" value={formUmroh.bintangMadinah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="5">⭐⭐⭐⭐⭐ (Bintang 5)</option><option value="4">⭐⭐⭐⭐ (Bintang 4)</option><option value="3">⭐⭐⭐ (Bintang 3)</option><option value="2">⭐⭐ (Bintang 2)</option><option value="1">⭐ (Bintang 1)</option></select></div>
                      </div>
                      <div className="border-t border-gray-100 pt-4"><label className={labelClass}>Fasilitas Kereta Cepat Haramain?</label><select name="keretaCepat" value={formUmroh.keretaCepat} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="tidak">Tidak Tersedia</option><option value="ya">Ya, Termasuk Kereta Cepat Haramain</option></select></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <label className={labelClass}>Pilih Tingkatan Badge</label>
                        <select value={formUmroh.badge} onChange={(e) => handleBadgeChange(e, setFormUmroh, formUmroh)} className={inputClass}>
                          <option value="Promo">Promo (Warna Merah)</option>
                          <option value="Reguler">Reguler (Warna Biru)</option>
                          <option value="Premium">Premium (Warna Ungu)</option>
                          <option value="VIP">VIP (Warna Kuning)</option>
                        </select>
                      </div>
                      <div className="flex flex-col"><label className={labelClass}>Upload Gambar Cover</label><input type="file" onChange={handleImageUpload} className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700"/></div>
                    </div>
                    
                    {/* BAGIAN DESKRIPSI DAN ACCORDION UMROH (YANG SEBELUMNYA HILANG) */}
                    <div className="col-span-2 border-t border-gray-200 pt-6 mt-2">
                      <label className="text-sm font-bold text-gray-800 uppercase mb-3 block">Deskripsi & Itinerary Utama</label>
                      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <JoditEditor value={formUmroh.deskripsi} config={joditConfig} onBlur={(c) => setFormUmroh({...formUmroh, deskripsi: c})} />
                      </div>
                      
                      <div className="flex justify-between items-center mt-8 mb-4 border-b border-gray-200 pb-3">
                        <label className="text-sm font-bold text-gray-800 uppercase">Informasi Tambahan (Buka-Tutup)</label>
                        <button type="button" onClick={() => handleAddInfo('umroh')} className="bg-blue-50 hover:bg-blue-100 transition text-blue-700 px-4 py-2 rounded-lg text-xs font-bold flex gap-2"><Plus size={16}/> Tambah Judul Baru</button>
                      </div>
                      
                      {(formUmroh.informasiTambahan || []).map((info, index) => (
                        <div key={index} className="border border-gray-200 rounded-2xl p-5 mb-5 bg-white shadow-sm relative">
                          <button type="button" onClick={() => handleRemoveInfo('umroh', index)} className="absolute top-5 right-5 text-red-400 hover:text-red-600 transition"><Trash2 size={18}/></button>
                          <input type="text" value={info.judul} onChange={(e) => handleUpdateInfo('umroh', index, 'judul', e.target.value)} className="border border-gray-200 p-3 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-400 outline-none w-full mb-4 pr-12 text-sm font-semibold" placeholder="Contoh Judul: Syarat Dokumen, Fasilitas Termasuk..." />
                          <div className="rounded-xl overflow-hidden border border-gray-200">
                            <JoditEditor value={info.isi} config={{...joditConfig, height: 250}} onBlur={(c) => handleUpdateInfo('umroh', index, 'isi', c)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. FORM DOMESTIK */}
                {activeTab === "domestik" && (
                  <div className="col-span-2 flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col"><label className={labelClass}>Nama Paket Trip</label><input type="text" name="title" value={formDomestik.title} onChange={(e) => handleChange(e, setFormDomestik, formDomestik)} className={inputClass} required/></div>
                      
                      {/* DROPDOWN DAERAH */}
                      <div className="flex flex-col">
                        <label className={`${labelClass} text-blue-600`}>Pilih Daerah Destinasi</label>
                        <select name="daerah" value={formDomestik.daerah} onChange={(e) => handleChange(e, setFormDomestik, formDomestik)} className={inputClass} required>
                          <option value="">-- Pilih Daerah (Dari Master) --</option>
                          {daerahOptions.map((daerah, idx) => (
                            <option key={idx} value={daerah}>{daerah}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="flex flex-col"><label className={labelClass}>Jenis Trip</label>
                        <select name="tipeTrip" value={formDomestik.tipeTrip} onChange={(e) => handleChange(e, setFormDomestik, formDomestik)} className={inputClass}>
                          <option value="Open Trip">Open Trip (Per Orang)</option>
                          <option value="Private Trip">Private Trip (Per Group)</option>
                        </select>
                      </div>
                      <div className="flex flex-col"><label className={labelClass}>Harga (Rp)</label>
                        <input type="text" value={formatInputNumber(formDomestik.price)} onChange={(e) => handleNumberChange(e, setFormDomestik, formDomestik, 'price')} className={inputClass} required placeholder="Contoh: 2.500.000"/>
                      </div>
                      <div className="flex flex-col"><label className={labelClass}>Durasi</label><input type="text" name="duration" value={formDomestik.duration} onChange={(e) => handleChange(e, setFormDomestik, formDomestik)} placeholder="Contoh: 3D2N" className={inputClass}/></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col"><label className={labelClass}>Transportasi (Nama Bus)</label><input type="text" name="transport" value={formDomestik.transport} onChange={(e) => handleChange(e, setFormDomestik, formDomestik)} placeholder="Contoh: Bus Pariwisata AC" className={inputClass}/></div>
                      <div className="flex flex-col"><label className={labelClass}>Hotel (Opsional)</label><input type="text" name="hotel" value={formDomestik.hotel} onChange={(e) => handleChange(e, setFormDomestik, formDomestik)} placeholder="Kosongkan jika tidak ada penginapan" className={inputClass}/></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col"><label className={labelClass}>Pilih Tingkatan Badge</label>
                        <select value={formDomestik.badge} onChange={(e) => handleBadgeChange(e, setFormDomestik, formDomestik)} className={inputClass}>
                          <option value="Promo">Promo (Warna Merah)</option>
                          <option value="Reguler">Reguler (Warna Biru)</option>
                          <option value="Premium">Premium (Warna Ungu)</option>
                          <option value="VIP">VIP (Warna Kuning)</option>
                        </select>
                      </div>
                      <div className="flex flex-col"><label className={labelClass}>Upload Gambar Cover</label>
                        <input type="file" onChange={handleImageUpload} className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700"/>
                      </div>
                    </div>
                    
                    <div className="col-span-2 border-t border-gray-200 pt-6 mt-2">
                      <label className="text-sm font-bold text-gray-800 uppercase mb-3 block">Deskripsi & Itinerary Utama</label>
                      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"><JoditEditor value={formDomestik.deskripsi} config={joditConfig} onBlur={(c) => setFormDomestik({...formDomestik, deskripsi: c})} /></div>
                      
                      <div className="flex justify-between items-center mt-8 mb-4 border-b border-gray-200 pb-3">
                        <label className="text-sm font-bold text-gray-800 uppercase">Informasi Tambahan (Buka-Tutup)</label>
                        <button type="button" onClick={() => handleAddInfo('domestik')} className="bg-blue-50 hover:bg-blue-100 transition text-blue-700 px-4 py-2 rounded-lg text-xs font-bold flex gap-2"><Plus size={16}/> Tambah Judul Baru</button>
                      </div>
                      
                      {(formDomestik.informasiTambahan || []).map((info, index) => (
                        <div key={index} className="border border-gray-200 rounded-2xl p-5 mb-5 bg-white shadow-sm relative">
                          <button type="button" onClick={() => handleRemoveInfo('domestik', index)} className="absolute top-5 right-5 text-red-400 hover:text-red-600 transition"><Trash2 size={18}/></button>
                          <input type="text" value={info.judul} onChange={(e) => handleUpdateInfo('domestik', index, 'judul', e.target.value)} className="border border-gray-200 p-3 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-400 outline-none w-full mb-4 pr-12 text-sm font-semibold" placeholder="Contoh Judul: Fasilitas Tambahan..." />
                          <div className="rounded-xl overflow-hidden border border-gray-200">
                            <JoditEditor value={info.isi} config={{...joditConfig, height: 250}} onBlur={(c) => handleUpdateInfo('domestik', index, 'isi', c)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. FORM MASTER DAERAH */}
                {activeTab === "daerah" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="flex flex-col"><label className={labelClass}>Nama Daerah</label><input type="text" name="title" value={formDaerah.title} onChange={(e) => handleChange(e, setFormDaerah, formDaerah)} className={inputClass} required /></div>
                    <div className="flex flex-col"><label className={labelClass}>Upload Gambar</label><input type="file" onChange={handleImageUpload} className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700"/></div>
                  </div>
                )}

                {/* 4. FORM MENGAPA MEMILIH KAMI */}
                {activeTab === "mengapa" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col"><label className={labelClass}>Judul Keunggulan</label><input type="text" name="title" value={formMengapa.title} onChange={(e) => handleChange(e, setFormMengapa, formMengapa)} className={inputClass} required /></div>
                      <div className="flex flex-col"><label className={labelClass}>Pilih Ikon</label>
                        <select name="icon" value={formMengapa.icon} onChange={(e) => handleChange(e, setFormMengapa, formMengapa)} className={`${inputClass} font-semibold`}>
                          <option value="ShieldCheck">🛡️ Keamanan (ShieldCheck)</option><option value="Star">⭐ Kualitas (Star)</option><option value="Heart">❤️ Hati (Heart)</option><option value="Clock">🕒 Waktu (Clock)</option><option value="Award">🏆 Prestasi (Award)</option><option value="ThumbsUp">👍 Jempol (ThumbsUp)</option><option value="Users">👥 Tim (Users)</option><option value="Gem">💎 Mewah (Gem)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col"><label className={labelClass}>Deskripsi</label><textarea name="deskripsi" value={formMengapa.deskripsi} onChange={(e) => handleChange(e, setFormMengapa, formMengapa)} rows="4" className={inputClass} required></textarea></div>
                  </div>
                )}
              </form>
            </div>
            
            <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3">
              <button onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium rounded-xl transition text-sm">Batal</button>
              <button form="dataForm" type="submit" disabled={isSubmitting || isUploading} className="px-6 py-2.5 bg-[#1e3a8a] hover:bg-blue-800 text-white font-medium rounded-xl transition shadow-md text-sm">Simpan Data</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ALERT */}
      {customAlert.show && (
        <div className="fixed inset-0 bg-slate-900/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-2xl"><h3 className="text-xl font-bold mb-2 text-gray-800">{customAlert.type === "confirm" ? "Konfirmasi Hapus" : "Informasi"}</h3><p className="text-gray-500 mb-8 text-sm">{customAlert.message}</p><div className="flex justify-center gap-3">{customAlert.type === "confirm" ? (<><button onClick={closeAlert} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium">Batal</button><button onClick={() => { customAlert.onConfirm(); closeAlert(); }} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium shadow-md">Ya, Hapus</button></>) : (<button onClick={closeAlert} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium">Mengerti</button>)}</div></div></div>
      )}
    </div>
  );
}

export default AdminDashboard;