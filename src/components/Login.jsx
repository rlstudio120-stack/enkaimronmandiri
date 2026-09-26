import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowLeft, ShieldCheck } from "lucide-react";

function Login() {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login Pengelola | Enka Imron Mandiri";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Jika input tidak memakai '@', otomatis tambahkan domain internal @enkaimron.id
      const cleanInput = usernameInput.trim().toLowerCase();
      const loginEmail = cleanInput.includes("@") ? cleanInput : `${cleanInput}@enkaimron.id`;

      // 2. Proses Login ke Firebase Auth
      const userCred = await signInWithEmailAndPassword(auth, loginEmail, password);

      // 3. Cek Status Akun di Tabel users_admin (Apakah Aktif atau Nonaktif)
      const q = query(collection(db, "users_admin"), where("email", "==", userCred.user.email));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const userData = snap.docs[0].data();
        if (userData.status === "Nonaktif") {
          await signOut(auth);
          setError("Akses Ditolak: Akun Anda sedang dinonaktifkan oleh Super Admin.");
          setLoading(false);
          return;
        }
      }

      // 4. Jika aman & aktif, arahkan ke Dashboard Admin
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Username atau Password yang Anda masukkan salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Dekorasi Latar Belakang */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1e3a8a] rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#f59e0b] rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-gray-100">
        
        {/* Header Login */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] p-8 text-center text-white relative">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck size={34} className="text-[#f59e0b]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wide">PORTAL ADMIN</h1>
          <p className="text-blue-200 text-xs mt-1 font-medium">Sistem Manajemen Enka Imron Mandiri</p>
        </div>

        {/* Form Login */}
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3.5 rounded-xl text-xs font-bold flex items-start gap-2.5 animate-pulse">
              <ShieldAlert size={18} className="shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Masukkan username Anda..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none text-sm font-semibold transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none text-sm font-semibold transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 p-0.5 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-yellow-500/30 transition-all text-sm mt-2 disabled:opacity-50"
            >
              {loading ? "Memverifikasi Akses..." : "Masuk ke Dashboard"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#1e3a8a] transition-colors">
              <ArrowLeft size={14} /> Kembali ke Halaman Utama Website
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;