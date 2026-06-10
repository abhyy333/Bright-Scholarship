import React, { useState } from "react";
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  GraduationCap, 
  Linkedin, 
  Info, 
  Clock, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  UserX, 
  Key, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
  UserPlus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Ban,
  Shield,
  Save,
  Check,
  X,
  Eye,
  EyeOff
} from "lucide-react";
import { AwardeeProfile, User, UserRole, EmailNotification } from "../types";

interface AccountPortalProps {
  currentUser: User | null;
  currentUserProfile: AwardeeProfile | null;
  awardees: AwardeeProfile[];
  onLogin: (email: string, pass: string) => { success: boolean; message: string; user?: User };
  onLogout: () => void;
  onRegister: (regData: {
    name: string;
    email: string;
    university: string;
    major: string;
    batch: string;
    gpa: number;
    bio: string;
    linkedinUrl: string;
    skills: string[];
    password?: string;
  }) => { success: boolean; message: string };
  onApprove: (awardeeId: string) => void;
  onReject: (awardeeId: string) => void;
  currentRole: UserRole;
  emails: EmailNotification[];
  onViewEmail: (email: EmailNotification) => void;
  onUpdateAwardee: (updated: AwardeeProfile) => void;
  onDeleteAwardee: (id: string) => void;
  googleRegInfo?: { email: string; name: string; token: string } | null;
  onClearGoogleRegInfo?: () => void;
  batches?: string[];
  onForgotPassword?: (email: string) => { success: boolean; message: string };
}

const INDONESIAN_UNIVERSITIES = [
  "Universitas Indonesia (UI)",
  "Institut Teknologi Bandung (ITB)",
  "Universitas Gadjah Mada (UGM)",
  "Universitas Airlangga (UNAIR)",
  "Institut Pertanian Bogor (IPB University)",
  "Institut Teknologi Sepuluh Nopember (ITS)",
  "Universitas Padjadjaran (UNPAD)",
  "Universitas Diponegoro (UNDIP)",
  "Universitas Brawijaya (UB)",
  "Universitas Hasanuddin (UNHAS)",
  "Universitas Sebelas Maret (UNS)",
  "Universitas Pendidikan Indonesia (UPI)",
  "Universitas Negeri Yogyakarta (UNY)",
  "Universitas Negeri Jakarta (UNJ)",
  "Universitas Negeri Semarang (UNNES)",
  "Universitas Negeri Surabaya (UNESA)",
  "Universitas Negeri Malang (UM)",
  "Universitas Sumatera Utara (USU)",
  "Universitas Andalas (UNAND)",
  "Universitas Sriwijaya (UNSRI)",
  "Universitas Syiah Kuala (USK)",
  "Universitas Riau (UNRI)",
  "Universitas Jember (UNEJ)",
  "Universitas Mulawarman (UNMUL)",
  "Universitas Lambung Mangkurat (ULM)",
  "Universitas Sam Ratulangi (UNSRAT)",
  "Universitas Tadulako (UNTAD)",
  "Universitas Udayana (UNUD)",
  "Universitas Mataram (UNRAM)",
  "Universitas Pattimura (UNPATTI)",
  "Universitas Cenderawasih (UNCEN)",
  "Universitas Jenderal Soedirman (UNSOED)",
  "Universitas Tidar (UNTIDAR)",
  "Universitas Siliwangi (UNSIL)",
  "Universitas Singaperbangsa Karawang (UNSIKA)",
  "Universitas Malikussaleh (UNIMAL)",
  "Universitas Teuku Umar (UTU)",
  "Universitas Samudra (UNSAM)",
  "Universitas Bangka Belitung (UBB)",
  "Universitas Maritim Raja Ali Haji (UMRAH)",
  "Universitas Lampung (UNILA)",
  "Universitas Bengkulu (UNIB)",
  "Universitas Sultan Ageng Tirtayasa (UNTIRTA)",
  "Universitas Pembangunan Nasional Veteran Jakarta (UPN Veteran Jakarta)",
  "Universitas Pembangunan Nasional Veteran Yogyakarta (UPN Veteran Yogyakarta)",
  "Universitas Pembangunan Nasional Veteran Jawa Timur (UPN Veteran Jatim)",
  "Universitas Trunojoyo Madura (UTM)",
  "Universitas Khairun (UNKHAIR)",
  "Universitas Negeri Makassar (UNM)",
  "Universitas Negeri Gorontalo (UNG)",
  "Universitas Negeri Manado (UNIMA)",
  "UIN Syarif Hidayatullah Jakarta",
  "UIN Sunan Kalijaga Yogyakarta",
  "UIN Maulana Malik Ibrahim Malang",
  "UIN Sunan Ampel Surabaya",
  "UIN Sunan Gunung Djati Bandung",
  "UIN Walisongo Semarang",
  "UIN Alauddin Makassar",
  "UIN Ar-Raniry Banda Aceh",
  "UIN Raden Fatah Palembang",
  "UIN Sultan Syarif Kasim Riau (UIN Suska)"
];

