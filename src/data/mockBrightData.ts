import { User, AwardeeProfile, Activity, ImpactStat, UpcomingSchedule } from "../types";

export const initialUsers: User[] = [
  {
    uid: "admin-1",
    name: "Abdul Habir",
    email: "abdulhabir66@gmail.com",
    role: "admin",
    createdAt: "2024-01-15T08:30:00Z"
  },
  {
    uid: "admin-user-abhyy",
    name: "Abhyy (Pengurus Pusat)",
    email: "abhyy333@gmail.com",
    role: "admin",
    createdAt: "2026-06-10T14:12:00Z"
  },
  {
    uid: "awardee-1",
    name: "Aisyah Putri Rahayu",
    email: "aisyah.putri@student.ui.ac.id",
    role: "awardee",
    createdAt: "2024-08-01T10:00:00Z"
  },
  {
    uid: "awardee-2",
    name: "Bambang Pamungkas Utama",
    email: "bambang.utama@mail.ugm.ac.id",
    role: "awardee",
    createdAt: "2024-08-01T11:15:00Z"
  },
  {
    uid: "awardee-3",
    name: "Faris Al-Fatih",
    email: "faris.alfatih@student.itb.ac.id",
    role: "awardee",
    createdAt: "2025-01-10T09:00:00Z"
  },
  {
    uid: "awardee-4",
    name: "Dewi Lestari Ningrum",
    email: "dewi.lestari@unram.ac.id",
    role: "awardee",
    createdAt: "2025-01-12T14:20:00Z"
  },
  {
    uid: "user-public-1",
    name: "Budi Santoso",
    email: "budi.santoso@gmail.com",
    role: "public",
    createdAt: "2025-05-18T16:45:00Z"
  },
  {
    uid: "fasilitator-1",
    name: "Ust. Hamdan, Lc.",
    email: "fasilitator@brightscholarship.org",
    role: "fasilitator",
    createdAt: "2025-02-10T08:00:00Z"
  },
  {
    uid: "kepalaasrama-1",
    name: "Drs. H. Mulyadi",
    email: "kepalaasrama@brightscholarship.org",
    role: "kepala_asrama",
    createdAt: "2025-02-12T09:30:00Z"
  }
];

export const initialAwardeeProfiles: AwardeeProfile[] = [
  {
    awardeeId: "awardee-1",
    name: "Aisyah Putri Rahayu",
    university: "Universitas Indonesia",
    major: "Ilmu Ekonomi",
    batch: "7",
    gpa: 3.84,
    bio: "Penerima beasiswa Bright Scholarship Angkatan 7. Tertarik pada pembangunan berkelanjutan, keseimbangan kebijakan moneter publik, serta aktif dalam pemberdayaan UMKM lokal di Depok.",
    linkedinUrl: "https://linkedin.com/in/aisyah-putri-rahayu",
    skills: ["Analisis Data", "Stata", "Financial Modeling", "Public Speaking", "Kepemimpinan Sosial"],
    totalServiceHours: 42,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
  },
  {
    awardeeId: "awardee-2",
    name: "Bambang Pamungkas Utama",
    university: "Universitas Gadjah Mada",
    major: "Teknik Elektro",
    batch: "7",
    gpa: 3.72,
    bio: "Mahasiswa Teknik Elektro UGM dengan komitmen tinggi pada pemanfaatan energi terbarukan di wilayah pedesaan. Organisasi asrama Bright Scholarship mengajari saya arti kepemimpinan transformasional.",
    linkedinUrl: "https://linkedin.com/in/bambang-pamungkas-utama",
    skills: ["Panel Surya", "IoT", "MATLAB", "Manajemen Proyek", "Bahasa Inggris Bisnis"],
    totalServiceHours: 35,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
  },
  {
    awardeeId: "awardee-3",
    name: "Faris Al-Fatih",
    university: "Institut Teknologi Bandung",
    major: "Teknik Informatika",
    batch: "8",
    gpa: 3.91,
    bio: "Software developer muda yang bertekad menjembatani kesenjangan digital di Indonesia Timur lewat aplikasi open-source pendidikan dasar gratis.",
    linkedinUrl: "https://linkedin.com/in/faris-alfatih-dev",
    skills: ["React/Vite", "Node.js", "Firebase", "Algoritma Struktur Data", "UI/UX Design"],
    totalServiceHours: 24,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
  },
  {
    awardeeId: "awardee-4",
    name: "Dewi Lestari Ningrum",
    university: "Universitas Mataram",
    major: "Pendidikan Bahasa Inggris",
    batch: "8",
    gpa: 3.89,
    bio: "Aktivis pendidikan yang mendirikan pojok baca gratis di Desa Sukarara Lombok. Fokus pada pengembangan kurikulum alternatif berbasis kearifan lokal untuk anak-anak pesisir.",
    linkedinUrl: "https://linkedin.com/in/dewi-lestari-ningrum",
    skills: ["Kurikulum English", "Storytelling", "Community Organizing", "Microsoft Office", "Negosiasi Vendor"],
    totalServiceHours: 58,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  }
];

