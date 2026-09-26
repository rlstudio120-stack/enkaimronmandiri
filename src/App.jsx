import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";

// Import Komponen Umum
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import NotFound from "./components/NotFound"; // <-- IMPORT HALAMAN 404

// Import Divisi Umroh
import Umroh from "./components/Umroh";
import SemuaPaketUmroh from "./components/SemuaPaketUmroh";
import PackageDetail from "./components/PackageDetail";

// Import Divisi Domestik
import Domestik from "./components/Domestik";
import SemuaDestinasi from "./components/SemuaDestinasi";
import DomestikDaerah from "./components/DomestikDaerah";
import DetailDomestik from "./components/DetailDomestik";

// Import Divisi Internasional
import Internasional from "./components/Internasional";
import SemuaDestinasiInt from "./components/SemuaDestinasiInt";
import SemuaPaketInt from "./components/SemuaPaketInt";
import DetailInternasional from "./components/DetailInternasional";

// Import Informasi & Profil
import News from "./components/News"; 
import NewsDetail from "./components/NewsDetail"; 
import TentangKami from "./components/TentangKami";
import SyaratKetentuan from "./components/SyaratKetentuan";
import Faq from "./components/Faq";

// --- WADAH AREA PUBLIK ---
function PublicLayout() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

// --- KOMPONEN PELINDUNG (PROTECTED ROUTE DENGAN CEK STATUS NONAKTIF) ---
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const q = query(collection(db, "users_admin"), where("email", "==", currentUser.email));
          const snap = await getDocs(q);
          if (!snap.empty && snap.docs[0].data().status === "Nonaktif") {
            await signOut(auth);
            setUser(null);
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-xl font-bold text-[#1e3a8a]">Memuat Sistem Keamanan...</div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

// --- APLIKASI UTAMA ---
function App() {
  return (
    <Router>
      <Routes>
        
        {/* === AREA PUBLIK === */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          
          {/* 1. RUTE DIVISI UMROH */}
          <Route path="/umroh" element={<Umroh />} />
          <Route path="/umroh/paket" element={<SemuaPaketUmroh />} />
          
          {/* 2. RUTE DIVISI DOMESTIK */}
          <Route path="/domestik" element={<Domestik />} />
          <Route path="/domestik/destinasi" element={<SemuaDestinasi />} />
          <Route path="/domestik/daerah/:namaDaerah" element={<DomestikDaerah />} />
          <Route path="/domestik/paket" element={<DomestikDaerah />} />
          <Route path="/paket/domestik/:id" element={<DetailDomestik />} />
          
          {/* 3. RUTE DIVISI INTERNASIONAL */}
          <Route path="/internasional" element={<Internasional />} />
          <Route path="/internasional/destinasi" element={<SemuaDestinasiInt />} />
          <Route path="/internasional/destinasi/:namaKawasan" element={<SemuaPaketInt />} />
          <Route path="/internasional/paket" element={<SemuaPaketInt />} />
          <Route path="/paket/internasional/:id" element={<DetailInternasional />} />

          {/* RUTE DETAIL PAKET UMROH (Fallback Umum) */}
          <Route path="/paket/:type/:id" element={<PackageDetail />} />
          
          {/* 4. RUTE BERITA & PROFIL */}
          <Route path="/berita" element={<News />} />
          <Route path="/berita/:id" element={<NewsDetail />} />
          <Route path="/tentang" element={<TentangKami />} />
          <Route path="/syarat" element={<SyaratKetentuan />} />
          <Route path="/faq" element={<Faq />} />

          {/* 5. RUTE PENANGKAP 404 (JIKA URL TIDAK DITEMUKAN) */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* === AREA LOGIN === */}
        <Route path="/login" element={<Login />} />

        {/* === AREA ADMIN TERLINDUNGI === */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </Router>
  );
}

export default App;