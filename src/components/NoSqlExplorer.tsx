import React, { useState } from "react";
import { Database, ShieldAlert, Key, FileJson, CheckCircle2, Copy } from "lucide-react";

export default function NoSqlExplorer() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeSchemaTab, setActiveSchemaTab] = useState<"users" | "awardees" | "activities" | "impact_stats" | "rules">("users");

  const schemas = {
    users: {
      collection: "users",
      docId: "{userId} (Firebase Auth UID)",
      description: "Menyimpan data otentikasi dasar dan peran akses pengguna (Admin, Awardee, atau Public).",
      whyNoSQL: "Mengisolasi metadata otentikasi minimal dari detail portofolio akademik. Skema ini sangat cepat di-read saat pertama kali pengguna login tanpa memuat muatan bio/skills yang besar.",
      fields: [
        { name: "uid", type: "String", desc: "UID unik hasil generator Firebase Authentication." },
        { name: "name", type: "String", desc: "Nama lengkap user untuk penayangan global dasar." },
        { name: "email", type: "String", desc: "Alamat email terdaftar dan terverifikasi." },
        { name: "role", type: "String (Enum)", desc: "Hak akses: 'admin' (pengelola beasiswa), 'awardee' (penerima beasiswa), atau 'public' (tamu)." },
        { name: "createdAt", type: "Timestamp", desc: "Waktu pendaftaran akun pertama kali." }
      ],
      json: `{
  "uid": "uid-aisyah-putri-123",
  "name": "Aisyah Putri Rahayu",
  "email": "aisyah.putri@student.ui.ac.id",
  "role": "awardee",
  "createdAt": "2024-08-01T10:00:00Z"
}`
    },
    awardees: {
      collection: "awardees",
      docId: "{awardeeId} (Sama dengan UID pengguna)",
      description: "Profil profesional dan akademik lengkap awardee. Dipisahkan dari koleksi dasar 'users' demi privasi data dan modularitas pembacaan data publik.",
      whyNoSQL: "NoSQL mendukung tipe data fleksibel seperti array untuk list 'skills' yang dinamis (tanpa memerlukan tabel relasi join) serta aman diakses publik secara massal.",
      fields: [
        { name: "awardeeId", type: "String", desc: "Foreign Key terhubung dengan UID koleksi 'users'." },
        { name: "name", type: "String", desc: "Nama lengkap penerima beasiswa." },
        { name: "university", type: "String", desc: "Universitas asal penerima beasiswa (e.g. Universitas Indonesia)." },
        { name: "major", type: "String", desc: "Jurusan / Program Studi." },
        { name: "batch", type: "String", desc: "Angkatan rekrutmen beasiswa (e.g. Angkatan 7)." },
        { name: "gpa", type: "Number (Double)", desc: "IPK Kumulatif terakhir (skala 4.00)." },
        { name: "bio", type: "String", desc: "Deskripsi diri deskriptif / profesional headline." },
        { name: "linkedinUrl", type: "String", desc: "Link tautan profil LinkedIn aktif." },
        { name: "skills", type: "Array (Strings)", desc: "Daftar keahlian teknis / non-teknis pendukung." },
        { name: "totalServiceHours", type: "Number", desc: "Agregasi jam kontribusi asrama / pengabdian sosial (Denormalisasi)." },
        { name: "status", type: "String (Enum)", desc: "Status beasiswa aktif: 'active' atau 'alumni'." },
        { name: "updatedAt", type: "Timestamp", desc: "Waktu modifikasi profil terakhir." }
      ],
      json: `{
  "awardeeId": "uid-aisyah-putri-123",
  "name": "Aisyah Putri Rahayu",
  "university": "Universitas Indonesia",
  "major": "Ilmu Ekonomi",
  "batch": "Angkatan 7",
  "gpa": 3.84,
  "bio": "Penerima beasiswa Bright Scholarship Angkatan 7. Tertarik pada pembangunan berkelanjutan, keseimbangan kebijakan moneter publik, serta aktif dalam pemberdayaan UMKM lokal di Depok.",
  "linkedinUrl": "https://linkedin.com/in/aisyah-putri-rahayu",
  "skills": ["Analisis Data", "Stata", "Financial Modeling", "Public Speaking", "Kepemimpinan Sosial"],
  "totalServiceHours": 42,
  "status": "active",
  "updatedAt": "2025-06-03T14:30:00Z"
}`
    },
    activities: {
      collection: "activities",
      docId: "{activityId} (Auto-generated UUID)",
      description: "Pencatatan kegiatan, pelatihan kepemimpinan (Pembinaan), dan pengabdian masyarakat riil oleh mahasiswa asrama.",
      whyNoSQL: "Penerima manfaat (awardeesInvolved) disimpan dalam array of references di dalam dokumen. Meminimalkan join query dan mempermudah query pencarian kegiatan berdasarkan ID awardee langsung lewat operator 'array-contains'.",
      fields: [
        { name: "activityId", type: "String", desc: "ID dokumen unik hasil sistem." },
        { name: "title", type: "String", desc: "Judul program / kegiatan." },
        { name: "description", type: "String", desc: "Penjelasan pelaksanaan, luaran, dan dampak sosial." },
        { name: "date", type: "String (YYYY-MM-DD)", desc: "Tanggal kalender pelaksanaan kegiatan." },
        { name: "category", type: "String (Enum)", desc: "Klasifikasi: 'Pembinaan', 'Pengabdian Masyarakat', 'Capacity Building', atau 'Lainnya'." },
        { name: "mediaUrl", type: "String", desc: "Link foto dokumentasi kegiatan atau folder berkas." },
        { name: "awardeesInvolved", type: "Array (Strings)", desc: "Daftar UID seluruh awardee penerima beasiswa yang ikut terlibat." },
        { name: "hoursEarned", type: "Number", desc: "Bobot jam pengabdian yang dikreditkan untuk setiap partisipan." },
        { name: "location", type: "String", desc: "Lokasi fisik pelaksanaan (atau link jika daring)." },
        { name: "createdBy", type: "String", desc: "UID administrator yang membuat dokumentasi ini." },
        { name: "createdAt", type: "Timestamp", desc: "Waktu log aktivitas dibuat di server." }
      ],
      json: `{
  "activityId": "act-panel-surya-778",
  "title": "Eco-Energy Volunteer: Instalasi Panel Surya Desa Mandiri",
  "description": "Kegiatan pengabdian masyarakat berupa perancangan dan pemasangan 3 unit panel surya mandiri untuk menyalakan pompa air bersih warga di Dusun Karang Bajo, Lombok Utara.",
  "date": "2025-04-12",
  "category": "Pengabdian Masyarakat",
  "mediaUrl": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600",
  "awardeesInvolved": ["uid-bambang-ugm-456", "uid-dewi-unram-789"],
  "hoursEarned": 15,
  "location": "Dusun Karang Bajo, Lombok Utara",
  "createdBy": "admin-1",
  "createdAt": "2025-04-12T16:00:00Z"
}`
    },
    impact_stats: {
      collection: "impact_stats",
      docId: "global_analytics",
      description: "Koleksi denormalisasi khusus untuk memegang angka agregasi utama dashboard beasiswa.",
      whyNoSQL: "Alih-alih memanggil query hitung (O(N) reads) setiap kali pengunjung membuka website (yang memperbesar biaya Firestore), agregasi di-cache secara otomatis dalam 1 dokumen tunggal. Hanya menyita 1 kali baca dokumen per sesi kunjungan (O(1) read).",
      fields: [
        { name: "statId", type: "String", desc: "Paling umum bernilai 'global_analytics'." },
        { name: "totalAwardeesCount", type: "Number", desc: "Total kuantitas awardees aktif." },
        { name: "totalActivitiesCount", type: "Number", desc: "Mencatat jumlah inisiatif asrama yang telah rampung." },
        { name: "totalServiceHours", type: "Number", desc: "Akumulasi jam pengabdian dan pembinaan seluruh awardee." },
        { name: "pembinaanHours", type: "Number", desc: "Total jam khusus pengembangan karakter & mentoring asrama." },
        { name: "pengabdianHours", type: "Number", desc: "Total jam pengabdian nyata kepada masyarakat pedesaan." },
        { name: "updatedAt", type: "Timestamp", desc: "Tanggal sinkronisasi terakhir sistem agregator." }
      ],
      json: `{
  "statId": "global_analytics",
  "totalAwardeesCount": 4,
  "totalActivitiesCount": 5,
  "totalServiceHours": 159,
  "pembinaanHours": 14,
  "pengabdianHours": 45,
  "updatedAt": "2025-06-03T18:15:00Z"
}`
    },
    rules: {
      collection: "Security Rules",
      docId: "firestore.rules",
      description: "Implementasi kebijakan Zero-Trust dan Role-Based Access Control (RBAC) terpusat di cloud Firestore.",
      whyNoSQL: "Mencegah serangan peretas lokal lewat bypass SDK klien browser. Menjamin bahwa modifikasi, penghapusan, dan pemeliharaan keseluruhan data hanya sah dieksekusi oleh akun Admin resmi.",
      fields: [
        { name: "Master Gate", type: "Default Deny", desc: "Kunci mati read/write global di luar rule pencocokan eksplisit." },
        { name: "Otoritas Tulis", type: "Admin Only", desc: "Melarang keras pengguna dengan peran 'awardee' atau 'public' memodifikasi dokumen apa pun." },
        { name: "Sesi Pengunjung", type: "Read Only", desc: "Peran non-admin dibatasi murni pada operasi pengamatan baca (get/list) guna mencegah anomali data akademik." },
        { name: "Maintenance & Rules", type: "Zero-Trust", desc: "Sistem dilindungi penuh di bawah lisensi pengawasan administrator terverifikasi." }
      ],
      json: `// Aturan Keamanan Firestore Terbaru (Hanya Admin yang Bisa Menulis & Memelihara)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fungsi otentikasi & peran internal
    function isSignedIn() {
      return request.auth != null;
    }
    
    function hasRole(role) {
      return isSignedIn() && 
        get(/users/$(request.auth.uid)).data.role == role;
    }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if hasRole('admin');
    }

    match /awardees/{awardeeId} {
      allow read: if true; 
      allow write: if hasRole('admin'); // KUNCI UTAMA: Hanya Admin yang dapat memodifikasi profil awardee
    }

    match /activities/{activityId} {
      allow read: if true;
      allow write: if hasRole('admin'); // Hanya Admin yang memiliki wewenang log program baru
    }

    match /impact_stats/{statId} {
      allow read: if true;
      allow write: if hasRole('admin'); // Agregat dashboard dikelola mutlak oleh Admin
    }
  }
}`
    }
  };

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(title);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 shadow-xl rounded-xl p-5 md:p-7 text-slate-300">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 text-emerald-400 font-semibold mb-1">
            <Database className="w-5 h-5 text-emerald-400" />
            <span className="text-xs uppercase tracking-wider font-mono">NoSQL & Architecture Specification</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Desain Arsitektur & Skema Database Efisien</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Arsitektur terstruktur NoSQL Firebase Firestore dengan model denormalisasi cache pintar, menjamin latensi super rendah dan biaya operasional hemat energi.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 max-w-max">
          <Key className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-[11px] font-medium leading-tight">
            <div className="text-white font-bold">ZERO-TRUST SECURITY</div>
            <div className="text-slate-400">Attribute-Based Rules (ABAC)</div>
          </div>
        </div>
      </div>

      {/* NoSQL Core Highlights Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="text-emerald-400 font-bold font-mono text-sm mb-1.5">01. Pembagian Koleksi (Split)</div>
          <p className="text-[12px] text-slate-400">
            Mengisolasi akun umum (<span className="text-white font-mono">/users</span>) dari profil akademik asrama (<span className="text-white font-mono">/awardees</span>). Cara ini melindungi PII dan menjamin profil awardee bisa dibagikan umum tanpa mempublikasikan email privat atau catatan admin.
          </p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="text-emerald-400 font-bold font-mono text-sm mb-1.5">02. Denormalisasi Agregat</div>
          <p className="text-[12px] text-slate-400">
            Koleksi <span className="text-white font-mono">/impact_stats</span> bertindak sebagai read-cache yang menangkap agregat jam sosial dan kepatuhan dalam satu baca data tunggal (O(1) reads), memangkas pembacaan database masal demi mencegah pemborosan kuota.
          </p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="text-emerald-400 font-bold font-mono text-sm mb-1.5">03. Aturan Proteksi (ABAC)</div>
          <p className="text-[12px] text-slate-400">
            Melarang keras modifikasi IPK atau Penambahan jam pembinaan mandiri oleh awardee. Memperbolehkan awardee memperbarui keterampilan/social links-nya sendiri secara fleksibel dengan validasi ketat dari server-side.
          </p>
        </div>
      </div>

      {/* Relational Mapping Flowchart */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/60 mb-6">
        <div className="text-white text-xs font-semibold mb-3 font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          Pemetaan Hubungan Relasi Firestore (NoSQL-Link)
        </div>
        <div className="flex flex-col lg:flex-row justify-around items-center gap-4 text-xs font-mono py-2 text-center">
          <div className="bg-teal-950/80 border border-teal-800 p-3 rounded-lg w-full max-w-[200px]">
            <div className="text-emerald-300 font-bold">Koleksi: /users</div>
            <div className="text-[10px] text-teal-400 mt-1">PK: `{`userId`}`</div>
            <div className="text-slate-400 text-[10px] mt-1">Memetakan Akun & Role</div>
          </div>
          <div className="text-slate-500 text-lg hidden lg:block">➔</div>
          <div className="bg-emerald-950/80 border border-emerald-800 p-3 rounded-lg w-full max-w-[220px]">
            <div className="text-emerald-300 font-bold">Koleksi: /awardees</div>
            <div className="text-[10px] text-emerald-400 mt-1">PK: `{`awardeeId`}` (uid)</div>
            <div className="text-slate-400 text-[10px] mt-1">Portofolio & IPK Kampus</div>
          </div>
          <div className="text-slate-500 text-lg hidden lg:block">➔</div>
          <div className="bg-blue-950/80 border border-blue-800 p-3 rounded-lg w-full max-w-[240px]">
            <div className="text-blue-300 font-bold">Koleksi: /activities</div>
            <div className="text-[10px] text-blue-400 mt-1">PK: `{`activityId`}` (auto)</div>
            <div className="text-slate-400 text-[10px] mt-1">Array IDs [Involvement]</div>
          </div>
          <div className="text-slate-500 text-lg hidden lg:block">➔</div>
          <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg w-full max-w-[200px]">
            <div className="text-slate-300 font-bold">Koleksi: /impact_stats</div>
            <div className="text-[10px] text-slate-400 mt-1">Doc: 'global_analytics'</div>
            <div className="text-slate-500 text-[10px] mt-1">Cache Total Waktu Pembinaan</div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Specification */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-800 pb-px mb-5">
        {(Object.keys(schemas) as Array<keyof typeof schemas>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveSchemaTab(key)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeSchemaTab === key
                ? "bg-slate-800 text-emerald-400 border-t border-x border-slate-700 font-bold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            {key === "rules" ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                Security Rules
              </span>
            ) : (
              <span className="flex items-center gap-1.5 capitalize">
                <FileJson className="w-3.5 h-3.5 text-emerald-500" />
                Colek: /{schemas[key].collection}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Detail Information */}
        <div className="lg:col-span-5 space-y-4 text-xs md:text-sm">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono font-bold">Informasi Koleksi</div>
            <h3 className="text-lg font-bold text-white font-mono">
              Collection Path: <span className="text-emerald-400">/{schemas[activeSchemaTab].collection}</span>
            </h3>
            <div className="text-slate-400 text-xs mt-1">
              Document ID format: <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded font-mono text-[11px]">{schemas[activeSchemaTab].docId}</code>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs border-l-2 border-emerald-500 pl-2">Visi & Tujuan Desain</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {schemas[activeSchemaTab].description}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs border-l-2 border-emerald-500 pl-2">Keunggulan NoSQL</h4>
            <p className="text-slate-400 text-xs leading-relaxed italic">
              {schemas[activeSchemaTab].whyNoSQL}
            </p>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            <h4 className="text-white font-semibold text-xs border-l-2 border-emerald-500 pl-2">Struktur Schema Dokumen</h4>
            <div className="space-y-2 mt-2">
              {schemas[activeSchemaTab].fields.map((field, idx) => (
                <div key={idx} className="bg-slate-950/80 p-2.5 rounded border border-slate-850">
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <span className="text-emerald-400 font-bold">{field.name}</span>
                    <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[9px]">{field.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{field.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* JSON / Code Block Area */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative">
          <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              <span className="ml-2">Schema JSON Terstruktur</span>
            </div>
            <button
              onClick={() => copyToClipboard(schemas[activeSchemaTab].json, activeSchemaTab)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer select-none transition-colors"
            >
              {copiedSection === activeSchemaTab ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin JSON</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre className="font-mono text-[11px] leading-relaxed text-slate-300">
              <code>{schemas[activeSchemaTab].json}</code>
            </pre>
          </div>
          <div className="p-3 bg-slate-900/60 border-t border-slate-850 text-[10px] text-slate-400 font-mono text-center">
            Gunakan koleksi ini untuk integrasi server SDK Klien Firebase Firestore
          </div>
        </div>
      </div>
    </div>
  );
}
