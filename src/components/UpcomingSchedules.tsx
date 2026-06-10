import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  Plus, 
  Search, 
  Trash2, 
  CheckSquare, 
  Check,
  CalendarDays, 
  Info, 
  BookOpen, 
  Award, 
  Sparkles, 
  HeartHandshake,
  Users,
  AlertCircle,
  Upload,
  Image
} from "lucide-react";
import { UpcomingSchedule, UserRole, AwardeeProfile, Activity } from "../types";

interface UpcomingSchedulesProps {
  schedules: UpcomingSchedule[];
  onAddSchedule: (newSched: UpcomingSchedule) => void;
  onDeleteSchedule: (id: string) => void;
  onUpdateRSVP: (id: string, enrolled: boolean) => void;
  currentRole: UserRole;
  awardees?: AwardeeProfile[];
  onUpdateSchedule?: (updatedSched: UpcomingSchedule) => void;
  onAddActivity?: (newAct: Activity, involvedIds: string[], hoursGranted: number) => void;
  batches?: string[];
  currentUserProfile?: AwardeeProfile | null;
}

export default function UpcomingSchedules({
  schedules,
  onAddSchedule,
  onDeleteSchedule,
  onUpdateRSVP,
  currentRole,
  awardees = [],
  onUpdateSchedule,
  onAddActivity,
  batches = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  currentUserProfile
}: UpcomingSchedulesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (deleteConfirmId) {
      const timer = setTimeout(() => {
        setDeleteConfirmId(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [deleteConfirmId]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAddForm, setShowAddForm] = useState(false);

  // Completion form states
  const [activeCompletionSchedId, setActiveCompletionSchedId] = useState<string | null>(null);
  const [checkedAwardees, setCheckedAwardees] = useState<string[]>([]);
  const [documentationImage, setDocumentationImage] = useState<string | null>(null);
  const [documentationImageName, setDocumentationImageName] = useState<string | null>(null);
  const [hoursGranted, setHoursGranted] = useState<number>(2);
  const [completionError, setCompletionError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState<UpcomingSchedule["category"]>("Pembinaan Karakter");
  const [location, setLocation] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [isGeneral, setIsGeneral] = useState(true);
  const [targetBatch, setTargetBatch] = useState("9");

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
        setImageUrl(event.target.result as string);
        setUploadedImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImageName(null);
    setImageUrl("");
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // User RSVP simulation state
  const [userRsvps, setUserRsvps] = useState<Record<string, boolean>>({
    "sched-1": true,
    "sched-3": true,
  });

  // Countdown timer for next event
  const [nextEvent, setNextEvent] = useState<UpcomingSchedule | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    // Find the next upcoming event from now
    const now = new Date();
    const futureEvents = schedules
      .filter(s => new Date(s.date + "T" + (s.time.split(" ")[0] || "08:00")) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (futureEvents.length > 0) {
      setNextEvent(futureEvents[0]);
    } else if (schedules.length > 0) {
      // Fallback to closest date even if passed for simulation beauty
      setNextEvent(schedules[0]);
    } else {
      setNextEvent(null);
    }
  }, [schedules]);

  useEffect(() => {
    if (!nextEvent) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = new Date(nextEvent.date + "T" + (nextEvent.time.split(" ")[0] || "08:00")).getTime();
      const difference = eventTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  const getScheduleStatus = (sched: UpcomingSchedule) => {
    if (sched.status) return sched.status;
    
    const todayStr = new Date().toISOString().split("T")[0];
    if (sched.date === todayStr) {
      return "Sedang Berlangsung";
    }
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const eventDate = new Date(sched.date);
    eventDate.setHours(0,0,0,0);
    
    if (eventDate.getTime() < today.getTime()) {
      return "Sedang Berlangsung"; // Past event but not yet marked finished
    }
    return "Mendatang";
  };

  const handleStartSchedule = (sched: UpcomingSchedule) => {
    if (onUpdateSchedule) {
      onUpdateSchedule({
        ...sched,
        status: "Sedang Berlangsung"
      });
    }
  };

  const handleDocumentationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("BATAL UNGGAH: Format file bukan gambar.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDocumentationImage(event.target.result as string);
          setDocumentationImageName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCompletion = (sched: UpcomingSchedule) => {
    if (!documentationImage) {
      setCompletionError("WAJIB UNGGAH: Foto dokumentasi kegiatan harus dilampirkan.");
      return;
    }
    if (checkedAwardees.length === 0) {
      setCompletionError("WAJIB ABSEN: Harap pilih minimal satu awardee yang hadir kegiatan ini.");
      return;
    }
    setCompletionError(null);

    // 1. Update schedule to status: Selesai
    const updated: UpcomingSchedule = {
      ...sched,
      status: "Selesai",
      confirmedAttendance: checkedAwardees,
      documentationUrl: documentationImage
    };
    if (onUpdateSchedule) {
      onUpdateSchedule(updated);
    }

    // 2. Create the real completed activity
    if (onAddActivity) {
      const newAct: Activity = {
        activityId: "act-" + Date.now(),
        title: sched.title,
        description: `${sched.description} (Pemateri: ${sched.speaker}, Lokasi: ${sched.location}). Kehadiran dikonfirmasi oleh pengurus asrama.`,
        date: sched.date,
        category: sched.category === "Kegiatan Sosial" ? "Pengabdian Masyarakat" : "Pembinaan",
        mediaUrl: documentationImage,
        awardeesInvolved: checkedAwardees,
        hoursEarned: hoursGranted,
        location: sched.location,
        createdBy: currentRole
      };
      onAddActivity(newAct, checkedAwardees, hoursGranted);
    }

    // Reset forms
    setActiveCompletionSchedId(null);
    setCheckedAwardees([]);
    setDocumentationImage(null);
    setDocumentationImageName(null);
  };

  const handleToggleRsvp = (schedId: string) => {
    const currentlyEnrolled = !!userRsvps[schedId];
    setUserRsvps(prev => ({
      ...prev,
      [schedId]: !currentlyEnrolled
    }));
    onUpdateRSVP(schedId, !currentlyEnrolled);

    // Provide micro feedback
    setSuccessMessage(
      currentlyEnrolled 
        ? "RSVP DIBATALKAN: Kursi Anda di agenda tersebut telah dilepas." 
        : "RSVP BERHASIL: Tempat duduk Anda telah terpesan untuk program pembinaan ini!"
    );
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const categoriesList = [
    "All", 
    "Pembinaan Karakter", 
    "Tahfidz Quran", 
    "Pembinaan Soft Skill", 
    "Kegiatan Sosial"
  ];

  const getCategoryBadgeClass = (cat: UpcomingSchedule["category"]) => {
    switch(cat) {
      case "Pembinaan Karakter":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Tahfidz Quran":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pembinaan Soft Skill":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "Kegiatan Sosial":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getCategoryIcon = (cat: UpcomingSchedule["category"]) => {
    switch(cat) {
      case "Pembinaan Karakter":
        return <Award className="w-4 h-4 text-blue-600" />;
      case "Tahfidz Quran":
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case "Pembinaan Soft Skill":
        return <Sparkles className="w-4 h-4 text-violet-600" />;
      case "Kegiatan Sosial":
        return <HeartHandshake className="w-4 h-4 text-rose-600" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const isStaff = currentRole === "admin" || currentRole === "fasilitator" || currentRole === "kepala_asrama";
    if (!isStaff) {
      setErrorMessage("DITOLAK: Maaf, otentikasi role saat ini melarang pembuatan jadwal baru.");
      return;
    }

    if (!title || !description || !date || !time || !location || !speaker) {
      setErrorMessage("BATAL INPUT: Harap lengkapi semua isian formulir wajib bertanda bintang (*).");
      return;
    }

    const newSched: UpcomingSchedule = {
      scheduleId: "sched-" + Date.now(),
      title,
      description,
      date,
      time,
      category,
      location,
      speaker,
      registeredAwardeesCount: 0,
      notes: notes.trim() || undefined,
      imageUrl: imageUrl || undefined,
      targetBatch: isGeneral ? "all" : targetBatch
    };

    onAddSchedule(newSched);

    // Clear form
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
    setSpeaker("");
    setNotes("");
    setImageUrl("");
    setUploadedImageName(null);
    setIsGeneral(true);
    setTargetBatch("9");
    setShowAddForm(false);

    setSuccessMessage(`JADWAL BERHASIL DIBUAT: '${newSched.title}' telah dimasukkan dalam schedule pipeline.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter schedules
  const filteredSchedules = schedules.filter(sched => {
    const matchesKeyword = 
      sched.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sched.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sched.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sched.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || sched.category === selectedCategory;

    // Filter schedules by targetBatch for awardees
    let matchesBatch = true;
    if (currentRole === "awardee" && currentUserProfile) {
      const userBatchClean = currentUserProfile.batch.replace(/[^0-9]/g, "");
      const targetBatchClean = sched.targetBatch ? sched.targetBatch.replace(/[^0-9]/g, "") : "all";
      
      if (targetBatchClean !== "" && targetBatchClean !== "all" && targetBatchClean !== userBatchClean) {
        matchesBatch = false;
      }
    }

    return matchesKeyword && matchesCategory && matchesBatch;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Intro Panel Description */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1 max-w-3xl">
          <h2 className="text-xl font-extrabold text-blue-950 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5.5 h-5.5 text-blue-600" />
            <span>Jadwal Pembinaan & Kegiatan Mendatang</span>
          </h2>
          <p className="text-slate-650 text-xs leading-relaxed font-sans max-w-2xl">
            Pusat penjadwalan terpadu untuk 4 pilar pembinaan beasiswa Bright Scholarship: 
            <span className="font-semibold text-blue-700"> Pembinaan Karakter</span>, 
            <span className="font-semibold text-emerald-700"> Tahfidz Quran</span>, 
            <span className="font-semibold text-violet-700"> Pembinaan Soft Skill</span>, dan 
            <span className="font-semibold text-rose-700"> Kegiatan Sosial</span>. 
            Awardee dapat memantau agenda harian, mendaftarkan status kehadiran (RSVP), dan menerima detail teknis acara.
          </p>
        </div>
        {(currentRole === "admin" || currentRole === "fasilitator" || currentRole === "kepala_asrama") && (
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setErrorMessage(null);
            }}
            id="toggle-add-schedule-btn"
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
          >
            {showAddForm ? "Tutup Form Jadwal" : "Buat Jadwal Baru"}
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Success & Error Banner */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex gap-3 text-emerald-900 transition-all shadow-xs">
          <CheckSquare className="w-5 h-5 shrink-0 text-emerald-600" />
          <div className="text-xs">
            <span className="font-bold">SUKSES:</span> {successMessage}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex gap-3 text-rose-900 transition-all shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <div className="text-xs">
            <span className="font-bold">ULASAN ERROR:</span> {errorMessage}
          </div>
        </div>
      )}

      {/* Spectacular Countdown Widget & Next Event Card */}
      {nextEvent && (
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-950 text-white p-6 rounded-2xl shadow-md border border-slate-800 relative overflow-hidden">
          {/* Accent decoration rings */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-blue-700/10 blur-xl pointer-events-none"></div>
          <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-emerald-700/10 blur-xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-4 space-y-3 border-b md:border-b-0 md:border-r border-slate-800 pb-5 md:pb-0 md:pr-6">
              <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                Agenda Terdekat Selanjutnya
              </span>
              <h3 className="text-base font-extrabold text-white tracking-tight line-clamp-2">
                {nextEvent.title}
              </h3>
              <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{nextEvent.date}</span>
                <span className="mx-1">•</span>
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{nextEvent.time}</span>
              </div>
            </div>

            {/* Countdown layout */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-2 text-center md:px-6">
              <span className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold mb-3">COUNTDOWN ACARA</span>
              {timeLeft ? (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-white font-mono bg-white/5 border border-white/10 rounded-lg w-12 h-12 flex items-center justify-center">
                      {timeLeft.days}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono font-bold">HARI</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-white font-mono bg-white/5 border border-white/10 rounded-lg w-12 h-12 flex items-center justify-center border-b-emerald-500 border-b-2">
                      {timeLeft.hours}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono font-bold">JAM</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-white font-mono bg-white/5 border border-white/10 rounded-lg w-12 h-12 flex items-center justify-center border-b-emerald-500 border-b-2">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono font-bold">MENIT</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-emerald-400 font-mono bg-white/5 border border-white/10 rounded-lg w-12 h-12 flex items-center justify-center animate-pulse">
                      {timeLeft.seconds}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono font-bold">DETIK</span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-slate-300 italic">Tanggal acara telah tiba, silakan hadiri lokasi.</span>
              )}
            </div>

            {/* Action buttons inside counting */}
            <div className="md:col-span-3 flex flex-col items-center justify-center">
              <div className="text-xs text-slate-300 text-center flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{nextEvent.registeredAwardeesCount} Awardees Terjadwal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reactive Form to Add Schedule (Admin Only) */}
      {showAddForm && (currentRole === "admin" || currentRole === "fasilitator" || currentRole === "kepala_asrama") && (
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm ring-1 ring-blue-50">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <div className="p-2 rounded bg-blue-100/50">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Form Pembuatan Agenda & Pembinaan</h3>
              <p className="text-[10px] text-slate-400">Silakan isi instrumen berikut untuk mempublikasikan jadwal pembinaan nasional</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column Fields */}
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold block">Nama Agenda / Judul Pembinaan *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Mentoring Rutin Tahfidz Quran Juz 30"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-semibold focus:border-blue-500 focus:bg-white outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold block">Kategori Pembinaan *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as UpcomingSchedule["category"])}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-semibold focus:border-blue-500 focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="Pembinaan Karakter">Pembinaan Karakter</option>
                    <option value="Tahfidz Quran">Tahfidz Quran</option>
                    <option value="Pembinaan Soft Skill">Pembinaan Soft Skill</option>
                    <option value="Kegiatan Sosial">Kegiatan Sosial</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-bold block">Tanggal Pelaksanaan *</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-semibold focus:border-blue-500 focus:bg-white outline-none cursor-pointer"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-bold block">Waktu / Durasi *</label>
                    <input
                      type="text"
                      placeholder="Contoh: 09:00 - 11:30 WIB"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-semibold focus:border-blue-500 focus:bg-white outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold block">Tempat / Ruangan *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Selasar Aula Utama Asrama / Zoom Meeting"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-semibold focus:border-blue-500 focus:bg-white outline-none"
                    required
                  />
                </div>
              </div>

              {/* Right Column Fields */}
              <div className="space-y-3.5 flex flex-col justify-between">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold block">Pembicara / Ustadz / Mentor *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ustadz Hilman Hakim, Al-Hafiz"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-semibold focus:border-blue-500 focus:bg-white outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold block">Deskripsi Detail Agenda *</label>
                  <textarea
                    placeholder="Menyediakan ulasan singkat mengenai poin-poin yang akan dicakup demi persiapan peserta asrama mendalam..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none resize-none font-sans"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold block">Catatan Tambahan (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Membawa mushaf Al-Quran, pakaian bebas rapi"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-800 text-xs font-medium focus:border-blue-500 focus:bg-white outline-none"
                  />
                </div>

                {/* Sifat Pembinaan / Target Batch */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
                  <span className="text-xs text-slate-700 font-extrabold block">Sifat Pembinaan & Target Angkatan</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input 
                        type="radio" 
                        name="isGeneral"
                        checked={isGeneral}
                        onChange={() => setIsGeneral(true)}
                        className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Umum (Semua Batch)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input 
                        type="radio" 
                        name="isGeneral"
                        checked={!isGeneral}
                        onChange={() => setIsGeneral(false)}
                        className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Khusus Batch Tertentu</span>
                    </label>
                  </div>

                  {!isGeneral && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Pilih Batch (Angkatan) Target *</label>
                      <select
                        value={targetBatch}
                        onChange={(e) => setTargetBatch(e.target.value)}
                        className="w-full bg-white border border-slate-200 p-2 rounded-lg text-slate-800 text-xs font-bold focus:border-blue-500 outline-none cursor-pointer"
                      >
                        {batches.map(b => (
                          <option key={b} value={b}>Batch {b}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Foto Sampul / Poster Agenda (Drag and drop) */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <label className="text-xs text-slate-600 font-bold block">
                Foto Sampul / Poster Agenda (Opsional, Tarik-dan-Lepas / File Upload)
              </label>
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                id="schedule-photo-dropzone"
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
                  id="schedule-photo-file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {imageUrl ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
                    <img 
                      src={imageUrl} 
                      alt="Preview Sampul" 
                      className="w-20 h-20 object-cover rounded-lg border border-emerald-200 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left space-y-1">
                      <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                        Foto Berhasil Diproses!
                      </p>
                      {uploadedImageName && (
                        <p className="text-[10px] text-slate-500 truncate max-w-xs">
                          {uploadedImageName}
                        </p>
                      )}
                      <button
                        type="button"
                        id="remove-schedule-photo-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveUploadedImage();
                        }}
                        className="text-[10px] text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer hover:bg-rose-50 px-1 py-0.5 rounded transition-all select-none z-30"
                      >
                        Hapus Foto Berkas
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 py-2">
                    <div className="p-2.5 rounded-full bg-slate-100 flex items-center justify-center w-10 h-10 mx-auto text-slate-500">
                      <Upload className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Pilih foto poster atau seret file ke sini
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Format yang didukung: PNG, JPG, JPEG, WEBP (Maksimal 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setErrorMessage(null);
                }}
                className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold ring-1 ring-slate-200 cursor-pointer transition-colors"
              >
                Batalkan
              </button>
              <button
                type="submit"
                id="submit-schedule-btn"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
              >
                Pecahkan Publikasi Jadwal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER AND SEARCH LAYOUT BAR */}
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        
        {/* Keyword Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Cari agenda pembinaan, topik, mentor, atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-55 bg-slate-50/50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-lg text-xs font-semibold focus:border-blue-505 outline-none font-sans transition-all text-slate-800 focus:bg-white"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              type="button"
              id={`cat-filter-btn-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 text-[11px] font-bold rounded-lg border cursor-pointer whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600 font-extrabold shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {cat === "All" ? "Semua Kategori" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* SCHEDULES COLLECTION GRID */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <Calendar className="w-10 h-10 text-slate-350 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-bold text-slate-700 font-sans">Jadwal Agenda Tidak Ditemukan</p>
          <p className="text-xs text-slate-400 mt-1">Cobalah menggunakan kata sandi alternatif atau ganti penapisan kategorial.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSchedules.map((sched) => {
            const hasRsvped = !!userRsvps[sched.scheduleId];
            const schedStatus = getScheduleStatus(sched);
            const isCompleting = activeCompletionSchedId === sched.scheduleId;

            return (
              <div 
                key={sched.scheduleId}
                id={`upcoming-card-${sched.scheduleId}`}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Horizontal color stripe or Cover Image based on upload status / completion */}
                {sched.documentationUrl || sched.imageUrl ? (
                  <div className="h-44 w-full overflow-hidden relative border-b border-slate-100">
                    <img 
                      src={sched.documentationUrl || sched.imageUrl} 
                      alt={sched.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                      <div className={`flex items-center gap-1.5 border px-2 py-0.5 rounded-full text-[9px] font-extrabold font-mono tracking-wide bg-white/95 text-slate-800 border-white shadow-2xs`}>
                        {getCategoryIcon(sched.category)}
                        <span>{sched.category}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`h-1.5 w-full ${
                    sched.category === "Pembinaan Karakter" 
                      ? "bg-blue-600" 
                      : sched.category === "Tahfidz Quran" 
                        ? "bg-emerald-500" 
                        : sched.category === "Pembinaan Soft Skill" 
                          ? "bg-violet-500" 
                          : "bg-rose-500"
                  }`}></div>
                )}

                <div className="p-5 flex-1 space-y-4">
                  {/* Category, Status badge and delete button row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {!sched.documentationUrl && !sched.imageUrl ? (
                        <div className={`flex items-center gap-1.5 border px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide ${getCategoryBadgeClass(sched.category)}`}>
                          {getCategoryIcon(sched.category)}
                          <span>{sched.category}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono mr-1">DOKUMENTASI PROGRAM</span>
                      )}

                      {/* Target Batch Badge */}
                      {sched.targetBatch && sched.targetBatch !== "all" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          Batch {sched.targetBatch}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
                          Semua Batch
                        </span>
                      )}
                    </div>

                    {/* Highly Polished Status Badge */}
                    <div className="flex items-center gap-2">
                      {schedStatus === "Mendatang" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          Mendatang
                        </span>
                      )}
                      {schedStatus === "Sedang Berlangsung" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                          Sedang Berlangsung
                        </span>
                      )}
                      {schedStatus === "Selesai" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 text-xxs flex items-center justify-center">✓</span>
                          Selesai
                        </span>
                      )}

                      {(currentRole === "admin" || currentRole === "fasilitator" || currentRole === "kepala_asrama") && (
                        <div className="relative inline-flex items-center ml-1">
                          {deleteConfirmId === sched.scheduleId ? (
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteSchedule(sched.scheduleId);
                                setDeleteConfirmId(null);
                              }}
                              className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 border-0 shadow-sm"
                              title="Konfirmasi hapus aktivitas"
                            >
                              <Check className="w-3 h-3 text-white" />
                              <span>Yakin?</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              id={`delete-sched-btn-${sched.scheduleId}`}
                              onClick={() => setDeleteConfirmId(sched.scheduleId)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus jadwal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title and description */}
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-900 tracking-tight leading-snug font-sans group-hover:text-blue-700 transition-colors">
                      {sched.title}
                    </h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3 font-sans">
                      {sched.description}
                    </p>
                  </div>

                  {/* Time and location specifications */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-sans pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={sched.time}>{sched.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{sched.date}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={sched.location}>{sched.location}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 truncate">
                      <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-semibold text-slate-700" title={sched.speaker}>Mentor: {sched.speaker}</span>
                    </div>
                  </div>

                  {/* Operational Notes */}
                  {sched.notes && (
                    <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors p-2.5 rounded-lg border border-slate-100 text-[10px] text-slate-600 leading-normal flex items-start gap-1.5 font-sans">
                      <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800">Catatan:</span> {sched.notes}
                      </div>
                    </div>
                   )}

                  {/* Attendance display for Completed items of Selesai */}
                  {schedStatus === "Selesai" && sched.confirmedAttendance && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1 text-[11px] text-slate-700">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kehadiran Dikonfirmasi ({sched.confirmedAttendance.length} Orang)</span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-mono flex flex-wrap gap-1 mt-1">
                        {sched.confirmedAttendance.map((uid) => {
                          const aw = awardees.find((a) => a.awardeeId === uid || a.name === uid);
                          return (
                            <span key={uid} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-800">
                              {aw ? aw.name : uid}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Action Controls for Facilitators / Dorm Heads */}
                  {(currentRole === "admin" || currentRole === "fasilitator" || currentRole === "kepala_asrama") && (
                    <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                      {schedStatus === "Mendatang" && (
                        <button
                          type="button"
                          onClick={() => handleStartSchedule(sched)}
                          className="w-full text-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                        >
                          Mulai Kegiatan (Set Sedang Berlangsung)
                        </button>
                      )}

                      {schedStatus === "Sedang Berlangsung" && !isCompleting && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCompletionSchedId(sched.scheduleId);
                            setCompletionError(null);
                            // Initialise checked awardees with those registered
                            setCheckedAwardees(awardees.map(a => a.awardeeId));
                          }}
                          className="w-full text-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer animate-pulse"
                        >
                          Konfirmasi Kehadiran & Selesaikan Kegiatan
                        </button>
                      )}
                    </div>
                  )}

                  {/* NESTED COMPLETION FORM (CONFIIRM ABSENSI AND DOKUMENTASI UPLOAD) */}
                  {isCompleting && (
                    <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-xl p-4.5 space-y-3 mt-3 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-900 uppercase tracking-tight">KONTROL PENYELESAIAN AGENDA</span>
                        <span className="text-[10px] text-blue-600 font-bold">Wajib Diisi</span>
                      </div>

                      {/* 1. Absensi Checklist */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10.5px] font-extrabold text-slate-800">Konfirmasi Kehadiran Awardee *</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setCheckedAwardees(awardees.map(a => a.awardeeId))}
                              className="text-[9px] font-bold text-blue-600 hover:underline"
                            >
                              Pilih Semua
                            </button>
                            <button
                              type="button"
                              onClick={() => setCheckedAwardees([])}
                              className="text-[9px] font-bold text-slate-500 hover:underline"
                            >
                              Hapus Semua
                            </button>
                          </div>
                        </div>

                        <div className="max-h-[140px] overflow-y-auto border border-slate-200 bg-white rounded-lg p-2.5 space-y-1.5">
                          {awardees.length === 0 ? (
                            <p className="text-[10px] text-slate-400 italic">Tidak ada data awardee aktif.</p>
                          ) : (
                            awardees.map((aw) => (
                              <label key={aw.awardeeId} className="flex items-center gap-2 text-[11px] font-medium text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                <input
                                  type="checkbox"
                                  className="rounded text-blue-600 focus:ring-blue-500 outline-none"
                                  checked={checkedAwardees.includes(aw.awardeeId)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setCheckedAwardees(prev => [...prev, aw.awardeeId]);
                                    } else {
                                      setCheckedAwardees(prev => prev.filter(id => id !== aw.awardeeId));
                                    }
                                  }}
                                />
                                <span className="truncate">{aw.name} ({aw.university})</span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>

                      {/* 2. Photo upload */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-extrabold text-slate-800 block">Unggah Foto Dokumentasi Kegiatan *</label>
                        <div className="flex items-center gap-3">
                          <label className="px-3 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-[10.5px] text-slate-700 font-bold cursor-pointer flex items-center gap-1.5 shadow-3xs">
                            <Upload className="w-3.5 h-3.5 text-blue-600" />
                            <span>Pilih File Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleDocumentationFileChange}
                            />
                          </label>
                          {documentationImageName && (
                            <span className="text-[10px] text-slate-600 truncate max-w-[150px] font-mono">{documentationImageName}</span>
                          )}
                        </div>

                        {documentationImage && (
                          <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-white max-h-[110px] mt-1.5">
                            <img src={documentationImage} alt="Preview dokumentasi" className="w-full h-auto object-cover max-h-[110px]" />
                            <button
                              type="button"
                              onClick={() => {
                                setDocumentationImage(null);
                                setDocumentationImageName(null);
                              }}
                              className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center text-[8px]"
                              title="Hapus foto"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 3. Hours to grant */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-extrabold text-slate-800 block">Bobot Jam Beasiswa (Granted Hours) *</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                          value={hoursGranted}
                          onChange={(e) => setHoursGranted(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                      </div>

                      {/* Compilation Error feedback */}
                      {completionError && (
                        <div className="p-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-[10px] font-bold flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <span>{completionError}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCompletionSchedId(null);
                            setCheckedAwardees([]);
                            setDocumentationImage(null);
                            setDocumentationImageName(null);
                            setCompletionError(null);
                          }}
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-[10.5px] font-bold cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveCompletion(sched)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10.5px] font-bold cursor-pointer flex-1 text-center"
                        >
                          Kirim & Selesaikan
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer RSVP interactives */}
                {schedStatus !== "Selesai" && (
                  <div className="bg-slate-50/70 border-t border-slate-100 px-5 py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-sans font-medium text-[11px]">
                      <Users className="w-4 h-4 text-slate-400 shrink-0" />
                      <span><b>{sched.registeredAwardeesCount}</b> Mahasiswa terjadwal</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Decorative summary footer of schedules */}
      <div className="bg-blue-50/30 rounded-xl border border-blue-100 p-4 text-[11.5px] text-blue-950 flex items-start gap-2.5 leading-normal text-left font-sans shadow-2xs">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
        <div>
          <span className="font-extrabold">Informasi Pembinaan Nasional:</span> Kegiatan di atas berkontribusi langsung pada pencapaian kelayakan beasiswa semesteran. Kehadiran akan terintegrasi secara otomatis dengan database asrama. Untuk kendala kehadiran tak terduga, silakan kirim permohonan dispensasi resmi ke email administrator.
        </div>
      </div>

    </div>
  );
}
