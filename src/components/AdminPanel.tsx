import React, { useState, useEffect } from "react";
import { 
  Shield, 
  UserCheck, 
  UserX, 
  Mail, 
  Search, 
  Edit, 
  AlertTriangle, 
  Ban, 
  Trash2, 
  X, 
  Save, 
  ChevronRight,
  ShieldAlert,
  Sliders,
  Check,
  Layers,
  Users
} from "lucide-react";
import { AwardeeProfile, User, EmailNotification, UserRole } from "../types";

interface AdminPanelProps {
  currentUser: User | null;
  currentRole: UserRole;
  awardees: AwardeeProfile[];
  onApprove: (awardeeId: string) => void;
  onReject: (awardeeId: string) => void;
  emails: EmailNotification[];
  onViewEmail: (email: EmailNotification) => void;
  onUpdateAwardee: (updated: AwardeeProfile) => void;
  onDeleteAwardee: (id: string) => void;
  users?: User[];
  onAddStaff?: (name: string, email: string, role: "fasilitator" | "kepala_asrama" | "admin") => { success: boolean; message: string };
  onDeleteStaff?: (uid: string) => void;
  batches?: string[];
  onAddBatch?: (batch: string) => void;
  onDeleteBatch?: (batch: string) => void;
}

export default function AdminPanel({
  currentUser,
  currentRole,
  awardees,
  onApprove,
  onReject,
  emails = [],
  onViewEmail,
  onUpdateAwardee,
  onDeleteAwardee,
  users = [],
  onAddStaff,
  onDeleteStaff,
  batches = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  onAddBatch,
  onDeleteBatch
}: AdminPanelProps) {
  const isSeniors = currentRole === "fasilitator" || currentRole === "kepala_asrama";
  const [adminActiveTab, setAdminActiveTab] = useState<"database" | "approval" | "smtp" | "staff" | "batches">(
    isSeniors ? "approval" : "database"
  );
  const [deleteBatchConfirmId, setDeleteBatchConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (deleteBatchConfirmId) {
      const timer = setTimeout(() => {
        setDeleteBatchConfirmId(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [deleteBatchConfirmId]);
  
  // New Staff Registration states
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"fasilitator" | "kepala_asrama" | "admin">("fasilitator");
  const [newStaffSuccess, setNewStaffSuccess] = useState<string | null>(null);
  const [newStaffError, setNewStaffError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingAwardeeId, setEditingAwardeeId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteStaffId, setConfirmDeleteStaffId] = useState<string | null>(null);
  const [promoteSearchTerm, setPromoteSearchTerm] = useState("");

  // Edit Form States
  const [editName, setEditName] = useState("");
  const [editUniversity, setEditUniversity] = useState("");
  const [editMajor, setEditMajor] = useState("");
  const [editBatch, setEditBatch] = useState("Angkatan 9");
  const [editGpa, setEditGpa] = useState<string>("3.50");
  const [editBio, setEditBio] = useState("");
  const [editLinkedinUrl, setEditLinkedinUrl] = useState("");

  const pendingAwardees = awardees.filter(a => a.status === "menunggu");

  const handleStartEdit = (a: AwardeeProfile) => {
    setEditingAwardeeId(a.awardeeId);
    setEditName(a.name);
    setEditUniversity(a.university);
    setEditMajor(a.major);
    setEditBatch(a.batch);
    setEditGpa(a.gpa.toString());
    setEditBio(a.bio);
    setEditLinkedinUrl(a.linkedinUrl);
  };

  const handleSaveEdit = (awardeeId: string) => {
    const original = awardees.find(a => a.awardeeId === awardeeId);
    if (!original) return;
    const updated: AwardeeProfile = {
      ...original,
      name: editName,
      university: editUniversity,
      major: editMajor,
      batch: editBatch,
      gpa: parseFloat(editGpa) || 0.0,
      bio: editBio,
      linkedinUrl: editLinkedinUrl,
      updatedAt: new Date().toISOString()
    };
    onUpdateAwardee(updated);
    setEditingAwardeeId(null);
  };

  const handleToggleSuspend = (a: AwardeeProfile) => {
    const updatedStatus = a.status === "suspended" ? "active" : "suspended";
    const updated: AwardeeProfile = {
      ...a,
      status: updatedStatus as any,
      updatedAt: new Date().toISOString()
    };
    onUpdateAwardee(updated);
  };

  const handleToggleBan = (a: AwardeeProfile) => {
    const updatedStatus = a.status === "banned" ? "active" : "banned";
    const updated: AwardeeProfile = {
      ...a,
      status: updatedStatus as any,
      updatedAt: new Date().toISOString()
    };
    onUpdateAwardee(updated);
  };

  const isAllowed = currentRole === "admin" || currentRole === "fasilitator" || currentRole === "kepala_asrama";
  
  if (!isAllowed) {
    return (
      <div className="bg-white border border-slate-200 p-6 rounded-xl text-center space-y-3">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <p className="text-sm font-bold text-slate-700">Akses Ditolak: Halaman ini khusus untuk Pengurus Asrama.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visual Identity Title banner */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs text-left">
        <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600 animate-pulse" />
          <span>Panel Administrator (Management & Multi-Tenant Control)</span>
        </h2>
      </div>

      <div className="bg-white border border-slate-205 rounded-xl p-6 shadow-sm space-y-6 text-left">
        
        {/* Inner Tabs Navigation */}
        <div className="flex flex-wrap border-b border-slate-200 -mx-6 px-6 gap-2 bg-slate-50/50 py-1.5 rounded-t-lg mb-2">
          {!isSeniors && (
            <button
              type="button"
              onClick={() => setAdminActiveTab("database")}
              className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                adminActiveTab === "database"
                  ? "border-emerald-650 text-emerald-700 font-extrabold bg-emerald-50/10"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Kelola Database</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setAdminActiveTab("approval")}
            className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              adminActiveTab === "approval"
                ? "border-emerald-650 text-emerald-700 font-extrabold bg-emerald-50/10"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Persetujuan Registrasi</span>
            {pendingAwardees.length > 0 && (
              <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse font-mono">
                {pendingAwardees.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setAdminActiveTab("smtp")}
            className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              adminActiveTab === "smtp"
                ? "border-emerald-650 text-emerald-700 font-extrabold bg-emerald-50/10"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Mail className="w-4 h-4 text-emerald-650" />
            <span>Logs SMTP</span>
            {emails.length > 0 && (
              <span className="bg-blue-650 text-white text-[9px] px-2 py-0.5 rounded-full font-mono font-black">
                {emails.length}
              </span>
            )}
          </button>
          {!isSeniors && (
            <button
              type="button"
              onClick={() => setAdminActiveTab("staff")}
              className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                adminActiveTab === "staff"
                  ? "border-emerald-650 text-emerald-700 font-extrabold bg-emerald-50/10"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Kelola Staf &amp; Pengurus</span>
            </button>
          )}
          {!isSeniors && (
            <button
              type="button"
              onClick={() => setAdminActiveTab("batches")}
              className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                adminActiveTab === "batches"
                  ? "border-emerald-650 text-emerald-700 font-extrabold bg-emerald-50/10"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Kelola Batch (Angkatan)</span>
            </button>
          )}
        </div>

        {/* Tab 1: Database Management */}
        {adminActiveTab === "database" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-1 pb-3 border-b border-slate-105">
              <h4 className="text-sm font-black text-blue-950 flex items-center gap-1.5 uppercase tracking-wide font-sans">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Kelola Database &amp; Status Akses Awardee</span>
              </h4>
              <p className="text-[11px] text-slate-500 font-sans">
                Pencarian, pembaruan data asrama, penangguhan sementara, pemblokiran akses, atau penghapusan data secara tuntas.
              </p>
            </div>

            {/* Filters & Search controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, universitas, atau program studi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none text-slate-800 transition-all font-sans"
                />
              </div>
              
              <div className="w-full sm:w-48 shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:bg-white outline-none cursor-pointer font-sans"
                >
                  <option value="all">Semua Status (All)</option>
                  <option value="active">Aktif (Active)</option>
                  <option value="menunggu">Menunggu Verifikasi</option>
                  <option value="suspended">Ditangguhkan (Suspended)</option>
                  <option value="banned">Diblokir (Banned)</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
            </div>

            {/* Result List */}
            {awardees.filter((aw) => {
              const matchesSearch = 
                aw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                aw.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                aw.major.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesStatus = 
                statusFilter === "all" || aw.status === statusFilter;
              return matchesSearch && matchesStatus;
            }).length === 0 ? (
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-400 italic text-xs font-semibold font-sans">
                Tidak ada pengajuan atau data awardee yang cocok dengan filter pencarian Anda.
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                {awardees.filter((aw) => {
                  const matchesSearch = 
                    aw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    aw.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    aw.major.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = 
                    statusFilter === "all" || aw.status === statusFilter;
                  return matchesSearch && matchesStatus;
                }).map((aw) => {
                  const isEditing = editingAwardeeId === aw.awardeeId;
                  return (
                    <div 
                      key={aw.awardeeId} 
                      className={`p-4 border rounded-xl transition-all space-y-4 ${
                        isEditing 
                          ? "bg-slate-50 border-blue-300 ring-1 ring-blue-100" 
                          : aw.status === "suspended"
                            ? "bg-amber-50/20 border-amber-300"
                            : aw.status === "banned"
                              ? "bg-rose-50/20 border-rose-300"
                              : aw.status === "menunggu"
                                ? "bg-emerald-50/10 border-emerald-300"
                                : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {isEditing ? (
                        /* EDIT FORM */
                        <div className="space-y-3 font-sans text-left">
                          <div className="bg-blue-50 p-2 text-[10.5px] font-bold text-blue-800 rounded-lg flex items-center gap-2 mb-2">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Mode Pengeditan Akurat: {aw.name}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-slate-500 block">Nama Lengkap</label>
                              <input 
                                type="text" 
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-800 focus:border-blue-500 font-bold outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-slate-500 block">Universitas</label>
                              <input 
                                type="text" 
                                value={editUniversity}
                                onChange={(e) => setEditUniversity(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-800 focus:border-blue-500 font-bold outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-slate-500 block">Program Studi / Jurusan</label>
                              <input 
                                type="text" 
                                value={editMajor}
                                onChange={(e) => setEditMajor(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-800 focus:border-blue-500 font-bold outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-slate-500 block">Angkatan Sinergi (Angka)</label>
                              <select 
                                value={editBatch}
                                onChange={(e) => setEditBatch(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-800 focus:border-blue-500 font-bold outline-none cursor-pointer font-sans"
                                required
                              >
                                {batches.map(b => (
                                  <option key={b} value={b}>{b}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-slate-500 block">Indeks Prestasi Kumulatif (IPK)</label>
                              <input 
                                type="text" 
                                value={editGpa}
                                onChange={(e) => setEditGpa(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-800 focus:border-blue-500 font-bold outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-slate-500 block">LinkedIn URL</label>
                              <input 
                                type="text" 
                                value={editLinkedinUrl}
                                onChange={(e) => setEditLinkedinUrl(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-800 focus:border-blue-500 font-medium outline-none"
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[10px] uppercase text-slate-500 block">Bio Deskripsi Singkat</label>
                              <textarea 
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-800 focus:border-blue-500 font-medium outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => setEditingAwardeeId(null)}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10.5px] font-extrabold rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Batal</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(aw.awardeeId)}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-extrabold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Simpan Perubahan</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* NOT EDITING - VIEW CARD */
                        <div className="space-y-3 font-sans text-left">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <img 
                                src={aw.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                                alt={aw.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full border border-slate-100 object-cover shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="font-extrabold text-[12.5px] text-slate-900 leading-snug">{aw.name}</h5>
                                  
                                  {/* Staff / Promoted Badges */}
                                  {(() => {
                                    const matchUser = users?.find(u => u.uid === aw.awardeeId || u.name.toLowerCase() === aw.name.toLowerCase());
                                    if (matchUser?.role === "fasilitator") {
                                      return (
                                        <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded">
                                          Fasilitator
                                        </span>
                                      );
                                    }
                                    if (matchUser?.role === "kepala_asrama") {
                                      return (
                                        <span className="text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-705 border border-amber-250 px-1.5 py-0.5 rounded">
                                          Kepala Asrama
                                        </span>
                                      );
                                    }
                                    return null;
                                  })()}

                                  {/* Status Badges */}
                                  {aw.status === "active" && (
                                    <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                                      Aktif
                                    </span>
                                  )}
                                  {aw.status === "alumni" && (
                                    <span className="text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                                      Alumni
                                    </span>
                                  )}
                                  {aw.status === "menunggu" && (
                                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                                      Menunggu Verifikasi
                                    </span>
                                  )}
                                  {aw.status === "suspended" && (
                                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded animate-pulse">
                                      Suspended ⚠️
                                    </span>
                                  )}
                                  {aw.status === "banned" && (
                                    <span className="text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-900 border border-red-300 px-1.5 py-0.5 rounded animate-pulse">
                                      Banned 🚫
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                  {aw.university} &bull; {aw.major}
                                </p>
                                {(() => {
                                  const matchUser = users?.find(u => u.uid === aw.awardeeId || u.name.toLowerCase() === aw.name.toLowerCase());
                                  const emailDisplay = matchUser?.email || `${aw.name.toLowerCase().replace(/\s+/g, "")}@brightscholarship.org`;
                                  return (
                                    <p className="text-[9.5px] text-blue-600 font-black font-mono flex items-center gap-1 mt-0.5">
                                      <Mail className="w-2.5 h-2.5 shrink-0 text-blue-500" />
                                      <span>{emailDisplay}</span>
                                    </p>
                                  );
                                })()}
                                <div className="flex gap-2 items-center flex-wrap pt-1 text-[9.5px] text-slate-600 font-mono font-bold uppercase">
                                  <span>📚 IPK {aw.gpa.toFixed(2)}</span>
                                  <span>&bull;</span>
                                  <span>🎓 {aw.batch}</span>
                                  <span>&bull;</span>
                                  <span>🕒 Berbagi {aw.totalServiceHours} Jam</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right text-[10px] text-slate-400 font-mono">
                              ID: {aw.awardeeId}
                            </div>
                          </div>

                          {aw.bio && (
                            <p className="text-[11px] font-medium text-slate-655 leading-relaxed italic border-l-2 border-slate-200 pl-2.5">
                              &ldquo;{aw.bio}&rdquo;
                            </p>
                          )}

                          {/* Management buttons line */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                            <div className="flex flex-wrap gap-1.5">
                              {/* Start edit details */}
                              <button
                                onClick={() => handleStartEdit(aw)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black cursor-pointer transition-all flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5 text-slate-500" />
                                <span>Edit Profil</span>
                              </button>

                              {/* Suspend / Unsuspend Toggle */}
                              <button
                                onClick={() => handleToggleSuspend(aw)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition-all flex items-center gap-1 border ${
                                  aw.status === "suspended"
                                    ? "bg-amber-100 hover:bg-amber-150 text-amber-900 border-amber-300"
                                    : "bg-amber-50 hover:bg-amber-100/60 text-amber-700 border-amber-200"
                                }`}
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>{aw.status === "suspended" ? "Undo Suspend" : "Suspend Akun"}</span>
                              </button>

                              {/* Ban / Unban Toggle */}
                              <button
                                onClick={() => handleToggleBan(aw)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition-all flex items-center gap-1 border ${
                                  aw.status === "banned"
                                    ? "bg-red-100 hover:bg-red-150 text-red-900 border-red-300"
                                    : "bg-red-50 hover:bg-red-100/60 text-red-700 border-red-200"
                                }`}
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>{aw.status === "banned" ? "Undo Banned" : "Banned Akun"}</span>
                              </button>
                            </div>

                            {/* Action row end: Deletion */}
                            <div className="flex items-center gap-2">
                              {confirmDeleteId === aw.awardeeId ? (
                                <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                                  <span className="text-[10px] font-bold text-rose-700 px-1 font-sans">Yakin hapus tuntas?</span>
                                  <button
                                    onClick={() => {
                                      onDeleteAwardee(aw.awardeeId);
                                      setConfirmDeleteId(null);
                                    }}
                                    className="px-2 py-0.5 bg-red-600 hover:bg-red-750 text-white rounded text-[10px] font-extrabold cursor-pointer transition-colors"
                                  >
                                    Ya, Hapus
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-extrabold cursor-pointer hover:bg-slate-300 transition-all"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDeleteId(aw.awardeeId)}
                                  className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-300 rounded-lg text-[10px] font-black cursor-pointer transition-all flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Hapus Akun</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Registrations Pending Approval */}
        {adminActiveTab === "approval" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 pb-2 border-b border-rose-100">
              <h4 className="text-sm font-black text-rose-900 flex items-center gap-1.5 uppercase tracking-wide font-sans">
                <UserCheck className="w-4 h-4 text-rose-650" />
                <span>Otoritas Verifikasi Registrasi Akun</span>
              </h4>
              <p className="text-[11px] text-slate-500 font-sans">
                Memvalidasi, mengkaji formulir kelayakan pendaftaran awardee baru, dan menyebarkan notifikasi surat resmi aktivasi otomatis.
              </p>
            </div>

            {pendingAwardees.length === 0 ? (
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-400 italic text-xs font-semibold font-sans">
                Belum ada pengajuan pendaftaran awardee baru saat ini. Semua pendaftaran telah diproses tuntas!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-sans">
                {pendingAwardees.map((pending) => (
                  <div key={pending.awardeeId} className="p-4 bg-white border border-slate-205 hover:border-slate-350 rounded-xl transition-all flex flex-col justify-between space-y-3 shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5 justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                            {pending.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800 leading-tight block">{pending.name}</h4>
                            <p className="text-[9.5px] text-slate-400 mt-0.5">Didaftarkan: {new Date(pending.updatedAt).toLocaleTimeString()}</p>
                          </div>
                        </div>
                        
                        <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded uppercase shrink-0 font-mono">
                          Menunggu
                        </span>
                      </div>

                      <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 transition-all text-[11px] space-y-1">
                        <p className="text-slate-650 font-medium"><strong className="text-slate-800 font-semibold font-sans">Universitas:</strong> {pending.university}</p>
                        <p className="text-slate-650 font-medium"><strong className="text-slate-800 font-semibold font-sans">Program Studi:</strong> {pending.major}</p>
                        <p className="text-slate-650 font-medium"><strong className="text-slate-800 font-semibold font-sans">Angkatan:</strong> {pending.batch}</p>
                        <p className="text-emerald-700 font-extrabold font-mono"><strong className="text-slate-800 font-sans font-semibold">IPK Terdaftar:</strong> {pending.gpa.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 justify-end">
                      <button
                        type="button"
                        onClick={() => onReject(pending.awardeeId)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-655 border border-red-200/40 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                      >
                        <UserX className="w-3.5 h-3.5 mt-0.5 animate-pulse" />
                        <span>Tolak</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onApprove(pending.awardeeId)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-250 mt-0.5" />
                        <span>Setujui</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: SMTP Logs */}
        {adminActiveTab === "smtp" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 pb-2 border-b border-slate-200 text-left">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wide font-sans">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>Log Pengiriman Surat Elektronik Otomatis (SMTP Engine)</span>
              </h4>
              <p className="text-[11px] text-slate-500 font-sans">
                Tinjau logs pengiriman surat elektronik resmi, diagnostic signals, serta status koneksi SMTP server.
              </p>
            </div>

            {emails && emails.length > 0 ? (
              <div className="space-y-4 font-sans text-left">
                <p className="text-slate-500 text-xs leading-relaxed font-sans text-left">
                  Berikut adalah riwayat surat elektronik yang dipicu saat persetujuan admin. Apabila Anda telah memasukkan kredensial SMTP asli, surat akan resmi dikirim ke mailbox real penerima. Klik surat untuk meninjau template HTML interaktif.
                </p>

                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 font-sans text-left">
                  {emails.map((mail) => (
                    <div 
                      key={mail.id} 
                      onClick={() => onViewEmail(mail)}
                      className={`p-4 border rounded-xl transition-all cursor-pointer flex flex-col justify-between group ${
                        mail.isRealSent 
                          ? "bg-emerald-50/40 border-emerald-250 hover:bg-emerald-50" 
                          : "bg-slate-50 hover:bg-slate-100/70 border-slate-200"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className={`font-black uppercase tracking-wider font-mono ${
                            mail.isRealSent ? "text-emerald-700 text-[9px]" : "text-amber-700 font-bold"
                          }`}>
                            {mail.isRealSent ? "✔ SMTP SECURE DIRECT DELIVERY" : "ℹ NOTIFIKASI EMAIL TERKIRIM (SANDBOX QUEUE)"}
                          </span>
                          <span className="text-slate-400 font-mono">{new Date(mail.sentAt).toLocaleTimeString()}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">
                          {mail.subject}
                        </h4>
                        <div className="text-[11px] text-slate-550 leading-relaxed font-sans">
                          <span className="block"><strong className="text-slate-705 font-semibold text-[10.5px]">Penerima:</strong> {mail.toName}</span>
                          <span className="block text-[10px] text-slate-450 font-mono mt-0.5">{mail.toEmail}</span>
                        </div>
                        
                        {/* Status Diagnostic Message */}
                        {mail.smtpMessage && (
                          <div className={`mt-2 p-2 rounded text-[9.5px] leading-relaxed font-mono ${
                            mail.isRealSent ? "bg-emerald-100/50 text-emerald-800 border border-emerald-250" : "bg-amber-100/40 text-amber-850 border border-amber-205"
                          }`}>
                            <strong>Status Pengiriman SMTP:</strong> {mail.smtpMessage}
                          </div>
                        )}
                      </div>
                      <div className="pt-3 mt-4 border-t border-slate-150 flex justify-between items-center text-[10px] font-bold text-blue-600 font-sans">
                        <span>Detail Log Notifikasi Surel ↗</span>
                        <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 bg-slate-50 border border-slate-105 rounded-xl text-center text-slate-400 font-semibold text-xs font-sans">
                Belum ada riwayat email terkirim di sistem outbox. Pendaftaran baru yang disetujui akan memicu pengiriman email aktivasi secara otomatis.
              </div>
            )}

            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-[10.5px] text-amber-900 leading-relaxed font-sans text-left">
              🛡 **Konfigurasikan Alamat SMTP Pengirim Resmi:** Untuk mengaktifkan pengiriman email asli ke Gmail/Inbox awardee asli, pastikan Anda telah memasukkan kredensial SMTP Anda di menu **Settings (ikon roda gigi kiri bawah) lalu Secrets Panel** dengan variabel <code className="bg-white px-1 py-0.5 rounded font-mono font-bold text-[10px] border border-amber-205">SMTP_USER</code> dan <code className="bg-white px-1 py-0.5 rounded font-mono font-bold text-[10px] border border-amber-205">SMTP_PASS</code>.
            </div>
          </div>
        )}

        {/* Tab 4: Kelola Staf & Pengurus */}
        {adminActiveTab === "staff" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-1 pb-3 border-b border-slate-105 text-left">
              <h4 className="text-sm font-black text-blue-950 flex items-center gap-1.5 uppercase tracking-wide font-sans">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Manajemen Hak Akses &amp; Akun Staf Pengurus</span>
              </h4>
              <p className="text-[11px] text-slate-500 font-sans">
                Tambahkan dan kelola kredensial email Fasilitator Akademik serta Kepala Asrama untuk memiliki otorisasi penuh, kecuali menu NoSQL dan Kelola Database.
              </p>
            </div>

            {/* Promosikan Awardee Seksi */}
            <div className="bg-emerald-50/45 border border-emerald-250 border-emerald-200 rounded-xl p-4.5 space-y-3 text-left">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-650 text-emerald-600" />
                <h5 className="text-[11.5px] font-black uppercase tracking-wider text-emerald-950">Promosi Cepat Awardee Aktif</h5>
              </div>
              <p className="text-[11px] text-emerald-900 leading-normal">
                Ketik nama atau universitas awardee aktif untuk melengkapi formulir pendaftaran staf di bawah secara otomatis.
              </p>
              
              {/* Search input field */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Ketik nama atau kampus asrama awardee..."
                  value={promoteSearchTerm}
                  onChange={(e) => setPromoteSearchTerm(e.target.value)}
                  className="w-full pl-8.5 pl-8 pr-3 py-1.5 bg-white border border-slate-205 rounded-lg text-xs font-semibold focus:border-emerald-555 focus:border-emerald-500 outline-none placeholder-slate-405 text-slate-800"
                />
                {promoteSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setPromoteSearchTerm("")}
                    className="absolute right-2.5 top-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer font-bold"
                  >
                    Batal
                  </button>
                )}
              </div>

              {/* Suggestions dropdown logic (Only shows if search term has input) */}
              {promoteSearchTerm ? (
                <div className="bg-white border border-slate-200/80 rounded-lg divide-y divide-slate-100 overflow-hidden shadow-xs animate-fadeIn max-h-40 overflow-y-auto">
                  {(() => {
                    const filtered = awardees
                      ? awardees.filter(
                          (a) =>
                            a.status === "active" &&
                            (a.name.toLowerCase().includes(promoteSearchTerm.toLowerCase()) ||
                              a.university.toLowerCase().includes(promoteSearchTerm.toLowerCase()))
                        )
                      : [];

                    if (filtered.length === 0) {
                      return (
                        <div className="p-3 text-center text-[10.5px] text-slate-400 font-medium">
                          Tidak ditemukan awardee aktif dengan nama/kampus tersebut.
                        </div>
                      );
                    }

                    return filtered.map((a) => {
                      const awardeeUser = users?.find((u) => u.uid === a.awardeeId || u.name === a.name);
                      const awardeeEmail =
                        awardeeUser?.email || `${a.name.toLowerCase().replace(/\s+/g, "")}@brightscholarship.org`;
                      const isSelected = newStaffEmail.toLowerCase() === awardeeEmail.toLowerCase();

                      return (
                        <div
                          key={a.awardeeId}
                          className={`flex items-center justify-between p-2 hover:bg-slate-50 transition-colors text-xs ${
                            isSelected ? "bg-emerald-50/50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {a.avatarUrl ? (
                              <img
                                src={a.avatarUrl}
                                alt={a.name}
                                className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[8px] shrink-0 uppercase">
                                {a.name.slice(0, 2)}
                              </div>
                            )}
                            <div className="truncate">
                              <span className="font-extrabold text-[11px] block text-slate-800 leading-tight">
                                {a.name}
                              </span>
                              <span className="text-[9px] block text-slate-400 font-mono leading-none">
                                {a.university} &bull; {a.batch}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setNewStaffName(a.name);
                              setNewStaffEmail(awardeeEmail);
                              setNewStaffSuccess(null);
                              setNewStaffError(null);
                              setPromoteSearchTerm(""); // Reset on select
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-black transition-all cursor-pointer ${
                              isSelected
                                ? "bg-emerald-600 text-white"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {isSelected ? "Terpilih" : "Pilih"}
                          </button>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : null}

              {/* Selected awardee badge */}
              {newStaffEmail && (
                <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-md border border-slate-200 text-[10px] animate-fadeIn pr-2 shadow-3xs">
                  <span className="font-semibold text-slate-700">
                    Siswa Terpilih: <span className="text-emerald-700 font-extrabold">{newStaffName}</span>{" "}
                    <span className="text-slate-400 font-mono">({newStaffEmail})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewStaffName("");
                      setNewStaffEmail("");
                    }}
                    className="text-rose-600 font-extrabold hover:underline text-[9.5px] cursor-pointer"
                  >
                    Batal Pilih
                  </button>
                </div>
              )}
            </div>

            {/* Form Tambah Staf Baru */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-left">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">Pendaftaran Email Staf Pengurus Baru</h5>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Call parent handler
                  if (onAddStaff) {
                    const res = onAddStaff(newStaffName, newStaffEmail, newStaffRole);
                    if (res.success) {
                      setNewStaffSuccess(res.message);
                      setNewStaffError(null);
                      setNewStaffName("");
                      setNewStaffEmail("");
                    } else {
                      setNewStaffError(res.message);
                      setNewStaffSuccess(null);
                    }
                  } else {
                    setNewStaffError("Handler pendaftaran staf tidak terhubung ke aplikasi utama.");
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
              >
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600">Nama Lengkap Staf *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ust. Hamdan, Lc."
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-250 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600">Alamat Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: hamdan@brightscholarship.org"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-250 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600">Peran Jabatan (Role) *</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as any)}
                    className="w-full text-xs bg-white border border-slate-250 rounded-lg p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-550"
                  >
                    <option value="fasilitator">Fasilitator</option>
                    <option value="kepala_asrama">Kepala Asrama</option>
                    <option value="admin">Admin / Pengurus Pusat</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-700 to-emerald-600 text-white hover:brightness-105 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm select-none h-[38px]"
                >
                  Daftarkan Email Pengurus
                </button>
              </form>

              {newStaffSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                  {newStaffSuccess}
                </div>
              )}

              {newStaffError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold">
                  {newStaffError}
                </div>
              )}
            </div>

            {/* List of Registered Staff */}
            <div className="space-y-3 text-left">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">Daftar Akun Pengurus &amp; Staf Asrama</h5>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Nama</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Jabatan / Peran</th>
                      <th className="p-3">Tanggal Dibuat</th>
                      <th className="p-3 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {users && users.filter(u => u.role === "admin" || u.role === "fasilitator" || u.role === "kepala_asrama").map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900">{u.name}</td>
                        <td className="p-3 font-mono text-slate-600 text-[11px]">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide uppercase ${
                            u.role === "admin" 
                              ? "bg-red-50 text-red-700 border border-red-200/50" 
                              : u.role === "fasilitator" 
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200/50"
                              : "bg-teal-50 text-teal-700 border border-teal-200/50"
                          }`}>
                            {u.role === "admin" ? "S-Admin / Pengurus Pusat" : u.role === "fasilitator" ? "Fasilitator" : "Kepala Asrama"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 text-[10px] font-mono">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}
                        </td>
                        <td className="p-3 text-center">
                          {u.uid !== currentUser?.uid ? (
                            confirmDeleteStaffId === u.uid ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="text-[9px] font-bold text-rose-700 font-sans">Yakin?</span>
                                <button
                                  onClick={() => {
                                    if (onDeleteStaff) onDeleteStaff(u.uid);
                                    setConfirmDeleteStaffId(null);
                                  }}
                                  className="px-2 py-0.5 bg-red-650 hover:bg-red-700 text-white rounded text-[10px] font-extrabold cursor-pointer transition-colors"
                                >
                                  Ya
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteStaffId(null)}
                                  className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold cursor-pointer hover:bg-slate-200"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteStaffId(u.uid)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center"
                                title="Hapus Akun Pengurus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium font-sans italic">Akun Anda</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Batch Management */}
        {adminActiveTab === "batches" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-1 pb-3 border-b border-slate-150">
              <h4 className="text-sm font-black text-blue-950 flex items-center gap-1.5 uppercase tracking-wide font-sans">
                <Layers className="w-4 h-4 text-emerald-650" />
                Manajemen Angkatan / Batch Sinergi
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                Gunakan fasilitas ini untuk menambah atau menghapus angkatan beasiswa aktif secara manual. Pilihan ini akan secara otomatis memperbarui semua dropdown pendaftaran, filter, dan profil di sistem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Side: Existing Batches with Delete Button */}
              <div className="md:col-span-7 bg-slate-50/50 rounded-xl border border-slate-205 p-5 space-y-4">
                <h5 className="text-xs font-black text-blue-950 uppercase tracking-wider font-sans">Daftar Angkatan Terdaftar</h5>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {batches.map((b) => (
                    <div 
                      key={b} 
                      className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between shadow-3xs group hover:border-emerald-250 transition-all"
                    >
                      <div className="font-bold text-slate-800 text-sm font-sans text-left">
                        Angkatan <span className="font-extrabold text-emerald-600 text-base font-mono">{b}</span>
                      </div>
                      
                      {deleteBatchConfirmId === b ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (onDeleteBatch) onDeleteBatch(b);
                            setDeleteBatchConfirmId(null);
                          }}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-extrabold px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-0.5 border-0"
                          title="Konfirmasi hapus angkatan"
                        >
                          <Check className="w-3 h-3 text-white" />
                          <span>Hapus?</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteBatchConfirmId(b)}
                          className="text-slate-300 hover:text-rose-600 hover:bg-rose-55 p-1.5 rounded transition-all cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100 border-0 bg-transparent flex items-center justify-center"
                          title={`Hapus Angkatan ${b}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Add New Batch form */}
              <div className="md:col-span-5 bg-white rounded-xl border border-slate-205 p-5 space-y-4 text-left">
                <h5 className="text-xs font-black text-blue-950 uppercase tracking-wider font-sans">Tambah Angkatan Baru</h5>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const val = fd.get("newBatchName") as string;
                    if (val && onAddBatch) {
                      onAddBatch(val);
                      e.currentTarget.reset();
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase font-sans">Nomor Angkatan (Hanya Angka)</label>
                    <input 
                      type="number" 
                      name="newBatchName"
                      min="1"
                      max="100"
                      placeholder="Contoh: 13"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-extrabold text-sm focus:border-emerald-500 focus:bg-white outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-emerald-600 to-blue-700 text-white font-extrabold text-xs rounded-lg shadow-sm hover:brightness-105 transition-all text-center cursor-pointer border-0"
                  >
                    Tambah Angkatan
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
