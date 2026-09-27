import { useState } from "react";
import { createPortal } from "react-dom";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "../firebase";
import { Key, Lock, Eye, EyeOff, X, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";

function GantiPasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUser = auth.currentUser;
  const currentUsername = currentUser?.email ? currentUser.email.split("@")[0] : "Admin";

  const resetForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setShowOld(false);
    setShowNew(false);
  };

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password baru minimal harus 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("Password baru tidak boleh sama dengan password lama.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        setError("Sesi login tidak ditemukan. Silakan login ulang.");
        setLoading(false);
        return;
      }

      // 1. Verifikasi Password Lama ke Firebase
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // 2. Simpan Password Baru
      await updatePassword(user, newPassword);

      setSuccess("Password Anda berhasil diperbarui!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Tutup modal otomatis setelah 2 detik
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Password lama yang Anda masukkan salah.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat.");
      } else {
        setError("Gagal mengganti password. Pastikan password lama Anda benar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TOMBOL PEMICU DI SIDEBAR ADMIN (Serasi dengan tombol Keluar Sistem) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 py-2.5 rounded-xl transition"
      >
        <Key size={16} className="text-[#f59e0b]" />
        <span className="text-sm font-bold">Ganti Password</span>
      </button>

      {/* MODAL POP-UP GANTI PASSWORD */}
      {isOpen && createPortal(
        <div 
          onClick={handleClose}
          className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 my-auto"
          >
            {/* Header Modal */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/15 p-2.5 rounded-xl border border-white/10">
                  <ShieldCheck size={22} className="text-[#f59e0b]" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Ganti Password Akun</h3>
                  <p className="text-[11px] text-blue-200 mt-0.5">
                    Login sebagai: <span className="font-bold text-[#f59e0b]">@{currentUsername}</span>
                  </p>
                </div>
              </div>
              <button onClick={handleClose} className="text-white/70 hover:text-white p-1 transition">
                <X size={22} />
              </button>
            </div>

            {/* Isi Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-start gap-2.5">
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5">
                  <CheckCircle size={18} className="shrink-0 text-emerald-500" />
                  <span>{success}</span>
                </div>
              )}

              {/* Input Password Lama */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Password Saat Ini (Lama)
                </label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan password saat ini..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:border-[#1e3a8a] outline-none text-sm font-semibold"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showOld ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-2"></div>

              {/* Input Password Baru */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Password Baru (Min. 6 Karakter)
                </label>
                <div className="relative">
                  <Key size={17} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:border-[#1e3a8a] outline-none text-sm font-semibold"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password Baru */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Ulangi Password Baru
                </label>
                <div className="relative">
                  <Key size={17} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password baru..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:border-[#1e3a8a] outline-none text-sm font-semibold"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              {/* Tombol Simpan & Batal */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-[#f59e0b] hover:bg-yellow-600 text-white font-bold text-xs shadow-lg shadow-yellow-500/20 transition disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Password"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default GantiPasswordModal;