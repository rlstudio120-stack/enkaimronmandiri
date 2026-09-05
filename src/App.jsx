import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Umroh from "./components/Umroh";
import Domestik from "./components/Domestik";
import AdminDashboard from "./components/AdminDashboard";
import PackageDetail from "./components/PackageDetail";

// 1. Membuat Wadah untuk Halaman Publik (yang butuh Navbar & Footer)
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

function App() {
  return (
    // 2. Membungkus seluruh aplikasi dengan BrowserRouter
    <BrowserRouter>
      <Routes>
        {/* Kelompok Halaman Publik */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/umroh" element={<Umroh />} />
          <Route path="/domestik" element={<Domestik />} />
          <Route path="/paket/:type/:id" element={<PackageDetail />} />
        </Route>

        {/* Halaman Admin (Berdiri Sendiri, Tanpa Navbar/Footer) */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;