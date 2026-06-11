import React, { useState } from "react";
import { 
  Trophy, 
  Search, 
  Plus, 
  Trash2, 
  Calendar, 
  BookOpen, 
  Award, 
  Sparkles, 
  GraduationCap, 
  Upload, 
  X, 
  CheckSquare, 
  Info,
  Medal,
  Eye,
  EyeOff
} from "lucide-react";
import { AwardeeAchievement, UserRole, AwardeeProfile } from "../types";

interface AwardeeAchievementsProps {
  achievements: AwardeeAchievement[];
  onAddAchievement: (newAch: AwardeeAchievement) => void;
  onDeleteAchievement: (id: string) => void;
  onUpdateAchievement?: (updatedBy: AwardeeAchievement) => void;
  currentRole: UserRole;
  awardees?: AwardeeProfile[];
  currentUserProfile?: AwardeeProfile | null;
}

export default function AwardeeAchievements({
  achievements,
  onAddAchievement,
  onDeleteAchievement,
  onUpdateAchievement,
  currentRole,
  awardees = [],
  currentUserProfile
}: AwardeeAchievementsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states - prefilled with logged-in awardee's ID
  const [selectedAwardeeId, setSelectedAwardeeId] = useState(currentUserProfile?.awardeeId || "");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AwardeeAchievement["category"]>("Akademik");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isStaff = currentRole === "admin" || currentRole === "fasilitator" || currentRole === "kepala_asrama";

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
      setErrorMessage("BATAL UNGGAH: Format file bukan gambar. Silakan masukkan format gambar valid.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
        setUploadedImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedImage = () => {
    setImageUrl("");
    setUploadedImageName(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (isStaff) {
      setErrorMessage("DITOLAK: Pengurus asrama hanya berwenang melakukan moderasi (hapus/menyembunyikan/takedown). Pengunggahan kontribusi & prestasi hanya boleh dilakukan langsung oleh mahasiswa (awardee) sendiri.");
      return;
    }

    const targetAwardeeId = currentUserProfile?.awardeeId || selectedAwardeeId;

    if (!targetAwardeeId || !title || !date || !description) {
      setErrorMessage("BATAL INPUT: Harap isi semua formulir wajib bertanda bintang (*).");
      return;
    }

    const awardeeObj = awardees.find(a => a.awardeeId === targetAwardeeId) || currentUserProfile;
    if (!awardeeObj) {
      setErrorMessage("BATAL INPUT: Profil Anda sebagai awardee tidak ditemukan.");
      return;
    }

    const newAch: AwardeeAchievement = {
      achievementId: "ach-" + Date.now(),
      awardeeId: targetAwardeeId,
      awardeeName: awardeeObj.name,
      title,
      category,
      date,
      description,
      imageUrl: imageUrl || undefined,
      batch: awardeeObj.batch,
      university: awardeeObj.university,
      isHidden: false // Default showing
    };

    onAddAchievement(newAch);

    // Reset Form
    setSelectedAwardeeId(currentUserProfile?.awardeeId || "");
    setTitle("");
    setCategory("Akademik");
    setDate("");
    setDescription("");
    setImageUrl("");
    setUploadedImageName(null);
    setShowAddForm(false);

    setSuccessMessage(`PRESTASI BERHASIL DICATAT: Pencapaian '${newAch.title}' oleh ${newAch.awardeeName} telah dipublikasikan.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter achievements
  const filteredAchievements = achievements.filter(ach => {
    const matchesKeyword = 
      ach.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ach.awardeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ach.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ach.university.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || ach.category === selectedCategory;

    if (!isStaff && ach.isHidden) {
      return false;
    }

    return matchesKeyword && matchesCategory;
  });

  const getCategoryIcon = (cat: AwardeeAchievement["category"]) => {
    switch(cat) {
      case "Akademik":
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case "Non-Akademik":
        return <Trophy className="w-4 h-4 text-emerald-600" />;
      case "Inovasi & Riset":
        return <Sparkles className="w-4 h-4 text-violet-600" />;
      case "Sosial Kemasyarakatan":
        return <Award className="w-4 h-4 text-rose-600" />;
    }
  };

  const getCategoryThemeClass = (cat: AwardeeAchievement["category"]) => {
    switch(cat) {
      case "Akademik":
        return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "Non-Akademik":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "Inovasi & Riset":
        return "bg-violet-50 text-violet-700 border-violet-200/50";
      case "Sosial Kemasyarakatan":
        return "bg-rose-50 text-rose-700 border-rose-200/50";
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-6 sm:p-8 rounded-2xl text-white relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_40%)]"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3/1.5 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>Papan Prestasi &amp; Apresiasi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
            Awardee Berprestasi Bright Scholarship
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
            Kumpulan inisiatif gemilang, hasil riset, kejuaraan nasional, sertifikasi internasional, dan kontribusi sosial yang ditorehkan oleh mahasiswa asrama kami. Menjadi suluh inspirasi bagi sesama penerima beasiswa.
          </p>
          
          {!isStaff && (
            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  if (currentUserProfile?.awardeeId) {
                    setSelectedAwardeeId(currentUserProfile.awardeeId);
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-550 bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] text-white font-extrabold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Bagikan Prestasi Saya</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold leading-relaxed">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* FORM: ADD ACHIEVEMENT (AWARDEES ONLY) */}
      {showAddForm && !isStaff && (
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm ring-1 ring-blue-50">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <div className="p-2 rounded bg-blue-100/50">
              <Medal className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Bagikan Pencapaian &amp; Prestasi Baru Anda</h3>
              <p className="text-[10px] text-slate-400">Silakan lengkapi formulir di bawah untuk mendaftarkan dan mengunggah prestasi ke Papan Apresiasi</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Side */}
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold block">Pilih Awardee Juara *</label>
                  <select
                    value={selectedAwardeeId}
                    onChange={(e) => setSelectedAwardeeId(e.target.value)}
                    className="w-full bg-slate-100/80 border border-slate-200 p-2.5 rounded-lg text-slate-500 text-xs font-semibold outline-none cursor-not-allowed"
                    disabled={!isStaff}
                    required
                  >
                    <option value="">-- Pilih Mahasiswa Penerima Beasiswa --</option>
                    {awardees.map(a => (
                      <option key={a.awardeeId} value={a.awardeeId}>
                        {a.name} ({a.university})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold block">Nama Penghargaan / Prestasi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Juara 1 Business Plan Competition Nasional UGM"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-semibold focus:border-blue-500 focus:bg-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-bold block">Kategori Prestasi *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-semibold focus:border-blue-500 focus:bg-white outline-none cursor-pointer"
                    >
                      <option value="Akademik">Akademik</option>
                      <option value="Non-Akademik">Non-Akademik</option>
                      <option value="Inovasi & Riset">Inovasi & Riset</option>
                      <option value="Sosial Kemasyarakatan">Sosial Kemasyarakatan</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-bold block">Tanggal Penghargaan *</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-semibold focus:border-blue-500 focus:bg-white outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="space-y-3.5 flex flex-col justify-between">
                <div className="space-y-1 flex-1">
                  <label className="text-xs text-slate-600 font-bold block">Ulasan / Kronologi Singkat Pencapaian *</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Tulis kronologi singkat pencapaian, inovasi yang diajukan, atau dambaan prestasi setelah memenangkan ajang ini..."
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none resize-none font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Poster / Bukti Upload Certificate */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <label className="text-xs text-slate-600 font-bold block">Foto Penghargaan / Bukti Sertifikat (Opsional)</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all relative ${
                  isDragging 
                    ? "border-blue-500 bg-blue-50/50" 
                    : imageUrl 
                      ? "border-emerald-300 bg-emerald-50/10" 
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/30 hover:bg-slate-50/60"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {imageUrl ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
                    <img 
                      src={imageUrl} 
                      alt="Preview Penghargaan" 
                      className="w-16 h-16 object-cover rounded-lg border border-emerald-200 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left space-y-0.5">
                      <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5" />
                        Bukti Certifikat Siap Diunggah!
                      </p>
                      {uploadedImageName && (
                        <p className="text-[10px] text-slate-500 truncate max-w-xs">{uploadedImageName}</p>
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveUploadedImage}
                        className="text-[10px] text-rose-600 hover:text-rose-805 font-bold underline cursor-pointer"
                      >
                        Hapus Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Pilih foto atau seret ke sini</p>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setErrorMessage(null);
                }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
              >
                Batalkan
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-lg shadow-sm cursor-pointer"
              >
                Publikasikan Prestasi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-stretch gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari prestasi, nama juara, universitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none placeholder-slate-400 text-slate-800"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {["All", "Akademik", "Non-Akademik", "Inovasi & Riset", "Sosial Kemasyarakatan"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                selectedCategory === cat 
                  ? "bg-slate-900 border border-slate-950 text-white" 
                  : "bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-600"
              }`}
            >
              {cat === "All" ? "Semua Kategori" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* DISPPLAY GRID */}
      {filteredAchievements.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
          <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-pulse" />
          <h4 className="text-sm font-bold text-slate-700">Belum Ada Pencapaian yang Cocok</h4>
          <p className="text-xs text-slate-450 text-slate-450 text-slate-400 mt-1">Gunakan kata kunci atau penapisan alternatif.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAchievements.map((ach) => (
            <div 
              key={ach.achievementId}
              className={`rounded-xl border transition-all flex flex-col justify-between overflow-hidden relative group ${
                ach.isHidden
                  ? "bg-rose-50/10 border-rose-200 opacity-90 shadow-none hover:border-rose-300"
                  : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs"
              }`}
            >
              {ach.isHidden && (
                <div className="absolute top-2.5 right-2.5 bg-rose-100 border border-rose-300 text-rose-800 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs animate-pulse z-10">
                  ⛔ TAKEDOWN (HIDDEN)
                </div>
              )}
              <div className="p-5 flex-1 space-y-4 text-left">
                {/* Category and date row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className={`flex items-center gap-1.5 border px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${getCategoryThemeClass(ach.category)}`}>
                    {getCategoryIcon(ach.category)}
                    <span>{ach.category}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{ach.date}</span>
                  </div>
                </div>

                {/* Achiever Info card */}
                <div className="flex items-center gap-3 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100/80">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-black text-xs shrink-0 flex items-center justify-center border border-blue-200 uppercase">
                    {ach.awardeeName.slice(0, 2)}
                  </div>
                  <div className="truncate">
                    <h5 className="font-extrabold text-xs text-slate-900 truncate leading-none mb-1">{ach.awardeeName}</h5>
                    <p className="text-[10px] text-slate-500 truncate leading-none">
                      {ach.university} • <span className="font-bold text-slate-655 text-slate-600">{ach.batch}</span>
                    </p>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h4 className="font-black text-xs text-slate-900 tracking-tight leading-snug group-hover:text-blue-700 transition-colors">
                    🏆 {ach.title}
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-sans line-clamp-4">
                    {ach.description}
                  </p>
                </div>

                {/* Optional Certificate image */}
                {ach.imageUrl && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 max-h-48">
                    <img 
                      src={ach.imageUrl} 
                      alt="Certificate" 
                      className="w-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="referrer" 
                    />
                  </div>
                )}
              </div>

              {/* Delete button (Admin only) */}
              {isStaff && (
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdateAchievement) {
                        onUpdateAchievement({
                          ...ach,
                          isHidden: !ach.isHidden
                        });
                      }
                    }}
                    className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer border ${
                      ach.isHidden 
                        ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300" 
                        : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    {ach.isHidden ? (
                      <>
                        <Eye className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                        <span className="font-extrabold text-emerald-700">Restore / Tampilkan</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                        <span className="font-extrabold text-amber-700">Sembunyikan / Takedown</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteAchievement(ach.achievementId)}
                    className="text-[10px] text-slate-400 hover:text-rose-600 flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="font-black">Hapus Apresiasi</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
