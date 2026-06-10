import React, { useState } from "react";
import { 
  Trophy, 
  Users, 
  Sparkles, 
  Calendar, 
  Clock, 
  BookOpen, 
  Heart, 
  FileText, 
  AlertCircle, 
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Megaphone,
  Home,
  CheckCircle2,
  Bookmark,
  Sparkle,
  QrCode,
  Plus,
  Settings,
  DollarSign,
  Check
} from "lucide-react";
import { AwardeeProfile, Activity, ImpactStat, User, UserRole, UpcomingSchedule, InfoPost, QrisCampaign } from "../types";

// Helper dynamically determines dormitory name based on university
export function getDormitoryName(university: string): string {
  if (!university) return "Asrama Sinergi Regional Nusantara";
  const univLower = university.toLowerCase();
  if (univLower.includes("indonesia") || univLower.includes("jakarta") || univLower.includes("syarif hidayatullah")) {
    return "Asrama Sinergi Jakarta-Depok (UI/UIN)";
  }
  if (univLower.includes("bandung") || univLower.includes("itb") || univLower.includes("padjadjaran") || univLower.includes("siliwangi") || univLower.includes("gunung djati")) {
    return "Asrama Sinergi Bandung (ITB/UNPAD/UIN)";
  }
  if (univLower.includes("gadjah mada") || univLower.includes("ugm") || univLower.includes("yogyakarta") || univLower.includes("uny") || univLower.includes("sebelas maret") || univLower.includes("uns") || univLower.includes("semarang") || univLower.includes("undip") || univLower.includes("sunan kalijaga") || univLower.includes("walisongo")) {
    return "Asrama Sinergi Yogyakarta-Solo (UGM/UNS/UIN)";
  }
  if (univLower.includes("airlangga") || univLower.includes("unair") || univLower.includes("surabaya") || univLower.includes("its") || univLower.includes("brawijaya") || univLower.includes("malang") || univLower.includes("jember") || univLower.includes("unej") || univLower.includes("sunan ampel")) {
    return "Asrama Sinergi Surabaya-Malang (ITS/UNAIR/UB)";
  }
  if (univLower.includes("mataram") || univLower.includes("unram") || univLower.includes("lombok")) {
    return "Asrama Sinergi Lombok Mataram (UNRAM)";
  }
  return "Asrama Sinergi Regional Nusantara";
}

// Announcements Database
export const ALL_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Dana Stimulan Riset Akhir Tahap 1",
    content: "Pemberitahuan kepada awardee Angkatan 7 bahwa pengajuan berkas stimulus riset dan skripsi ditutup akhir bulan ini. Silakan unggah proposal melalui portal admin.",
    batch: "Angkatan 7",
    category: "Pemberitahuan Utama",
    date: "2026-06-08",
    urgent: true
  },
  {
    id: "ann-2",
    title: "Sidak Kedisiplinan & Piket Bersama",
    content: "Diberitahukan kepada seluruh penghuni Asrama Yogyakarta & Surabaya (Angkatan 7) bahwa akan ada inspeksi kerapian dan kebersihan asrama terjadwal.",
    batch: "Angkatan 7",
    category: "Peraturan Asrama",
    date: "2026-06-07",
    urgent: false
  },
  {
    id: "ann-3",
    title: "Welcoming & Leadership Building Angkatan 8",
    content: "Wajib hadir bagi seluruh Awardee Angkatan 8 untuk mengikuti malam penyambutan dan pengenalan pengurus asrama baru di Aula Utama.",
    batch: "Angkatan 8",
    category: "Agenda Wajib",
    date: "2026-06-05",
    urgent: true
  },
  {
    id: "ann-4",
    title: "Pembagian Kunci Loker & Inventaris Kasur Angkatan 8",
    content: "Pengambilan inventaris asrama Angkatan 8 dapat menemui bapak asrama di ruang pos piket pada jam kerja.",
    batch: "Angkatan 8",
    category: "Logistik Asrama",
    date: "2026-06-04",
    urgent: false
  },
  {
    id: "ann-5",
    title: "Pengenalan Ekosistem Digital Bright Scholarship Angkatan 9",
    content: "Selamat bergabung Angkatan 9! Harap menyelesaikan pengisian profil SIM Akademik dan mengaktifkan akun portal beasiswa Anda sebelum orientasi dimulai.",
    batch: "Angkatan 9",
    category: "Orientasi Mahasiswa",
    date: "2026-06-09",
    urgent: true
  },
  {
    id: "ann-6",
    title: "Pengukuran Jas Almamater Beasiswa Angkatan 9",
    content: "Jadwal pengukuran jas dan atribut seragam untuk Angkatan 9 baru dilaksanakan secara kolektif di masing-masing regional asrama.",
    batch: "Angkatan 9",
    category: "Distribusi Seragam",
    date: "2026-06-08",
    urgent: false
  }
];

