import React, { useState, useRef } from "react";
import { 
  User as UserIcon, 
  Camera, 
  Save, 
  Plus, 
  X, 
  GraduationCap, 
  BookOpen, 
  Linkedin, 
  FileText, 
  Check, 
  Sparkles,
  Award,
  Upload,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { AwardeeProfile, UserRole } from "../types";

interface MyProfileProps {
  currentUserProfile: AwardeeProfile | null;
  onUpdateAwardee: (updated: AwardeeProfile) => void;
  currentRole: UserRole;
  onNavigateToTab?: (tab: any) => void;
  batches?: string[];
}

const PRESET_AVATARS = [
  { name: "Kreatif Perempuan", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
  { name: "Akademisi Laki-laki", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
  { name: "Teknolog Laki-laki", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
  { name: "Pengembang Perempuan", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
  { name: "Pelajar Modern", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" },
];

export default function MyProfile({
  currentUserProfile,
  onUpdateAwardee,
  currentRole,
  onNavigateToTab,
  batches = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
}: MyProfileProps) {
  if (!currentUserProfile) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4 max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-800">Akses Terkunci / Sesi Tidak Terdeteksi</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            Anda belum masuk / login sebagai Awardee di portal ini, atau peran Anda saat ini terdeteksi sebagai Administrator utama.
          </p>
        </div>
        <div>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab("portal")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Menuju Halaman Login Portal
            </button>
          )}
        </div>
      </div>
    );
  }

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUserProfile.name);
  const [university, setUniversity] = useState(currentUserProfile.university);
  const [major, setMajor] = useState(currentUserProfile.major);
  const [batch, setBatch] = useState(currentUserProfile.batch);
  const [gpa, setGpa] = useState(currentUserProfile.gpa.toString());
  const [bio, setBio] = useState(currentUserProfile.bio);
  const [linkedin, setLinkedin] = useState(currentUserProfile.linkedinUrl || "");
  const [skills, setSkills] = useState<string[]>(currentUserProfile.skills || []);
  const [skillInput, setSkillInput] = useState("");
  
  // Photo states
  const [currentPhoto, setCurrentPhoto] = useState(currentUserProfile.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddSkill = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") return;
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill && !skills.includes(cleanSkill)) {
      setSkills(prev => [...prev, cleanSkill]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AwardeeProfile = {
      ...currentUserProfile,
      name: name.trim(),
      university: university.trim(),
      major: major.trim(),
      batch: batch,
      gpa: parseFloat(gpa) || currentUserProfile.gpa,
      bio: bio.trim(),
      linkedinUrl: linkedin.trim(),
      skills: skills,
      avatarUrl: currentPhoto,
      updatedAt: new Date().toISOString()
    };
    onUpdateAwardee(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 5000);
  };

  // Image Upload Core Logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Mohon pilih file gambar saja (PNG/JPG/JPEG).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const base64Url = loadEvent.target?.result as string;
      if (base64Url) {
        setCurrentPhoto(base64Url);
        setCustomPhotoUrl("");
        setShowPhotoModal(false);
        // Save immediately in profile if not in edit mode
        if (!isEditing) {
          const updated: AwardeeProfile = {
            ...currentUserProfile,
            avatarUrl: base64Url,
            updatedAt: new Date().toISOString()
          };
          onUpdateAwardee(updated);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      }
    };
    reader.readAsDataURL(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (customPhotoUrl.trim().startsWith("http")) {
      setCurrentPhoto(customPhotoUrl.trim());
      setShowPhotoModal(false);
      setCustomPhotoUrl("");
      if (!isEditing) {
        const updated: AwardeeProfile = {
          ...currentUserProfile,
          avatarUrl: customPhotoUrl.trim(),
          updatedAt: new Date().toISOString()
        };
        onUpdateAwardee(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } else {
      alert("Masukkan link/URL gambar HTTP atau HTTPS yang valid.");
    }
  };

  const selectPreset = (url: string) => {
    setCurrentPhoto(url);
    setShowPhotoModal(false);
    if (!isEditing) {
      const updated: AwardeeProfile = {
        ...currentUserProfile,
        avatarUrl: url,
        updatedAt: new Date().toISOString()
      };
      onUpdateAwardee(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title & Header Banner */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-black text-blue-955 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-emerald-600" />
            <span>Manajemen Profil Pribadi Anda</span>
          </h2>
          <p className="text-slate-500 text-xs leading-normal">
            Pembaruan profil mandiri demi keakuratan direktori publik asrama & pelacakan jam pembinaan.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setName(currentUserProfile.name);
              setUniversity(currentUserProfile.university);
              setMajor(currentUserProfile.major);
              setBatch(currentUserProfile.batch);
              setGpa(currentUserProfile.gpa.toString());
              setBio(currentUserProfile.bio);
              setLinkedin(currentUserProfile.linkedinUrl || "");
              setSkills([...(currentUserProfile.skills || [])]);
              setIsEditing(true);
            }}
            className="px-4 py-2 bg-blue-950 text-white font-extrabold hover:bg-blue-900 active:scale-95 text-xs rounded-xl shadow-md cursor-pointer select-none transition-all flex items-center gap-1.5 self-start md:self-auto"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Edit Data Informasi Profil</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-55 border border-emerald-250 text-emerald-900 rounded-xl flex items-center gap-3 text-xs font-bold text-left shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-extrabold">Perubahan Disimpan Permanen!</p>
            <p className="font-medium text-slate-600 text-[11px] mt-0.5">Seluruh detail data Anda saat ini telah sinkron secara real-time pada database direktori.</p>
          </div>
        </div>
      )}

      {/* Profile Card & Photo Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Photo and Social Hours Summary */}
        <div className="bg-white border border-slate-205 rounded-xl p-6 shadow-xs text-center space-y-6 h-fit text-left">
          <div className="space-y-4 flex flex-col items-center">
            
            {/* Interactive Portrait Hover/Camera */}
            <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 shrink-0">
              <img 
                src={currentUserProfile.avatarUrl || currentPhoto} 
                alt={currentUserProfile.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white text-[10px] font-black tracking-wide cursor-pointer gap-1"
                aria-label="Ubah foto profil"
              >
                <Camera className="w-5 h-5 text-emerald-450" />
                <span>Ubah Foto</span>
              </button>
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-sm text-blue-950">{currentUserProfile.name}</h3>
              <p className="text-[11px] text-slate-500 font-mono">{currentUserProfile.batch}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-150 mt-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Awardee Aktif</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Status Kontribusi Sosial</h4>
            
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Total Jam Pengabdian:</span>
                <span className="text-emerald-700 font-black text-sm">{currentUserProfile.totalServiceHours} Jam</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentUserProfile.totalServiceHours / 60) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>Minimal 60 Jam</span>
                <span>{Math.round((currentUserProfile.totalServiceHours / 60) * 100)}% Tercapai</span>
              </div>
            </div>

            <p className="text-[10.5px] text-slate-505 leading-relaxed italic">
              *Detail akumulasi di-update ketika administrasi asrama menyetujui log kegiatan yang Anda daftarkan di menu timeline.
            </p>
          </div>
        </div>

        {/* Right Col: Forms or Details */}
        <div className="lg:col-span-2 bg-white border border-slate-205 rounded-xl p-6 shadow-xs text-left">
          
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider">Lengkapi Formulir Akademik & Bio</h3>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Interactive Form Editor</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10.5px] font-bold text-slate-600 uppercase block">Nama Lengkap Anda</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-205 rounded-lg bg-white text-slate-800 text-xs focus:border-blue-500 font-bold outline-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-600 uppercase block">Universitas Mitra</label>
                  <input 
                    type="text" 
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-205 rounded-lg bg-white text-slate-800 text-xs focus:border-blue-500 font-bold outline-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-600 uppercase block">Program Studi / Fakultas</label>
                  <input 
                    type="text" 
                    required
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-205 rounded-lg bg-white text-slate-800 text-xs focus:border-blue-500 font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-600 uppercase block">Angkatan Beasiswa Sinergi (Angka)</label>
                  <select 
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-205 rounded-lg bg-white text-slate-800 text-xs focus:border-blue-500 font-bold outline-none font-sans cursor-pointer"
                    required
                  >
                    {batches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-600 uppercase block">Indeks Prestasi Kumulatif (IPK)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.00"
                    max="4.00"
                    required
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-205 rounded-lg bg-white text-slate-800 text-xs focus:border-blue-500 font-bold outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10.5px] font-bold text-slate-600 uppercase block">LinkedIn URL Profil</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="url" 
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full pl-9 pr-4 py-2 border border-slate-205 rounded-lg bg-white text-slate-850 text-xs focus:border-blue-500 font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10.5px] font-bold text-slate-600 uppercase block">Biografi & Deskripsi Diri Singkat</label>
                  <textarea 
                    rows={3}
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tuliskan latar belakang, minat kontribusi sosial, atau target akademis Anda..."
                    className="w-full px-3 py-2 border border-slate-205 rounded-lg bg-white text-slate-800 text-xs focus:border-blue-500 font-normal outline-none leading-relaxed"
                  />
                </div>

                {/* Skills tags selection */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10.5px] font-bold text-slate-600 uppercase block">Tag Keahlian & Keterampilan Anda</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      placeholder="Masukkan keahlian baru (cth: Core PHP, Public Relations)..."
                      className="flex-1 px-3 py-2 border border-slate-205 rounded-lg bg-white text-slate-800 text-xs focus:border-blue-500 font-medium outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-blue-950 text-white font-extrabold hover:bg-blue-900 rounded-lg text-xs cursor-pointer select-none"
                    >
                      Tambah
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skills.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">Belum ada tag keahlian yang dimasukkan.</p>
                    ) : (
                      skills.map((s, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-3xs"
                        >
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(s)}
                            className="text-emerald-500 hover:text-emerald-800 font-black cursor-pointer align-middle text-xs"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-205 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-700 to-emerald-600 text-white hover:brightness-105 shadow-md text-xs font-extrabold rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Pembaruan Profil</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              
              {/* Profile details header info */}
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest">Lembar Profil Akademik Terdaftar</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>Universitas</span>
                  </div>
                  <span className="text-slate-805 font-black block mt-1.5 text-xs">{currentUserProfile.university}</span>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Fakultas / Program Studi</span>
                  </div>
                  <span className="text-slate-805 font-black block mt-1.5 text-xs">{currentUserProfile.major}</span>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-paling tracking-wider">Angkatan Sinergi</span>
                  <span className="text-slate-850 font-extrabold block mt-1.5 text-xs">{currentUserProfile.batch}</span>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Indeks Prestasi Kumulatif (IPK)</span>
                  <span className="text-emerald-700 font-black block mt-1.5 text-sm">{currentUserProfile.gpa.toFixed(2)}</span>
                </div>

                {currentUserProfile.linkedinUrl && (
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 sm:col-span-2">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <Linkedin className="w-3.5 h-3.5 text-blue-605" />
                      <span>Alamat LinkedIn</span>
                    </div>
                    <a 
                      href={currentUserProfile.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-650 hover:underline font-bold block mt-1 text-xs"
                    >
                      {currentUserProfile.linkedinUrl}
                    </a>
                  </div>
                )}

                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 sm:col-span-2">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Biografi Diri</span>
                  </div>
                  <p className="text-slate-750 block mt-2 text-xs leading-relaxed italic">
                    "{currentUserProfile.bio}"
                  </p>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 sm:col-span-2">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-2">Tag Keahlian & Keterampilan</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentUserProfile.skills && currentUserProfile.skills.length > 0 ? (
                      currentUserProfile.skills.map((sk, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-blue-50/70 border border-blue-100 text-blue-755 rounded-lg text-[10px] font-bold">
                          {sk}
                        </span>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">Belum ada keahlian yang ditambahkan.</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* Profile Picture Uploader Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs font-sans text-left">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-150 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 text-emerald-400">
                <Camera className="w-4 h-4" />
                <span>Pusat Unggah Foto Profil</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              
              {/* Option 1: Drag and Drop Local Picture */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide block">Opsi 1: Unggah File Foto Lokal (Drag & Drop)</span>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? "border-emerald-555 bg-emerald-50/40 text-emerald-800 scale-98" 
                      : "border-slate-250 hover:bg-slate-50 hover:border-slate-400 text-slate-500"
                  }`}
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:scale-105 transition-transform" />
                  <p className="text-xs font-black text-slate-700">Tarik gambar ke mari, atau klik untuk memilih file</p>
                  <p className="text-[10px] text-slate-400 mt-1">Mendukung format PNG, JPG, atau JPEG (Maks. 5MB)</p>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Option 2: Choose preset from list */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide block">Opsi 2: Gunakan Foto Preset Mahasiswa</span>
                <div className="grid grid-cols-5 gap-3">
                  {PRESET_AVATARS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectPreset(item.url)}
                      className="group flex flex-col items-center gap-1.5 focus:outline-none focus:scale-95 cursor-pointer text-left"
                      title={item.name}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-205 group-hover:border-emerald-500 transition-all shadow-xs shrink-0">
                        <img 
                          src={item.url} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[8.5px] text-slate-500 font-bold truncate max-w-full text-center block leading-tight">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: External direct Image URL */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide block">Opsi 3: Tempel Tautan / URL Gambar Luar</span>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="url" 
                      placeholder="https://example.com/foto-anda.jpg"
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-slate-205 rounded-lg text-xs font-semibold bg-slate-50 focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-4 py-1.5 bg-blue-950 hover:bg-blue-900 text-white font-extrabold rounded-lg text-xs cursor-pointer select-none"
                  >
                    Terapkan
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-350 text-slate-600 rounded-lg text-xs font-bold cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
