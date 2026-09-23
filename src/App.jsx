import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Import Komponen Halaman
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Umroh from "./components/Umroh";
import Domestik from "./components/Domestik";
import Internasional from "./components/Internasional";
import PackageDetail from "./components/PackageDetail";
import DetailDomestik from "./components/DetailDomestik"; // <-- IMPORT HALAMAN BARU DOMESTIK
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import DomestikDaerah from "./components/DomestikDaerah";
import News from "./components/News"; 
import NewsDetail from "./components/NewsDetail"; 
import SemuaDestinasi from "./components/SemuaDestinasi";
import SemuaPaketUmroh from "./components/SemuaPaketUmroh";
import SemuaDestinasiInt from "./components/SemuaDestinasiInt";
import SemuaPaketInt from "./components/SemuaPaketInt";
import DetailInternasional from "./components/DetailInternasional";

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

// --- KOMPONEN PELINDUNG (PROTECTED ROUTE) ---
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
          <Route path="/umroh" element={<Umroh />} />
          <Route path="/domestik" element={<Domestik />} />
          <Route path="/domestik/destinasi" element={<SemuaDestinasi />} />
          <Route path="/internasional" element={<Internasional />} />
          
          {/* RUTE PAKET DOMESTIK BARU */}
          <Route path="/paket/domestik/:id" element={<DetailDomestik />} />
          
          {/* RUTE PAKET UMUM (Umroh/Internasional) */}
          <Route path="/paket/:type/:id" element={<PackageDetail />} />
          <Route path="/domestik/daerah/:namaDaerah" element={<DomestikDaerah />} />
          <Route path="/berita" element={<News />} />
          <Route path="/berita/:id" element={<NewsDetail />} />
          <Route path="/umroh/paket" element={<SemuaPaketUmroh />} />
          <Route path="/internasional/destinasi" element={<SemuaDestinasiInt />} />
          <Route path="/internasional/paket" element={<SemuaPaketInt />} />
          <Route path="/paket/internasional/:id" element={<DetailInternasional />} />
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