export const initialActivities: Activity[] = [
  {
    activityId: "act-1",
    title: "Eco-Energy Volunteer: Instalasi Panel Surya Desa Mandiri",
    description: "Kegiatan pengabdian masyarakat riil berupa perancangan dan pemasangan 3 unit panel surya mandiri untuk menyalakan penerangan jalan umum dan pompa air bersih di Dusun Karang Bajo, Lombok Utara. Dipimpin oleh Bambang dan disokong relawan asrama.",
    date: "2025-04-12",
    category: "Pengabdian Masyarakat",
    location: "Dusun Karang Bajo, Lombok Utara",
    awardeesInvolved: ["awardee-2", "awardee-4"],
    hoursEarned: 15,
    createdBy: "admin-1",
    mediaUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80"
  },
  {
    activityId: "act-2",
    title: "Program Pendampingan Digitalisasi Laporan Keuangan UMKM",
    description: "Pembekalan akuntansi praktis menggunakan aplikasi digital untuk 25 pelaku industri kerajinan kain tenun lokal khas Lombok Barat, yang membantu memperluas kelayakan pinjaman modal usaha.",
    date: "2025-05-02",
    category: "Pengabdian Masyarakat",
    location: "Koperasi Tenun Patuh Angen, Lombok Barat",
    awardeesInvolved: ["awardee-1", "awardee-4"],
    hoursEarned: 12,
    createdBy: "admin-1",
    mediaUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
  },
  {
    activityId: "act-3",
    title: "Bright Leadership Forum: Character & Public Trust",
    description: "Studium generale dan pembinaan intensif kepemimpinan asrama bulanan, menghadirkan narasumber nasional bertema 'Membangun Etika Kepemimpinan Publik Berintegritas Tinggi'. Seluruh awardee wajib hadir guna menyelaraskan visi beasiswa.",
    date: "2025-05-20",
    category: "Pembinaan",
    location: "Bright Executive Hall, Jakarta Selatan (Hybrid)",
    awardeesInvolved: ["awardee-1", "awardee-2", "awardee-3", "awardee-4"],
    hoursEarned: 6,
    createdBy: "admin-1",
    mediaUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80"
  },
  {
    activityId: "act-4",
    title: "Youth Tech Bootcamp: Kelas Coding Pemrogram Cilik Lombok",
    description: "Kegiatan sukarelawan asrama dalam melatih logika dasar pemrograman (Scratch & Web dasar) kepada 30 siswa SMP Negeri pelosok guna meningkatkan keakraban teknologi di luar kurikulum standar.",
    date: "2025-05-28",
    category: "Pengabdian Masyarakat",
    location: "Lab Komputer SMPN 4 Narmada",
    awardeesInvolved: ["awardee-3", "awardee-4"],
    hoursEarned: 18,
    createdBy: "admin-1",
    mediaUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"
  },
  {
    activityId: "act-5",
    title: "Capacity Building: Public Speaking & Pitching Masterclass",
    description: "Pelatihan pembinaan soft skills asrama eksklusif tentang elevator pitching untuk presentasi karya kompetisi nasional, menyelaraskan kemampuan komunikasi mahasiswa Bright Scholarship agar cakap meyakinkan investor.",
    date: "2025-06-03",
    category: "Capacity Building",
    location: "Asrama Bright Scholarship Regional Bandung",
    awardeesInvolved: ["awardee-1", "awardee-3"],
    hoursEarned: 8,
    createdBy: "admin-1",
    mediaUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
  }
];

