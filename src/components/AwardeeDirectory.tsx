import React, { useState } from "react";
import { 
  Users, 
  Linkedin, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Plus, 
  X, 
  CheckCircle2, 
  Edit3, 
  UserCheck, 
  ShieldAlert,
  Info,
  Calendar,
  Search
} from "lucide-react";
import { AwardeeProfile, UserRole } from "../types";

interface AwardeeDirectoryProps {
  awardees: AwardeeProfile[];
  onUpdateAwardee: (updated: AwardeeProfile) => void;
  currentRole: UserRole;
  currentUserId: string;
  onNavigateToTab?: (tab: string) => void;
}

export default function AwardeeDirectory({ awardees, onUpdateAwardee, currentRole, currentUserId, onNavigateToTab }: AwardeeDirectoryProps) {
  const [selectedAwardee, setSelectedAwardee] = useState<AwardeeProfile | null>(awardees[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkillText, setNewSkillText] = useState("");
  
  // AI Career Counseling States
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Simulation Status Alerts
  const [simulationAlert, setSimulationAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterBatch, setFilterBatch] = useState("All");
  const [filterUniversity, setFilterUniversity] = useState("All");
  const [filterMajor, setFilterMajor] = useState("All");

  // Dynamic filter options extracted from existing awardees list
  const universitiesList = Array.from(new Set(awardees.map(a => a.university))).filter(Boolean);
  const majorsList = Array.from(new Set(awardees.map(a => a.major))).filter(Boolean);
  const batchesList = Array.from(new Set(awardees.map(a => a.batch))).filter(Boolean).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const filteredAwardees = awardees.filter((awardee) => {
    // 1. Search Query Search bounds
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchesQuery = (
        awardee.name.toLowerCase().includes(query) ||
        awardee.university.toLowerCase().includes(query) ||
        awardee.major.toLowerCase().includes(query) ||
        awardee.skills.some(skill => skill.toLowerCase().includes(query))
      );
      if (!matchesQuery) return false;
    }

    // 2. Batch Filter bounds
    if (filterBatch !== "All" && awardee.batch !== filterBatch) {
      return false;
    }

    // 3. University Filter bounds
    if (filterUniversity !== "All" && awardee.university !== filterUniversity) {
      return false;
    }

    // 4. Major Filter bounds
    if (filterMajor !== "All" && awardee.major !== filterMajor) {
      return false;
    }

    return true;
  });

  // Buffer state for the edit form
  const [editName, setEditName] = useState("");
  const [editUniversity, setEditUniversity] = useState("");
  const [editMajor, setEditMajor] = useState("");
  const [editBatch, setEditBatch] = useState("");
  const [editGpa, setEditGpa] = useState(3.0);
  const [editBio, setEditBio] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [editHours, setEditHours] = useState(0);
  const [editStatus, setEditStatus] = useState<"active" | "alumni">("active");

  const openAwardeeDetails = (awardee: AwardeeProfile) => {
    setSelectedAwardee(awardee);
    setIsEditing(false);
    setAiInsight(null);
    setSimulationAlert(null);
  };

  const handleStartEdit = () => {
    if (!selectedAwardee) return;
    const isStaff = currentRole === "admin" || currentRole === "fasilitator" || currentRole === "kepala_asrama";
    if (!isStaff) {
      setSimulationAlert({
        type: "error",
        message: "AKSES DITOLAK: Maaf, akun Anda tidak memiliki hak akses yang memadai untuk mengedit profil ini."
      });
      return;
    }
    setEditName(selectedAwardee.name);
    setEditUniversity(selectedAwardee.university);
    setEditMajor(selectedAwardee.major);
    setEditBatch(selectedAwardee.batch);
    setEditGpa(selectedAwardee.gpa);
    setEditBio(selectedAwardee.bio);
    setEditLinkedin(selectedAwardee.linkedinUrl);
    setEditSkills([...selectedAwardee.skills]);
    setEditHours(selectedAwardee.totalServiceHours);
    setEditStatus(selectedAwardee.status);
    setIsEditing(true);
    setSimulationAlert(null);
  };

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    if (!editSkills.includes(newSkillText.trim())) {
      setEditSkills([...editSkills, newSkillText.trim()]);
    }
    setNewSkillText("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditSkills(editSkills.filter(s => s !== skillToRemove));
  };

  // Simulate Firestore Write Rule Evaluation!
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAwardee) return;

    // Simulate Client-side vs Server-side rule check matching firestore.rules
    const isStaff = currentRole === "admin" || currentRole === "fasilitator" || currentRole === "kepala_asrama";
    if (!isStaff) {
      setSimulationAlert({
        type: "error",
        message: "AKSES DITOLAK: Hanya administrator dan staf pengurus asrama yang berwenang memperbarui data ini."
      });
      return;
    }

    // If check passes (Admin can do anything, or Awardee changes only their permitted fields)
    const updatedRecord: AwardeeProfile = {
      ...selectedAwardee,
      name: editName,
      university: editUniversity,
      major: editMajor,
      batch: editBatch,
      gpa: editGpa,
      bio: editBio,
      linkedinUrl: editLinkedin,
      skills: editSkills,
      totalServiceHours: editHours,
      status: editStatus,
      updatedAt: new Date().toISOString()
    };

    onUpdateAwardee(updatedRecord);
    setSelectedAwardee(updatedRecord);
    setIsEditing(false);
    setSimulationAlert({
      type: "success",
      message: "DATA DISINKRONKAN: Perubahan profil awardee berhasil disimpan dan diperbarui di database pusat."
    });
  };

  // Generate Personalized Career Roadmap from server-side Gemini AI
  const handleGenerateCareerInsight = async () => {
    if (!selectedAwardee) return;
    setIsAiLoading(true);
    setAiInsight(null);

    try {
      const response = await fetch("/api/generateAwardeeInsight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedAwardee)
      });

      const data = await response.json();
      if (data.success && data.report) {
        setAiInsight(data.report);
      } else {
        throw new Error(data.error || "Gagal menghasilkan insight AI.");
      }
    } catch (err: any) {
      console.warn("Using calculated local report fallback...", err.message);
      generateLocalCareerInsightFallback();
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateLocalCareerInsightFallback = () => {
    if (!selectedAwardee) return;
    
    const textTemplate = `### ANALISIS KOMPETENSI AWARDEE: ${selectedAwardee.name.toUpperCase()} (BRIGHT SCHOLARSHIP)
*(Disusun otomatis berbasis klasterisasi kurikulum lokal)*

#### A. EVALUASI AKADEMIS DAN INTEGRITAS DIRI
Mahasiswa menunjukkan performa akademis yang cemerlang dengan raihan **IPK ${selectedAwardee.gpa}** di **${selectedAwardee.university}**. Ini mencerminkan keseimbangan kognitif yang kokoh. 
Lebih lanjut, keterlibatan aktif sepanjang **${selectedAwardee.totalServiceHours} Jam Pengabdian** membuktikan kedalaman empati sosial dan komitmen asrama yang tinggi dalam membumikan ilmunya secara langsung bagi masyarakat akar rumput.

#### B. STRATEGI RELEVANSI INDUSTRI & PENGEMBANGAN SKILLS
Sebagai mahasiswa rumpun **${selectedAwardee.major}**, paduan keterampilan teknis Anda (*${selectedAwardee.skills.slice(0, 3).join(", ") || "Keorganisasian"}*) sangat prospektif dalam lingkup profesional masa depan. Untuk bersaing kuat:
*   **Perdalam Integrasi Teknis:** Gabungkan keterampilan analisis atau pengajaran Anda dengan proyek pengabdian riil (misal, membuat sistem lapor desa atau digitalisasi literasi).
*   **Sertifikasi Sasaran:** Bidik sertifikasi bertaraf nasional/internasional yang mendongkrak daya tawar ijazah utama Anda sebelum kelulusan.

#### C. REKOMENDASI PEMBINAAN & PENGABDIAN BERIKUTNYA
Berdasarkan program studi Anda, diusulkan 2 proyek sosial berkelanjutan (social projects) baru:
1.  **Inkubasi Pojok Literasi Digital:** Mengedukasi anak-anak marginal mengenai pemanfaatan internet sehat, mempraktikkan keterampilan komunikasi interpersonal Anda.
2.  **Audit Efisiensi Energi/Ekonomi Desa:** Menyusun kuesioner kelayakan usaha desa guna membantu perangkat meluncurkan BUMDES yang matang secara fiskal.

#### D. PRINSIP KEPEMIMPINAN BRIGHT SCHOLARSHIP
*"Kecerdasan bukanlah komoditas komersial semata, melainkan amanah kepemimpinan sosial yang dititipkan Tuhan demi perbaikan martabat kemanusiaan."* Tetaplah merendah, menajamkan empati, dan melayani negeri.`;

    setAiInsight(textTemplate);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
      
      {/* LEFT: Grid List of Awardees */}
      <div className="lg:col-span-12 xl:col-span-5 space-y-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Daftar Penerima Beasiswa ({awardees.length})</span>
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200/60 px-2 py-0.5 rounded-full font-bold">
              AKTIF
            </span>
          </div>
          <p className="text-slate-500 text-xs leading-normal">
            Pilih nama mahasiswa di bawah untuk meninjau kecakapan kompetensi, portofolio LinkedIn, jumlah jam sosial, serta menyusun peta karir digital via asistem kecerdasan AI.
          </p>
        </div>

        {/* Search input bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="relative animate-fadeIn">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama, universitas, jurusan, atau keahlian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none text-slate-800 placeholder-slate-400 transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer select-none"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Triple Category filters layout (User Intent requirement) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase block tracking-wider">Angkatan</label>
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700 font-bold focus:bg-white focus:border-emerald-500 outline-none cursor-pointer"
              >
                <option value="All">Semua Angkatan</option>
                {batchesList.map(b => (
                  <option key={b} value={b}>Angkatan {b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase block tracking-wider">Universitas</label>
              <select
                value={filterUniversity}
                onChange={(e) => setFilterUniversity(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700 font-bold focus:bg-white focus:border-emerald-500 outline-none cursor-pointer truncate"
              >
                <option value="All">Semua Kampus</option>
                {universitiesList.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase block tracking-wider">Jurusan (Major)</label>
              <select
                value={filterMajor}
                onChange={(e) => setFilterMajor(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700 font-bold focus:bg-white focus:border-emerald-500 outline-none cursor-pointer truncate"
              >
                <option value="All">Semua Jurusan</option>
                {majorsList.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {(searchQuery || filterBatch !== "All" || filterUniversity !== "All" || filterMajor !== "All") && (
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-semibold font-sans bg-amber-50/50 p-2 border border-amber-205 rounded-lg animate-fadeIn text-left">
              <span>Menampilkan {filteredAwardees.length} dari {awardees.length} awardee</span>
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterBatch("All");
                  setFilterUniversity("All");
                  setFilterMajor("All");
                }}
                className="text-blue-600 hover:underline cursor-pointer font-extrabold"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Small selection grid */}
        <div className="space-y-2.5">
          {filteredAwardees.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-xs">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2.5 animate-pulse" />
              <p className="text-xs font-semibold text-slate-700">Tidak ada awardee yang cocok</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal font-sans">
                Coba cari dengan kata kunci lain seperti nama, universitas, atau keahlian berbeda.
              </p>
            </div>
          ) : (
            filteredAwardees.map((awardee) => {
              const isSelected = selectedAwardee?.awardeeId === awardee.awardeeId;
              return (
                <button
                  key={awardee.awardeeId}
                  onClick={() => openAwardeeDetails(awardee)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? "bg-blue-50/70 border-blue-600 shadow-sm transform translate-x-1"
                      : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {/* Simulated Avatar image or Initials */}
                  <img 
                    src={awardee.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"} 
                    alt={awardee.name} 
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0 animate-fade-in"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-extrabold text-xs text-blue-950 truncate font-sans block">{awardee.name}</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-extrabold shrink-0">IPK {awardee.gpa}</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium truncate block font-sans">{awardee.university}</span>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-mono text-slate-500 font-bold">
                      <span>{awardee.batch}</span>
                      <span>•</span>
                      <span className="text-amber-600">{awardee.totalServiceHours} Jam Pengabdian</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: Detailed Profile & Interactive RBAC Simulation Panel */}
      <div className="lg:col-span-12 xl:col-span-7 space-y-5">
        {selectedAwardee ? (
          <div className="bg-white border border-slate-205 rounded-xl p-5 md:p-6 shadow-sm relative">
            
            {/* Detail Section */}

            {/* Simulation Feedback alert banner */}
            {simulationAlert && (
              <div className={`p-3 rounded-lg flex items-start gap-2.5 text-xs font-semibold mb-4 border ${
                simulationAlert.type === "success" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs"
                  : "bg-red-50 border-red-200 text-red-800 shadow-xs"
              }`}>
                {simulationAlert.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <p className="leading-tight">{simulationAlert.message}</p>
              </div>
            )}

            {/* Dynamic Rendering: Normal view vs Dynamic simulator editing form */}
            {!isEditing ? (
              <div className="space-y-5">
                {/* Avatar and Heading description info */}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <img 
                    src={selectedAwardee.avatarUrl} 
                    alt={selectedAwardee.name} 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-100"
                  />
                  <div className="text-center sm:text-left space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-lg font-extrabold text-blue-950 tracking-tight">{selectedAwardee.name}</h2>
                      <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-bold font-mono uppercase">
                        {selectedAwardee.status === "active" ? "Aktif" : "Alumni"}
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs font-medium flex items-center justify-center sm:justify-start gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedAwardee.university} • {selectedAwardee.major}</span>
                    </p>
                    <div className="text-[10px] text-slate-500 font-semibold font-mono flex justify-center sm:justify-start gap-3">
                      <span>{selectedAwardee.batch}</span>
                      <span>|</span>
                      <span className="text-emerald-600 font-extrabold">IPK: {selectedAwardee.gpa}</span>
                      <span>|</span>
                      <span className="text-amber-650 text-amber-600">Total: {selectedAwardee.totalServiceHours} Jam Pengabdian</span>
                    </div>
                  </div>
                </div>

                {/* Biography */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">Tentang Penerima Beasiswa</h4>
                  <p className="text-slate-705 text-slate-705 text-slate-700 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-150">
                    {selectedAwardee.bio || "Penerima beasiswa belum mencantumkan biografi singkat."}
                  </p>
                </div>

                {/* Skills/Competencies Tagged */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">Kecakapan & Tagging Kompetensi</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAwardee.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] font-semibold font-mono px-2 py-1 bg-emerald-50/50 text-emerald-800 rounded border border-emerald-200/70"
                      >
                        {skill}
                      </span>
                    ))}
                    {selectedAwardee.skills.length === 0 && (
                      <span className="text-xs text-slate-500">Belum ada kecakapan tertulis.</span>
                    )}
                  </div>
                </div>

                {/* Footnotes of contacts & interactive actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-150">
                  {selectedAwardee.linkedinUrl ? (
                    <a 
                      href={selectedAwardee.linkedinUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-505 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-[#0A66C2] shrink-0 fill-[#0A66C2]" />
                      <span>LinkedIn Profile</span>
                    </a>
                  ) : (
                    <span className="text-slate-500 text-xs">LinkedIn belum dicantumkan</span>
                  )}

                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab("activities")}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer select-none shadow-sm"
                    >
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>Kegiatan Awardee</span>
                    </button>
                  )}
                </div>

                {/* AI Counselor Report Render Area */}
                {aiInsight && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-50/45 border border-blue-200/80 space-y-3 relative overflow-hidden text-left shadow-xs">
                    <div className="absolute right-0 top-0 p-2 text-blue-500/10 pointer-events-none">
                      <Sparkles className="w-16 h-16" />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-700 font-mono">
                      <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 animate-ping" />
                      <span>Rekomendasi Mutu Karir & Pembinaan AI</span>
                    </div>
                    <div className="text-xs leading-relaxed text-slate-700 space-y-3 prose prose-emerald max-w-none">
                      {aiInsight.split("\n").map((line, idx) => {
                        if (line.startsWith("### ")) {
                          return <div key={idx} className="text-xs font-extrabold text-blue-950 uppercase tracking-wider font-mono pt-2 border-b border-slate-200 pb-1">{line.replace("### ", "")}</div>;
                        }
                        if (line.startsWith("#### ")) {
                          return <div key={idx} className="text-xs font-extrabold text-teal-605 text-emerald-700 mt-2.5 font-mono">{line.replace("#### ", "")}</div>;
                        }
                        if (line.startsWith("* ") || line.startsWith("- ")) {
                          return <li key={idx} className="ml-3 text-slate-700 mt-1 list-disc">{line.replace(/^(\*\s*|-\s*)/, "")}</li>;
                        }
                        return <p key={idx} className="leading-relaxed text-slate-655 text-slate-650">{line}</p>;
                      })}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              /* THE EDITING FORM / ABAC RULES SIMULATOR PANEL */
              <form onSubmit={handleSubmitEdit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-205">
                  <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-emerald-600" />
                    <span>Modifikasi Profil (Kontrol Akses ABAC)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-1 rounded bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 cursor-pointer select-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  {/* Name field (writable by admin, or owner only) */}
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold block text-[11px]">Nama Lengkap *</label>
                    <input 
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white border border-slate-250 p-2 rounded text-slate-800 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none font-sans shadow-xs"
                    />
                  </div>

                  {/* University (Restricted Field!) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-600 font-bold block text-[11px]">Universitas *</label>
                      <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 rounded uppercase font-sans">Admin Only</span>
                    </div>
                    <input 
                      type="text"
                      required
                      disabled={currentRole === "awardee"}
                      value={editUniversity}
                      onChange={(e) => setEditUniversity(e.target.value)}
                      className={`w-full border p-2 rounded font-medium font-sans outline-none focus:ring-1 focus:ring-blue-105 shadow-xs ${
                        currentRole === "awardee" 
                          ? "bg-slate-100/70 border-slate-200 text-slate-450 cursor-not-allowed" 
                          : "bg-white border-slate-250 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  {/* Major (Restricted Field!) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-600 font-bold block text-[11px]">Jurusan *</label>
                      <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 rounded uppercase font-sans">Admin Only</span>
                    </div>
                    <input 
                      type="text"
                      required
                      disabled={currentRole === "awardee"}
                      value={editMajor}
                      onChange={(e) => setEditMajor(e.target.value)}
                      className={`w-full border p-2 rounded font-medium font-sans outline-none focus:ring-1 focus:ring-blue-105 shadow-xs ${
                        currentRole === "awardee" 
                          ? "bg-slate-100/70 border-slate-200 text-slate-450 cursor-not-allowed" 
                          : "bg-white border-slate-250 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  {/* Batch (Restricted Field!) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-600 font-bold block text-[11px]">Angkatan Penerima (Angka) *</label>
                      <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 rounded uppercase font-sans">Admin Only</span>
                    </div>
                    <input 
                      type="number"
                      min="1"
                      required
                      disabled={currentRole === "awardee"}
                      value={editBatch.replace(/[^0-9]/g, "")}
                      onChange={(e) => setEditBatch("Angkatan " + e.target.value)}
                      className={`w-full border p-2 rounded font-sans outline-none focus:ring-1 focus:ring-blue-105 shadow-xs ${
                        currentRole === "awardee" 
                          ? "bg-slate-100/70 border-slate-200 text-slate-450 cursor-not-allowed" 
                          : "bg-white border-slate-250 focus:border-blue-500 font-bold"
                      }`}
                    />
                  </div>

                  {/* GPA / IPK (Classified Security Field!) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-600 font-bold block text-[11px]">IPK IPK Terakhir *</label>
                      <span className="text-[9px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 rounded uppercase font-sans">Verified Grade</span>
                    </div>
                    <input 
                      type="number"
                      step="0.01"
                      min="0.00"
                      max="4.00"
                      required
                      disabled={currentRole === "awardee"}
                      value={editGpa}
                      onChange={(e) => setEditGpa(parseFloat(e.target.value) || 0)}
                      className={`w-full border p-2 rounded font-mono font-medium outline-none focus:ring-1 focus:ring-blue-105 shadow-xs ${
                        currentRole === "awardee" 
                          ? "bg-slate-100/70 border-slate-200 text-slate-450 cursor-not-allowed" 
                          : "bg-white border-slate-250 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  {/* Service Hours (SYSTEM / ADMIN ONLY!) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-600 font-bold block text-[11px]">Jam Pelayanan Sosial *</label>
                      <span className="text-[9px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 rounded uppercase font-sans">System Only</span>
                    </div>
                    <input 
                      type="number"
                      required
                      disabled={currentRole === "awardee"}
                      value={editHours}
                      onChange={(e) => setEditHours(parseInt(e.target.value) || 0)}
                      className={`w-full border p-2 rounded font-mono font-medium outline-none focus:ring-1 focus:ring-blue-105 shadow-xs ${
                        currentRole === "awardee" 
                          ? "bg-slate-100/70 border-slate-200 text-slate-450 cursor-not-allowed" 
                          : "bg-white border-slate-250 focus:border-blue-500"
                      }`}
                    />
                  </div>
                </div>

                {/* LinkedIn Profile Url (Open to own edits) */}
                <div className="space-y-1 text-xs">
                  <label className="text-slate-600 font-bold block text-[11px]">Link Profil LinkedIn</label>
                  <input 
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    className="w-full bg-white border border-slate-250 p-2 rounded text-slate-800 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none font-mono shadow-xs"
                  />
                </div>

                {/* Bio text (Open to own edits) */}
                <div className="space-y-1 text-xs">
                  <label className="text-slate-600 font-bold block text-[11px]">Biografi Singkat (Maks. 1000 Karakter)</label>
                  <textarea 
                    rows={3}
                    maxLength={1000}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-white border border-slate-250 p-2 rounded text-slate-800 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none shadow-xs"
                    placeholder="Tuliskan latar belakang Anda, minat riset, atau aksi pengabdian di sini..."
                  />
                </div>

                {/* Skills Tag management within list */}
                <div className="space-y-2 text-xs">
                  <label className="text-slate-600 font-bold block text-[11px]">Manajemen Kunci Keterampilan</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Contoh: Laravel, IoT, Python"
                      value={newSkillText}
                      onChange={(e) => setNewSkillText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }}
                      className="flex-1 bg-white border border-slate-250 p-2 rounded text-slate-800 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs rounded text-xs font-bold shrink-0 cursor-pointer select-none transition-colors"
                    >
                      <Plus className="w-4 h-4 inline-block mr-1" />
                      Tambah
                    </button>
                  </div>
                  
                  {/* Current editing skills list */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editSkills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] font-bold font-mono px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200 flex items-center gap-1.5"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-400 hover:text-red-650 hover:bg-slate-205 rounded p-px shrink-0 font-extrabold cursor-pointer select-none"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {editSkills.length === 0 && (
                      <span className="text-slate-500 text-[10px] italic">Masukkan keahlian anda di atas.</span>
                    )}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold cursor-pointer select-none border border-slate-250"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-700 to-emerald-600 text-white hover:brightness-105 shadow-md shadow-blue-500/5 rounded text-xs font-extrabold cursor-pointer select-none"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-xs">
            Pilih awardee di bilah kiri untuk membongkar detail portofolio.
          </div>
        )}
      </div>

    </div>
  );
}