export default function AccountPortal({
  currentUser,
  currentUserProfile,
  awardees,
  onLogin,
  onLogout,
  onRegister,
  onApprove,
  onReject,
  currentRole,
  emails = [],
  onViewEmail,
  onUpdateAwardee,
  onDeleteAwardee,
  googleRegInfo = null,
  onClearGoogleRegInfo,
  batches = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  onForgotPassword
}: AccountPortalProps) {
  const [activeSubTab, setActiveSubTab] = useState<"login" | "register">("login");

  // Forgot Password States
  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  const [forgotEmail, setForgotPasswordEmail] = useState("");
  const [forgotSuccess, setForgotPasswordSuccess] = useState<string | null>(null);
  const [forgotError, setForgotPasswordError] = useState<string | null>(null);

  React.useEffect(() => {
    if (googleRegInfo) {
      setActiveSubTab("register");
      setRegName(googleRegInfo.name);
      setRegEmail(googleRegInfo.email);
    }
  }, [googleRegInfo]);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Register Form States (Simplified as per user intent)
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUniversity, setRegUniversity] = useState("");
  const [showUnivSuggestions, setShowUnivSuggestions] = useState(false);
  const [regBatch, setRegBatch] = useState("9");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Kelola Awardee States for Admin
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingAwardeeId, setEditingAwardeeId] = useState<string | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<"database" | "approval" | "smtp">("database");
  
  // Edit Form States
  const [editName, setEditName] = useState("");
  const [editUniversity, setEditUniversity] = useState("");
  const [editMajor, setEditMajor] = useState("");
  const [editBatch, setEditBatch] = useState("9");
  const [editGpa, setEditGpa] = useState<string>("3.50");
  const [editBio, setEditBio] = useState("");
  const [editLinkedinUrl, setEditLinkedinUrl] = useState("");
  
  // Personal Profile Edit States (For Awardee Menu)
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalName, setPersonalName] = useState("");
  const [personalUniversity, setPersonalUniversity] = useState("");
  const [personalMajor, setPersonalMajor] = useState("");
  const [personalBatch, setPersonalBatch] = useState("9");
  const [personalGpa, setPersonalGpa] = useState("4.00");
  const [personalBio, setPersonalBio] = useState("");
  const [personalLinkedin, setPersonalLinkedin] = useState("");
  const [personalSkills, setPersonalSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  
  // Deletion confirm track
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter pending accounts specifically for admin view
  const pendingAwardees = awardees.filter(a => a.status === "menunggu");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Email dan password harus diisi.");
      return;
    }

    const res = onLogin(loginEmail.trim(), loginPassword.trim());
    if (res.success && res.user) {
      setLoginSuccess(`Berhasil masuk! Selamat datang kembali, ${res.user.name}.`);
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setLoginError(res.message);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError(null);
    setForgotPasswordSuccess(null);

    const cleanEmail = forgotEmail.trim();
    if (!cleanEmail) {
      setForgotPasswordError("Harap masukkan alamat email Anda.");
      return;
    }

    if (onForgotPassword) {
      const res = onForgotPassword(cleanEmail);
      if (res.success) {
        setForgotPasswordSuccess(res.message);
        setForgotPasswordEmail("");
      } else {
        setForgotPasswordError(res.message);
      }
    } else {
      setForgotPasswordError("Fitur pemulihan kredensial sedang tidak aktif.");
    }
  };

  const handleStartPersonalEdit = () => {
    if (!currentUserProfile) return;
    setPersonalName(currentUserProfile.name);
    setPersonalUniversity(currentUserProfile.university);
    setPersonalMajor(currentUserProfile.major);
    setPersonalBatch(currentUserProfile.batch);
    setPersonalGpa(currentUserProfile.gpa.toString());
    setPersonalBio(currentUserProfile.bio);
    setPersonalLinkedin(currentUserProfile.linkedinUrl || "");
    setPersonalSkills([...(currentUserProfile.skills || [])]);
    setIsEditingPersonal(true);
  };

  const handleSavePersonalEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserProfile) return;
    const updated: AwardeeProfile = {
      ...currentUserProfile,
      name: personalName.trim() || currentUserProfile.name,
      university: personalUniversity.trim() || currentUserProfile.university,
      major: personalMajor.trim() || currentUserProfile.major,
      batch: personalBatch || currentUserProfile.batch,
      gpa: parseFloat(personalGpa) || currentUserProfile.gpa,
      bio: personalBio.trim() || currentUserProfile.bio,
      linkedinUrl: personalLinkedin.trim() || currentUserProfile.linkedinUrl,
      skills: personalSkills,
      updatedAt: new Date().toISOString()
    };
    onUpdateAwardee(updated);
    setIsEditingPersonal(false);
  };

  const handleAddPersonalSkill = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") return;
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill && !personalSkills.includes(cleanSkill)) {
      setPersonalSkills(prev => [...prev, cleanSkill]);
      setSkillInput("");
    }
  };

  const handleRemovePersonalSkill = (skillToRemove: string) => {
    setPersonalSkills(prev => prev.filter(s => s !== skillToRemove));
  };

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

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    // Form Validation matches standard constraints (Simplified)
    if (!regName.trim() || !regEmail.trim() || !regUniversity.trim() || (!googleRegInfo && !regPassword.trim())) {
      setRegError("Harap isi semua kolom wajib (Nama, Email, Universitas" + (googleRegInfo ? "" : ", Sandi") + ").");
      return;
    }

    if (!googleRegInfo && regPassword !== regConfirmPassword) {
      setRegError("Konfirmasi kata sandi tidak cocok dengan kata sandi yang dibuat.");
      return;
    }

    const res = onRegister({
      name: regName.trim(),
      email: regEmail.trim(),
      university: regUniversity.trim(),
      major: "Sains & Teknologi", // High-quality default field
      batch: regBatch,
      gpa: 4.0, // High-quality default GPA
      bio: googleRegInfo ? "Profil terdaftar via Google OAuth. Siap berkontribusi secara utuh." : "Awardee aktif Bright Scholarship.",
      linkedinUrl: "https://linkedin.com",
      skills: ["Leadership", "Social Stewardship", "Collaboration"],
      password: googleRegInfo ? "google-auth-auto-generated-pwd" : regPassword
    });

    if (res.success) {
      setRegSuccess(res.message);
      // Reset form
      setRegName("");
      setRegEmail("");
      setRegUniversity("");
      setRegBatch("9");
      setRegPassword("");
      setRegConfirmPassword("");
      if (onClearGoogleRegInfo) {
        onClearGoogleRegInfo();
      }
    } else {
      setRegError(res.message);
    }
  };

  const fillQuickDemoLogin = (email: string) => {
    setLoginEmail(email);
    setLoginPassword("password123");
    setLoginError(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Identity Title */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs text-left">
        <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
          <Key className="w-5 h-5 text-emerald-600" />
          <span>Portal Login & Registrasi Akun</span>
        </h2>
      </div>

      {/* Main Layout */}
      <div className="space-y-6 text-left">
        {currentUser ? (
            /* Logged In Dashboard State */
            <div className="bg-white border border-slate-205 rounded-xl p-6 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 flex items-center justify-center font-black text-lg shadow-inner">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-blue-950">{currentUser.name}</h3>
                    <p className="text-xs text-slate-550 font-medium mt-0.5">{currentUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                    currentUser.role === "admin" 
                      ? "bg-slate-900 border-slate-800 text-slate-100" 
                      : "bg-blue-50 border-blue-200 text-blue-700"
                  }`}>
                    {currentUser.role === "admin" ? "admin" : "awardee"}
                  </span>
                  
                  <button
                    onClick={onLogout}
                    className="p-1 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Keluar (Log Out)
                  </button>
                </div>
              </div>

              {/* Account Status / Profile Warning Box for Pending Awardees */}
              {currentUserProfile && currentUserProfile.status === "menunggu" && (
                <div className="bg-amber-50 border border-amber-200 p-4.5 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-850 font-bold text-xs">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin-reverse" />
                    <span>STATUS AKUN: MENUNGGU PERSETUJUAN ADMINISTRATOR</span>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                    Selamat, registrasi Anda berhasil disimpan di database! Namun, demi kepatuhan integritas, akun Anda saat ini berada dalam **status menunggu verifikasi**. Profil akademik Anda belum dapat tampil di Direktori Utama atau dihitung dalam akumulasi jam sosial publik sebelum Admin menyetujui akun ini.
                  </p>
                </div>
              )}

              {/* Status Box for Active Awardee */}
              {currentUserProfile && currentUserProfile.status === "active" && (
                <div className="bg-emerald-50 border border-emerald-200 p-4.5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-850 font-bold text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>STATUS AKUN: AKTIF</span>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed font-medium">
                    Akun beasiswa Anda telah **Disetujui & Aktif** sepenuhnya. Profil akademik Anda kini diperlihatkan di Direktori Publik, dan jam partisipasi Anda dihitung secara dinamis pada dasbor analisis dampak sosial beasiswa.
                  </p>
                </div>
              )}

              {/* Status Box for Suspended Awardee */}
              {currentUserProfile && currentUserProfile.status === "suspended" && (
                <div className="bg-amber-100 border border-amber-300 p-4.5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>STATUS AKUN: DITANGGUHKAN (SUSPENDED)</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    Akun awardee Anda saat ini sedang **ditangguhkan sementara** oleh Admin Bright Scholarship. Profil publik Anda telah disembunyikan dari direktori, dan aksi/jam sosial yang dicatatkan dibekukan sementara hingga status akun dipulihkan oleh Administrator.
                  </p>
                </div>
              )}

              {/* Status Box for Banned Awardee */}
              {currentUserProfile && currentUserProfile.status === "banned" && (
                <div className="bg-red-50 border border-red-200 p-4.5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-red-950 font-extrabold text-xs">
                    <Ban className="w-4 h-4 text-red-700 shrink-0" />
                    <span>STATUS AKUN: DIBLOKIR PERMANEN (BANNED)</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    Akun ini telah **diblokir secara permanen** karena melanggaran ketentuan dan integritas beasiswa. Akses Anda sepenuhnya dibatasi. Silakan hubungi pengurus yayasan Bright Scholarship jika terdapat kekeliruan.
                  </p>
                </div>
              )}

              {/* Display Profile Redirection for Logged User */}
              <div className="space-y-4 font-sans">
                {currentUserProfile ? (
                  <div className="bg-slate-50 border border-slate-205 p-5 rounded-xl space-y-3.5">
                    <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
                      <UserIcon className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                      <span>MANAJEMEN PROFIL & FOTO DIKONTROL MANDIRI</span>
                    </div>
                    <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                      Untuk memberikan fleksibilitas penuh, pengeditan info akun, penulisan biografi diri, penambahan tag keahlian, serta pengunggahan/pengeditan foto profil Anda kini telah **dipisahkan secara mandiri**.
                    </p>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium">
                      Silakan akses halaman khusus <strong className="text-blue-700">"Profil Saya"</strong> di panel navigasi menu sebelah kiri asrama digital untuk mengelola portofolio personal Anda secara interaktif (termasuk fitur ganti foto profil).
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-250 p-5 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-xs">
                      <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>SESI ADMINISTRATOR AKTIF</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      Anda terautentikasi sebagai Administrator Utama (Superuser) Bright Scholarship. Semua instrumen kelola asrama, persetujuan akun, dan logs SMTP pengiriman surat kini telah **diposisi-pisahkan secara eksklusif**.
                    </p>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium">
                      Silakan akses menu khusus <strong className="text-emerald-700">"Panel Admin"</strong> pada menu navigasi sidebar sebelah kiri untuk melakukan administrasi beasiswa utuh secara nyaman.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Login Register Screen */
            <div className="max-w-xl mx-auto w-full space-y-6">
              <div className="flex flex-col items-center justify-center p-4 text-center bg-white/50 backdrop-blur-xs border border-slate-200/60 rounded-xl">
                <img 
                  src="https://biologi.fkip.uns.ac.id/wp-content/uploads/2023/03/Logo-Bright-Scholarship.png" 
                  alt="Bright Scholarship Logo" 
                  referrerPolicy="no-referrer"
                  className="h-14 w-auto object-contain max-w-[280px]"
                />
              </div>

              <div className="bg-white border border-slate-205 rounded-xl shadow-md overflow-hidden">
              
              {/* Tabs selector */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => {
                    setActiveSubTab("login");
                    setRegError(null);
                    setRegSuccess(null);
                  }}
                  className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeSubTab === "login"
                      ? "border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50/20"
                      : "text-slate-550 hover:bg-slate-50"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Masuk Portal
                </button>

                <button
                  onClick={() => {
                    setActiveSubTab("register");
                    setLoginError(null);
                    setLoginSuccess(null);
                  }}
                  className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeSubTab === "register"
                      ? "border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50/20"
                      : "text-slate-550 hover:bg-slate-50"
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  Registrasi Akun Awardee
                </button>
              </div>

              <div className="p-5 md:p-6">
                {activeSubTab === "login" ? (
                  forgotPasswordView ? (
                    /* FORGOT PASSWORD VIEW */
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 animate-fadeIn text-left">
                      <div className="text-left space-y-1">
                        <h3 className="font-extrabold text-sm text-blue-955 text-blue-900 flex items-center gap-1.5">
                          🛡 Atur Ulang / Pulihkan Sandi
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Masukkan alamat email terdaftar Anda untuk melihat sandi atau memulihkan akses kredensial.
                        </p>
                      </div>

                      {forgotSuccess && (
                        <div className="space-y-3 animate-fadeIn">
                          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg leading-relaxed">
                            ✔ {forgotSuccess}
                          </div>
                          
                          {/* Spam folder notification check */}
                          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg flex items-start gap-2.5 leading-relaxed">
                            <span className="text-base select-none leading-none pt-0.5">📧</span>
                            <div>
                              <strong className="block font-black text-amber-950 mb-0.5">PENTING: Periksa Folder Utama & SPAM!</strong>
                              Silakan periksa folder <span className="underline font-bold">Spam atau Junk / Sampah</span> pada email Anda jika dalam waktu 1-2 menit ke depan surel tidak kunjung berlabuh di Kotak Masuk utama.
                            </div>
                          </div>
                        </div>
                      )}

                      {forgotError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-lg">
                          {forgotError}
                        </div>
                      )}

                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-600 uppercase block">Alamat Email Kampus/Yayasan</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                              type="email"
                              placeholder="nama@school.ac.id atau nama@brightscholarship.org"
                              value={forgotEmail}
                              onChange={(e) => setForgotPasswordEmail(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none text-slate-800 transition-all font-sans"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setForgotPasswordView(false);
                              setForgotPasswordSuccess(null);
                              setForgotPasswordError(null);
                            }}
                            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all text-center cursor-pointer select-none"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="flex-2 py-2 bg-[#0f766e] hover:bg-[#115e59] text-white font-extrabold text-xs rounded-lg shadow-sm transition-all text-center cursor-pointer select-none"
                          >
                            Pulihkan Sandi
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    /* LOGIN VIEW */
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div className="text-left space-y-1">
                        <h3 className="font-bold text-sm text-blue-955 text-blue-900">Login Akun</h3>
                        <p className="text-[11px] text-slate-500">
                          Gunakan email terdaftar serta sandi verifikasi untuk masuk ke asrama digital.
                        </p>
                      </div>

                      {loginSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-805 text-xs font-semibold rounded-lg flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-650 shrink-0" />
                          <span>{loginSuccess}</span>
                        </div>
                      )}

                      {loginError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-650 shrink-0" />
                          <span>{loginError}</span>
                        </div>
                      )}

                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-600 uppercase block">Alamat Email Kampus/Yayasan</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                              type="email"
                              placeholder="nama@school.ac.id atau nama@brightscholarship.org"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none text-slate-800 transition-all font-sans"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center bg-transparent m-0 p-0">
                            <label className="text-[11px] font-bold text-slate-600 block uppercase m-0">Kata Sandi (Password)</label>
                            <button
                              type="button"
                              onClick={() => setForgotPasswordView(true)}
                              className="text-[10px] font-extrabold text-[#0f766e] hover:underline focus:outline-none cursor-pointer m-0 select-none"
                            >
                              Lupa sandi?
                            </button>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                              type={loginShowPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none text-slate-800 transition-all font-sans"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setLoginShowPassword(!loginShowPassword)}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                              title={loginShowPassword ? "Sembunyikan Kata Sandi" : "Tampilkan Kata Sandi"}
                            >
                              {loginShowPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-extrabold text-xs rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Masuk ke Akun Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {/* Unified Sign-In with Google */}
                      <div className="flex items-center my-3">
                        <div className="flex-1 border-t border-slate-100"></div>
                        <span className="px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Atau</span>
                        <div className="flex-1 border-t border-slate-100"></div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const width = 500;
                          const height = 650;
                          const left = window.screenX + (window.innerWidth - width) / 2;
                          const top = window.screenY + (window.innerHeight - height) / 2;
                          
                          window.open(
                            "/api/auth/google",
                            "google_oauth_popup",
                            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
                          );
                        }}
                        className="w-full py-2.5 bg-white hover:bg-[#f8fafc] border border-slate-200 text-slate-700 font-bold text-xs rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                        </svg>
                        <span>Lanjutkan dengan Google</span>
                      </button>
                    </div>
                  </form>
                )) : (
                  /* REGISTER VIEW */
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 font-sans">
                    <div className="text-left space-y-1">
                      <h3 className="font-bold text-sm text-blue-900">Registrasi Akun Awardee Bright Scholarship</h3>
                      <p className="text-[11px] text-slate-500">
                        Isi form di bawah ini untuk mengaktifkan akun portal Anda. Akun baru memerlukan persetujuan Administrator demi integritas data dan keamanan sistem asrama.
                      </p>
                    </div>

                    {googleRegInfo && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex flex-col gap-1.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span className="font-extrabold text-blue-950 text-xs">Akun Google Terhubung ({googleRegInfo.email})</span>
                          </div>
                          {onClearGoogleRegInfo && (
                            <button
                              type="button"
                              onClick={() => {
                                onClearGoogleRegInfo();
                                setRegName("");
                                setRegEmail("");
                              }}
                              className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md transition-all cursor-pointer"
                            >
                              Batal
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          Otentikasi Google berhasil! Silakan lengkapi sisa kolom formulir pendaftaran di bawah ini (Pilih <strong>Universitas</strong> & <strong>Angkatan</strong>) sebelum menekan tombol kirim verifikasi.
                        </p>
                      </div>
                    )}

                    {regSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-xl flex items-start gap-3 shadow-xs">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0 animate-bounce" />
                        <div className="space-y-1 flex-1">
                          <p className="font-extrabold text-xs text-blue-950">Pendaftaran Berhasil Dikirim!</p>
                          <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                            {regSuccess}
                          </p>
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[10.5px] font-bold text-amber-850 space-y-1.5 mt-2">
                            <p className="flex items-center gap-1.5 uppercase font-extrabold tracking-wide text-amber-900">
                              <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
                              <span>PEMBERITAHUAN EMAIL AKTIVASI</span>
                            </p>
                            <p className="font-medium text-slate-705 leading-relaxed">
                              Apabila akun Anda telah disetujui oleh pengurus asrama / admin, Anda akan menerima <strong>email verifikasi resmi dari Bright Scholarship</strong> ke alamat email terdaftar Anda sebagai tanda aktivasi akun penuh!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {regError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-650 shrink-0" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Nama Lengkap *</label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Contoh: Muhammad Rafli"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none text-slate-800 transition-all font-sans"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Email Akun *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            placeholder="rafli@student.itb.ac.id"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            disabled={!!googleRegInfo}
                            readOnly={!!googleRegInfo}
                            className={`w-full pl-9 pr-4 py-2 border rounded-lg text-xs font-medium outline-none transition-all font-sans ${
                              googleRegInfo 
                                ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed font-semibold" 
                                : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-500"
                            }`}
                            required
                          />
                        </div>
                      </div>

                      {/* University */}
                      <div className="space-y-1 relative">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Universitas Negeri *</label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Ketik untuk mencari (e.g. ITB, Indonesia, UGM)"
                            value={regUniversity}
                            onFocus={() => setShowUnivSuggestions(true)}
                            onBlur={() => {
                              setTimeout(() => {
                                setShowUnivSuggestions(false);
                              }, 200);
                            }}
                            onChange={(e) => {
                              setRegUniversity(e.target.value);
                              setShowUnivSuggestions(true);
                            }}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none text-slate-800 transition-all font-sans"
                            required
                          />
                        </div>
                        {/* Auto-complete Suggestions Dropdown */}
                        {showUnivSuggestions && regUniversity.trim().length > 0 && (() => {
                          const query = regUniversity.toLowerCase();
                          const matches = INDONESIAN_UNIVERSITIES.filter(u => 
                            u.toLowerCase().includes(query) && 
                            u.toLowerCase() !== query
                          ).slice(0, 5); // top 5 recommendations

                          if (matches.length === 0) return null;

                          return (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-205 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto divide-y divide-slate-100 py-1 font-sans">
                              {matches.map((univ) => (
                                <button
                                  key={univ}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault(); // Prevents input blur racing
                                    setRegUniversity(univ);
                                    setShowUnivSuggestions(false);
                                  }}
                                  className="w-full text-left px-4 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-755 transition-colors cursor-pointer"
                                >
                                  {univ}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Batch */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Angkatan Beasiswa (Angka)</label>
                        <select
                           value={regBatch}
                           onChange={(e) => setRegBatch(e.target.value)}
                           className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none text-slate-800 font-sans cursor-pointer"
                           required
                        >
                          {batches.map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      {/* Password / Google OAuth placeholder */}
                      <div className="space-y-1 sm:col-span-2">
                        {googleRegInfo ? (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-emerald-800 uppercase block font-extrabold flex items-center gap-1">
                              <span>Kata Sandi Akun *</span>
                            </label>
                            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
                              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-slate-600 font-medium text-[11px]">Terautentikasi otomatis via Google OAuth (tidak memerlukan sandi manual).</span>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Create Password */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-emerald-850 block uppercase font-extrabold font-sans">Buat Kata Sandi Akun *</label>
                              <div className="relative">
                                <input
                                  type={showRegPassword ? "text" : "password"}
                                  placeholder="Minimal 6 karakter"
                                  value={regPassword}
                                  onChange={(e) => setRegPassword(e.target.value)}
                                  className="w-full px-3 pr-10 py-2 bg-emerald-50/40 border border-emerald-250/70 rounded-lg text-xs font-bold focus:bg-white focus:border-emerald-600 outline-none text-slate-800 transition-all font-sans"
                                  required
                                  minLength={6}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowRegPassword(!showRegPassword)}
                                  className="absolute right-3 top-2 text-slate-450 hover:text-slate-650 focus:outline-none transition-colors"
                                  title={showRegPassword ? "Sembunyikan Kata Sandi" : "Tampilkan Kata Sandi"}
                                >
                                  {showRegPassword ? (
                                    <EyeOff className="w-4 h-4 text-slate-400" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-slate-400" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-emerald-850 block uppercase font-extrabold font-sans">Konfirmasi Kata Sandi *</label>
                              <div className="relative">
                                <input
                                  type={showRegConfirmPassword ? "text" : "password"}
                                  placeholder="Ulangi kata sandi"
                                  value={regConfirmPassword}
                                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                                  className="w-full px-3 pr-10 py-2 bg-emerald-50/40 border border-emerald-250/70 rounded-lg text-xs font-bold focus:bg-white focus:border-emerald-600 outline-none text-slate-800 transition-all font-sans"
                                  required
                                  minLength={6}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                                  className="absolute right-3 top-2 text-slate-450 hover:text-slate-650 focus:outline-none transition-colors"
                                  title={showRegConfirmPassword ? "Sembunyikan Kata Sandi" : "Tampilkan Kata Sandi"}
                                >
                                  {showRegConfirmPassword ? (
                                    <EyeOff className="w-4 h-4 text-slate-400" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-slate-400" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-300" />
                      <span>Registrasi & Kirim untuk Verifikasi</span>
                    </button>

                    {/* Unified Sign-In with Google */}
                    <div className="flex items-center my-3">
                      <div className="flex-1 border-t border-slate-100"></div>
                      <span className="px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Atau</span>
                      <div className="flex-1 border-t border-slate-100"></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const width = 500;
                        const height = 650;
                        const left = window.screenX + (window.innerWidth - width) / 2;
                        const top = window.screenY + (window.innerHeight - height) / 2;
                        
                        window.open(
                          "/api/auth/google",
                          "google_oauth_popup",
                          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
                        );
                      }}
                      className="w-full py-2.5 bg-white hover:bg-[#f8fafc] border border-slate-200 text-slate-700 font-bold text-xs rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      <span>Lanjutkan dengan Google</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
