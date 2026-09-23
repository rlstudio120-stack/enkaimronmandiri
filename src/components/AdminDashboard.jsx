import { useState, useEffect } from "react";
import { 
  LayoutDashboard, MapPin, Tent, LogOut, Plus, Edit3, Trash2, X, ShieldCheck, 
  Star, Heart, Clock, Award, ThumbsUp, Users, Gem, Bus, Plane, Globe, Box, 
  MessageSquare, Settings, Zap, Smile, CheckCircle, Compass, BookOpen, Ship, TrainFront,
  Activity, ArrowLeft, LayoutTemplate, Database, FileText, MonitorSmartphone, Info
} from "lucide-react";
import JoditEditor from "jodit-react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; 
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const IconMap = { ShieldCheck, Star, Heart, Clock, Award, MapPin, ThumbsUp, Users, Gem, Bus, Tent, Plane, Globe, Box, Zap, Smile, CheckCircle, Compass, BookOpen, Ship, TrainFront, FileText };

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = async () => { try { await signOut(auth); navigate("/login"); } catch (error) { alert("Gagal keluar sistem."); } };

  const [dataList, setDataList] = useState([]);
  const [daerahOptions, setDaerahOptions] = useState([]);
  const [daerahIntOptions, setDaerahIntOptions] = useState([]); // Tambahan Internasional
  const [umrohPromoOptions, setUmrohPromoOptions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", type: "info", onConfirm: null });
  const [stats, setStats] = useState({ umroh: 0, domestik: 0, internasional: 0, testimoni: 0, berita: 0 });

  // ================= TEMPLATE DATA & CONFIGURATIONS =================
  const initialUmroh = { title: "", price: "", tipeWaktu: "bulan", waktuInfo: "", duration: "", maskapai: "", pakaiNamaHotel: "ya", hotelMekah: "", bintangMekah: "5", hotelMadinah: "", bintangMadinah: "5", keretaCepat: "tidak", tampilBadge: "ya", badge: "Tidak Ada", badgeColor: "", image: "", deskripsi: "", informasiTambahan: [] };
  const initialDomestik = { title: "", daerah: "", duration: "", hotel: "", tipeTrip: "Open Trip", price: "", hargaPrivate: [{ nominal: "", deskripsi: "" }], transportasi: [{ jenis: "Bus", deskripsi: "" }], badge: "Tidak Ada", badgeColor: "", image: "", deskripsi: "", informasiTambahan: [] };
  const initialInternasional = { title: "", negara: "", duration: "", hotel: "", tipeTrip: "Open Trip", price: "", hargaPrivate: [{ nominal: "", deskripsi: "" }], transportasi: [{ jenis: "Pesawat", deskripsi: "" }], badge: "Tidak Ada", badgeColor: "", image: "", deskripsi: "", informasiTambahan: [] }; // Tambahan Internasional
  
  const initialDaerah = { title: "", image: "", status: "Aktif" };
  const initialDaerahInt = { title: "", image: "", status: "Aktif" }; // Tambahan Internasional
  const initialBerita = { title: "", date: "", image: "", text: "", category: "Berita", tipe: "Umroh" }; 
  const initialMengapa = { title: "", deskripsi: "", icon: "ShieldCheck", color: "bg-[#1e3a8a]" };
  const initialKeunggulanUmroh = { title: "", deskripsi: "", icon: "ShieldCheck" };
  const initialKeunggulanDomestik = { title: "", deskripsi: "", icon: "MapPin" }; 
  const initialKeunggulanInt = { title: "", deskripsi: "", icon: "Globe" }; // Tambahan Internasional
  const initialLayanan = { title: "", deskripsi: "", image: "", icon: "Plane", color: "bg-[#1e3a8a]", link: "/domestik" };
  const initialTestimoni = { name: "", service: "Paket Umroh", img: "", text: "", stars: "5" };

  const initialConfig = { heroTitle: "Perjalanan Anda,\nAmanah Kami", heroDesc: "Melayani perjalanan Domestik, Internasional, dan Umroh.", heroBg: "", showBadges: "ya", heroTitleSize: "text-[32px] md:text-5xl lg:text-6xl", heroBgPos: "bg-center", b1Text: "Terpercaya", b1Icon: "ShieldCheck", b2Text: "Harga Terbaik", b2Icon: "Star", b3Text: "Pelayanan Prima", b3Icon: "Heart", promoBg: "", promoSmall: "Paket Umroh 2024", promoTitle: "Berangkat Nyaman,\nIbadah Khusyuk", promoBtn: "Cek Promo", promoPrice: "25", promoLink: "/umroh", promoBgColor: "bg-[#0f172a]", promoBgPos: "object-center", testiAutoSlide: "ya", domCtaTitle: "Ingin Menyesuaikan Isi Paket Ini?", domCtaDesc: "Atau ingin membuat rute perjalanan impian Anda sendiri? Konsultasikan dengan tim kami.", domCtaBtn: "Konsultasi via WhatsApp", domCtaLink: "https://wa.me/6281234567890", domCtaBg: "", domCtaBgColor: "bg-[#1e3a8a]" };
  const initialUmrohConfig = { heroSmallText: "Perjalanan Ibadah", heroSmallTextSize: "text-[10px] md:text-sm", heroTitle: "Perjalanan Umroh Nyaman,\nIbadah Makin Bermakna", heroDesc: "Kami hadir untuk memberikan pengalaman ibadah Umroh yang nyaman.", heroBg: "", heroTitleSize: "text-[32px] md:text-5xl lg:text-6xl", heroBgPos: "bg-center", f1Text: "Amanah & Terpercaya", f1Icon: "ShieldCheck", f2Text: "Pembimbing Berpengalaman", f2Icon: "Users", f3Text: "Pelayanan Terbaik", f3Icon: "Star", ctaBg: "", ctaTitle: "Siap Berangkat Umroh?", ctaDesc: "Percayakan perjalanan ibadah Anda bersama Enka Imron Mandiri.", ctaBtnText: "Hubungi Kami Sekarang", ctaBtnLink: "#", ctaBgColor: "bg-[#0f172a]", ctaBgPos: "object-center" };
  const initialDomestikConfig = { heroSmallText: "Jelajahi Indonesia", heroSmallTextSize: "text-[10px] md:text-sm", heroTitle: "Destinasi Wisata Domestik Terbaik", heroDesc: "Temukan keindahan alam dan budaya Indonesia melalui berbagai pilihan Open Trip dan Private Trip.", heroBg: "", heroTitleSize: "text-[32px] md:text-5xl lg:text-6xl", heroBgPos: "bg-center", showBadges: "ya", d1Text: "Pemandu Profesional", d1Icon: "Users", d2Text: "Harga Transparan", d2Icon: "Star", d3Text: "Aman & Nyaman", d3Icon: "ShieldCheck", ctaBg: "", ctaTitle: "Ingin Menyesuaikan Isi Paket Ini?", ctaDesc: "Atau ingin membuat rute perjalanan impian Anda sendiri? Konsultasikan dengan tim kami.", ctaBtnText: "Konsultasi via WhatsApp", ctaBtnLink: "https://wa.me/6281234567890", ctaBgColor: "bg-[#1e3a8a]", ctaBgPos: "object-center" };
  const initialInternasionalConfig = { heroSmallText: "Jelajahi Dunia", heroSmallTextSize: "text-[10px] md:text-sm", heroTitle: "Destinasi Wisata Internasional Terbaik", heroDesc: "Temukan keindahan ragam budaya dan pesona negara-negara di seluruh dunia.", heroBg: "", heroTitleSize: "text-[32px] md:text-5xl lg:text-6xl", heroBgPos: "bg-center", showBadges: "ya", d1Text: "Pemandu Berpengalaman", d1Icon: "Users", d2Text: "Fasilitas Premium", d2Icon: "Star", d3Text: "Aman & Nyaman", d3Icon: "ShieldCheck", ctaBg: "", ctaTitle: "Punya Negara Impian Sendiri?", ctaDesc: "Konsultasikan rute perjalanan ke negara impian Anda dengan tim ahli kami.", ctaBtnText: "Konsultasi via WhatsApp", ctaBtnLink: "https://wa.me/6281234567890", ctaBgColor: "bg-[#1e3a8a]", ctaBgPos: "object-center" }; // Tambahan Internasional

  const [formUmroh, setFormUmroh] = useState(initialUmroh);
  const [formDomestik, setFormDomestik] = useState(initialDomestik);
  const [formInternasional, setFormInternasional] = useState(initialInternasional); // Tambahan
  const [formDaerah, setFormDaerah] = useState(initialDaerah);
  const [formDaerahInt, setFormDaerahInt] = useState(initialDaerahInt); // Tambahan
  const [formBerita, setFormBerita] = useState(initialBerita);
  const [formMengapa, setFormMengapa] = useState(initialMengapa);
  const [formKeunggulanUmroh, setFormKeunggulanUmroh] = useState(initialKeunggulanUmroh);
  const [formKeunggulanDomestik, setFormKeunggulanDomestik] = useState(initialKeunggulanDomestik);
  const [formKeunggulanInt, setFormKeunggulanInt] = useState(initialKeunggulanInt); // Tambahan
  const [formLayanan, setFormLayanan] = useState(initialLayanan);
  const [formTestimoni, setFormTestimoni] = useState(initialTestimoni);
  
  const [formConfig, setFormConfig] = useState(initialConfig);
  const [formUmrohConfig, setFormUmrohConfig] = useState(initialUmrohConfig);
  const [formDomestikConfig, setFormDomestikConfig] = useState(initialDomestikConfig);
  const [formInternasionalConfig, setFormInternasionalConfig] = useState(initialInternasionalConfig); // Tambahan

  useEffect(() => { fetchData(); fetchDaerahOptions(); }, [activeTab]);

  const fetchDaerahOptions = async () => { 
    const snapDom = await getDocs(collection(db, "destinasi_domestik")); 
    setDaerahOptions(snapDom.docs.map(doc => doc.data().title)); 
    const snapInt = await getDocs(collection(db, "destinasi_internasional")); 
    setDaerahIntOptions(snapInt.docs.map(doc => doc.data().title)); 
  };
  
  const fetchData = async () => {
    if (activeTab === "web_settings") return; 
    if (activeTab === "dashboard") {
      const snapUmroh = await getDocs(collection(db, "paket_umroh")); const snapDomestik = await getDocs(collection(db, "paket_domestik")); const snapInt = await getDocs(collection(db, "paket_internasional")); const snapTesti = await getDocs(collection(db, "testimoni_pelanggan")); const snapBerita = await getDocs(collection(db, "berita"));
      setStats({ umroh: snapUmroh.size, domestik: snapDomestik.size, internasional: snapInt.size, testimoni: snapTesti.size, berita: snapBerita.size }); return;
    }
    if (activeTab === "config") { const snap = await getDoc(doc(db, "settings", "home")); if (snap.exists()) setFormConfig({ ...initialConfig, ...snap.data() }); const uSnap = await getDocs(collection(db, "paket_umroh")); setUmrohPromoOptions(uSnap.docs.map(d => ({ id: d.id, title: d.data().title }))); return; }
    if (activeTab === "config_umroh") { const snap = await getDoc(doc(db, "settings", "umroh")); if (snap.exists()) setFormUmrohConfig({ ...initialUmrohConfig, ...snap.data() }); return; }
    if (activeTab === "config_domestik") { const snap = await getDoc(doc(db, "settings", "domestik")); if (snap.exists()) setFormDomestikConfig({ ...initialDomestikConfig, ...snap.data() }); return; }
    if (activeTab === "config_internasional") { const snap = await getDoc(doc(db, "settings", "internasional")); if (snap.exists()) setFormInternasionalConfig({ ...initialInternasionalConfig, ...snap.data() }); return; } // Tambahan
    
    let colName = "paket_umroh";
    if (activeTab === "domestik") colName = "paket_domestik"; 
    if (activeTab === "internasional") colName = "paket_internasional"; 
    if (activeTab === "berita") colName = "berita"; 
    if (activeTab === "daerah") colName = "destinasi_domestik"; 
    if (activeTab === "daerah_internasional") colName = "destinasi_internasional"; 
    if (activeTab === "mengapa") colName = "mengapa_kami"; 
    if (activeTab === "keunggulan_umroh") colName = "keunggulan_umroh"; 
    if (activeTab === "keunggulan_domestik") colName = "keunggulan_domestik"; 
    if (activeTab === "keunggulan_internasional") colName = "keunggulan_internasional"; 
    if (activeTab === "layanan") colName = "layanan_utama"; 
    if (activeTab === "testimoni") colName = "testimoni_pelanggan"; 

    if(colName) { const snapshot = await getDocs(collection(db, colName)); setDataList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); }
  };

  const formatInputNumber = (num) => num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
  const handleNumberChange = (e, setForm, formState, fieldName) => setForm({ ...formState, [fieldName]: e.target.value.replace(/\D/g, "") });
  const handleChange = (e, setForm, formState) => setForm({ ...formState, [e.target.name]: e.target.value });
  
  const handleConfigChange = (e) => setFormConfig({ ...formConfig, [e.target.name]: e.target.value });
  const handleUmrohConfigChange = (e) => setFormUmrohConfig({ ...formUmrohConfig, [e.target.name]: e.target.value });
  const handleDomestikConfigChange = (e) => setFormDomestikConfig({ ...formDomestikConfig, [e.target.name]: e.target.value });
  const handleInternasionalConfigChange = (e) => setFormInternasionalConfig({ ...formInternasionalConfig, [e.target.name]: e.target.value });

  // Handler Array Form Domestik & Internasional
  const handleAddHarga = (setForm, formState) => setForm({...formState, hargaPrivate: [...(formState.hargaPrivate || []), { nominal: "", deskripsi: "" }]});
  const handleRemoveHarga = (setForm, formState, index) => { const newArr = [...formState.hargaPrivate]; newArr.splice(index, 1); setForm({...formState, hargaPrivate: newArr}); };
  const handleUpdateHarga = (setForm, formState, index, field, value) => { const newArr = [...formState.hargaPrivate]; newArr[index][field] = field === 'nominal' ? value.replace(/\D/g, "") : value; setForm({...formState, hargaPrivate: newArr}); };
  const handleAddTransport = (setForm, formState) => setForm({...formState, transportasi: [...(formState.transportasi || []), { jenis: "Bus", deskripsi: "" }]});
  const handleRemoveTransport = (setForm, formState, index) => { const newArr = [...formState.transportasi]; newArr.splice(index, 1); setForm({...formState, transportasi: newArr}); };
  const handleUpdateTransport = (setForm, formState, index, field, value) => { const newArr = [...formState.transportasi]; newArr[index][field] = value; setForm({...formState, transportasi: newArr}); };
  
  const handleBadgeChange = (e, setForm, formState) => { const val = e.target.value; let color = "bg-blue-600"; if (val === "Promo") color = "bg-red-500"; if (val === "Premium") color = "bg-purple-600"; if (val === "VIP") color = "bg-[#f59e0b]"; setForm({ ...formState, badge: val, badgeColor: color }); };
  const handleAddInfo = (setForm, formState) => setForm({...formState, informasiTambahan: [...(formState.informasiTambahan || []), {judul: "", isi: ""}]});
  const handleRemoveInfo = (setForm, formState, index) => { const newArr = [...formState.informasiTambahan]; newArr.splice(index, 1); setForm({...formState, informasiTambahan: newArr}); };
  const handleUpdateInfo = (setForm, formState, index, field, value) => { const newArr = [...formState.informasiTambahan]; newArr[index][field] = value; setForm({...formState, informasiTambahan: newArr}); };

  const showAlert = (message, type = "info", onConfirm = null) => setCustomAlert({ show: true, message, type, onConfirm });
  const closeAlert = () => setCustomAlert({ show: false, message: "", type: "info", onConfirm: null });

  const openAddModal = () => { 
    setEditId(null); 
    if (activeTab === "umroh") setFormUmroh(initialUmroh); 
    else if (activeTab === "domestik") setFormDomestik(initialDomestik); 
    else if (activeTab === "internasional") setFormInternasional(initialInternasional); 
    else if (activeTab === "daerah") setFormDaerah(initialDaerah); 
    else if (activeTab === "daerah_internasional") setFormDaerahInt(initialDaerahInt); 
    else if (activeTab === "berita") setFormBerita(initialBerita); 
    else if (activeTab === "mengapa") setFormMengapa(initialMengapa); 
    else if (activeTab === "keunggulan_umroh") setFormKeunggulanUmroh(initialKeunggulanUmroh); 
    else if (activeTab === "keunggulan_domestik") setFormKeunggulanDomestik(initialKeunggulanDomestik); 
    else if (activeTab === "keunggulan_internasional") setFormKeunggulanInt(initialKeunggulanInt); 
    else if (activeTab === "layanan") setFormLayanan(initialLayanan); 
    else if (activeTab === "testimoni") setFormTestimoni(initialTestimoni); 
    setIsFormOpen(true); 
  };

  const openEditModal = (item) => { 
    setEditId(item.id); 
    if (activeTab === "umroh") setFormUmroh({...initialUmroh, ...item}); 
    else if (activeTab === "domestik") { setFormDomestik({...initialDomestik, ...item, price: item.price || item.hargaOpenTrip || item.hargaPrivateTrip, hargaPrivate: item.hargaPrivate || initialDomestik.hargaPrivate, transportasi: item.transportasi || (item.transport ? [{jenis: "Bus", deskripsi: item.transport}] : initialDomestik.transportasi) }); } 
    else if (activeTab === "internasional") { setFormInternasional({...initialInternasional, ...item, price: item.price || item.hargaOpenTrip || item.hargaPrivateTrip, hargaPrivate: item.hargaPrivate || initialInternasional.hargaPrivate, transportasi: item.transportasi || (item.transport ? [{jenis: "Pesawat", deskripsi: item.transport}] : initialInternasional.transportasi) }); } 
    else if (activeTab === "daerah") setFormDaerah({...initialDaerah, ...item}); 
    else if (activeTab === "daerah_internasional") setFormDaerahInt({...initialDaerahInt, ...item}); 
    else if (activeTab === "berita") setFormBerita({...initialBerita, ...item}); 
    else if (activeTab === "mengapa") setFormMengapa({...initialMengapa, ...item}); 
    else if (activeTab === "keunggulan_umroh") setFormKeunggulanUmroh({...initialKeunggulanUmroh, ...item}); 
    else if (activeTab === "keunggulan_domestik") setFormKeunggulanDomestik({...initialKeunggulanDomestik, ...item}); 
    else if (activeTab === "keunggulan_internasional") setFormKeunggulanInt({...initialKeunggulanInt, ...item}); 
    else if (activeTab === "layanan") setFormLayanan({...initialLayanan, ...item}); 
    else if (activeTab === "testimoni") setFormTestimoni({...initialTestimoni, ...item}); 
    setIsFormOpen(true); 
  };

  const joditConfig = { height: 300, askBeforePasteHTML: false, askBeforePasteFromWord: false, defaultActionOnPaste: "insert_as_html" };
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e, formType, setFormFunc, stateData, configField = null, configType = "home") => {
    const file = e.target.files[0]; if (!file) return; setIsUploading(true); const formData = new FormData(); formData.append("file", file); formData.append("upload_preset", "ed8ovogp"); 
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/h8p2mssb/image/upload`, { method: "POST", body: formData }); const data = await response.json();
      if (data.secure_url) {
        if (configField) { 
          if(configType === "umroh") setFormUmrohConfig({ ...formUmrohConfig, [configField]: data.secure_url }); 
          else if(configType === "domestik") setFormDomestikConfig({ ...formDomestikConfig, [configField]: data.secure_url }); 
          else if(configType === "internasional") setFormInternasionalConfig({ ...formInternasionalConfig, [configField]: data.secure_url }); 
          else setFormConfig({ ...formConfig, [configField]: data.secure_url }); 
        } 
        else if (setFormFunc) { setFormFunc({ ...stateData, image: data.secure_url }); } 
        else { 
          if (activeTab === "umroh") setFormUmroh({ ...formUmroh, image: data.secure_url }); 
          else if (activeTab === "domestik") setFormDomestik({ ...formDomestik, image: data.secure_url }); 
          else if (activeTab === "internasional") setFormInternasional({ ...formInternasional, image: data.secure_url }); 
          else if (activeTab === "daerah") setFormDaerah({ ...formDaerah, image: data.secure_url }); 
          else if (activeTab === "daerah_internasional") setFormDaerahInt({ ...formDaerahInt, image: data.secure_url }); 
          else if (activeTab === "berita") setFormBerita({ ...formBerita, image: data.secure_url }); 
          else if (activeTab === "layanan") setFormLayanan({ ...formLayanan, image: data.secure_url }); 
        } 
      } else alert("Gagal mengunggah gambar.");
    } catch (error) { alert("Terjadi kesalahan jaringan."); } finally { setIsUploading(false); }
  };

  const handleTestiImage = async (e) => { const file = e.target.files[0]; if (!file) return; setIsUploading(true); const formData = new FormData(); formData.append("file", file); formData.append("upload_preset", "ed8ovogp"); try { const response = await fetch(`https://api.cloudinary.com/v1_1/h8p2mssb/image/upload`, { method: "POST", body: formData }); const data = await response.json(); if (data.secure_url) setFormTestimoni({ ...formTestimoni, img: data.secure_url }); } catch (error) {} finally { setIsUploading(false); } };

  const handleSaveConfig = async (e) => { e.preventDefault(); setIsSubmitting(true); try { await setDoc(doc(db, "settings", "home"), formConfig); showAlert("Pengaturan Beranda Disimpan!", "success"); } catch (error) { showAlert("Gagal menyimpan.", "error"); } finally { setIsSubmitting(false); } };
  const handleSaveUmrohConfig = async (e) => { e.preventDefault(); setIsSubmitting(true); try { await setDoc(doc(db, "settings", "umroh"), formUmrohConfig); showAlert("Pengaturan Umroh Disimpan!", "success"); } catch (error) { showAlert("Gagal menyimpan.", "error"); } finally { setIsSubmitting(false); } };
  const handleSaveDomestikConfig = async (e) => { e.preventDefault(); setIsSubmitting(true); try { await setDoc(doc(db, "settings", "domestik"), formDomestikConfig); showAlert("Pengaturan Domestik Disimpan!", "success"); } catch (error) { showAlert("Gagal menyimpan.", "error"); } finally { setIsSubmitting(false); } };
  const handleSaveInternasionalConfig = async (e) => { e.preventDefault(); setIsSubmitting(true); try { await setDoc(doc(db, "settings", "internasional"), formInternasionalConfig); showAlert("Pengaturan Internasional Disimpan!", "success"); } catch (error) { showAlert("Gagal menyimpan.", "error"); } finally { setIsSubmitting(false); } };
  
  const handleSubmit = async (e) => { 
    e.preventDefault(); setIsSubmitting(true); 
    let colName = "paket_umroh"; let dataToSave = formUmroh; 
    if (activeTab === "domestik") { colName = "paket_domestik"; dataToSave = formDomestik; } 
    if (activeTab === "internasional") { colName = "paket_internasional"; dataToSave = formInternasional; } 
    if (activeTab === "daerah") { colName = "destinasi_domestik"; dataToSave = formDaerah; } 
    if (activeTab === "daerah_internasional") { colName = "destinasi_internasional"; dataToSave = formDaerahInt; } 
    if (activeTab === "berita") { colName = "berita"; dataToSave = formBerita; } 
    if (activeTab === "mengapa") { colName = "mengapa_kami"; dataToSave = formMengapa; } 
    if (activeTab === "keunggulan_umroh") { colName = "keunggulan_umroh"; dataToSave = formKeunggulanUmroh; } 
    if (activeTab === "keunggulan_domestik") { colName = "keunggulan_domestik"; dataToSave = formKeunggulanDomestik; } 
    if (activeTab === "keunggulan_internasional") { colName = "keunggulan_internasional"; dataToSave = formKeunggulanInt; } 
    if (activeTab === "layanan") { colName = "layanan_utama"; dataToSave = formLayanan; } 
    if (activeTab === "testimoni") { colName = "testimoni_pelanggan"; dataToSave = formTestimoni; } 
    
    try { 
      if (editId) { await updateDoc(doc(db, colName, editId), dataToSave); showAlert("Data diperbarui.", "success"); } 
      else { await addDoc(collection(db, colName), dataToSave); showAlert("Data ditambahkan.", "success"); } 
      setIsFormOpen(false); fetchData(); fetchDaerahOptions(); 
    } catch (error) { showAlert("Gagal menyimpan data.", "error"); } finally { setIsSubmitting(false); } 
  };

  const confirmDelete = (id) => { 
    showAlert("Yakin ingin menghapus?", "confirm", async () => { 
      let colName = "paket_umroh"; 
      if (activeTab === "domestik") colName = "paket_domestik"; 
      if (activeTab === "internasional") colName = "paket_internasional"; 
      if (activeTab === "daerah") colName = "destinasi_domestik"; 
      if (activeTab === "daerah_internasional") colName = "destinasi_internasional"; 
      if (activeTab === "berita") colName = "berita"; 
      if (activeTab === "mengapa") colName = "mengapa_kami"; 
      if (activeTab === "keunggulan_umroh") colName = "keunggulan_umroh"; 
      if (activeTab === "keunggulan_domestik") colName = "keunggulan_domestik"; 
      if (activeTab === "keunggulan_internasional") colName = "keunggulan_internasional"; 
      if (activeTab === "layanan") colName = "layanan_utama"; 
      if (activeTab === "testimoni") colName = "testimoni_pelanggan"; 
      await deleteDoc(doc(db, colName, id)); fetchData(); fetchDaerahOptions(); showAlert("Dihapus.", "success"); 
    }); 
  };

  const inputClass = "w-full border border-gray-200 p-3 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-0 focus:outline-none transition text-sm";
  const labelClass = "text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";
  const titleSizeOptions = <><option value="text-[28px] md:text-4xl lg:text-5xl">Sedang</option><option value="text-[32px] md:text-5xl lg:text-6xl">Besar (Standar)</option><option value="text-[36px] md:text-6xl lg:text-7xl">Sangat Besar</option></>;
  const smallTextSizeOptions = <><option value="text-[10px] md:text-xs">Kecil</option><option value="text-[10px] md:text-sm">Sedang (Standar)</option><option value="text-xs md:text-base">Besar</option></>;
  const bgPosOptions = <><option value="bg-top">Fokus Atas</option><option value="bg-center">Fokus Tengah (Standar)</option><option value="bg-bottom">Fokus Bawah (Pemandangan)</option></>;
  const objectPosOptions = <><option value="object-top">Fokus Atas</option><option value="object-center">Fokus Tengah (Standar)</option><option value="object-bottom">Fokus Bawah (Pemandangan)</option></>;
  const bgColorOptions = <><option value="bg-[#0f172a]">Biru Gelap Default</option><option value="bg-[#1e3a8a]">Biru Enka Mandiri</option><option value="bg-[#f59e0b]">Kuning Emas</option><option value="bg-emerald-800">Hijau Tua</option><option value="bg-black">Hitam Pekat</option></>;
  const colorOptions = <><option value="bg-[#1e3a8a]">Biru Tua</option><option value="bg-[#f59e0b]">Kuning Emas</option><option value="bg-emerald-500">Hijau</option><option value="bg-red-500">Merah</option><option value="bg-purple-500">Ungu</option></>;

  const renderIconSelector = (currentIcon, setIconFn) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {Object.keys(IconMap).map((key) => { const Icon = IconMap[key]; return (<button key={key} type="button" onClick={() => setIconFn(key)} className={`p-2.5 rounded-xl border transition-colors flex flex-col items-center justify-center focus:outline-none ${currentIcon === key ? "bg-blue-100 border-blue-500 text-blue-700 shadow-sm" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`} title={key}><Icon size={22} /></button>); })}
    </div>
  );

  const isHomeSetting = ["config", "layanan", "mengapa", "testimoni"].includes(activeTab);
  const isUmrohSetting = ["config_umroh", "keunggulan_umroh"].includes(activeTab);
  const isDomestikSetting = ["config_domestik", "keunggulan_domestik"].includes(activeTab);
  const isInternasionalSetting = ["config_internasional", "keunggulan_internasional"].includes(activeTab); // Tambahan

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans selection:bg-blue-100">
      
      {/* ===================== SIDEBAR ===================== */}
      <div className="w-64 bg-[#0f172a] text-white flex flex-col shadow-2xl z-20 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg"><LayoutDashboard size={20}/></div>
          <div><h2 className="text-base font-bold">Workspace</h2><p className="text-[10px] text-slate-400">Enka Imron Mandiri</p></div>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 mb-4 ${activeTab === "dashboard" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><Activity size={18} /><span className="text-sm font-medium">Dashboard Info</span></button>

          <p className="px-4 text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider mb-2 mt-6">Manajemen Paket</p>
          <button onClick={() => setActiveTab("umroh")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "umroh" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><Tent size={18} /><span className="text-sm font-medium">Paket Umroh</span></button>
          <button onClick={() => setActiveTab("domestik")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "domestik" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><MapPin size={18} /><span className="text-sm font-medium">Paket Domestik</span></button>
          <button onClick={() => setActiveTab("internasional")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "internasional" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><Globe size={18} /><span className="text-sm font-medium">Paket Internasional</span></button>

          <p className="px-4 text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider mb-2 mt-6">Pusat Konten</p>
          <button onClick={() => setActiveTab("berita")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "berita" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><FileText size={18} /><span className="text-sm font-medium">Berita & Artikel</span></button>

          <p className="px-4 text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider mb-2 mt-6">Pengaturan Website</p>
          <button onClick={() => setActiveTab("web_settings")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "web_settings" || isHomeSetting || isUmrohSetting || isDomestikSetting || isInternasionalSetting ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><LayoutTemplate size={18} /><span className="text-sm font-medium">Tampilan Web & CTA</span></button>

          <p className="px-4 text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider mb-2 mt-6">Master Data</p>
          <button onClick={() => setActiveTab("daerah")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "daerah" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><MapPin size={18} /><span className="text-sm font-medium">Master Daerah Domestik</span></button>
          <button onClick={() => setActiveTab("daerah_internasional")} className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center gap-3 ${activeTab === "daerah_internasional" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><Globe size={18} /><span className="text-sm font-medium">Master Kawasan / Negara</span></button>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-2.5 rounded-xl transition shadow-lg shadow-red-500/30">
            <LogOut size={16} /><span className="text-sm font-bold">Keluar Sistem</span>
          </button>
        </div>
      </div>

      {/* ===================== KONTEN UTAMA ===================== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center z-10 shrink-0">
          <div><h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab === "dashboard" ? "Dashboard Sistem" : activeTab === "web_settings" ? "Pusat Pengaturan Tampilan Web" : activeTab === "berita" ? "Pusat Berita & Artikel Web" : isHomeSetting ? "Pengaturan Halaman Beranda" : isUmrohSetting ? "Pengaturan Halaman Umroh" : isDomestikSetting ? "Pengaturan Halaman Domestik" : isInternasionalSetting ? "Pengaturan Halaman Internasional" : `Manajemen ${activeTab.replace('_', ' ')}`}</h1></div>
          {!["dashboard", "web_settings", "config", "config_umroh", "config_domestik", "config_internasional"].includes(activeTab) && (
            <button onClick={openAddModal} className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition hover:bg-blue-800"><Plus size={18} />Tambah Data</button>
          )}
        </header>

        <div className="flex-1 p-8 overflow-y-auto bg-[#f8fafc]">
          
          {/* DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#1e3a8a] to-blue-600 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden"><div className="absolute top-0 right-0 opacity-10 w-64 h-64 bg-white rounded-full -mr-20 -mt-20"></div><div className="relative z-10"><p className="text-blue-200 font-semibold tracking-wider text-sm mb-2 uppercase">Workspace System</p><h2 className="text-3xl md:text-4xl font-bold mb-3">Selamat Datang, Admin! 👋</h2><p className="text-blue-100 text-sm md:text-base max-w-xl leading-relaxed">Pantau kinerja website, kelola paket perjalanan, dan perbarui informasi jamaah Anda dari satu panel kontrol yang elegan.</p></div></div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden group"><div className="absolute right-[-10%] top-[-10%] opacity-20"><Tent size={100}/></div><div className="relative z-10"><p className="text-cyan-100 font-semibold text-xs mb-1">Paket Umroh</p><h3 className="text-3xl font-bold mb-3">{stats.umroh}</h3><button onClick={() => setActiveTab("umroh")} className="text-[10px] font-bold bg-white/20 px-3 py-1.5 rounded-lg transition">Kelola →</button></div></div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden group"><div className="absolute right-[-10%] top-[-10%] opacity-20"><MapPin size={100}/></div><div className="relative z-10"><p className="text-emerald-100 font-semibold text-xs mb-1">Trip Domestik</p><h3 className="text-3xl font-bold mb-3">{stats.domestik}</h3><button onClick={() => setActiveTab("domestik")} className="text-[10px] font-bold bg-white/20 px-3 py-1.5 rounded-lg transition">Kelola →</button></div></div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden group"><div className="absolute right-[-10%] top-[-10%] opacity-20"><Globe size={100}/></div><div className="relative z-10"><p className="text-indigo-100 font-semibold text-xs mb-1">Trip Internasional</p><h3 className="text-3xl font-bold mb-3">{stats.internasional}</h3><button onClick={() => setActiveTab("internasional")} className="text-[10px] font-bold bg-white/20 px-3 py-1.5 rounded-lg transition">Kelola →</button></div></div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden group"><div className="absolute right-[-10%] top-[-10%] opacity-20"><BookOpen size={100}/></div><div className="relative z-10"><p className="text-amber-100 font-semibold text-xs mb-1">Pusat Berita</p><h3 className="text-3xl font-bold mb-3">{stats.berita}</h3><button onClick={() => setActiveTab("berita")} className="text-[10px] font-bold bg-white/20 px-3 py-1.5 rounded-lg transition">Kelola →</button></div></div>
                <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden group"><div className="absolute right-[-10%] top-[-10%] opacity-20"><MessageSquare size={100}/></div><div className="relative z-10"><p className="text-pink-100 font-semibold text-xs mb-1">Testimoni</p><h3 className="text-3xl font-bold mb-3">{stats.testimoni}</h3><button onClick={() => setActiveTab("testimoni")} className="text-[10px] font-bold bg-white/20 px-3 py-1.5 rounded-lg transition">Kelola →</button></div></div>
              </div>
            </div>
          )}

          {/* HUB PENGATURAN TAMPILAN WEB */}
          {activeTab === "web_settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div onClick={() => setActiveTab("config")} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group text-center flex flex-col items-center"><div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><MonitorSmartphone size={30}/></div><h3 className="text-lg font-bold text-gray-800 mb-2">Halaman Beranda</h3><p className="text-xs text-gray-500">Kelola Hero, Banner Promo, Layanan Utama, Keunggulan.</p><div className="mt-auto pt-4 text-xs font-bold text-blue-600">Buka Pengaturan →</div></div>
              <div onClick={() => setActiveTab("config_umroh")} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group text-center flex flex-col items-center"><div className="w-16 h-16 bg-orange-50 text-[#f59e0b] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Tent size={30}/></div><h3 className="text-lg font-bold text-gray-800 mb-2">Halaman Umroh</h3><p className="text-xs text-gray-500">Sesuaikan Gambar Hero, CTA Khusus Umroh dan Keunggulan.</p><div className="mt-auto pt-4 text-xs font-bold text-[#f59e0b]">Buka Pengaturan →</div></div>
              <div onClick={() => setActiveTab("config_domestik")} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group text-center flex flex-col items-center"><div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><MapPin size={30}/></div><h3 className="text-lg font-bold text-gray-800 mb-2">Halaman Domestik</h3><p className="text-xs text-gray-500">Sesuaikan Hero Domestik, CTA Kustom, dan Keunggulan.</p><div className="mt-auto pt-4 text-xs font-bold text-emerald-600">Buka Pengaturan →</div></div>
              <div onClick={() => setActiveTab("config_internasional")} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group text-center flex flex-col items-center"><div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Globe size={30}/></div><h3 className="text-lg font-bold text-gray-800 mb-2">Halaman Internasional</h3><p className="text-xs text-gray-500">Sesuaikan Hero Luar Negeri, CTA Trip, dan Keunggulan.</p><div className="mt-auto pt-4 text-xs font-bold text-purple-600">Buka Pengaturan →</div></div>
            </div>
          )}

          {/* NAVIGASI SUB-MENU HORIZONTAL */}
          {(isHomeSetting || isUmrohSetting || isDomestikSetting || isInternasionalSetting) && (
            <div className="mb-8">
              <button onClick={() => setActiveTab("web_settings")} className="flex items-center gap-2 text-gray-500 hover:text-[#1e3a8a] font-bold mb-4 transition-colors"><ArrowLeft size={16}/> Kembali ke Pilihan Halaman</button>
              <div className="bg-white p-2 rounded-2xl inline-flex flex-wrap gap-2 shadow-sm border border-gray-100">
                {isHomeSetting && (<><button onClick={() => setActiveTab("config")} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'config' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Visual Hero & Promo</button><button onClick={() => setActiveTab("layanan")} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'layanan' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Layanan Kami</button><button onClick={() => setActiveTab("mengapa")} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'mengapa' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Keunggulan Beranda</button><button onClick={() => setActiveTab("testimoni")} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'testimoni' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Testimoni Jamaah</button></>)}
                {isUmrohSetting && (<><button onClick={() => setActiveTab("config_umroh")} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'config_umroh' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Visual Hero & CTA</button><button onClick={() => setActiveTab("keunggulan_umroh")} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'keunggulan_umroh' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Keunggulan Umroh</button></>)}
                {isDomestikSetting && (<><button onClick={() => setActiveTab("config_domestik")} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'config_domestik' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Visual Hero & CTA</button><button onClick={() => setActiveTab("keunggulan_domestik")} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'keunggulan_domestik' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Keunggulan Domestik</button></>)}
                {isInternasionalSetting && (<><button onClick={() => setActiveTab("config_internasional")} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'config_internasional' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Visual Hero & CTA</button><button onClick={() => setActiveTab("keunggulan_internasional")} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'keunggulan_internasional' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Keunggulan Internasional</button></>)}
              </div>
            </div>
          )}

          {/* ======================= KONTEN FORM PENGATURAN HALAMAN ======================= */}
          {/* CONFIG: BERANDA */}
          {activeTab === "config" && (
             <form onSubmit={handleSaveConfig} className="max-w-5xl mx-auto space-y-8 pb-10">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><Star size={20}/> 1. Pengaturan Hero Beranda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Judul Utama</label><textarea name="heroTitle" value={formConfig.heroTitle} onChange={handleConfigChange} rows="2" className={inputClass}></textarea></div>
                  <div><label className={labelClass}>Deskripsi Singkat</label><textarea name="heroDesc" value={formConfig.heroDesc} onChange={handleConfigChange} rows="2" className={inputClass}></textarea></div>
                  <div><label className={labelClass}>Ukuran Font Judul</label><select name="heroTitleSize" value={formConfig.heroTitleSize} onChange={handleConfigChange} className={inputClass}>{titleSizeOptions}</select></div>
                  <div><label className={labelClass}>Posisi Fokus Gambar</label><select name="heroBgPos" value={formConfig.heroBgPos} onChange={handleConfigChange} className={inputClass}>{bgPosOptions}</select></div>
                  <div><label className={labelClass}>Background Gambar</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'heroBg', 'home')} className="w-full text-sm border p-2.5 rounded-xl bg-slate-50"/></div>
                  <div><label className={labelClass}>Tampilkan Ikon Info?</label><select name="showBadges" value={formConfig.showBadges} onChange={handleConfigChange} className={inputClass}><option value="ya">Ya, Tampilkan 3 Ikon</option><option value="tidak">Sembunyikan</option></select></div>
                </div>
                {formConfig.showBadges === "ya" && (
                  <div className="mt-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <p className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wide">Pengaturan 3 Ikon Info</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 1</label><input type="text" name="b1Text" value={formConfig.b1Text} onChange={handleConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon</label>{renderIconSelector(formConfig.b1Icon, (val) => setFormConfig({...formConfig, b1Icon: val}))}</div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 2</label><input type="text" name="b2Text" value={formConfig.b2Text} onChange={handleConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon</label>{renderIconSelector(formConfig.b2Icon, (val) => setFormConfig({...formConfig, b2Icon: val}))}</div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 3</label><input type="text" name="b3Text" value={formConfig.b3Text} onChange={handleConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon</label>{renderIconSelector(formConfig.b3Icon, (val) => setFormConfig({...formConfig, b3Icon: val}))}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><Zap size={20}/> 2. Pengaturan Banner Promo Beranda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Teks Label Kecil</label><input type="text" name="promoSmall" value={formConfig.promoSmall} onChange={handleConfigChange} className={inputClass}/></div>
                  <div><label className={labelClass}>Judul Promo</label><textarea name="promoTitle" value={formConfig.promoTitle} onChange={handleConfigChange} rows="2" className={inputClass}></textarea></div>
                  <div><label className={labelClass}>Teks Tombol Promo</label><input type="text" name="promoBtn" value={formConfig.promoBtn} onChange={handleConfigChange} className={inputClass}/></div>
                  <div><label className={`${labelClass} text-blue-600`}>Tombol Diarahkan Ke Paket:</label><select name="promoLink" value={formConfig.promoLink} onChange={handleConfigChange} className={inputClass}><option value="/umroh">-- Halaman Utama Umroh --</option>{umrohPromoOptions.map(u => (<option key={u.id} value={`/paket/umroh/${u.id}`}>Paket: {u.title}</option>))}</select></div>
                  <div><label className={labelClass}>Harga Mulai (Angka Besar)</label><input type="text" name="promoPrice" value={formConfig.promoPrice} onChange={handleConfigChange} className={inputClass}/></div>
                  <div><label className={labelClass}>Warna Latar Promo</label><select name="promoBgColor" value={formConfig.promoBgColor} onChange={handleConfigChange} className={inputClass}>{bgColorOptions}</select></div>
                  <div className="md:col-span-2"><label className={labelClass}>Background Gambar Promo</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'promoBg', 'home')} className="w-full text-sm border p-2.5 rounded-xl bg-slate-50"/></div>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting || isUploading} className="w-full py-4 bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold rounded-xl shadow-xl transition-colors text-lg">Simpan Pengaturan Beranda</button>
            </form>
          )}

          {/* CONFIG: UMROH */}
          {activeTab === "config_umroh" && (
             <form onSubmit={handleSaveUmrohConfig} className="max-w-5xl mx-auto space-y-8 pb-10">
               <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><Tent size={20}/> 1. Pengaturan Hero Umroh</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div><label className={labelClass}>Teks Oranye (Kecil)</label><input type="text" name="heroSmallText" value={formUmrohConfig.heroSmallText} onChange={handleUmrohConfigChange} className={inputClass}/></div>
                   <div><label className={labelClass}>Ukuran Teks Oranye</label><select name="heroSmallTextSize" value={formUmrohConfig.heroSmallTextSize} onChange={handleUmrohConfigChange} className={inputClass}>{smallTextSizeOptions}</select></div>
                   <div><label className={labelClass}>Judul Utama</label><textarea name="heroTitle" value={formUmrohConfig.heroTitle} onChange={handleUmrohConfigChange} rows="2" className={inputClass}></textarea></div>
                   <div><label className={labelClass}>Deskripsi</label><textarea name="heroDesc" value={formUmrohConfig.heroDesc} onChange={handleUmrohConfigChange} rows="2" className={inputClass}></textarea></div>
                   <div><label className={labelClass}>Ukuran Font Judul</label><select name="heroTitleSize" value={formUmrohConfig.heroTitleSize} onChange={handleUmrohConfigChange} className={inputClass}>{titleSizeOptions}</select></div>
                   <div><label className={labelClass}>Posisi Fokus Gambar</label><select name="heroBgPos" value={formUmrohConfig.heroBgPos} onChange={handleUmrohConfigChange} className={inputClass}>{bgPosOptions}</select></div>
                   <div className="md:col-span-2"><label className={labelClass}>Background Gambar Hero Umroh</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'heroBg', 'umroh')} className="w-full text-sm border border-gray-200 p-2.5 rounded-xl bg-slate-50 outline-none"/></div>
                 </div>
                 <div className="mt-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                   <p className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wide">Pengaturan 3 Ikon Info</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 1</label><input type="text" name="f1Text" value={formUmrohConfig.f1Text} onChange={handleUmrohConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon 1</label>{renderIconSelector(formUmrohConfig.f1Icon, (val) => setFormUmrohConfig({...formUmrohConfig, f1Icon: val}))}</div>
                     <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 2</label><input type="text" name="f2Text" value={formUmrohConfig.f2Text} onChange={handleUmrohConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon 2</label>{renderIconSelector(formUmrohConfig.f2Icon, (val) => setFormUmrohConfig({...formUmrohConfig, f2Icon: val}))}</div>
                     <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 3</label><input type="text" name="f3Text" value={formUmrohConfig.f3Text} onChange={handleUmrohConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon 3</label>{renderIconSelector(formUmrohConfig.f3Icon, (val) => setFormUmrohConfig({...formUmrohConfig, f3Icon: val}))}</div>
                   </div>
                 </div>
               </div>
               
               <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><Zap size={20}/> 2. Banner CTA Umroh (Bawah)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2"><label className={labelClass}>Judul Ajakan</label><input type="text" name="ctaTitle" value={formUmrohConfig.ctaTitle} onChange={handleUmrohConfigChange} className={inputClass}/></div>
                   <div className="md:col-span-2"><label className={labelClass}>Deskripsi Ajakan</label><textarea name="ctaDesc" value={formUmrohConfig.ctaDesc} onChange={handleUmrohConfigChange} rows="2" className={inputClass}></textarea></div>
                   <div><label className={labelClass}>Teks Tombol Aksi</label><input type="text" name="ctaBtnText" value={formUmrohConfig.ctaBtnText} onChange={handleUmrohConfigChange} className={inputClass}/></div>
                   <div><label className={labelClass}>Link Tombol (URL/WA)</label><input type="text" name="ctaBtnLink" value={formUmrohConfig.ctaBtnLink} onChange={handleUmrohConfigChange} className={inputClass}/></div>
                   <div><label className={labelClass}>Warna Latar CTA</label><select name="ctaBgColor" value={formUmrohConfig.ctaBgColor} onChange={handleUmrohConfigChange} className={inputClass}>{bgColorOptions}</select></div>
                   <div className="md:col-span-2"><label className={labelClass}>Background Gambar CTA (Opsional)</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'ctaBg', 'umroh')} className="w-full text-sm border border-gray-200 p-2.5 rounded-xl bg-slate-50"/></div>
                 </div>
               </div>
               <button type="submit" disabled={isSubmitting || isUploading} className="w-full py-4 bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold rounded-xl shadow-xl transition-colors text-lg">Simpan Pengaturan Umroh</button>
             </form>
          )}

          {/* CONFIG: DOMESTIK */}
          {activeTab === "config_domestik" && (
             <form onSubmit={handleSaveDomestikConfig} className="max-w-5xl mx-auto space-y-8 pb-10">
               <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><MapPin size={20}/> 1. Pengaturan Hero Domestik</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div><label className={labelClass}>Teks Oranye (Kecil)</label><input type="text" name="heroSmallText" value={formDomestikConfig.heroSmallText} onChange={handleDomestikConfigChange} className={inputClass}/></div>
                   <div><label className={labelClass}>Ukuran Teks Oranye</label><select name="heroSmallTextSize" value={formDomestikConfig.heroSmallTextSize} onChange={handleDomestikConfigChange} className={inputClass}>{smallTextSizeOptions}</select></div>
                   <div><label className={labelClass}>Judul Utama Hero</label><textarea name="heroTitle" value={formDomestikConfig.heroTitle} onChange={handleDomestikConfigChange} rows="2" className={inputClass}></textarea></div>
                   <div><label className={labelClass}>Deskripsi</label><textarea name="heroDesc" value={formDomestikConfig.heroDesc} onChange={handleDomestikConfigChange} rows="2" className={inputClass}></textarea></div>
                   <div><label className={labelClass}>Ukuran Font Judul</label><select name="heroTitleSize" value={formDomestikConfig.heroTitleSize} onChange={handleDomestikConfigChange} className={inputClass}>{titleSizeOptions}</select></div>
                   <div><label className={labelClass}>Posisi Fokus Gambar</label><select name="heroBgPos" value={formDomestikConfig.heroBgPos} onChange={handleDomestikConfigChange} className={inputClass}>{bgPosOptions}</select></div>
                   <div className="md:col-span-2"><label className={labelClass}>Background Gambar Hero Domestik</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'heroBg', 'domestik')} className="w-full text-sm border border-gray-200 p-2.5 rounded-xl mb-1 bg-slate-50 outline-none"/></div>
                   <div><label className={labelClass}>Tampilkan 3 Ikon Info?</label><select name="showBadges" value={formDomestikConfig.showBadges} onChange={handleDomestikConfigChange} className={inputClass}><option value="ya">Ya, Tampilkan</option><option value="tidak">Sembunyikan</option></select></div>
                 </div>
                 {formDomestikConfig.showBadges !== "tidak" && (
                   <div className="mt-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                     <p className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wide">Pengaturan 3 Ikon Info</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 1</label><input type="text" name="d1Text" value={formDomestikConfig.d1Text || ""} onChange={handleDomestikConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon</label>{renderIconSelector(formDomestikConfig.d1Icon || "Users", (val) => setFormDomestikConfig({...formDomestikConfig, d1Icon: val}))}</div>
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 2</label><input type="text" name="d2Text" value={formDomestikConfig.d2Text || ""} onChange={handleDomestikConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon</label>{renderIconSelector(formDomestikConfig.d2Icon || "Star", (val) => setFormDomestikConfig({...formDomestikConfig, d2Icon: val}))}</div>
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 3</label><input type="text" name="d3Text" value={formDomestikConfig.d3Text || ""} onChange={handleDomestikConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon</label>{renderIconSelector(formDomestikConfig.d3Icon || "ShieldCheck", (val) => setFormDomestikConfig({...formDomestikConfig, d3Icon: val}))}</div>
                     </div>
                   </div>
                 )}
               </div>

               <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><Compass size={20}/> 2. Banner CTA Domestik</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2"><label className={labelClass}>Judul Ajakan Kustomisasi</label><input type="text" name="ctaTitle" value={formDomestikConfig.ctaTitle} onChange={handleDomestikConfigChange} className={inputClass}/></div>
                   <div className="md:col-span-2"><label className={labelClass}>Deskripsi Tambahan</label><textarea name="ctaDesc" value={formDomestikConfig.ctaDesc} onChange={handleDomestikConfigChange} rows="2" className={inputClass}></textarea></div>
                   <div><label className={labelClass}>Teks Tombol Hubungi</label><input type="text" name="ctaBtnText" value={formDomestikConfig.ctaBtnText} onChange={handleDomestikConfigChange} className={inputClass}/></div>
                   <div><label className={labelClass}>Nomor WA (Link)</label><input type="text" name="ctaBtnLink" value={formDomestikConfig.ctaBtnLink} onChange={handleDomestikConfigChange} className={inputClass}/></div>
                   <div><label className={labelClass}>Warna Latar CTA</label><select name="ctaBgColor" value={formDomestikConfig.ctaBgColor} onChange={handleDomestikConfigChange} className={inputClass}>{bgColorOptions}</select></div>
                   <div className="md:col-span-2"><label className={labelClass}>Background Gambar CTA (Opsional)</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'ctaBg', 'domestik')} className="w-full text-sm border border-gray-200 p-2.5 rounded-xl bg-slate-50"/></div>
                 </div>
               </div>
               <button type="submit" disabled={isSubmitting || isUploading} className="w-full py-4 bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold rounded-xl shadow-xl transition-colors text-lg">Simpan Pengaturan Domestik</button>
             </form>
          )}

          {/* CONFIG: INTERNASIONAL */}
          {activeTab === "config_internasional" && (
             <form onSubmit={handleSaveInternasionalConfig} className="max-w-5xl mx-auto space-y-8 pb-10">
               <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><Globe size={20}/> 1. Pengaturan Hero Internasional</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div><label className={labelClass}>Teks Oranye (Kecil)</label><input type="text" name="heroSmallText" value={formInternasionalConfig.heroSmallText || ""} onChange={handleInternasionalConfigChange} className={inputClass}/></div>
                   <div><label className={labelClass}>Ukuran Teks Oranye</label><select name="heroSmallTextSize" value={formInternasionalConfig.heroSmallTextSize || "text-[10px] md:text-sm"} onChange={handleInternasionalConfigChange} className={inputClass}>{smallTextSizeOptions}</select></div>
                   <div><label className={labelClass}>Judul Utama Hero</label><textarea name="heroTitle" value={formInternasionalConfig.heroTitle} onChange={handleInternasionalConfigChange} rows="2" className={inputClass}></textarea></div>
                   <div><label className={labelClass}>Deskripsi</label><textarea name="heroDesc" value={formInternasionalConfig.heroDesc} onChange={handleInternasionalConfigChange} rows="2" className={inputClass}></textarea></div>
                   <div><label className={labelClass}>Ukuran Font Judul</label><select name="heroTitleSize" value={formInternasionalConfig.heroTitleSize} onChange={handleInternasionalConfigChange} className={inputClass}>{titleSizeOptions}</select></div>
                   <div><label className={labelClass}>Posisi Fokus Gambar</label><select name="heroBgPos" value={formInternasionalConfig.heroBgPos} onChange={handleInternasionalConfigChange} className={inputClass}>{bgPosOptions}</select></div>
                   <div className="md:col-span-2"><label className={labelClass}>Background Gambar Hero Internasional</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'heroBg', 'internasional')} className="w-full text-sm border border-gray-200 p-2.5 rounded-xl mb-1 bg-slate-50 outline-none"/></div>
                   <div><label className={labelClass}>Tampilkan 3 Ikon Info?</label><select name="showBadges" value={formInternasionalConfig.showBadges} onChange={handleInternasionalConfigChange} className={inputClass}><option value="ya">Ya, Tampilkan</option><option value="tidak">Sembunyikan</option></select></div>
                 </div>
                 {formInternasionalConfig.showBadges !== "tidak" && (
                   <div className="mt-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                     <p className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wide">Pengaturan 3 Ikon Info</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 1</label><input type="text" name="d1Text" value={formInternasionalConfig.d1Text || ""} onChange={handleInternasionalConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon</label>{renderIconSelector(formInternasionalConfig.d1Icon || "Users", (val) => setFormInternasionalConfig({...formInternasionalConfig, d1Icon: val}))}</div>
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 2</label><input type="text" name="d2Text" value={formInternasionalConfig.d2Text || ""} onChange={handleInternasionalConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon</label>{renderIconSelector(formInternasionalConfig.d2Icon || "Star", (val) => setFormInternasionalConfig({...formInternasionalConfig, d2Icon: val}))}</div>
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><label className={labelClass}>Teks Info 3</label><input type="text" name="d3Text" value={formInternasionalConfig.d3Text || ""} onChange={handleInternasionalConfigChange} className="w-full mb-3 p-2.5 border rounded-lg text-sm"/><label className={labelClass}>Pilih Ikon</label>{renderIconSelector(formInternasionalConfig.d3Icon || "ShieldCheck", (val) => setFormInternasionalConfig({...formInternasionalConfig, d3Icon: val}))}</div>
                     </div>
                   </div>
                 )}
               </div>

               <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2"><Globe size={20}/> 2. Banner CTA Internasional</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2"><label className={labelClass}>Judul Ajakan</label><input type="text" name="ctaTitle" value={formInternasionalConfig.ctaTitle || ""} onChange={handleInternasionalConfigChange} className={inputClass}/></div>
                   <div className="md:col-span-2"><label className={labelClass}>Deskripsi Tambahan</label><textarea name="ctaDesc" value={formInternasionalConfig.ctaDesc || ""} onChange={handleInternasionalConfigChange} rows="2" className={inputClass}></textarea></div>
                   <div><label className={labelClass}>Teks Tombol Hubungi</label><input type="text" name="ctaBtnText" value={formInternasionalConfig.ctaBtnText || ""} onChange={handleInternasionalConfigChange} className={inputClass}/></div>
                   <div><label className={labelClass}>Nomor WA (Link)</label><input type="text" name="ctaBtnLink" value={formInternasionalConfig.ctaBtnLink || ""} onChange={handleInternasionalConfigChange} className={inputClass}/></div>
                   <div><label className={labelClass}>Warna Latar CTA</label><select name="ctaBgColor" value={formInternasionalConfig.ctaBgColor || "bg-[#1e3a8a]"} onChange={handleInternasionalConfigChange} className={inputClass}>{bgColorOptions}</select></div>
                   <div className="md:col-span-2"><label className={labelClass}>Background Gambar CTA (Opsional)</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, 'ctaBg', 'internasional')} className="w-full text-sm border border-gray-200 p-2.5 rounded-xl bg-slate-50"/></div>
                 </div>
               </div>
               <button type="submit" disabled={isSubmitting || isUploading} className="w-full py-4 bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold rounded-xl shadow-xl transition-colors text-lg">Simpan Pengaturan Internasional</button>
             </form>
          )}

          {/* TABEL DATA UMUM */}
          {!["dashboard", "web_settings", "config", "config_umroh", "config_domestik", "config_internasional"].includes(activeTab) && (
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
                          {(activeTab === "mengapa" || activeTab === "layanan" || activeTab === "keunggulan_umroh" || activeTab === "keunggulan_domestik" || activeTab === "keunggulan_internasional") ? (
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md ${item.color || 'bg-[#1e3a8a]'}`}><DynamicIcon size={26} /></div>
                          ) : activeTab === "testimoni" ? (
                            <img src={item.img} alt={item.name} className="w-14 h-14 rounded-full object-cover shadow-sm border border-gray-200" />
                          ) : (<img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-gray-100" />)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800 text-base mb-1 flex items-center gap-2">
                            {item.title || item.name}
                            {(activeTab === 'daerah' || activeTab === 'daerah_internasional') && (<span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${item.status === 'Nonaktif' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>{item.status || 'Aktif'}</span>)}
                            {activeTab === 'berita' && (<span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-blue-100 text-blue-600">{item.tipe || 'Umroh'}</span>)}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1">{item.deskripsi || item.text || item.daerah || item.negara || item.service || (item.text && item.text.replace(/<[^>]*>?/gm, ''))}</div>
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

      {/* ===================== MODAL FORM TAMBAH / EDIT DATA ===================== */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white"><h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Edit3 className="text-blue-600"/>{editId ? 'Perbarui Data' : 'Tambah Data Baru'}</h2><button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 transition outline-none"><X size={26}/></button></div>
            
            <div className="p-8 overflow-y-auto bg-slate-50 custom-scrollbar">
              <form id="dataForm" onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                
                {/* FORM UMROH */}
                {activeTab === "umroh" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div className="flex flex-col"><label className={labelClass}>Nama Paket</label><input type="text" name="title" value={formUmroh.title} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass} required /></div><div className="flex flex-col"><label className={labelClass}>Harga (Rp)</label><input type="text" value={formatInputNumber(formUmroh.price)} onChange={(e) => handleNumberChange(e, setFormUmroh, formUmroh, 'price')} className={inputClass} required /></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"><div className="flex flex-col"><label className={labelClass}>Format Waktu</label><select name="tipeWaktu" value={formUmroh.tipeWaktu} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="bulan">Bulan Saja</option><option value="tanggal">Tanggal Pasti</option></select></div><div className="flex flex-col"><label className={labelClass}>Isi Waktu</label><input type={formUmroh.tipeWaktu==='bulan'?'text':'date'} name="waktuInfo" value={formUmroh.waktuInfo} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass} /></div><div className="flex flex-col"><label className={labelClass}>Durasi</label><input type="text" name="duration" value={formUmroh.duration} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass} /></div><div className="flex flex-col"><label className={labelClass}>Maskapai</label><input type="text" name="maskapai" value={formUmroh.maskapai} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass} /></div></div>
                    <div className="bg-white p-5 rounded-2xl border border-blue-100 flex flex-col gap-5 shadow-sm"><div className="flex items-center gap-4 border-b border-gray-100 pb-3"><label className="text-sm font-bold text-blue-900">Tampilkan Nama Hotel Spesifik?</label><select name="pakaiNamaHotel" value={formUmroh.pakaiNamaHotel} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className="border border-gray-200 py-1.5 px-3 rounded-lg bg-slate-50 text-sm focus:outline-none"><option value="ya">Ya, Tampilkan</option><option value="tidak">Sembunyikan</option></select></div><div className="grid grid-cols-2 gap-6"><div className="flex flex-col"><label className={labelClass}>Nama Hotel Mekah</label><input type="text" name="hotelMekah" value={formUmroh.hotelMekah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} disabled={formUmroh.pakaiNamaHotel === 'tidak'} className={`w-full border p-3 rounded-xl text-sm focus:outline-none transition ${formUmroh.pakaiNamaHotel === 'tidak' ? 'bg-gray-100' : 'bg-slate-50'}`}/></div><div className="flex flex-col"><label className={labelClass}>Bintang Mekah</label><select name="bintangMekah" value={formUmroh.bintangMekah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option></select></div><div className="flex flex-col"><label className={labelClass}>Nama Hotel Madinah</label><input type="text" name="hotelMadinah" value={formUmroh.hotelMadinah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} disabled={formUmroh.pakaiNamaHotel === 'tidak'} className={`w-full border p-3 rounded-xl text-sm focus:outline-none transition ${formUmroh.pakaiNamaHotel === 'tidak' ? 'bg-gray-100' : 'bg-slate-50'}`}/></div><div className="flex flex-col"><label className={labelClass}>Bintang Madinah</label><select name="bintangMadinah" value={formUmroh.bintangMadinah} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option></select></div></div><div className="border-t border-gray-100 pt-4"><label className={labelClass}>Kereta Cepat Haramain?</label><select name="keretaCepat" value={formUmroh.keretaCepat} onChange={(e) => handleChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="tidak">Tidak Tersedia</option><option value="ya">Ya, Termasuk Kereta Cepat</option></select></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div className="flex flex-col"><label className={labelClass}>Pilih Tingkatan Badge</label><select value={formUmroh.badge} onChange={(e) => handleBadgeChange(e, setFormUmroh, formUmroh)} className={inputClass}><option value="Tidak Ada">Tanpa Badge</option><option value="Promo">Promo (Merah)</option><option value="Reguler">Reguler (Biru)</option><option value="Premium">Premium (Ungu)</option><option value="VIP">VIP (Kuning)</option></select></div><div className="flex flex-col"><label className={labelClass}>Upload Gambar Cover</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, null)} className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm outline-none"/></div></div>
                    <div className="col-span-2 border-t border-gray-200 pt-6 mt-2"><label className="text-sm font-bold text-gray-800 uppercase mb-3 block">Deskripsi & Itinerary Utama</label><div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"><JoditEditor value={formUmroh.deskripsi} config={joditConfig} onBlur={(c) => setFormUmroh({...formUmroh, deskripsi: c})} /></div><div className="flex justify-between items-center mt-8 mb-4 border-b border-gray-200 pb-3"><label className="text-sm font-bold text-gray-800 uppercase">Informasi Tambahan</label><button type="button" onClick={() => handleAddInfo(setFormUmroh, formUmroh)} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold flex gap-2 outline-none"><Plus size={16}/> Tambah Info</button></div>{(formUmroh.informasiTambahan || []).map((info, index) => (<div key={index} className="border border-gray-200 rounded-2xl p-5 mb-5 bg-white shadow-sm relative"><button type="button" onClick={() => handleRemoveInfo(setFormUmroh, formUmroh, index)} className="absolute top-5 right-5 text-red-400 hover:text-red-600 transition outline-none"><Trash2 size={18}/></button><input type="text" value={info.judul} onChange={(e) => handleUpdateInfo(setFormUmroh, formUmroh, index, 'judul', e.target.value)} className="border border-gray-200 p-3 rounded-xl w-full mb-4 outline-none font-semibold text-sm" placeholder="Contoh Judul..." /><div className="rounded-xl overflow-hidden border border-gray-200"><JoditEditor value={info.isi} config={{...joditConfig, height: 250}} onBlur={(c) => handleUpdateInfo(setFormUmroh, formUmroh, index, 'isi', c)} /></div></div>))}</div>
                  </div>
                )}

                {/* FORM DOMESTIK */}
                {activeTab === "domestik" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div className="flex flex-col"><label className={labelClass}>Nama Paket Trip</label><input type="text" name="title" value={formDomestik.title} onChange={(e) => handleChange(e, setFormDomestik, formDomestik)} className={inputClass} required/></div><div className="flex flex-col"><label className={`${labelClass} text-blue-600`}>Pilih Daerah Destinasi</label><select name="daerah" value={formDomestik.daerah} onChange={(e) => handleChange(e, setFormDomestik, formDomestik)} className={inputClass} required><option value="">-- Pilih Daerah --</option>{daerahOptions.map((daerah, idx) => (<option key={idx} value={daerah}>{daerah}</option>))}</select></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5"><div className="flex flex-col"><label className={labelClass}>Jenis Trip</label><select name="tipeTrip" value={formDomestik.tipeTrip} onChange={(e) => handleChange(e, setFormDomestik, formDomestik)} className={inputClass}><option value="Open Trip">Open Trip (Per Orang)</option><option value="Private Trip">Private Trip (Grup)</option></select></div><div className="flex flex-col"><label className={labelClass}>Durasi Wisata</label><input type="text" name="duration" value={formDomestik.duration} onChange={(e) => handleChange(e, setFormDomestik, formDomestik)} placeholder="Contoh: 1 Hari" className={inputClass}/></div><div className="flex flex-col"><label className={labelClass}>Fasilitas Hotel (Ops)</label><input type="text" name="hotel" value={formDomestik.hotel} onChange={(e) => handleChange(e, setFormDomestik, formDomestik)} className={inputClass}/></div></div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"><label className="text-sm font-bold text-gray-800 uppercase mb-4 block border-b pb-2">Pengaturan Harga</label><div className="flex flex-col mb-5"><label className={labelClass}>Harga Utama / Termurah</label><input type="text" value={formatInputNumber(formDomestik.price)} onChange={(e) => handleNumberChange(e, setFormDomestik, formDomestik, 'price')} className={inputClass} required placeholder="Contoh: 341000"/></div>
                      {formDomestik.tipeTrip === "Private Trip" && (
                        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-dashed border-gray-300"><div className="flex justify-between items-center mb-2"><label className={labelClass}>Daftar Harga Grup (Private)</label><button type="button" onClick={() => handleAddHarga(setFormDomestik, formDomestik)} className="bg-[#1e3a8a] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Plus size={14}/> Tambah Harga</button></div>
                          {(formDomestik.hargaPrivate || []).map((hp, idx) => (
                            <div key={idx} className="flex items-center gap-3 relative bg-white p-3 rounded-xl border border-gray-100 shadow-sm"><div className="flex-1"><label className="text-[10px] text-gray-400 font-bold mb-1 block">Nominal Harga (Rp)</label><input type="text" value={formatInputNumber(hp.nominal)} onChange={(e) => handleUpdateHarga(setFormDomestik, formDomestik, idx, 'nominal', e.target.value)} className="w-full border-b focus:border-blue-500 outline-none py-1 text-sm font-semibold"/></div><div className="flex-1"><label className="text-[10px] text-gray-400 font-bold mb-1 block">Deskripsi Kapasitas</label><input type="text" value={hp.deskripsi} onChange={(e) => handleUpdateHarga(setFormDomestik, formDomestik, idx, 'deskripsi', e.target.value)} className="w-full border-b focus:border-blue-500 outline-none py-1 text-sm font-semibold"/></div><button type="button" onClick={() => handleRemoveHarga(setFormDomestik, formDomestik, idx)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button></div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"><div className="flex justify-between items-center mb-4 border-b pb-2"><label className="text-sm font-bold text-gray-800 uppercase">Armada Transportasi</label><button type="button" onClick={() => handleAddTransport(setFormDomestik, formDomestik)} className="bg-[#1e3a8a] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Plus size={14}/> Tambah Transport</button></div>
                      <div className="space-y-3">
                        {(formDomestik.transportasi || []).map((tr, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-gray-100"><select value={tr.jenis} onChange={(e) => handleUpdateTransport(setFormDomestik, formDomestik, idx, 'jenis', e.target.value)} className="border border-gray-200 p-2 rounded-lg outline-none text-sm font-semibold bg-white w-1/3"><option value="Bus">Bus Pariwisata</option><option value="Shuttle">Shuttle / Hiace</option><option value="Kereta">Kereta Api</option><option value="Kapal">Kapal Laut</option><option value="Pesawat">Pesawat Udara</option><option value="Jeep">Jeep / Offroad</option></select><input type="text" value={tr.deskripsi} onChange={(e) => handleUpdateTransport(setFormDomestik, formDomestik, idx, 'deskripsi', e.target.value)} className="flex-1 border border-gray-200 p-2 rounded-lg outline-none text-sm bg-white"/><button type="button" onClick={() => handleRemoveTransport(setFormDomestik, formDomestik, idx)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button></div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div className="flex flex-col"><label className={labelClass}>Pilih Tingkatan Badge</label><select value={formDomestik.badge} onChange={(e) => handleBadgeChange(e, setFormDomestik, formDomestik)} className={inputClass}><option value="Tidak Ada">Tanpa Badge</option><option value="Promo">Promo (Merah)</option><option value="Reguler">Reguler (Biru)</option><option value="Premium">Premium (Ungu)</option><option value="VIP">VIP (Kuning)</option></select></div><div className="flex flex-col"><label className={labelClass}>Upload Gambar Cover</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, null)} className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm outline-none"/></div></div>
                    <div className="col-span-2 border-t border-gray-200 pt-6 mt-2"><label className="text-sm font-bold text-gray-800 uppercase mb-3 block">Deskripsi & Itinerary Utama</label><div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"><JoditEditor value={formDomestik.deskripsi} config={joditConfig} onBlur={(c) => setFormDomestik({...formDomestik, deskripsi: c})} /></div><div className="flex justify-between items-center mt-8 mb-4 border-b border-gray-200 pb-3"><label className="text-sm font-bold text-gray-800 uppercase">Informasi Tambahan</label><button type="button" onClick={() => handleAddInfo(setFormDomestik, formDomestik)} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold flex gap-2 outline-none"><Plus size={16}/> Tambah Info</button></div>{(formDomestik.informasiTambahan || []).map((info, index) => (<div key={index} className="border border-gray-200 rounded-2xl p-5 mb-5 bg-white shadow-sm relative"><button type="button" onClick={() => handleRemoveInfo(setFormDomestik, formDomestik, index)} className="absolute top-5 right-5 text-red-400 hover:text-red-600 transition outline-none"><Trash2 size={18}/></button><input type="text" value={info.judul} onChange={(e) => handleUpdateInfo(setFormDomestik, formDomestik, index, 'judul', e.target.value)} className="border border-gray-200 p-3 rounded-xl w-full mb-4 outline-none font-semibold text-sm" placeholder="Contoh Judul: Harga Rombongan..." /><div className="rounded-xl overflow-hidden border border-gray-200"><JoditEditor value={info.isi} config={{...joditConfig, height: 250}} onBlur={(c) => handleUpdateInfo(setFormDomestik, formDomestik, index, 'isi', c)} /></div></div>))}</div>
                  </div>
                )}

                {/* FORM INTERNASIONAL (Ditambahkan) */}
                {activeTab === "internasional" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div className="flex flex-col"><label className={labelClass}>Nama Paket Trip</label><input type="text" name="title" value={formInternasional.title} onChange={(e) => handleChange(e, setFormInternasional, formInternasional)} className={inputClass} required/></div><div className="flex flex-col"><label className={`${labelClass} text-purple-600`}>Pilih Kawasan / Negara Tujuan</label><select name="negara" value={formInternasional.negara} onChange={(e) => handleChange(e, setFormInternasional, formInternasional)} className={inputClass} required><option value="">-- Pilih Negara --</option>{daerahIntOptions.map((daerah, idx) => (<option key={idx} value={daerah}>{daerah}</option>))}</select></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5"><div className="flex flex-col"><label className={labelClass}>Jenis Trip</label><select name="tipeTrip" value={formInternasional.tipeTrip} onChange={(e) => handleChange(e, setFormInternasional, formInternasional)} className={inputClass}><option value="Open Trip">Open Trip (Per Orang)</option><option value="Private Trip">Private Trip (Grup)</option></select></div><div className="flex flex-col"><label className={labelClass}>Durasi Wisata</label><input type="text" name="duration" value={formInternasional.duration} onChange={(e) => handleChange(e, setFormInternasional, formInternasional)} placeholder="Contoh: 5 Hari 4 Malam" className={inputClass}/></div><div className="flex flex-col"><label className={labelClass}>Fasilitas Hotel (Ops)</label><input type="text" name="hotel" value={formInternasional.hotel} onChange={(e) => handleChange(e, setFormInternasional, formInternasional)} className={inputClass}/></div></div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"><label className="text-sm font-bold text-gray-800 uppercase mb-4 block border-b pb-2">Pengaturan Harga</label><div className="flex flex-col mb-5"><label className={labelClass}>Harga Utama / Termurah</label><input type="text" value={formatInputNumber(formInternasional.price)} onChange={(e) => handleNumberChange(e, setFormInternasional, formInternasional, 'price')} className={inputClass} required placeholder="Contoh: 15500000"/></div>
                      {formInternasional.tipeTrip === "Private Trip" && (
                        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-dashed border-gray-300"><div className="flex justify-between items-center mb-2"><label className={labelClass}>Daftar Harga Grup (Private)</label><button type="button" onClick={() => handleAddHarga(setFormInternasional, formInternasional)} className="bg-[#1e3a8a] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Plus size={14}/> Tambah Harga</button></div>
                          {(formInternasional.hargaPrivate || []).map((hp, idx) => (
                            <div key={idx} className="flex items-center gap-3 relative bg-white p-3 rounded-xl border border-gray-100 shadow-sm"><div className="flex-1"><label className="text-[10px] text-gray-400 font-bold mb-1 block">Nominal Harga (Rp)</label><input type="text" value={formatInputNumber(hp.nominal)} onChange={(e) => handleUpdateHarga(setFormInternasional, formInternasional, idx, 'nominal', e.target.value)} className="w-full border-b focus:border-blue-500 outline-none py-1 text-sm font-semibold"/></div><div className="flex-1"><label className="text-[10px] text-gray-400 font-bold mb-1 block">Deskripsi Kapasitas</label><input type="text" value={hp.deskripsi} onChange={(e) => handleUpdateHarga(setFormInternasional, formInternasional, idx, 'deskripsi', e.target.value)} className="w-full border-b focus:border-blue-500 outline-none py-1 text-sm font-semibold"/></div><button type="button" onClick={() => handleRemoveHarga(setFormInternasional, formInternasional, idx)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button></div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"><div className="flex justify-between items-center mb-4 border-b pb-2"><label className="text-sm font-bold text-gray-800 uppercase">Armada Transportasi</label><button type="button" onClick={() => handleAddTransport(setFormInternasional, formInternasional)} className="bg-[#1e3a8a] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Plus size={14}/> Tambah Transport</button></div>
                      <div className="space-y-3">
                        {(formInternasional.transportasi || []).map((tr, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-gray-100"><select value={tr.jenis} onChange={(e) => handleUpdateTransport(setFormInternasional, formInternasional, idx, 'jenis', e.target.value)} className="border border-gray-200 p-2 rounded-lg outline-none text-sm font-semibold bg-white w-1/3"><option value="Pesawat">Pesawat Udara</option><option value="Kereta">Kereta Cepat</option><option value="Kapal">Kapal Feri</option><option value="Bus">Bus Wisata</option><option value="Shuttle">Shuttle</option></select><input type="text" value={tr.deskripsi} onChange={(e) => handleUpdateTransport(setFormInternasional, formInternasional, idx, 'deskripsi', e.target.value)} className="flex-1 border border-gray-200 p-2 rounded-lg outline-none text-sm bg-white"/><button type="button" onClick={() => handleRemoveTransport(setFormInternasional, formInternasional, idx)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button></div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div className="flex flex-col"><label className={labelClass}>Pilih Tingkatan Badge</label><select value={formInternasional.badge} onChange={(e) => handleBadgeChange(e, setFormInternasional, formInternasional)} className={inputClass}><option value="Tidak Ada">Tanpa Badge</option><option value="Promo">Promo (Merah)</option><option value="Reguler">Reguler (Biru)</option><option value="Premium">Premium (Ungu)</option><option value="VIP">VIP (Kuning)</option></select></div><div className="flex flex-col"><label className={labelClass}>Upload Gambar Cover</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, null)} className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm outline-none"/></div></div>
                    <div className="col-span-2 border-t border-gray-200 pt-6 mt-2"><label className="text-sm font-bold text-gray-800 uppercase mb-3 block">Deskripsi & Itinerary Utama</label><div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"><JoditEditor value={formInternasional.deskripsi} config={joditConfig} onBlur={(c) => setFormInternasional({...formInternasional, deskripsi: c})} /></div><div className="flex justify-between items-center mt-8 mb-4 border-b border-gray-200 pb-3"><label className="text-sm font-bold text-gray-800 uppercase">Informasi Tambahan</label><button type="button" onClick={() => handleAddInfo(setFormInternasional, formInternasional)} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold flex gap-2 outline-none"><Plus size={16}/> Tambah Info</button></div>{(formInternasional.informasiTambahan || []).map((info, index) => (<div key={index} className="border border-gray-200 rounded-2xl p-5 mb-5 bg-white shadow-sm relative"><button type="button" onClick={() => handleRemoveInfo(setFormInternasional, formInternasional, index)} className="absolute top-5 right-5 text-red-400 hover:text-red-600 transition outline-none"><Trash2 size={18}/></button><input type="text" value={info.judul} onChange={(e) => handleUpdateInfo(setFormInternasional, formInternasional, index, 'judul', e.target.value)} className="border border-gray-200 p-3 rounded-xl w-full mb-4 outline-none font-semibold text-sm" placeholder="Contoh Judul: Harga Visa..." /><div className="rounded-xl overflow-hidden border border-gray-200"><JoditEditor value={info.isi} config={{...joditConfig, height: 250}} onBlur={(c) => handleUpdateInfo(setFormInternasional, formInternasional, index, 'isi', c)} /></div></div>))}</div>
                  </div>
                )}

                {/* FORM MASTER DAERAH DOMESTIK */}
                {activeTab === "daerah" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="flex flex-col"><label className={labelClass}>Nama Daerah</label><input type="text" name="title" value={formDaerah.title} onChange={(e) => handleChange(e, setFormDaerah, formDaerah)} className={inputClass} required /></div><div className="flex flex-col"><label className={labelClass}>Status Penayangan</label><select name="status" value={formDaerah.status || "Aktif"} onChange={(e) => handleChange(e, setFormDaerah, formDaerah)} className={inputClass}><option value="Aktif">Aktif (Tampil di Web)</option><option value="Nonaktif">Sembunyikan (Draft)</option></select></div></div>
                    <div className="flex flex-col"><label className={labelClass}>Upload Gambar Area</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, null)} className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm outline-none"/></div>
                  </div>
                )}

                {/* FORM MASTER DAERAH INTERNASIONAL */}
                {activeTab === "daerah_internasional" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="flex flex-col"><label className={labelClass}>Nama Kawasan / Negara</label><input type="text" name="title" value={formDaerahInt.title} onChange={(e) => handleChange(e, setFormDaerahInt, formDaerahInt)} className={inputClass} required /></div><div className="flex flex-col"><label className={labelClass}>Status Penayangan</label><select name="status" value={formDaerahInt.status || "Aktif"} onChange={(e) => handleChange(e, setFormDaerahInt, formDaerahInt)} className={inputClass}><option value="Aktif">Aktif (Tampil di Web)</option><option value="Nonaktif">Sembunyikan (Draft)</option></select></div></div>
                    <div className="flex flex-col"><label className={labelClass}>Upload Gambar Negara</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, null)} className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm outline-none"/></div>
                  </div>
                )}

                {/* FORM KEUNGGULAN (MENGAPA, UMROH, DOMESTIK, INTERNASIONAL) */}
                {(activeTab === "mengapa" || activeTab === "keunggulan_umroh" || activeTab === "keunggulan_domestik" || activeTab === "keunggulan_internasional") && (() => {
                  let currentForm, setFormFunc;
                  if (activeTab === "mengapa") { currentForm = formMengapa; setFormFunc = setFormMengapa; }
                  else if (activeTab === "keunggulan_umroh") { currentForm = formKeunggulanUmroh; setFormFunc = setFormKeunggulanUmroh; }
                  else if (activeTab === "keunggulan_domestik") { currentForm = formKeunggulanDomestik; setFormFunc = setFormKeunggulanDomestik; }
                  else if (activeTab === "keunggulan_internasional") { currentForm = formKeunggulanInt; setFormFunc = setFormKeunggulanInt; }
                  
                  return (
                    <div className="col-span-2 flex flex-col gap-6">
                      <div className={`grid grid-cols-1 ${activeTab === 'mengapa' ? 'md:grid-cols-2' : ''} gap-6`}>
                        <div className="flex flex-col"><label className={labelClass}>Judul Keunggulan</label><input type="text" name="title" value={currentForm.title} onChange={(e) => handleChange(e, setFormFunc, currentForm)} className={inputClass} required /></div>
                        {activeTab === 'mengapa' && (<div className="flex flex-col"><label className={labelClass}>Warna Ikon</label><select name="color" value={currentForm.color} onChange={(e) => handleChange(e, setFormFunc, currentForm)} className={inputClass}>{colorOptions}</select></div>)}
                      </div>
                      <div className="flex flex-col"><label className={labelClass}>Deskripsi Pendek</label><textarea name="deskripsi" value={currentForm.deskripsi} onChange={(e) => handleChange(e, setFormFunc, currentForm)} rows="3" className={inputClass} required></textarea></div>
                      <div className="flex flex-col p-5 bg-white border border-gray-100 rounded-2xl shadow-sm"><label className={labelClass}>Pilih Ikon</label>{renderIconSelector(currentForm.icon, (val) => setFormFunc({...currentForm, icon: val}))}</div>
                    </div>
                  );
                })()}

                {/* FORM BERITA */}
                {activeTab === "berita" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="flex flex-col md:col-span-2"><label className={labelClass}>Judul Artikel / Berita</label><input type="text" name="title" value={formBerita.title} onChange={(e) => handleChange(e, setFormBerita, formBerita)} className={inputClass} required /></div><div className="flex flex-col"><label className={labelClass}>Tanggal Rilis</label><input type="date" name="date" value={formBerita.date} onChange={(e) => handleChange(e, setFormBerita, formBerita)} className={inputClass} required /></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="flex flex-col"><label className={labelClass}>Tipe Trip (Divisi)</label><select name="tipe" value={formBerita.tipe} onChange={(e) => handleChange(e, setFormBerita, formBerita)} className={inputClass}><option value="Umroh">Divisi Umroh</option><option value="Domestik">Divisi Domestik</option><option value="Internasional">Divisi Internasional</option></select></div><div className="flex flex-col"><label className={labelClass}>Kategori Konten</label><select name="category" value={formBerita.category} onChange={(e) => handleChange(e, setFormBerita, formBerita)} className={inputClass}><option value="Berita">Berita & Pengumuman</option><option value="Kegiatan Jamaah">Kegiatan Jamaah</option><option value="Promo & Info">Promo Khusus</option><option value="Tips Liburan">Tips Perjalanan</option></select></div><div className="flex flex-col"><label className={labelClass}>Upload Gambar Cover</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, null)} className="w-full border border-gray-200 p-2.5 rounded-xl bg-slate-50 text-sm outline-none"/></div></div>
                    <div className="flex flex-col border-t border-gray-200 pt-6 mt-2"><label className="text-sm font-bold text-gray-800 uppercase mb-3 block">Isi Artikel</label><div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"><JoditEditor value={formBerita.text} config={{...joditConfig, height: 400}} onBlur={(c) => setFormBerita({...formBerita, text: c})} /></div></div>
                  </div>
                )}

                {/* FORM LAYANAN */}
                {activeTab === "layanan" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="flex flex-col"><label className={labelClass}>Judul Layanan</label><input type="text" name="title" value={formLayanan.title} onChange={(e) => handleChange(e, setFormLayanan, formLayanan)} className={inputClass} required /></div><div className="flex flex-col"><label className={labelClass}>Link Saat di Klik</label><select name="link" value={formLayanan.link} onChange={(e) => handleChange(e, setFormLayanan, formLayanan)} className={inputClass}><option value="/domestik">Halaman Domestik</option><option value="/internasional">Halaman Internasional</option><option value="/umroh">Halaman Umroh</option><option value="#">Kosongkan</option></select></div></div>
                    <div className="flex flex-col"><label className={labelClass}>Deskripsi Singkat</label><textarea name="deskripsi" value={formLayanan.deskripsi} onChange={(e) => handleChange(e, setFormLayanan, formLayanan)} rows="2" className={inputClass} required></textarea></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm"><div className="flex flex-col"><label className={labelClass}>Warna Latar Ikon</label><select name="color" value={formLayanan.color} onChange={(e) => handleChange(e, setFormLayanan, formLayanan)} className={inputClass}>{colorOptions}</select></div><div className="flex flex-col"><label className={labelClass}>Gambar Latar Kartu</label><input type="file" onChange={(e) => handleImageUpload(e, null, null, null, null)} className="w-full border border-gray-200 p-2 rounded-xl bg-slate-50 text-sm outline-none"/></div><div className="md:col-span-2"><label className={labelClass}>Pilih Ikon Visual</label>{renderIconSelector(formLayanan.icon, (val) => setFormLayanan({...formLayanan, icon: val}))}</div></div>
                  </div>
                )}

                {/* FORM TESTIMONI */}
                {activeTab === "testimoni" && (
                  <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="flex flex-col"><label className={labelClass}>Nama Pelanggan</label><input type="text" name="name" value={formTestimoni.name} onChange={(e) => handleChange(e, setFormTestimoni, formTestimoni)} className={inputClass} required /></div><div className="flex flex-col"><label className={labelClass}>Layanan / Paket</label><input type="text" name="service" value={formTestimoni.service} onChange={(e) => handleChange(e, setFormTestimoni, formTestimoni)} className={inputClass} required /></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="flex flex-col"><label className={labelClass}>Foto Profil Pelanggan</label><input type="file" onChange={handleTestiImage} className="w-full border border-gray-200 p-2 rounded-xl bg-slate-50 text-sm outline-none"/></div><div className="flex flex-col"><label className={labelClass}>Rating Penilaian</label><select name="stars" value={formTestimoni.stars} onChange={(e) => handleChange(e, setFormTestimoni, formTestimoni)} className={inputClass}><option value="5">⭐⭐⭐⭐⭐ (Sangat Puas)</option><option value="4">⭐⭐⭐⭐ (Puas)</option><option value="3">⭐⭐⭐ (Cukup)</option></select></div></div>
                    <div className="flex flex-col"><div className="flex justify-between items-center mb-1.5"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pesan / Komentar</label><span className={`text-xs font-bold ${formTestimoni.text.length >= 150 ? 'text-red-500' : 'text-blue-600'}`}>{formTestimoni.text.length}/150 Karakter</span></div><textarea name="text" value={formTestimoni.text} onChange={(e) => handleChange(e, setFormTestimoni, formTestimoni)} rows="3" maxLength="150" className={inputClass} required></textarea></div>
                  </div>
                )}
                
              </form>
            </div>
            
            <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0"><button onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl transition text-sm outline-none">Batal</button><button form="dataForm" type="submit" disabled={isSubmitting || isUploading} className="px-6 py-2.5 bg-[#1e3a8a] text-white font-medium rounded-xl shadow-md text-sm outline-none">Simpan Data</button></div>
          </div>
        </div>
      )}

      {/* INDIKATOR UPLOAD GAMBAR GLOBAL */}
      {isUploading && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-[200] bg-white rounded-full shadow-2xl border border-blue-100 px-6 py-3 flex items-center gap-3 animate-pulse">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-[#1e3a8a]"></div>
          <span className="text-sm font-bold text-[#1e3a8a]">Sedang mengunggah gambar ke server... Mohon tunggu.</span>
        </div>
      )}

      {/* MODAL NOTIFIKASI (CUSTOM ALERT) */}
      {customAlert.show && (
        <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className={`p-8 text-center border-t-8 ${customAlert.type === 'error' ? 'border-red-500' : customAlert.type === 'confirm' ? 'border-orange-500' : 'border-emerald-500'}`}>
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 ${customAlert.type === 'error' ? 'bg-red-50 text-red-500' : customAlert.type === 'confirm' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                {customAlert.type === 'error' ? <X size={40} /> : customAlert.type === 'confirm' ? <Info size={40} /> : <CheckCircle size={40} />}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{customAlert.type === 'error' ? 'Gagal Menyimpan' : customAlert.type === 'confirm' ? 'Konfirmasi Aksi' : 'Berhasil!'}</h3>
              <p className="text-sm text-gray-600 mb-8">{customAlert.message}</p>
              <div className="flex justify-center gap-3">
                {customAlert.type === 'confirm' && (<button onClick={closeAlert} className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl transition hover:bg-gray-200">Batal</button>)}
                <button onClick={() => { if (customAlert.onConfirm) customAlert.onConfirm(); closeAlert(); }} className={`flex-1 px-5 py-3 font-bold text-white rounded-xl transition shadow-lg ${customAlert.type === 'error' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : customAlert.type === 'confirm' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'}`}>
                  {customAlert.type === 'confirm' ? 'Ya, Lanjutkan' : 'Tutup'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;