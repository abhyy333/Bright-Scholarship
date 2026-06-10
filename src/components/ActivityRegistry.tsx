import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckSquare, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Info,
  Layers,
  Sparkles,
  Award,
  Upload,
  Trash2,
  Image,
  Check
} from "lucide-react";
import { Activity, AwardeeProfile, UserRole } from "../types";

interface ActivityRegistryProps {
  activities: Activity[];
  awardees: AwardeeProfile[];
  onAddActivity: (newAct: Activity, involvedAwardeeIds: string[], hours: number) => void;
  currentRole: UserRole;
  onDeleteActivity?: (activityId: string) => void;
}

export default function ActivityRegistry({ 
  activities, 
  awardees, 
  onAddActivity, 
  currentRole,
  onDeleteActivity 
}: ActivityRegistryProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showInvolvedAwardees, setShowInvolvedAwardees] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (deleteConfirmId) {
      const timer = setTimeout(() => {
        setDeleteConfirmId(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [deleteConfirmId]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Field States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<Activity["category"]>("Pengabdian Masyarakat");
  const [location, setLocation] = useState("");
  const [hoursEarned, setHoursEarned] = useState(8);
  const [selectedAwardees, setSelectedAwardees] = useState<string[]>([]);
  const [mediaUrl, setMediaUrl] = useState("https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=600&q=80");

  // Proof image upload states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);

  const unspashPresets = [
    { label: "Pengabdian Desa", url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80" },
    { label: "Diskusi Asrama", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80" },
    { label: "Pendidikan & Anak", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80" },
    { label: "Analisis Keuangan", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80" }
  ];

  const handleToggleAwardee = (awardeeId: string) => {
    if (selectedAwardees.includes(awardeeId)) {
      setSelectedAwardees(selectedAwardees.filter(id => id !== awardeeId));
    } else {
      setSelectedAwardees([...selectedAwardees, awardeeId]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("BATAL UNGGAH: Format file bukan gambar. Silakan masukkan format gambar valid (PNG, JPG, JPEG, atau WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMediaUrl(event.target.result as string);
        setUploadedImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImageName(null);
    setMediaUrl("https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=600&q=80");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    // Dynamic Server-side RBAC verification simulating real Firestore Rules!
    if (currentRole !== "admin") {
      setErrorMessage("TRANSAKSI BATAL: Hak akses ditolak. Hanya peran 'admin' yang dizinkan meluncurkan kegiatan baru demi integritas akumulasi jam kerja sosial asrama.");
      return;
    }

    const involvedAwardees = awardees.map(aw => aw.awardeeId);

    if (involvedAwardees.length === 0) {
      setErrorMessage("BATAL: Tidak ada awardee terdaftar untuk menerima kredit jam.");
      return;
    }

    const newActivity: Activity = {
      activityId: "act-" + Math.random().toString(36).substring(2, 9),
      title,
      description,
      date,
      category,
      location,
      hoursEarned,
      awardeesInvolved: involvedAwardees,
      mediaUrl,
      createdBy: "admin-1",
      createdAt: new Date().toISOString()
    };

    // Callback triggers atomic addition + increments hours of marked awardees in the core parent state!
    onAddActivity(newActivity, involvedAwardees, hoursEarned);

    // Clear Form Fields
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    setSelectedAwardees([]);
    setUploadedImageName(null);
    setShowAddForm(false);
    
     setSuccessMessage(`PROGRAM TELAH LOGGED: '${newActivity.title}' berhasil didaftarkan! +${hoursEarned} Jam Pembinaan didelegasikan otomatis ke seluruh (${involvedAwardees.length}) Awardee.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Dynamic Alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs md:text-sm flex items-start gap-3 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <div>
            <span className="font-bold block text-slate-800 text-xs uppercase tracking-wider mb-0.5">Transaksi NoSQL Berhasil</span>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 font-semibold text-xs md:text-sm flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-655 text-red-600" />
          <div>
            <span className="font-bold block text-slate-800 text-xs uppercase tracking-wider mb-0.5">Sistem Memblokir Tulisan</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl font-extrabold text-blue-950 tracking-tight">Timeline & Logbook Program</h2>
          <p className="text-slate-600 text-xs mt-1 max-w-2xl leading-normal font-sans">
            Pencatatan berkala program pembinaan (pembinaan karakter, tahfidz quran, pembinaan soft skill, kegiatan sosial) dan proyek kerelaan sosial. Setiap agenda melampirkan jam kredit untuk memantau dampak.
          </p>
        </div>
        
        {currentRole === "admin" && (
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-700 to-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm hover:brightness-105 transition-all cursor-pointer shrink-0 select-none"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Tutup Form" : "Log Kegiatan Baru"}</span>
          </button>
        )}
      </div>

      {/* ADMIN LOG ACTIVITIES FORM */}
      {showAddForm && currentRole === "admin" && (
        <div className="bg-white border border-slate-205 rounded-xl p-5 md:p-6 shadow-xs animate-scale-up">
          <div className="flex items-center justify-between pb-3 border-b border-slate-205 mb-5">
            <div className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Logbook Agenda Baru (Otorisasi: Admin)</span>
            </div>
            <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold font-mono uppercase">
              DATABASE: WRITE_SECURE
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-xs font-sans">
            {/* Left Fields Column */}
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold font-sans">Judul Kegiatan / Nama Program *</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Youth Tech Bootcamp: Mengajar Anak Panti..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-slate-250 p-2.5 rounded text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none shadow-xs"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold font-sans">Uraian / Deskripsi Dampak Proyek *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Gambarkan pelaksanaan, desa sasaran, dan pencapaian kuantitatif program asrama ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-slate-250 p-2.5 rounded text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none shadow-xs"
                />
              </div>

              {/* Proof Image Upload & Presets */}
              <div className="space-y-3">
                <label className="text-slate-600 font-bold block">Foto Bukti Kegiatan / Dokumentasi *</label>

                {/* Drag and Drop Zone */}
                <div 
                  id="activity-dropzone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-all relative ${
                    isDragging 
                      ? "border-blue-500 bg-blue-50/50 scale-[1.01]" 
                      : uploadedImageName 
                        ? "border-emerald-500 bg-emerald-50/20" 
                        : "border-slate-300 hover:border-blue-400 bg-slate-50/50"
                  }`}
                >
                  <input
                    type="file"
                    id="evidence-file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Unggah foto bukti kegiatan"
                  />
                  
                  {mediaUrl && (uploadedImageName || mediaUrl.startsWith("data:")) ? (
                    <div className="flex flex-col items-center gap-2 relative z-20">
                      <div className="relative group max-w-full">
                        <img 
                          src={mediaUrl} 
                          alt="Preview bukti" 
                          referrerPolicy="no-referrer"
                          className="w-full max-h-32 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          id="remove-proof-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveUploadedImage();
                          }}
                          className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-full shadow-md transition-colors cursor-pointer select-none"
                          title="Hapus foto bukti"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium font-mono text-center truncate max-w-full">
                        {uploadedImageName || "Foto Kustom Unggahan"}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>Foto berhasil dilampirkan sebagai bukti valid</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2 gap-2 text-slate-500">
                      <div className="p-2.5 bg-white rounded-full shadow-xs border border-slate-200">
                        <Upload className="w-5 h-5 text-blue-600 animate-bounce" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700">Tarik & Lepas foto bukti kemari</p>
                        <p className="text-[10px] text-slate-400">Atau klik untuk browsing dari komputer Anda</p>
                      </div>
                      <div className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">
                        PNG, JPG, JPEG, WEBP (Maks. 5MB)
                      </div>
                    </div>
                  )}
                </div>

                {/* Preset choices as quick alternatives */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Atau Pilih Preset Cepat</span>
                    {mediaUrl && !uploadedImageName && !mediaUrl.startsWith("data:") && (
                      <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded font-bold font-mono">
                        Preset Aktif
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {unspashPresets.map((img, i) => {
                      const isSelected = mediaUrl === img.url && !uploadedImageName;
                      return (
                        <button
                          type="button"
                          id={`preset-btn-${i}`}
                          key={i}
                          onClick={() => {
                            setMediaUrl(img.url);
                            setUploadedImageName(null);
                          }}
                          className={`p-2 rounded text-left border rounded-lg overflow-hidden transition-all text-[11px] font-semibold flex items-center justify-between cursor-pointer font-sans shadow-xs ${
                            isSelected 
                              ? "bg-blue-50/60 border-blue-600 text-blue-900 font-bold" 
                              : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate">{img.label}</span>
                          {isSelected && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse shrink-0"></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Fields Column */}
            <div className="space-y-4">
              {/* Date & Hours & Classifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold font-sans">Tanggal Pelaksanaan *</label>
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-slate-250 p-2.5 rounded text-slate-800 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-105 outline-none font-sans shadow-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold font-sans">Durasi/Lama Kegiatan *</label>
                  <input 
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={hoursEarned}
                    onChange={(e) => setHoursEarned(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-250 p-2.5 rounded text-slate-800 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-105 outline-none font-sans shadow-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold block">Kategori Kegiatan *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Activity["category"])}
                    className="w-full bg-white border border-slate-250 p-2.5 rounded text-slate-800 font-medium focus:border-blue-505 focus:ring-1 focus:ring-blue-100 outline-none font-sans shadow-xs cursor-pointer"
                  >
                    <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
                    <option value="Pembinaan">Pembinaan (Karakter, Tahfidz, Soft Skill, Sosial)</option>
                    <option value="Capacity Building">Capacity Building</option>
                    <option value="Lainnya">Lainnya / Umum</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold font-sans">Lokasi Agenda *</label>
                  <input 
                    type="text"
                    required
                    placeholder="E.g., Desa Sukarara, Lombok"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-slate-250 p-2.5 rounded text-slate-800 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-105 outline-none font-sans shadow-xs"
                  />
                </div>
              </div>

              {/* Auto Awardee Delivery Notice */}
              <div className="space-y-1.5 bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                <span className="text-[11px] font-bold text-blue-900 block font-sans">Delegasi Jam Kredit Otomatis</span>
                <p className="text-[10px] text-slate-600 leading-normal font-sans">
                  Dengan ditiadakannya pilihan manual, transaksi ini akan otomatis mencatat jam kredit/pengabdian baru dan mendistribusikannya secara langsung kepada <b>seluruh ({awardees.length}) awardee</b> yang terdaftar pada sistem Bright Scholarship saat disimpan.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded cursor-pointer select-none border border-slate-250 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-700 to-emerald-600 text-white font-extrabold rounded cursor-pointer select-none hover:brightness-105 shadow-sm text-xs"
                >
                  Simpan Transaksi Ke Database
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ACTIVITIES GALLERY GRID DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((act) => {
          // Get beautiful category-specific colors
          let categoryColor = "bg-blue-50 border-blue-200 text-blue-700";
          if (act.category === "Pembinaan") {
            categoryColor = "bg-indigo-50 border-indigo-200 text-indigo-700";
          } else if (act.category === "Pengabdian Masyarakat") {
            categoryColor = "bg-emerald-50 border-emerald-205 text-emerald-700";
          } else if (act.category === "Capacity Building") {
            categoryColor = "bg-amber-50 border-amber-200 text-amber-800";
          }

          // Gather participant info
          const involvedAwardeesFull = awardees.filter(aw => act.awardeesInvolved.includes(aw.awardeeId));

          return (
            <div 
              key={act.activityId} 
              className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="h-44 w-full overflow-hidden relative border-b border-slate-100">
                  <img 
                    src={act.mediaUrl || "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=600&q=80"} 
                    alt={act.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded border uppercase font-mono shadow-sm ${categoryColor}`}>
                      {act.category}
                    </span>
                  </div>
                  
                  {(currentRole === "admin" || currentRole === "fasilitator" || currentRole === "kepala_asrama") && (
                    <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                      {deleteConfirmId === act.activityId ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteActivity) onDeleteActivity(act.activityId);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] rounded-lg shadow-md transition-all cursor-pointer inline-flex items-center gap-1 border-0"
                          title="Konfirmasi hapus"
                        >
                          <Check className="w-3 h-3 text-white" />
                          <span>Yakin?</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(act.activityId);
                          }}
                          className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md transition-all cursor-pointer inline-flex items-center justify-center border-0"
                          title="Hapus Kegiatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-white/95 text-amber-705 text-amber-700 border border-slate-200 px-2 py-1 rounded font-mono text-[10px] font-extrabold shadow-xs inline-flex items-center gap-1 backdrop-blur-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>+{act.hoursEarned} jam/org</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-4 md:p-5 space-y-2">
                  <div className="font-extrabold text-blue-950 text-sm md:text-base leading-tight tracking-tight">
                    {act.title}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-slate-500 font-mono font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {act.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {act.location}
                    </span>
                  </div>

                  <p className="text-slate-650 text-slate-600 text-xs leading-relaxed py-1 line-clamp-3 font-sans">
                    {act.description}
                  </p>
                </div>
              </div>

              {/* Participants list footer footer */}
              <div className="p-4 pt-0">
                <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowInvolvedAwardees(prev => ({
                          ...prev,
                          [act.activityId]: !prev[act.activityId]
                        }));
                      }}
                      className="text-[10px] font-bold text-slate-500 hover:text-blue-600 font-sans uppercase flex items-center gap-1 cursor-pointer select-none transition-colors border-0 bg-transparent py-1 px-0"
                    >
                      <span>Awardees Terlibat ({act.awardeesInvolved.length})</span>
                      <span className="text-[9px] text-blue-600 font-bold font-sans normal-case inline-flex items-center">
                        ({showInvolvedAwardees[act.activityId] ? "Sembunyikan" : "Lihat Semua"})
                      </span>
                    </button>
                    <div className="flex -space-x-2 overflow-hidden items-center">
                      {involvedAwardeesFull.map((aw) => (
                        <img 
                          key={aw.awardeeId}
                          src={aw.avatarUrl} 
                          alt={aw.name} 
                          title={`${aw.name} (${aw.university})`}
                          referrerPolicy="no-referrer"
                          className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white object-cover"
                        />
                      ))}
                    </div>
                  </div>

                  {showInvolvedAwardees[act.activityId] && (
                    <div className="mt-1 p-2.5 bg-slate-50 border border-slate-150 rounded-lg space-y-1.5 text-left animate-fadeIn">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Daftar Mahasiswa Terlibat:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 px-1 max-h-40 overflow-y-auto">
                        {involvedAwardeesFull.map((aw) => (
                          <div key={aw.awardeeId} className="flex items-center gap-2 py-0.5 border-b border-dashed border-slate-200 last:border-0 pb-1 last:pb-0">
                            <img src={aw.avatarUrl} alt={aw.name} className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-300" referrerPolicy="no-referrer" />
                            <div className="text-[11px] leading-tight">
                              <span className="font-bold text-slate-800 font-sans block">{aw.name}</span>
                              <span className="text-slate-400 text-[10px] font-sans block">{aw.university} - Angkatan {aw.batch}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