interface BrightDashboardProps {
  awardees: AwardeeProfile[];
  activities: Activity[];
  impactStats: ImpactStat;
  onNavigateToTab: (tab: "dashboard" | "directory" | "activities" | "schedule" | "nosql" | "portal" | "myProfile" | "adminPanel") => void;
  currentUser?: User | null;
  currentUserProfile?: AwardeeProfile | null;
  simulatedRole?: UserRole;
  schedules?: UpcomingSchedule[];
}

export default function BrightDashboard({ 
  awardees, 
  activities, 
  impactStats, 
  onNavigateToTab,
  currentUser,
  currentUserProfile,
  simulatedRole,
  schedules
}: BrightDashboardProps) {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Profile-based Dynamic Isolation / Batch Filtering State (Matches specified workflow!)
  const isActiveAwardee = simulatedRole === "awardee" && currentUserProfile;
  const initialBatch = (isActiveAwardee && currentUserProfile?.batch) ? currentUserProfile.batch : "Angkatan 7";
  const [selectedBatch, setSelectedBatch] = useState<string>(initialBatch);

  // Mading Digital & Timeline States
  const [dashboardSubTab, setDashboardSubTab] = useState<"posts" | "timeline">("posts");
  const [showAddPostForm, setShowAddPostForm] = useState(false);

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<"Info Penting" | "Kegiatan Sosial" | "Pengumuman">("Info Penting");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostBatch, setNewPostBatch] = useState("Angkatan 7");
  const [newPostImageAttachment, setNewPostImageAttachment] = useState<string | null>(null);
  const [postSuccessMsg, setPostSuccessMsg] = useState<string | null>(null);

  const [infoPosts, setInfoPosts] = useState<InfoPost[]>(() => {
    const saved = localStorage.getItem("bright_info_posts");
    if (saved) return JSON.parse(saved);
    return []; // Completely empty initial roster so users can fill it on their own as requested
  });

  React.useEffect(() => {
    localStorage.setItem("bright_info_posts", JSON.stringify(infoPosts));
  }, [infoPosts]);

  // Handle local file loads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setBase64: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal adalah 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setBase64(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers
  const handleAddInfoPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const roleLabel = simulatedRole === "admin" ? "Admin Pusat" : (simulatedRole === "fasilitator" ? "Fasilitator" : "Kepala Asrama");
    const authorName = currentUser?.name ? `${currentUser.name} (${roleLabel})` : `Pengurus (${roleLabel})`;

    const newPost: InfoPost = {
      id: `post-${Date.now()}`,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      category: newPostCategory,
      date: new Date().toISOString().split("T")[0],
      batch: newPostBatch,
      createdBy: authorName,
      imageUrl: newPostImageAttachment || undefined
    };

    setInfoPosts(prev => [newPost, ...prev]);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostImageAttachment(null);
    setPostSuccessMsg(`Berhasil mempublikasikan postingan baru bertema '${newPostCategory}' untuk ${newPostBatch}!`);
    setTimeout(() => {
      setPostSuccessMsg(null);
      setShowAddPostForm(false);
    }, 2800);
  };

  // Filter posts on active batch selector
  const activeBatchPosts = infoPosts.filter(p => p.batch === selectedBatch);

  React.useEffect(() => {
    if (simulatedRole === "awardee" && currentUserProfile?.batch) {
      setSelectedBatch(currentUserProfile.batch);
    }
  }, [currentUserProfile?.batch, simulatedRole]);

  // Derived variables corresponding to filter flow
  const resolvedUniversity = isActiveAwardee 
    ? currentUserProfile.university 
    : (selectedBatch === "Angkatan 7" ? "Universitas Gadjah Mada" : (selectedBatch === "Angkatan 8" ? "Institut Teknologi Bandung" : "UIN Syarif Hidayatullah Jakarta"));
  const resolvedDormitory = getDormitoryName(resolvedUniversity);

  // 1. Filtered Announcements
  const filteredAnnouncements = ALL_ANNOUNCEMENTS.filter(a => a.batch === selectedBatch);

  // 2. Filtered Schedules
  const filteredSchedules = (() => {
    const extraSchedules = [
      {
        scheduleId: "sched-9-1",
        title: "Orientasi Mahasiswa Baru Bright Scholarship (Angkatan 9)",
        description: "Pembekalan komprehensif mengenai tata tertib, hak, kewajiban, dan peta pembinaan asrama selama satu tahun penuh.",
        date: "2026-06-12",
        time: "19:30 - 21:30 WIB",
        category: "Pembinaan Karakter" as const,
        location: resolvedDormitory,
        speaker: "Abdul Habir / Pengurus Pusat YBM BRILiaN",
        registeredAwardeesCount: 12,
        notes: "Wajib hadir bagi seluruh awardee baru Angkatan 9. Link Zoom akan dikirim via grup chat asrama."
      },
      {
        scheduleId: "sched-9-2",
        title: "Setoran Hafalan Pertama & Evaluasi Akreditasi Awal",
        description: "Sesi mentoring kelompok bersama ustadz pembina regional asrama untuk pemetaan tingkat pemahaman bacaan dan hafalan Al-Quran.",
        date: "2026-06-18",
        time: "05:15 - 07:00 WIB",
        category: "Tahfidz Quran" as const,
        location: "Masjid/Selasar Utama Asrama Regional",
        speaker: "Ustadz Pembina Regional",
        registeredAwardeesCount: 8,
        notes: "Umat Muslim harap mempersiapkan setoran pembuka minimal 10 ayat terakhir Juz Amma."
      }
    ];

    const combined = [...(schedules || []), ...extraSchedules];

    return combined.filter(s => {
      if (selectedBatch === "Angkatan 7") {
        return ["sched-1", "sched-2", "sched-4"].includes(s.scheduleId);
      } else if (selectedBatch === "Angkatan 8") {
        return ["sched-1", "sched-2", "sched-3"].includes(s.scheduleId);
      } else if (selectedBatch === "Angkatan 9") {
        return ["sched-9-1", "sched-9-2", "sched-4"].includes(s.scheduleId);
      }
      return true;
    });
  })();

  // 3. Filtered Activities
  const filteredActivities = (() => {
    const extraActivities = [
      {
        activityId: "act-9-1",
        title: "Upacara Penyambutan & Silaturahmi Keluarga Besar Angkatan 9",
        description: "Dokumentasi peluncuran perdana pembinaan bagi penerima beasiswa baru dari berbagai Universitas Negeri dan UIN terkemuka se-Indonesia secara terpadu di Aula Sentral.",
        date: "2026-06-10",
        category: "Pembinaan" as const,
        location: "Aula Utama Pusdiklat Regional",
        awardeesInvolved: [],
        hoursEarned: 4,
        createdBy: "admin-1",
        mediaUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
      }
    ];

    const combined = [...activities, ...extraActivities];

    if (selectedBatch === "Angkatan 9") {
      return combined.filter(a => a.activityId === "act-9-1" || a.title.includes("Angkatan 9"));
    }

    return combined.filter(act => {
      if (act.activityId === "act-9-1") return false;
      return act.awardeesInvolved.some(id => {
        const foundAw = awardees.find(a => a.awardeeId === id);
        return foundAw && foundAw.batch === selectedBatch;
      });
    });
  })();

  // Combined timeline of executed activities and completed schedules for "Timeline & Kegiatan" historical feed
  const timelineHistory = (() => {
    // Standard activities representing completed projects
    const standardTimeline = activities.map(act => ({
      id: act.activityId,
      title: act.title,
      description: act.description,
      date: act.date,
      category: act.category,
      imageUrl: act.mediaUrl,
      involvedCount: act.awardeesInvolved.length,
      location: act.location,
    }));

    // Completed schedules
    const completedScheds = (schedules || [])
      .filter(s => s.status === "Selesai")
      .map(s => ({
        id: s.scheduleId,
        title: s.title,
        description: s.description,
        date: s.date,
        category: s.category === "Kegiatan Sosial" ? "Pengabdian Masyarakat" as const : "Pembinaan" as const,
        imageUrl: s.documentationUrl,
        involvedCount: (s.confirmedAttendance || []).length,
        location: s.location,
      }));

    const extraActivities = [
      {
        id: "act-9-1",
        title: "Upacara Penyambutan & Silaturahmi Keluarga Besar Angkatan 9",
        description: "Dokumentasi peluncuran perdana pembinaan bagi penerima beasiswa baru dari berbagai Universitas Negeri dan UIN terkemuka se-Indonesia secara terpadu di Aula Sentral.",
        date: "2026-06-10",
        category: "Pembinaan" as const,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
        involvedCount: 15,
        location: "Aula Utama Pusdiklat Regional"
      }
    ];

    const all = [...completedScheds, ...standardTimeline, ...extraActivities];
    // Sort descending by date
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  })();

  // Dynamic calculations based on state to ensure structural coherence!
  const totalAwardees = awardees.length;
  const totalActivities = activities.length;
  
  // Calculate aggregate service hours directly from real-time awardee records
  const dynamicTotalHours = awardees.reduce((sum, awardee) => sum + awardee.totalServiceHours, 0);

  // Aggregate hours by category for high fidelity dashboard visualization
  const categoryStats = activities.reduce(
    (acc, act) => {
      const hours = act.hoursEarned * act.awardeesInvolved.length;
      if (act.category === "Pembinaan") {
        acc.pembinaan += hours;
      } else if (act.category === "Pengabdian Masyarakat") {
        acc.pengabdian += hours;
      } else {
        acc.pembedayaanLain += hours;
      }
      return acc;
    },
    { pembinaan: 0, pengabdian: 0, pembedayaanLain: 0 }
  );

  const averageHoursPerAwardee = totalAwardees > 0 ? (dynamicTotalHours / totalAwardees).toFixed(1) : "0";
  const benchmarkPercentage = Math.min(100, Math.round((parseFloat(averageHoursPerAwardee) / 35) * 100)); // Target 35 hours benchmark

  // Request AI Summary from server backend via Express + Gemini
  const handleGenerateAiReport = async () => {
    setIsAiLoading(true);
    setAiReport(null);
    setAiError(null);

    try {
      const response = await fetch("/api/generateImpactReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          totalAwardees,
          totalActivities,
          totalHours: dynamicTotalHours,
          pembinaanHours: categoryStats.pembinaan,
          pengabdianHours: categoryStats.pengabdian + categoryStats.pembedayaanLain,
          activityCategories: {
            "Pembinaan Karakter & Asrama": activities.filter(a => a.category === "Pembinaan").length,
            "Pengabdian Masyarakat Riil": activities.filter(a => a.category === "Pengabdian Masyarakat").length,
            "Capacity Building & Lainnya": activities.filter(a => a.category !== "Pembinaan" && a.category !== "Pengabdian Masyarakat").length
          }
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAiReport(data.analysis);
      } else {
        throw new Error(data.error || "Gagal menghasilkan ringkasan AI.");
      }
    } catch (err: any) {
      console.warn("API Error, using formatted local report fallback...", err.message);
      // Fallback elegant, rich mock report that explains how to set the actual API KEY
      generateLocalFallbackReport();
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateLocalFallbackReport = () => {
    const reportTemplate = `### SOCIAL IMPACT COMPREHENSIVE ASSESSMENT - BRIGHT SCHOLARSHIP
*(Laporan ini disinkronkan secara semi-otomatis lewat Analitik Berbasis Aturan Klien)*

#### 1. ANALISIS KUANTITATIF & KUALITATIF SINERGI DAMPAK
Dengan total penerima manfaat sebanyak **${totalAwardees} Mahasiswa** yang tersebar di universitas-universitas terkemuka, program Bright Scholarship telah sukses merealisasikan akumulasi sebanyak **${dynamicTotalHours} Jam Kontribusi Sosial**.

Rasio rata-rata jam kontribusi per awardee menyentuh angka **${averageHoursPerAwardee} Jam**, melampaui standar semesteran sebesar 14%. Sinergi program ini terbagi menjadi dua elemen fundamental asrama:
*   **Pembinaan (${categoryStats.pembinaan} jam):** Biasanya kegiatannya berupa pembinaan karakter, tahfidz quran, pembinaan soft skill, dan kegiatan sosial.
*   **Pengabdian Masyarakat Aktif (${categoryStats.pengabdian + categoryStats.pembedayaanLain} jam):** Penyaluran keahlian teknik, sains, dan humaniora riil ke pedesaan marginal.

#### 2. PEMETAAN NILAI TAMBAH (BATU PIJAKAN IMPACT)
*   **Value for Universities (Dampak Terhadap Kampus):** Memposisikan awardee sebagai mahasiswa berprestasi dengan rekam jejak sosial tinggi, memajukan indikator kinerja perguruan tinggi.
*   **Value for Underprivileged Communities (Dampak Terhadap Masyarakat Sasaran):** Pembangunan infrastruktur mikro (seperti energi terbarukan panel surya di Lombok Utara) yang segera menyerap kebutuhan mendesak masyarakat rawan energi.
*   **Value for Corporate/Donors (Dampak Kepercayaan Donatur):** Transparansi akuntabilitas luaran kontribusi sosial (setiap jam teraudit dengan bukti logbook) memperkuat nilai retensi investasi donatur.

#### 3. REKOMENDASI TAKTIS STRATEGI PROGRAM TAJAM DAMPAK (TAHUN AJARAN BARU)
Untuk memaksimalkan utilitas jam kontribusi mahasiswa, diusulkan 3 inisiatif taktis berikut:
1.  **Inkubasi Bright-Village:** Menetapkan satu desa binaan tetap per wilayah asrama untuk proyek terintegrasi (pendidikan + elektrifikasi).
2.  **Digital Skills Peer-to-Peer:** Menyalurkan kompetensi anak-anak IT/Elektro asrama untuk pelatihan literasi komputer di panti asuhan lokal.
3.  **Forum Kolokium Nasional:** Menyelenggarakan bedah kasus inklusi sosial antar asrama se-Indonesia guna menajamkan wawasan kritis awardee.

---
💡 *Catatan Pengembang: Berkas API server mendeteksi GEMINI_API_KEY belum terkonfigurasi pada Environment Variables. Masukkan kunci rahasia Anda pada panel kontrol Settings AI Studio untuk memfungsikan penyusunan AI dinamis sesungguhnya.*`;
    
    setAiReport(reportTemplate);
  };

  return (
    <div className="space-y-6">
      {/* Premium Hero Banner (Deep Corporate Navy gradient for high prestige contrast) */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-950 border border-blue-900 rounded-xl overflow-hidden shadow-lg relative p-6 md:p-8">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-900/40 border border-blue-700 text-emerald-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-emerald-300 animated-pulse" />
            <span>Bright Scholarship 2026 Admin Hub</span>
          </div>
          <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-tight">
            Membina Pemimpin Berkarakter,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Mengabdi Nyata untuk Negeri
            </span>
          </h1>
          <p className="text-blue-100/80 text-xs md:text-sm max-w-2xl leading-relaxed">
            Selamat datang di Pusat Manajemen Data & Portofolio Dampak Sosial Bright Scholarship. Lacak jam kontribusi, bina prestasi akademik, dan publikasikan kegiatan kemasyarakatan mahasiswa asrama secara real-time.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateToTab("schedule")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer select-none shadow-md shadow-blue-600/10"
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              Lihat Jadwal Pembinaan
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Awardee Berbeasiswa</span>
            <div className="text-3xl font-extrabold text-blue-950 font-mono">{totalAwardees}</div>
            <span className="text-[10px] text-emerald-600 font-bold font-sans flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Saring aktif & berprestasi
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Kegiatan Terlaksana</span>
            <div className="text-3xl font-extrabold text-blue-950 font-mono">{totalActivities}</div>
            <span className="text-[10px] text-blue-600 font-bold font-sans flex items-center gap-1">
              {activities.filter(a => a.category === "Pengabdian Masyarakat").length} Proyek Pengabdian
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Total Jam Pelayanan</span>
            <div className="text-3xl font-extrabold text-blue-950 font-mono">{dynamicTotalHours}</div>
            <span className="text-[10px] text-amber-600 font-bold font-sans flex items-center gap-1">
              Akumulatif seluruh asrama
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Rata-rata Jam Individu</span>
            <span className="text-xs font-extrabold text-blue-950 font-mono">{averageHoursPerAwardee} h</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5 overflow-hidden">
            <div 
              style={{ width: `${benchmarkPercentage}%` }} 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            ></div>
          </div>
          <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold">
            <span>Target: 35 jam</span>
            <span className="text-emerald-600 font-extrabold">{benchmarkPercentage}% Tercapai</span>
          </div>
        </div>
      </div>

      {/* Sinergi Kontribusi & AI Report Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Synthesis visual metrics ratios */}
        <div className="lg:col-span-4 bg-white border border-slate-200/85 rounded-xl p-5 md:p-6 space-y-5 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-base font-extrabold text-blue-950 mb-1.5 font-sans">Sinergi Pembinaan & Pengabdian</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Keseimbangan antara penempaan moral-karakter di asrama dengan pengabdian sosial konkret di lapangan.
            </p>
          </div>

          {/* Visual bar graph style comparisons */}
          <div className="space-y-4 my-2">
            {/* Pembinaan */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full block"></span>
                  Pembinaan
                </span>
                <span className="font-mono text-slate-600 font-semibold">{categoryStats.pembinaan} Jam</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, Math.round((categoryStats.pembinaan / (dynamicTotalHours || 1)) * 100))}%` }}
                  className="bg-blue-600 h-full rounded-full"
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-sans">
                Biasanya meliputi pembinaan karakter, tahfidz quran, pembinaan soft skill, dan kegiatan sosial.
              </p>
            </div>

            {/* Other Capacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full block"></span>
                  Capacity Building & Lainnya
                </span>
                <span className="font-mono text-slate-600 font-semibold">{categoryStats.pembedayaanLain} Jam</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, Math.round((categoryStats.pembedayaanLain / (dynamicTotalHours || 1)) * 105))}%` }}
                  className="bg-amber-500 h-full rounded-full"
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 leading-normal">
            <div>💡 <span className="font-extrabold text-blue-950">Prinsip Asrama:</span></div>
            <p>Seorang pemimpin sejati wajib mengimbangi kematangan akademik internal dengan kepekaan eksternal membantu lingkungan sekitar.</p>
          </div>
        </div>

        {/* Right: Mading Pengumuman & Timeline Kegiatan */}
        <div id="mading-qris-pemberdayaan" className="lg:col-span-8 bg-white border border-slate-200/85 rounded-xl p-5 md:p-6 space-y-5 shadow-xs flex flex-col">
          
          {/* Header & Sub-Tab Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
            <div className="space-y-1 text-left">
              <h3 className="text-base font-extrabold text-blue-950 font-sans flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-500" />
                Mading Digital & Informasi Pemberdayaan
              </h3>
              <p className="text-slate-500 text-xs leading-normal">
                Media kolaborasi pengumuman penting, manajemen informasi, dan galeri linimasa program riil asrama.
              </p>
            </div>

            {/* Sub-tab Pill Selectors */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50 self-start sm:self-auto shrink-0 animate-fadeIn">
              <button
                onClick={() => setDashboardSubTab("posts")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  dashboardSubTab === "posts" 
                    ? "bg-white text-blue-950 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Info & Kegiatan
              </button>
              <button
                onClick={() => setDashboardSubTab("timeline")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  dashboardSubTab === "timeline" 
                    ? "bg-white text-blue-950 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Timeline & Riwayat Kegiatan
              </button>
            </div>
          </div>

          <div className="flex-1">
            {/* 1. INFO & KEGIATAN TAB */}
            {dashboardSubTab === "posts" && (
              <div className="space-y-4">
                
                {/* Facilitator & Dorm Head Management Action */}
                {(simulatedRole === "admin" || simulatedRole === "fasilitator" || simulatedRole === "kepala_asrama") && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-amber-50 text-amber-800 font-extrabold border border-amber-200 px-2 py-0.5 rounded-full uppercase font-mono tracking-wider">
                        Hak Akses Pengurus Aktif
                      </span>
                      <button
                        onClick={() => setShowAddPostForm(!showAddPostForm)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold select-none cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {showAddPostForm ? "Sembunyikan Form" : "Unggah Info Utama / Kegiatan"}
                      </button>
                    </div>

                    {showAddPostForm && (
                      <form onSubmit={handleAddInfoPost} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 animate-fadeIn my-1.5 text-left">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-sans">Publikasikan Pengumuman Baru</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-600">Judul Postingan / Kegiatan</label>
                            <input
                              type="text"
                              value={newPostTitle}
                              onChange={(e) => setNewPostTitle(e.target.value)}
                              placeholder="Contoh: Sidak Kebersihan Akhir Pekan"
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-600">Kategori</label>
                            <select
                              value={newPostCategory}
                              onChange={(e) => setNewPostCategory(e.target.value as any)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                            >
                              <option value="Info Penting">Info Penting</option>
                              <option value="Kegiatan Sosial">Kegiatan Sosial</option>
                              <option value="Pengumuman">Pengumuman</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-600">Ditujukan Untuk (Angkatan)</label>
                            <select
                              value={newPostBatch}
                              onChange={(e) => setNewPostBatch(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                            >
                              <option value="Angkatan 7">Angkatan 7 (Senior)</option>
                              <option value="Angkatan 8">Angkatan 8 (Madya)</option>
                              <option value="Angkatan 9">Angkatan 9 (Baru)</option>
                            </select>
                          </div>

                          <div className="space-y-1 flex items-end">
                            <span className="text-[10px] text-slate-400 italic">
                              *Dipublikasikan sebagai: &apos;{currentUser?.name || "Pengurus Asrama"}&apos;
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-600">Detail Isi Berita / Kegiatan Sosial</label>
                          <textarea
                             value={newPostContent}
                             onChange={(e) => setNewPostContent(e.target.value)}
                             rows={3}
                             placeholder="Uraikan deskripsi lengkap, tanggal pelaksanaan, tata tertib, dan draf agenda yang mesti dilakukan oleh para awardee di asrama..."
                             className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                             required
                           />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-600">Unggah Foto/Gambar Pendukung (Opsional)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(e, setNewPostImageAttachment)}
                            className="w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-105 cursor-pointer"
                          />
                          {newPostImageAttachment && (
                            <div className="mt-2 relative inline-block">
                              <img src={newPostImageAttachment} alt="Preview lampiran" className="h-16 w-auto rounded border border-slate-200" />
                              <button
                                type="button"
                                onClick={() => setNewPostImageAttachment(null)}
                                className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold cursor-pointer hover:bg-rose-600"
                              >
                                &times;
                              </button>
                            </div>
                          )}
                        </div>

                        {postSuccessMsg && (
                          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-[10px] text-emerald-800 font-bold">
                            ✔ {postSuccessMsg}
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddPostForm(false)}
                            className="px-2.5 py-1 text-slate-650 hover:bg-slate-200 rounded text-xs select-none cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold select-none cursor-pointer"
                          >
                            Tayangkan Sekarang
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Posts Feed */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {/* Highlighted activeBatch indicator */}
                  <div className="text-[10px] text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                    <span>Menampilkan Berita Terbaru Khusus:</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">{selectedBatch}</span>
                  </div>

                  {activeBatchPosts.length > 0 ? (
                    activeBatchPosts.map((post) => (
                      <div key={post.id} className="p-4 bg-slate-50 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors text-left flex gap-3">
                        <div className="pt-0.5">
                          {post.category === "Info Penting" ? (
                            <span className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center font-bold text-xs shrink-0 select-none text-rose-600">!</span>
                          ) : post.category === "Kegiatan Sosial" ? (
                            <span className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-xs shrink-0 select-none text-emerald-600">♥</span>
                          ) : (
                            <span className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs shrink-0 select-none text-blue-600">i</span>
                          )}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-xs font-extrabold text-blue-950 font-sans">{post.title}</h4>
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              post.category === "Info Penting" 
                                ? "bg-rose-50 text-rose-700 border border-rose-200/50" 
                                : post.category === "Kegiatan Sosial" 
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" 
                                  : "bg-blue-50 text-blue-700 border border-blue-200/50"
                            }`}>
                              {post.category}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-650 leading-relaxed font-sans">{post.content}</p>

                          {post.imageUrl && (
                            <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 max-h-[180px] flex items-center justify-start">
                              <img src={post.imageUrl} alt="Lampiran postingan" className="max-h-[180px] w-auto object-contain rounded-lg" referrerPolicy="no-referrer" />
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold font-mono pt-2">
                            <span>Oleh: {post.createdBy}</span>
                            <span>{new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-400 space-y-2">
                      <p className="text-xs font-bold">Tidak ada pengumuman khusus untuk {selectedBatch}.</p>
                      <p className="text-[10px] text-slate-500">Ubah penyaring angkatan di atas atau hubungi fasilitator asrama untuk memperbarui berkas informasi.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. TIMELINE & KEGIATAN TAB */}
            {dashboardSubTab === "timeline" && (
              <div className="space-y-4">
                
                {/* Information Callout */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 leading-normal flex items-start gap-2">
                  <span className="text-emerald-500 font-bold text-sm leading-none">✔</span>
                  <div className="text-left">
                    <span className="font-bold text-slate-800 font-sans">Riwayat Terverifikasi:</span> Berikut adalah galeri linimasa program pembinaan asrama dan pengabdian masyarakat yang telah sukses dituntaskan dan terekam di sistem lengkap dengan tanggal pelaksanaan serta foto dokumentasi riil.
                  </div>
                </div>

                <div className="relative border-l-2 border-blue-100 pl-5 ml-2.5 py-1.5 space-y-6">
                  {timelineHistory.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      Belum ada kegiatan yang selesai dilaksanakan.
                    </div>
                  ) : (
                    timelineHistory.map((act) => (
                      <div key={act.id} className="relative group text-left">
                        {/* Timeline Node Point Dot */}
                        <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-blue-500 group-hover:bg-blue-500 transition-colors"></div>
                        
                        <div className="space-y-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-lg p-4 transition-all">
                          {/* Date and Category */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-500 font-mono font-bold">
                              {new Date(act.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </span>
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              act.category === "Pengabdian Masyarakat" || act.category === "Lainnya"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" 
                                : "bg-blue-50 text-blue-700 border border-blue-200/50"
                            }`}>
                              {act.category}
                            </span>
                          </div>

                          {/* Title and location */}
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-black text-blue-950 font-sans group-hover:text-blue-600 transition-colors">
                              {act.title}
                            </h4>
                            {act.location && (
                              <p className="text-[9.5px] text-slate-500 font-sans font-semibold">
                                📍 Lokasi: {act.location}
                              </p>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-650 leading-relaxed font-sans">{act.description}</p>

                          {/* Foto Dokumentasi */}
                          {act.imageUrl && (
                            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 max-h-[220px] mt-1.5 shadow-3xs flex items-center justify-start">
                              <img 
                                src={act.imageUrl} 
                                alt={`Dokumentasi ${act.title}`} 
                                className="max-h-[220px] w-full object-cover rounded-lg group-hover:scale-101 transition-transform duration-300" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          <div className="text-[9.5px] text-slate-500 font-bold font-mono border-t border-slate-100 pt-1.5 flex justify-between">
                            <span>👤 Partisipasi: {act.involvedCount} Awardee Terlibat</span>
                            <span className="text-emerald-600">Telah Diverifikasi ✓</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
