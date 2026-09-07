import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { 
  LayoutDashboard, MapPin, Tent, LogOut, Plus, 
  Edit3, Trash2, X, CheckCircle, AlertTriangle, Info 
} from "lucide-react";
import JoditEditor from "jodit-react";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("umroh");
  const [dataList, setDataList] = useState([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", type: "info", onConfirm: null });

  const initialUmroh = { title: "", duration: "", airline: "", hotel: "", price: "", badge: "New", badgeColor: "bg-blue-600", image: "", jumlahUmroh: "", fasilitas: "", deskripsi: "" };
  const initialDomestik = { title: "", duration: "", transport: "", hotel: "", hargaOpenTrip: "", hargaPrivateTrip: "", badge: "Eksklusif", badgeColor: "bg-green-600", image: "", deskripsi: "" };
  
  const [formUmroh, setFormUmroh] = useState(initialUmroh);
  const [formDomestik, setFormDomestik] = useState(initialDomestik);

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    const colName = activeTab === "umroh" ? "paket_umroh" : "paket_domestik";
    const snapshot = await getDocs(collection(db, colName));
    setDataList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleUmrohChange = (e) => setFormUmroh({ ...formUmroh, [e.target.name]: e.target.value });
  const handleDomestikChange = (e) => setFormDomestik({ ...formDomestik, [e.target.name]: e.target.value });

  const showAlert = (message, type = "info", onConfirm = null) => setCustomAlert({ show: true, message, type, onConfirm });
  const closeAlert = () => setCustomAlert({ show: false, message: "", type: "info", onConfirm: null });

  const openAddModal = () => {
    setEditId(null);
    activeTab === "umroh" ? setFormUmroh(initialUmroh) : setFormDomestik(initialDomestik);
    setIsFormOpen(true);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    activeTab === "umroh" ? setFormUmroh(item) : setFormDomestik(item);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const colName = activeTab === "umroh" ? "paket_umroh" : "paket_domestik";
    const dataToSave = activeTab === "umroh" 
      ? formUmroh 
      : { ...formDomestik, price: formDomestik.hargaOpenTrip || formDomestik.hargaPrivateTrip || formDomestik.price };

    try {
      if (editId) {
        await updateDoc(doc(db, colName, editId), dataToSave);
        showAlert("Data paket berhasil diperbarui.", "success");
      } else {
        await addDoc(collection(db, colName), dataToSave);
        showAlert("Paket baru berhasil ditambahkan.", "success");
      }
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      showAlert("Gagal menyimpan data. Periksa koneksi Anda.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    showAlert("Yakin ingin menghapus paket ini? Tindakan ini tidak dapat dibatalkan.", "confirm", async () => {
      const colName = activeTab === "umroh" ? "paket_umroh" : "paket_domestik";
      await deleteDoc(doc(db, colName, id));
      fetchData();
      showAlert("Paket berhasil dihapus.", "success");
    });
  };


  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans selection:bg-blue-100">
      
      {/* Sidebar Elegan */}
      <div className="w-72 bg-[#0f172a] text-white flex flex-col shadow-2xl z-20 relative">
        <div className="p-8 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg"><LayoutDashboard size={24} className="text-white"/></div>
          <div>
            <h2 className="text-lg font-bold tracking-wide">Workspace</h2>
            <p className="text-xs text-slate-400">Enka Imron Mandiri</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Manajemen Paket</p>
          <button onClick={() => setActiveTab("umroh")} className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${activeTab === "umroh" ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
            <Tent size={20} />
            <span className="font-medium">Paket Umroh</span>
          </button>
          <button onClick={() => setActiveTab("domestik")} className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${activeTab === "domestik" ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
            <MapPin size={20} />
            <span className="font-medium">Paket Domestik</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 py-3 rounded-xl transition">
            <LogOut size={18} />
            <span className="font-medium text-sm">Keluar Sistem</span>
          </button>
        </div>
      </div>

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header (Top Bar) */}
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === "umroh" ? "Daftar Paket Umroh" : "Daftar Paket Domestik"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Kelola informasi paket perjalanan yang tampil di website utama.</p>
          </div>
          <button onClick={openAddModal} className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium shadow-md shadow-blue-900/10 transition-all flex items-center gap-2">
            <Plus size={18} />
            Tambah Paket
          </button>
        </header>

        {/* Area Tabel */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 border-b font-semibold">Visual</th>
                  <th className="px-6 py-4 border-b font-semibold">Informasi Paket</th>
                  <th className="px-6 py-4 border-b font-semibold">Harga</th>
                  <th className="px-6 py-4 border-b font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dataList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 w-24">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 text-base mb-1">{item.title}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded-md">{item.duration}</span>
                        {item.airline && <span>✈️ {item.airline}</span>}
                        {item.transport && <span>🚢 {item.transport}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">
                        {item.hargaOpenTrip || item.hargaPrivateTrip || item.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip" title="Edit">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => confirmDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dataList.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                <Info size={48} className="mb-4 opacity-50" />
                <p className="text-lg">Belum ada data yang ditambahkan.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {editId ? <Edit3 className="text-blue-600"/> : <Plus className="text-blue-600"/>}
                {editId ? "Perbarui Data Paket" : "Tambah Paket Baru"}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><X size={20}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-slate-50/50">
              <form id="paketForm" onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                {activeTab === "umroh" ? (
                  <>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nama Paket</label><input required type="text" name="title" value={formUmroh.title} onChange={handleUmrohChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Harga</label><input required type="text" name="price" value={formUmroh.price} onChange={handleUmrohChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Durasi</label><input required type="text" name="duration" value={formUmroh.duration} onChange={handleUmrohChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Maskapai</label><input required type="text" name="airline" value={formUmroh.airline} onChange={handleUmrohChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Hotel</label><input required type="text" name="hotel" value={formUmroh.hotel} onChange={handleUmrohChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Jml Umroh <span className="normal-case font-normal text-gray-400">(Opsional)</span></label><input type="text" name="jumlahUmroh" value={formUmroh.jumlahUmroh} onChange={handleUmrohChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col col-span-2"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">URL Gambar</label><input required type="text" name="image" value={formUmroh.image} onChange={handleUmrohChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Deskripsi Lengkap & Itinerary</label>
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                        <JoditEditor
                          value={formUmroh.deskripsi}
                          config={{ height: 400, placeholder: 'Ketik deskripsi, itinerary, atau buat tabel di sini...' }}
                          onBlur={(newContent) => setFormUmroh({ ...formUmroh, deskripsi: newContent })}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nama Destinasi</label><input required type="text" name="title" value={formDomestik.title} onChange={handleDomestikChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Durasi</label><input required type="text" name="duration" value={formDomestik.duration} onChange={handleDomestikChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Transportasi</label><input required type="text" name="transport" value={formDomestik.transport} onChange={handleDomestikChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Penginapan</label><input required type="text" name="hotel" value={formDomestik.hotel} onChange={handleDomestikChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide text-blue-600">Harga Open Trip</label><input type="text" name="hargaOpenTrip" value={formDomestik.hargaOpenTrip} onChange={handleDomestikChange} className="border border-blue-100 bg-blue-50/30 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"/></div>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide text-green-600">Harga Private Trip</label><input type="text" name="hargaPrivateTrip" value={formDomestik.hargaPrivateTrip} onChange={handleDomestikChange} className="border border-green-100 bg-green-50/30 p-3 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition"/></div>
                    <div className="flex flex-col col-span-2"><label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">URL Gambar</label><input required type="text" name="image" value={formDomestik.image} onChange={handleDomestikChange} className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"/></div>
                    <div className="flex flex-col col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Deskripsi Lengkap & Itinerary</label>
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                        <JoditEditor
                          value={formDomestik.deskripsi}
                          config={{ height: 400, placeholder: 'Ketik deskripsi, itinerary, atau buat tabel di sini...' }}
                          onBlur={(newContent) => setFormDomestik({ ...formDomestik, deskripsi: newContent })}
                        />
                      </div>
                    </div>                  
                  </>
                )}
              </form>
            </div>
            
            <div className="px-8 py-5 border-t bg-white flex justify-end gap-3">
              <button onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition">Batal</button>
              <button form="paketForm" type="submit" disabled={isSubmitting} className={`px-6 py-2.5 text-white font-medium rounded-xl transition shadow-md flex items-center gap-2 ${isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"}`}>
                {isSubmitting ? "Menyimpan..." : (editId ? "Simpan Perubahan" : "Simpan Paket")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ALERT / CONFIRM */}
      {customAlert.show && (
        <div className="fixed inset-0 bg-slate-900/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="flex justify-center mb-5">
              {customAlert.type === "success" && <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle size={32} /></div>}
              {customAlert.type === "error" && <div className="bg-red-100 p-3 rounded-full text-red-600"><X size={32} /></div>}
              {customAlert.type === "confirm" && <div className="bg-amber-100 p-3 rounded-full text-amber-600"><AlertTriangle size={32} /></div>}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {customAlert.type === "confirm" ? "Konfirmasi Hapus" : "Informasi"}
            </h3>
            <p className="text-gray-500 mb-8">{customAlert.message}</p>
            
            <div className="flex justify-center gap-3">
              {customAlert.type === "confirm" ? (
                <>
                  <button onClick={closeAlert} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition">Batal</button>
                  <button onClick={() => { customAlert.onConfirm(); closeAlert(); }} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition shadow-md shadow-red-500/20">Ya, Hapus</button>
                </>
              ) : (
                <button onClick={closeAlert} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-md shadow-blue-600/20">Mengerti</button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;