export const initialImpactStat: ImpactStat = {
  statId: "global_analytics",
  totalAwardeesCount: 4,
  totalActivitiesCount: 5,
  totalServiceHours: 159, // 42 + 35 + 24 + 58 (derived initial hours)
  pembinaanHours: 14, // Monthly character building plus Capacity Building (6 + 8)
  pengabdianHours: 45 // 15 (act 1) + 12 (act 2) + 18 (act 4)
};

export const initialUpcomingSchedules: UpcomingSchedule[] = [
  {
    scheduleId: "sched-1",
    title: "Mentoring Tahfidz Quran Juz 30 & Setoran Rutin",
    description: "Kegiatan rutin setoran hafalan Juz 30 (Amma) bagi seluruh awardee asrama, disertai pembekalan tajwid, makharijul huruf, dan pemaknaan tafsir ringkas ayat-ayat pilihan.",
    date: "2026-06-15",
    time: "05:00 - 06:30 WIB",
    category: "Tahfidz Quran",
    location: "Selasar Utama Masjid Asrama Regional",
    speaker: "Ustadz Hilman Hakim, Al-Hafiz",
    registeredAwardeesCount: 4,
    notes: "Wajib membawa mushaf Al-Quran masing-masing dan datang tepat waktu setelah ibadah shalat subuh berjamaah."
  },
  {
    scheduleId: "sched-2",
    title: "Workshop Pembinaan Karakter: Etika Kepemimpinan Publik",
    description: "Pembekalan karakter moral berintegritas tinggi untuk mengokohkan kejujuran akademis, pilar anti-korupsi, serta ketangguhan kepemimpinan spiritual yang berorientasi mengayomi masyarakat.",
    date: "2026-06-20",
    time: "09:00 - 11:30 WIB",
    category: "Pembinaan Karakter",
    location: "Bright Executive Hall & Zoom Live",
    speaker: "Abdul Habir",
    registeredAwardeesCount: 3,
    notes: "Dresscode: Kemeja putih rapi/almamater. Disediakan e-certificate kepemimpinan dan makan siang sehat."
  },
  {
    scheduleId: "sched-3",
    title: "Soft Skill masterclass: Elevator Pitch & Presentation Design",
    description: "Latihan praktis menyusun rancangan deck presentasi di Figma, teknik berbicara meyakinkan (elevator pitch), dan pembawaan diri percaya diri di hadapan panelis reviewer nasional.",
    date: "2026-06-25",
    time: "13:30 - 16:00 WIB",
    category: "Pembinaan Soft Skill",
    location: "Bright Innovation Hub Lab, Lantai 2",
    speaker: "Faris Al-Fatih (Informatika ITB / Founder Devpedia)",
    registeredAwardeesCount: 4,
    notes: "Harap menginstall atau mendaftar akun Figma sebelum kelas dimulai. Membawa laptop masing-masing dengan baterai terisi penuh."
  },
  {
    scheduleId: "sched-4",
    title: "Kegiatan Sosial: Bright Care Peduli & Pojok Literasi Anak Panti",
    description: "Aksi pengabdian sosial kemitraan panti asuhan yatim piatu. Awardee berkolaborasi menyumbangkan buku edukatif, merakit pojok ruang bermain, dan mengajar kelas bahasa Inggris interaktif.",
    date: "2026-07-02",
    time: "08:00 - 14:00 WIB",
    category: "Kegiatan Sosial",
    location: "Panti Asuhan Kasih Ibu, Depok Barat",
    speaker: "Dewi Lestari Ningrum (Coordinator Bright Care)",
    registeredAwardeesCount: 4,
    notes: "Titik kumpul keberangkatan di Lobby Asrama pukul 07:15 WIB. Transportasi bus asrama PP disediakan."
  }
];

