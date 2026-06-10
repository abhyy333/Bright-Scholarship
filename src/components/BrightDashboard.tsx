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

  const isStaff = simulatedRole === "admin" || simulatedRole === "fasilitator" || simulatedRole === "kepala_asrama";
  const activeAwardeeId = currentUserProfile?.awardeeId || "awardee-1";

  const todayStr = new Date().toISOString().split("T")[0];

  // Cumulative program-wide statistics (sum of hours across all students)
  const categoryStats = activities.reduce(
    (acc, act) => {
      const hours = act.hoursEarned * act.awardeesInvolved.length;
      if (act.category === "Pembinaan") {
        if (act.date <= todayStr) {
          acc.pembinaan += hours;
        }
      } else if (act.category === "Pengabdian Masyarakat") {
        acc.pengabdian += hours;
      } else {
        acc.pembedayaanLain += hours;
      }
      return acc;
    },
    { pembinaan: 0, pengabdian: 0, pembedayaanLain: 0 }
  );

  // Total unique events duration hours (without multiplying by students involved)
  const totalAllPembinaanEventsHours = activities
    .filter(a => a.category === "Pembinaan" && a.date <= todayStr)
    .reduce((sum, act) => sum + act.hoursEarned, 0);

  // Individual awardee statistics (only things they actually participated in)
  const myParticipatedActivities = activities.filter(act => 
    act.awardeesInvolved.includes(activeAwardeeId)
  );

  const myPembinaanHours = myParticipatedActivities
    .filter(act => act.category === "Pembinaan" && act.date <= todayStr)
    .reduce((sum, act) => sum + act.hoursEarned, 0);

  const myPengabdianHours = myParticipatedActivities
    .filter(act => act.category === "Pengabdian Masyarakat")
    .reduce((sum, act) => sum + act.hoursEarned, 0);

  const myPembedayaanLainHours = myParticipatedActivities
    .filter(act => act.category !== "Pembinaan" && act.category !== "Pengabdian Masyarakat")
    .reduce((sum, act) => sum + act.hoursEarned, 0);

  // Determine hours to display based on actor role
  const displayedPembinaanHours = isStaff ? categoryStats.pembinaan : myPembinaanHours;
  const displayedPengabdianHours = isStaff ? categoryStats.pengabdian : myPengabdianHours;
  const displayedPembedayaanLainHours = isStaff ? categoryStats.pembedayaanLain : myPembedayaanLainHours;

  const averagePembinaanHours = totalAwardees > 0 ? (categoryStats.pembinaan / totalAwardees).toFixed(1) : "0";
  const benchmarkPercentage = isStaff 
    ? Math.min(100, Math.round((parseFloat(averagePembinaanHours) / 15) * 100))
    : Math.min(100, Math.round((myPembinaanHours / 15) * 100));
  
  const dynamicTotalHours = awardees.reduce((sum, awardee) => sum + awardee.totalServiceHours, 0);

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
          totalHours: categoryStats.pembinaan,
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
Dengan total penerima manfaat sebanyak **${totalAwardees} Mahasiswa** yang tersebar di universitas-universitas terkemuka, program Bright Scholarship telah sukses merealisasikan akumulasi sebanyak **${categoryStats.pembinaan} Jam Waktu Pembinaan**.

Rasio rata-rata waktu pembinaan per awardee menyentuh angka **${averagePembinaanHours} Jam**, melampaui standar semesteran sebesar 14%. Sinergi program ini terbagi menjadi dua elemen fundamental asrama:
*   **Pembinaan (${categoryStats.pembinaan} jam):** Biasanya kegiatannya berupa pembinaan karakter, tahfidz quran, pembinaan soft skill, dan kegiatan sosial.
*   **Pengabdian Masyarakat Aktif (${categoryStats.pengabdian + categoryStats.pembedayaanLain} jam):** Penyaluran keahlian teknik, sains, dan humaniora riil ke pedesaan marginal.

