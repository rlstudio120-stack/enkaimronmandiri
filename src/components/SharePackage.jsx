import { useState } from "react";
import { createPortal } from "react-dom";
import { Share2, Copy, Check, X, Sparkles } from "lucide-react";

function SharePackage({ title, price, duration, kategori, infoTambahan }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const currentUrl = window.location.href;

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const shareText = `✨ *Rekomendasi ${kategori || "Paket Perjalanan"} — Enka Imron Mandiri* ✨\n\n📌 *${title}*\n${infoTambahan ? `📍 ${infoTambahan}\n` : ""}⏱️ Durasi: ${duration || "-"}\n💰 Harga Mulai: *${formatRupiah(price)} /pax*\n\nLihat rincian itinerary dan fasilitas lengkapnya di sini:\n👇\n${currentUrl}`;

  // 1. Fungsi Share ke WhatsApp
  const handleShareWA = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank");
  };

  // 2. Fungsi Share ke Facebook
  const handleShareFB = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, "_blank", "width=600,height=500");
  };

  // 3. Fungsi Share ke Instagram & Aplikasi HP
  const handleShareIG = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Enka Imron Mandiri`,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        // User membatalkan share
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);
      alert("Teks promosi & Link paket telah disalin! Silakan tempel (Paste) di DM atau Story Instagram Anda.");
      window.open("https://www.instagram.com/", "_blank");
    }
  };

  // 4. Fungsi Salin Link Saja
  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // 5. Fungsi Salin Teks Broadcast Lengkap
  const handleCopyCaption = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <>
      {/* TOMBOL PEMICU SHARE */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full bg-slate-100 hover:bg-slate-200 text-gray-700 hover:text-[#1e3a8a] font-bold py-3.5 rounded-xl transition-colors text-xs md:text-sm flex items-center justify-center gap-2 border border-gray-200"
      >
        <Share2 size={17} className="text-[#1e3a8a]" /> Bagikan Paket Ini
      </button>

      {/* MODAL POP-UP (Menggunakan Portal agar tampil tepat di tengah layar & di atas Navbar) */}
      {isOpen && createPortal(
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 my-auto"
          >
            {/* Header Modal */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#1e3a8a] to-blue-800 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="bg-white/15 p-2 rounded-xl">
                  <Share2 size={18} className="text-[#f59e0b]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base leading-tight">Bagikan Paket Perjalanan</h3>
                  <p className="text-[11px] text-blue-200">Kirim info paket ini ke keluarga atau kerabat</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Preview Singkat Paket */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-100 text-left">
                <p className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider mb-0.5">{kategori}</p>
                <h4 className="font-bold text-gray-800 text-sm line-clamp-1 mb-0.5">{title}</h4>
                <p className="text-xs font-extrabold text-[#1e3a8a]">{formatRupiah(price)} <span className="font-normal text-gray-500">/pax</span></p>
              </div>

              {/* 3 Tombol Utama Sosial Media */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 text-center">
                  Pilih Media Sosial
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={handleShareWA}
                    className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition group"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-1.5 shadow-md group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.625.846 5.059 2.284 7.033l-1.494 4.455 4.606-1.454c1.916 1.242 4.195 1.966 6.604 1.966 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold">WhatsApp</span>
                    <span className="text-[9px] text-emerald-600">Grup / Teman</span>
                  </button>

                  {/* Instagram */}
                  <button
                    type="button"
                    onClick={handleShareIG}
                    className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 transition group"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center mb-1.5 shadow-md group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold">Instagram</span>
                    <span className="text-[9px] text-pink-600">DM / Story</span>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={handleShareFB}
                    className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition group"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center mb-1.5 shadow-md group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold">Facebook</span>
                    <span className="text-[9px] text-blue-600">Beranda / Grup</span>
                  </button>
                </div>
              </div>

              {/* Tombol Salin Caption & Link */}
              <div className="pt-2 border-t border-gray-100 space-y-2.5">
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                    copiedCaption 
                      ? "bg-emerald-600 text-white border-emerald-600" 
                      : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200"
                  }`}
                >
                  {copiedCaption ? (
                    <><Check size={16} /> Teks Promosi & Link Berhasil Disalin!</>
                  ) : (
                    <><Sparkles size={16} className="text-[#f59e0b]" /> Salin Teks Broadcast Promosi + Link</>
                  )}
                </button>

                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-gray-200">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="w-full bg-transparent text-xs text-gray-500 px-2.5 outline-none truncate font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                      copiedLink ? "bg-emerald-600 text-white" : "bg-[#1e3a8a] hover:bg-blue-800 text-white"
                    }`}
                  >
                    {copiedLink ? <><Check size={14} /> Tersalin</> : <><Copy size={14} /> Salin Link</>}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default SharePackage;