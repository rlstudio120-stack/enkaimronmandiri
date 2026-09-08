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
import PackageDetail from "./components/PackageDetail";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import DomestikDaerah from "./components/DomestikDaerah";

// --- WADAH AREA PUBLIK ---
// Mengembalikan Navbar dan Footer yang sebelumnya hilang
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
          <Route path="/paket/:type/:id" element={<PackageDetail />} />
          <Route path="/domestik/daerah/:namaDaerah" element={<DomestikDaerah />} />
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