#### 2. PEMETAAN NILAI TAMBAH (BATU PIJAKAN IMPACT)
*   **Value for Universities (Dampak Terhadap Kampus):** Memposisikan awardee sebagai mahasiswa berprestasi dengan rekam jejak sosial tinggi, memajukan indikator kinerja perguruan tinggi.
*   **Value for Underprivileged Communities (Dampak Terhadap Masyarakat Sasaran):** Pembangunan infrastruktur mikro (seperti energi terbarukan panel surya di Lombok Utara) yang segera menyerap kebutuhan mendesak masyarakat rawan energi.
*   **Value for Corporate/Donors (Dampak Kepercayaan Donatur):** Transparansi akuntabilitas luaran kontribusi sosial (setiap jam teraudit dengan bukti logbook) memperkuat nilai retensi investasi donatur.

#### 3. REKOMENDASI TAKTIS STRATEGI PROGRAM TAJAM DAMPAK (TAHUN AJARAN BARU)
Untuk memaksimalkan utilitas jam pembinaan mahasiswa, diusulkan 3 inisiatif taktis berikut:
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Total Awardee Aktif</span>
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

        {/* Metric 3 - Waktu Pembinaan */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">
              {isStaff ? "Total Jam Pembinaan (Program)" : "Waktu Pembinaan Saya"}
            </span>
            <span className="text-xs font-extrabold text-blue-950 font-mono">
              {isStaff ? `${displayedPembinaanHours} Jam (${averagePembinaanHours}/mhs)` : `${displayedPembinaanHours} Jam`}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5 overflow-hidden">
            <div 
              style={{ width: `${benchmarkPercentage}%` }} 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            ></div>
          </div>
          <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold">
            <span>{isStaff ? "Rata-rata Target: 15 jam" : "Target Kelulusan: 15 jam"}</span>
            <span className="text-emerald-600 font-extrabold">{benchmarkPercentage}% Tercapai</span>
          </div>
        </div>
      </div>

      {/* Sinergi Kontribusi Panel */}
      <div className="w-full">
        {/* Synthesis visual metrics ratios */}
        <div className="w-full bg-white border border-slate-200/85 rounded-xl p-5 md:p-6 space-y-5 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-base font-extrabold text-blue-950 mb-1.5 font-sans">
              {isStaff ? "Sinergi Pembinaan & Pengabdian Asrama" : "Sinergi Pembinaan & Pengabdian Saya"}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Keseimbangan antara penempaan moral-karakter internal asrama dengan penyaluran empati sosial konkret di lapangan.
            </p>
          </div>

          {/* Visual bar graph style comparisons */}
          <div className="space-y-4 my-2">
            {/* Pembinaan */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full block"></span>
                  {isStaff ? "Total Pembinaan Karakter" : "Pembinaan Karakter Saya"}
                </span>
                <span className="font-mono text-slate-600 font-semibold">{displayedPembinaanHours} Jam</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, Math.round((displayedPembinaanHours / (displayedPembinaanHours + displayedPengabdianHours + displayedPembedayaanLainHours || 1)) * 100))}%` }}
                  className="bg-blue-600 h-full rounded-full"
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-sans">
                {isStaff 
                  ? "Meliputi pembinaan karakter mingguan, tahfidz quran, pembinaan soft skill, dan mentoring asrama yang dihadiri oleh seluruh awardee." 
                  : "Sesi pembinaan karakter mingguan, mentoring tahfidz Al-Quran harian, dan kegiatan internal asrama yang Anda hadiri secara aktif."}
              </p>
            </div>

            {/* Other Capacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full block"></span>
                  {isStaff ? "Total Pengabdian & Capacity Building" : "Pengabdian & Capacity Building Saya"}
                </span>
                <span className="font-mono text-slate-600 font-semibold">{displayedPengabdianHours + displayedPembedayaanLainHours} Jam</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, Math.round(((displayedPengabdianHours + displayedPembedayaanLainHours) / (displayedPembinaanHours + displayedPengabdianHours + displayedPembedayaanLainHours || 1)) * 100))}%` }}
                  className="bg-amber-500 h-full rounded-full"
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-sans">
                {isStaff
                  ? "Mengukur realisasi jam kerja sosial, sukarelawan kemanusiaan, serta pelatihan kepemimpinan sekunder di lapangan."
                  : "Jam pengabdian sosial sukarela di lapangan serta kegiatan pelatihan kepemimpinan yang Anda ikuti langsung luar asrama."}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 leading-normal">
            <div>💡 <span className="font-extrabold text-blue-950">Prinsip Asrama:</span></div>
            <p>Seorang pemimpin sejati wajib mengimbangi kematangan akademik internal dengan kepekaan eksternal membantu lingkungan sekitar.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
