import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Users, 
  Calendar, 
  Database, 
  ShieldCheck, 
  Info, 
  Plus, 
  UserPlus, 
  ChevronRight,
  Sparkles,
  RefreshCw,
  LogOut,
  Sliders,
  AlertTriangle,
  CalendarDays,
  Menu,
  X,
  Key,
  User as UserIcon,
  LayoutDashboard
} from "lucide-react";

import { 
  initialUsers, 
  initialAwardeeProfiles, 
  initialActivities, 
  initialImpactStat,
  initialUpcomingSchedules
} from "./data/mockBrightData";

import { User, AwardeeProfile, Activity, ImpactStat, UserRole, UpcomingSchedule, EmailNotification, AwardeeAchievement } from "./types";

import BrightDashboard from "./components/BrightDashboard";
import AwardeeDirectory from "./components/AwardeeDirectory";
import ActivityRegistry from "./components/ActivityRegistry";
import NoSqlExplorer from "./components/NoSqlExplorer";
import UpcomingSchedules from "./components/UpcomingSchedules";
import AccountPortal from "./components/AccountPortal";
import MyProfile from "./components/MyProfile";
import AdminPanel from "./components/AdminPanel";
import AiCompiler from "./components/AiCompiler";
import AwardeeAchievements from "./components/AwardeeAchievements";

export default function App() {
  // 1. Core State Engine (Reactive state that immediately reflects any changes across tabs!)
  const [batches, setBatches] = useState<string[]>(() => {
    const saved = localStorage.getItem("bright_batches");
    if (saved) return JSON.parse(saved);
    return ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  });

  useEffect(() => {
    localStorage.setItem("bright_batches", JSON.stringify(batches));
  }, [batches]);

  const handleAddBatch = (newBatch: string) => {
    const trimmed = newBatch.trim();
    if (!trimmed) return;
    if (batches.includes(trimmed)) return;
    setBatches(prev => [...prev, trimmed].sort((a, b) => parseInt(a) - parseInt(b)));
  };

  const handleDeleteBatch = (batchToDelete: string) => {
    setBatches(prev => prev.filter(b => b !== batchToDelete));
  };

  const [awardees, setAwardees] = useState<AwardeeProfile[]>(() => {
    let rawProfiles = initialAwardeeProfiles;
    const saved = localStorage.getItem("bright_awardees");
    if (saved) {
      try {
        rawProfiles = JSON.parse(saved);
      } catch (e) {
        rawProfiles = initialAwardeeProfiles;
      }
    }
    // Deep sanitize batch names to be purely numerical string matching batches (e.g. "7", "8")
    return rawProfiles.map(p => {
      let b = p.batch || "9";
      b = b.replace("Angkatan ", "").replace(/\(.*\)/g, "").trim();
      return { ...p, batch: b };
    });
  });

  useEffect(() => {
    localStorage.setItem("bright_awardees", JSON.stringify(awardees));
  }, [awardees]);

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem("bright_activities");
    if (saved) return JSON.parse(saved);
    return []; // Empty initially as requested
  });
  const [impactStats, setImpactStats] = useState<ImpactStat>({
    ...initialImpactStat,
    totalActivitiesCount: localStorage.getItem("bright_activities") ? JSON.parse(localStorage.getItem("bright_activities")!).length : 0,
    totalServiceHours: localStorage.getItem("bright_activities") ? JSON.parse(localStorage.getItem("bright_activities")!).reduce((acc: number, act: any) => acc + (act.hoursEarned * act.awardeesInvolved.length), 0) : 0
  });
  const [schedules, setSchedules] = useState<UpcomingSchedule[]>(() => {
    const saved = localStorage.getItem("bright_schedules");
    if (saved) return JSON.parse(saved);
    return initialUpcomingSchedules;
  });

  useEffect(() => {
    localStorage.setItem("bright_activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("bright_schedules", JSON.stringify(schedules));
  }, [schedules]);

  const [achievements, setAchievements] = useState<AwardeeAchievement[]>(() => {
    const saved = localStorage.getItem("bright_achievements");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Gagal load achievements:", e);
      }
    }
    return [
      {
        achievementId: "ach-1",
        awardeeId: "awardee-3",
        awardeeName: "Faris Al-Fatih",
        title: "Juara 1 Nasional Musabaqah Tilawatil Quran (MTQ) Belajar Mahasiswa 2026",
        category: "Non-Akademik",
        date: "2026-05-15",
        description: "Meraih gelar tertinggi dalam cabang Hifzhil Quran 10 Juz Putra tingkat nasional dengan nilai kumulatif 98.5, mengalahkan perwakilan puluhan perguruan tinggi terkemuka se-Indonesia.",
        batch: "Angkatan 8",
        university: "Institut Teknologi Bandung"
      },
      {
        achievementId: "ach-2",
        awardeeId: "awardee-1",
        awardeeName: "Aisyah Putri Rahayu",
        title: "Medali Emas Olimpiade Sains Nasional Bidang Informatika & Komputer 2026",
        category: "Akademik",
        date: "2026-04-20",
        description: "Menempati urutan ke-3 terbaik dari ratusan finalis se-Indonesia dalam kompetisi intensif pemecahan masalah (problem solving) algoritma dan pemrograman komputer tingkat universitas.",
        batch: "Angkatan 7",
        university: "Universitas Indonesia"
      },
      {
        achievementId: "ach-3",
        awardeeId: "awardee-2",
        awardeeName: "Bambang Pamungkas Utama",
        title: "Best Paper Award di IEEE International Conference on Applied AI & Robotic Systems",
        category: "Inovasi & Riset",
        date: "2026-06-02",
        description: "Menyusun karya tulis ilmiah bertema 'Deep Learning for Quranic Pronunciation Verification in Asrama Environment'. Dinilai juri memberikan solusi otomatis makhraj Al-Quran yang mutakhir berbasis digital signal processing.",
        batch: "Angkatan 7",
        university: "Universitas Gadjah Mada"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("bright_achievements", JSON.stringify(achievements));
  }, [achievements]);

  const handleAddAchievement = (newAch: AwardeeAchievement) => {
    setAchievements(prev => [newAch, ...prev]);
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(ach => ach.achievementId !== id));
  };

  const handleUpdateAchievement = (updatedAch: AwardeeAchievement) => {
    setAchievements(prev => prev.map(ach => ach.achievementId === updatedAch.achievementId ? updatedAch : ach));
  };

  // 1.1 Authentication & Registration Database State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("bright_users");
    let loadedUsers: User[] = saved ? JSON.parse(saved) : [...initialUsers];
    const abhyyEmail = "abhyy333@gmail.com";
    const hasAbhyy = loadedUsers.some(u => u.email.toLowerCase() === abhyyEmail);
    if (!hasAbhyy) {
      loadedUsers.push({
        uid: "admin-user-abhyy",
        name: "Abhyy (Pengurus Pusat)",
        email: abhyyEmail,
        role: "admin",
        createdAt: "2026-06-10T14:12:00Z"
      });
    } else {
      loadedUsers = loadedUsers.map(u => 
        u.email.toLowerCase() === abhyyEmail ? { ...u, role: "admin" as UserRole, name: u.name || "Abhyy (Pengurus Pusat)" } : u
      );
    }
    return loadedUsers;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<AwardeeProfile | null>(null);
  const [userPasswords, setUserPasswords] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("bright_user_passwords");
    const creds: Record<string, string> = saved ? JSON.parse(saved) : {};
    initialUsers.forEach(u => {
      const emailLower = u.email.toLowerCase();
      if (!creds[emailLower]) {
        creds[emailLower] = "password123";
      }
    });
    if (!creds["abhyy333@gmail.com"]) {
      creds["abhyy333@gmail.com"] = "password123";
    }
    return creds;
  });

  useEffect(() => {
    localStorage.setItem("bright_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("bright_user_passwords", JSON.stringify(userPasswords));
  }, [userPasswords]);

  // 1.2 Simulated Email Dispatcher Engine State (Direct response to user requirement)
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [activePreviewEmail, setActivePreviewEmail] = useState<EmailNotification | null>(null);
  const [emailToast, setEmailToast] = useState<{ visible: boolean; email: EmailNotification | null }>({
    visible: false,
    email: null
  });

  const [googleAuthFeedback, setGoogleAuthFeedback] = useState<{ type: "login" | "register"; message: string } | null>(null);
  const [googleRegInfo, setGoogleRegInfo] = useState<{ email: string; name: string; token: string } | null>(null);

  const hasAttemptedRestore = useRef(false);

  // 2. Active Tab / Navigation Route
  const [currentTab, setCurrentTab] = useState<"dashboard" | "directory" | "activities" | "schedule" | "nosql" | "portal" | "myProfile" | "adminPanel" | "aiCompiler" | "achievements">(() => {
    const saved = localStorage.getItem("bright_scholarship_last_tab");
    const allowed = ["dashboard", "directory", "activities", "schedule", "nosql", "portal", "myProfile", "adminPanel", "aiCompiler", "achievements"];
    if (saved && allowed.includes(saved)) {
      return saved as any;
    }
    return "dashboard";
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Synchronize active tab to localStorage on change
  useEffect(() => {
    localStorage.setItem("bright_scholarship_last_tab", currentTab);
  }, [currentTab]);

  // 3. Simulated Sandbox Identity State
  const [simulatedRole, setSimulatedRole] = useState<UserRole>("public");
  const [simulatedUserId, setSimulatedUserId] = useState<string>("user-public-1"); // Matches 'admin-1' or 'awardee-1'

  // 4. Role Switch Handler (Automatically adjusts active UID for high-precision simulation)
  const handleRoleChange = (role: UserRole) => {
    setSimulatedRole(role);
    const isStaff = role === "admin" || role === "fasilitator" || role === "kepala_asrama";
    if (!isStaff && (currentTab === "nosql" || currentTab === "adminPanel")) {
      setCurrentTab("dashboard");
    } else if ((role === "fasilitator" || role === "kepala_asrama") && currentTab === "nosql") {
      setCurrentTab("dashboard");
    }
    if (role !== "admin" && currentTab === "aiCompiler") {
      setCurrentTab("dashboard");
    }

    if (role === "admin") {
      setSimulatedUserId("admin-1");
      const found = users.find(u => u.uid === "admin-1");
      if (found) {
        setCurrentUser(found);
        setCurrentUserProfile(null);
      }
    } else if (role === "fasilitator" || role === "kepala_asrama") {
      const found = users.find(u => u.role === role);
      if (found) {
        setSimulatedUserId(found.uid);
        setCurrentUser(found);
        setCurrentUserProfile(null);
      } else {
        const fallbackUid = `simulated-${role}`;
        setSimulatedUserId(fallbackUid);
        const placeholderUser: User = {
          uid: fallbackUid,
          name: role === "fasilitator" ? "Fasilitator Akademik" : "Kepala Asrama",
          email: `${role}@brightscholarship.org`,
          role: role,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(placeholderUser);
        setCurrentUserProfile(null);
      }
    } else if (role === "awardee") {
      setSimulatedUserId("awardee-1"); // Default to Aisyah Putri
      const found = users.find(u => u.uid === "awardee-1");
      if (found) {
        setCurrentUser(found);
        const profile = awardees.find(a => a.awardeeId === "awardee-1") || null;
        setCurrentUserProfile(profile);
      }
    } else {
      setSimulatedUserId("user-public-1");
      setCurrentUser(null);
      setCurrentUserProfile(null);
    }
  };

  // 4.0 Forgot Password / Password Recovery Handler with SMTP dispatching
  const handleForgotPassword = (email: string) => {
    const emailLower = email.toLowerCase();
    const foundUser = users.find(u => u.email.toLowerCase() === emailLower);
    if (!foundUser) {
      return { success: false, message: "Email tersebut tidak terdaftar di asrama digital." };
    }

    const password = userPasswords[emailLower] || "password123";

    // Build formal stylized forgot password recovery email
    const customEmail: EmailNotification = {
      id: `email-forgot-${Date.now()}`,
      toEmail: foundUser.email,
      toName: foundUser.name,
      subject: `🔒 Pemulihan Kata Sandi Akun Bright Scholarship Anda`,
      sentAt: new Date().toISOString(),
      bodyHtml: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #1e3a8a, #059669); padding: 32px 24px; text-align: center; color: #ffffff;">
            <div style="display: inline-block; width: 48px; height: 48px; background-color: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 12px; font-weight: 900; font-size: 20px; line-height: 48px; text-align: center; margin-bottom: 12px;">BS</div>
            <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase;">Bright Scholarship</h1>
            <p style="margin: 4px 0 0 0; font-size: 11px; opacity: 0.85; font-weight: 600; letter-spacing: 0.1em;">PEMULIHAN KATA SANDI</p>
          </div>

          <!-- Body Section -->
          <div style="padding: 32px 24px; color: #334155;">
            <p style="font-size: 14px; font-weight: 500; margin-top: 0;">Yth. <strong>${foundUser.name}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Kami menerima permintaan untuk memulihkan kata sandi akun sistem <strong>Bright Scholarship Digital Hub</strong> Anda. Berikut adalah detail kredensial Anda yang saat ini tersimpan aman di asrama digital.
            </p>

            <!-- Password Box -->
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin: 24px 0; text-align: center;">
              <h3 style="color: #15803d; font-size: 13px; font-weight: 800; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.05em;">
                🛡 DETAIL KREDENSIAL PORTAL
              </h3>
              <p style="color: #64748b; font-size: 11px; margin-bottom: 8px;">Simpan info ini secara rahasia dan jangan dibagikan kepada siapa pun.</p>
              <div style="display: inline-block; background-color: #ffffff; border: 1.5px dashed #bbf7d0; border-radius: 8px; padding: 10px 20px; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; color: #0f766e; letter-spacing: 0.05em;">
                ${password}
              </div>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Jika Anda telah masuk ke portal, silakan memperbarui kata sandi Anda melalui koordinasi dengan Pengurus Asrama demi menjaga keamanan akun.
            </p>
          </div>

          <!-- Footer section -->
          <div style="background-color: #f8fafc; padding: 24px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.5;">
            <p style="margin: 0 0 6px 0; font-weight: 600; color: #64748b;">BRIGHT SCHOLARSHIP FOUNDATION SYSTEM</p>
            <p style="margin: 0;">Pesan ini dikirimkan secara otomatis oleh Sistem Pemulihan Bright Scholarship. Mohon jangan membalas email ini secara langsung.</p>
          </div>
        </div>
      `
    };

    setEmails(prev => [customEmail, ...prev]);
    setEmailToast({
      visible: true,
      email: customEmail
    });

    // Send via API
    fetch("/api/sendApprovedEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        toEmail: customEmail.toEmail,
        toName: customEmail.toName,
        subject: customEmail.subject,
        bodyHtml: customEmail.bodyHtml
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setEmails(prev => prev.map(m => m.id === customEmail.id ? { ...m, isRealSent: data.smtpConfigured, smtpMessage: data.message } : m));
        if (data.smtpConfigured) {
          setEmailToast(prev => prev.email?.id === customEmail.id ? { visible: true, email: { ...customEmail, isRealSent: true, smtpMessage: data.message } } : prev);
        }
      }
    })
    .catch(err => console.error("SMTP error forgot password:", err));

    return { 
      success: true, 
      message: `Kami telah sukses mengirimkan instruksi detail pemulihan/pengaturan kata sandi akun Anda ke email yang dituju. Silakan periksa secepatnya.` 
    };
  };

  // 4.1 Login Handler
  const handleLogin = (email: string, pass: string) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!foundUser) {
      return { success: false, message: "Alamat email tersebut tidak terdaftar dalam asrama." };
    }
    const correctPassword = userPasswords[foundUser.email.toLowerCase()] || "password123";
    if (pass !== correctPassword) {
      return { success: false, message: "Kata sandi salah. Harap periksa kembali." };
    }

    setCurrentUser(foundUser);
    setSimulatedRole(foundUser.role);
    setSimulatedUserId(foundUser.uid);

    const profile = awardees.find(a => a.awardeeId === foundUser.uid) || null;
    setCurrentUserProfile(profile);

    // Redirect to profile tab immediately upon successful login
    setCurrentTab("myProfile");

    return { success: true, message: "Berhasil masuk.", user: foundUser };
  };

  // 4.1.2 Google Authentic OAuth Unified Login/Register Handler (Senior Full-Stack Design)
  const handleGoogleAuthSuccess = (email: string, name: string, token: string, isRestore = false) => {
    const emailLower = email.toLowerCase();
    
    // Save JWT securely to localStorage for real session preservation
    localStorage.setItem("bright_jwt_token", token);
    
    // Check if user is the admin (Abdul Habir or Abhyy)
    if (emailLower === "abdulhabir66@gmail.com" || emailLower === "abhyy333@gmail.com") {
      const defaultAdminUid = emailLower === "abdulhabir66@gmail.com" ? "admin-1" : "admin-user-abhyy";
      const defaultAdminName = emailLower === "abdulhabir66@gmail.com" ? "Abdul Habir (Admin Utama)" : "Abhyy (Pengurus Pusat)";
      
      let existingAdmin = users.find(u => u.email.toLowerCase() === emailLower);
      if (!existingAdmin) {
        existingAdmin = {
          uid: defaultAdminUid,
          name: name || defaultAdminName,
          email: emailLower,
          role: "admin",
          createdAt: new Date().toISOString()
        };
        setUsers(prev => [...prev, existingAdmin!]);
      } else {
        existingAdmin.role = "admin";
        existingAdmin.name = name || existingAdmin.name || defaultAdminName;
      }
      
      setCurrentUser(existingAdmin);
      setSimulatedRole("admin");
      setSimulatedUserId(existingAdmin.uid);
      setCurrentUserProfile(null);
      
      if (!isRestore) {
        // Dispatch simulated secure notification
        const adminEmail: EmailNotification = {
          id: `google-auth-admin-${Date.now()}`,
          toEmail: email,
          toName: existingAdmin.name,
          subject: "🔒 Otentikasi Google Cloud Admin Aktif!",
          bodyHtml: `Sesi login Admin untuk ${email} ditandatangani secara aman dengan JWT Server-Side. Kunci integrasi mutakhir aktif.`,
          sentAt: new Date().toISOString(),
          read: false,
          isSimulated: true
        };
        
        setEmails(prev => [adminEmail, ...prev]);
        setEmailToast({ visible: true, email: adminEmail });
        setTimeout(() => setEmailToast(prev => ({ ...prev, visible: false })), 6000);
        
        // Provide positive alert feedback
        setGoogleAuthFeedback({
          type: "login",
          message: "Login berhasil"
        });
        
        setCurrentTab("myProfile");
      }
      return;
    }

    // Check if general user is already registered
    let existingUser = users.find(u => u.email.toLowerCase() === emailLower);
    
    if (existingUser) {
      setCurrentUser(existingUser);
      setSimulatedRole(existingUser.role);
      setSimulatedUserId(existingUser.uid);
      
      const profile = awardees.find(a => a.awardeeId === existingUser.uid) || null;
      setCurrentUserProfile(profile);
      
      if (!isRestore) {
        const loginEmailObj: EmailNotification = {
          id: `google-auth-login-${Date.now()}`,
          toEmail: email,
          toName: existingUser.name,
          subject: "🔑 Sesi Masuk Google Berhasil!",
          bodyHtml: `Halo ${existingUser.name}, sesi masuk Anda telah divalidasi. Token JWT Anda didekripsi dengan selamat di sisi server.`,
          sentAt: new Date().toISOString(),
          read: false,
          isSimulated: true
        };
        
        setEmails(prev => [loginEmailObj, ...prev]);
        setEmailToast({ visible: true, email: loginEmailObj });
        setTimeout(() => setEmailToast(prev => ({ ...prev, visible: false })), 6000);

        // Provide login feedback
        setGoogleAuthFeedback({
          type: "login",
          message: "Login berhasil"
        });
      }
    } else {
      if (!isRestore) {
        // Instead of automatically registering directly, we preserve OAuth data in state,
        // and redirect the user to complete the registration form manually first.
        setGoogleRegInfo({ email, name, token });
        
        setGoogleAuthFeedback({
          type: "register",
          message: "Otentikasi Google berhasil! Silakan isi formulir registrasi di bawah untuk menyelesaikan pendaftaran Anda."
        });
      }
    }
    
    if (!isRestore) {
      if (existingUser) {
        setCurrentTab("myProfile");
      } else {
        setCurrentTab("portal");
      }
    }
  };

  // Listen for POST MESSAGE authentication success triggers from popup/google-auth window
  useEffect(() => {
    const handleGoogleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Allow local development and container preview origins
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      
      if (event.data?.type === 'GOOGLE_OAUTH_SUCCESS') {
        const { email, name, token } = event.data;
        if (email && token) {
          handleGoogleAuthSuccess(email, name || "User Google", token);
        }
      }
    };
    
    window.addEventListener("message", handleGoogleMessage);
    return () => window.removeEventListener("message", handleGoogleMessage);
  }, [users, awardees]);

  // Hook to handle direct redirect token query params & LocalStorage checks upon bootup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const emailParam = params.get("email");
    const nameParam = params.get("name");
    
    if (tokenParam && emailParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
      handleGoogleAuthSuccess(emailParam, nameParam || "Google User", tokenParam);
      return;
    }

    // Try to verify and restore session using saved token from localStorage
    const savedToken = localStorage.getItem("bright_jwt_token");
    if (savedToken && !hasAttemptedRestore.current) {
      hasAttemptedRestore.current = true;
      fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: savedToken })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.email) {
          handleGoogleAuthSuccess(data.email, data.name || "Google User", savedToken, true);
        } else {
          // Token is invalid/expired, clear it
          localStorage.removeItem("bright_jwt_token");
        }
      })
      .catch(err => {
        console.warn("Restore JWT session failed:", err);
      });
    }
  }, [users, awardees]);

  // 4.2 Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("bright_jwt_token"); // Clears custom JWT
    setCurrentUser(null);
    setCurrentUserProfile(null);
    setSimulatedRole("public");
    setSimulatedUserId("user-public-1");
  };

  // 4.3 Registrasi Handler (Status akun baru: 'menunggu')
  const handleRegister = (regData: {
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
  }) => {
    const emailLower = regData.email.toLowerCase();
    if (users.some(u => u.email.toLowerCase() === emailLower)) {
      return { success: false, message: "Alamat email tersebut sudah terdaftar di sistem kami." };
    }

    const newUid = `awardee-${Date.now()}`;

    if (regData.password) {
      setUserPasswords(prev => ({
        ...prev,
        [emailLower]: regData.password || "password123"
      }));
    }

    const newUser: User = {
      uid: newUid,
      name: regData.name,
      email: regData.email,
      role: "awardee",
      createdAt: new Date().toISOString()
    };

    const newProfile: AwardeeProfile = {
      awardeeId: newUid,
      name: regData.name,
      university: regData.university,
      major: regData.major,
      batch: regData.batch,
      gpa: regData.gpa,
      bio: regData.bio,
      linkedinUrl: regData.linkedinUrl,
      skills: regData.skills,
      totalServiceHours: 0,
      status: "menunggu",
      updatedAt: new Date().toISOString(),
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&w=300&q=80`
    };

    setUsers(prev => [...prev, newUser]);
    setAwardees(prev => [...prev, newProfile]);
    setGoogleRegInfo(null);

    return { 
      success: true, 
      message: `Registrasi berhasil! Profil '${regData.name}' telah tersimpan dalam status 'menunggu' persetujuan Admin.` 
    };
  };

  // 4.4 Admin Approve Handler with Instant Auto-generated Welcome Email Notification
  const handleApprove = (awardeeId: string) => {
    let targetProfile = awardees.find(a => a.awardeeId === awardeeId);
    let targetUser = users.find(u => u.uid === awardeeId);

    setAwardees(prev => 
      prev.map(a => {
        if (a.awardeeId === awardeeId) {
          const updatedProfile = { ...a, status: "active" as const, updatedAt: new Date().toISOString() };
          targetProfile = updatedProfile;
          return updatedProfile;
        }
        return a;
      })
    );

    // Sync current logged in profile status if they are the one being approved
    if (currentUser && currentUser.uid === awardeeId) {
      setCurrentUserProfile(prev => prev ? { ...prev, status: "active" } : null);
    }

    // Build formal stylized welcome verification email
    const toName = targetProfile ? targetProfile.name : (targetUser ? targetUser.name : "Awardee Bright Scholarship");
    const toEmail = targetUser ? targetUser.email : (targetProfile ? `${toName.toLowerCase().replace(/\s+/g, "")}@student.ac.id` : "awardee@brightscholarship.org");
    const university = targetProfile ? targetProfile.university : "Universitas Mitra";
    const batchName = targetProfile ? targetProfile.batch : "Angkatan 9";

    const customEmail: EmailNotification = {
      id: `email-${Date.now()}`,
      toEmail,
      toName,
      subject: `Selamat! Akun Bright Scholarship Anda Telah Aktif & Disetujui 🎉`,
      sentAt: new Date().toISOString(),
      bodyHtml: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #1e3a8a, #059669); padding: 32px 24px; text-align: center; color: #ffffff;">
            <div style="display: inline-block; width: 48px; height: 48px; background-color: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 12px; font-weight: 900; font-size: 20px; line-height: 48px; text-align: center; margin-bottom: 12px;">BS</div>
            <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase;">Bright Scholarship</h1>
            <p style="margin: 4px 0 0 0; font-size: 11px; opacity: 0.85; font-weight: 600; letter-spacing: 0.1em;">YAYASAN BEASISWA DIGITAL HUB</p>
          </div>

          <!-- Body Section -->
          <div style="padding: 32px 24px; color: #334155;">
            <p style="font-size: 14px; font-weight: 500; margin-top: 0;">Yth. <strong>${toName}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Kami dengan bangga menyampaikan kabar gembira bahwa registrasi akun portal akademik Anda selaku <strong>Awardee Bright Scholarship</strong> di sistem <strong>Bright Scholarship Digital Hub</strong> telah secara resmi <strong>DISYAHKAN & DISETUJUI (APPROVED)</strong> oleh pengurus asrama yayasan beasiswa.
            </p>

            <!-- Status Box -->
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin: 24px 0; text-align: left;">
              <h3 style="color: #15803d; font-size: 13px; font-weight: 800; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.05em; display: flex; items-center gap: 5px;">
                ✔ STATUS AKUN: AKTIF PENUH
              </h3>
              <p style="color: #1e293b; font-size: 12px; line-height: 1.6; margin: 0;">
                Profil asrama Anda sekarang berada dalam status <strong>Aktif</strong>. Akun akademik Anda telah disinkronkan secara real-time ke dalam Direktori Publik, dan kontribusi jam sosial yang Anda kumpulkan akan langsung dihitung dalam visualisasi akumulasi dampak yayasan.
              </p>
            </div>

            <!-- Credentials table -->
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 24px 0; border-radius: 8px; overflow: hidden; border: 1px solid #f1f5f9;">
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px 14px; font-weight: 600; color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Email Akun</td>
                <td style="padding: 10px 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${toEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9;">Universitas</td>
                <td style="padding: 10px 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${university}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px 14px; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9;">Sinergi Angkatan</td>
                <td style="padding: 10px 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${batchName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: 600; color: #64748b;">Tanggal Verifikasi</td>
                <td style="padding: 10px 14px; font-weight: 700; color: #0f172a;">${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
            </table>

            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Anda dapat segera menggunakan email ini untuk masuk ke portal, meregistrasikan keikusertaan pada program peningkatan karakter mingguan (Tahfidz, Soft skill), aserta mengunggah foto laporan aksi sosial di lapangan.
            </p>

            <div style="text-align: center; margin: 32px 0 12px 0;">
              <a href="#" style="background-color: #059669; color: #ffffff; font-weight: 700; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-size: 13px; display: inline-block; box-shadow: 0 4px 10px rgba(5, 150, 105, 0.25);">Masuk ke Dashboard Asrama</a>
            </div>
          </div>

          <!-- Footer section -->
          <div style="background-color: #f8fafc; padding: 24px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.5;">
            <p style="margin: 0 0 6px 0; font-weight: 600; color: #64748b;">BRIGHT SCHOLARSHIP FOUNDATION SYSTEM</p>
            <p style="margin: 0;">Pesan ini dikirimkan secara otomatis oleh Sistem Autentikasi Bright Scholarship untuk keperluan verifikasi registrasi. Mohon jangan membalas email ini secara langsung.</p>
          </div>
        </div>
      `
    };

    setEmails(prev => [customEmail, ...prev]);
    setEmailToast({
      visible: true,
      email: customEmail
    });

    // Real SMTP integration: Dispatch via full-stack background API server
    fetch("/api/sendApprovedEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        toEmail: customEmail.toEmail,
        toName: customEmail.toName,
        subject: customEmail.subject,
        bodyHtml: customEmail.bodyHtml
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Update local email notification log to reflect true real delivery
          setEmails(prev => prev.map(m => {
            if (m.id === customEmail.id) {
              return { 
                ...m, 
                isRealSent: data.smtpConfigured,
                smtpMessage: data.message 
              };
            }
            return m;
          }));
          
          if (data.smtpConfigured) {
            // Update toast dynamically to announce actual transmission success
            setEmailToast(prev => prev.email?.id === customEmail.id ? {
              visible: true,
              email: { 
                ...customEmail, 
                isRealSent: true, 
                smtpMessage: data.message 
              }
            } : prev);
          }
        } else {
          console.error("[SMTP Outbox Error]:", data.error);
          setEmails(prev => prev.map(m => {
            if (m.id === customEmail.id) {
              return { 
                ...m, 
                isRealSent: false,
                smtpMessage: `Penyebab Gagal: ${data.error}` 
              };
            }
            return m;
          }));
        }
      })
      .catch(err => {
        console.error("[SMTP Server Network Error]:", err);
      });
  };

  // 4.5 Admin Reject Handler
  const handleReject = (awardeeId: string) => {
    setAwardees(prev => prev.filter(a => a.awardeeId !== awardeeId));
    setUsers(prev => prev.filter(u => u.uid !== awardeeId));
    if (currentUser && currentUser.uid === awardeeId) {
      handleLogout();
    }
  };

  // 4.6 Admin Add Staff Handler (Fasilitator, Kepala Asrama, & Admin)
  const handleAddStaff = (name: string, email: string, role: "fasilitator" | "kepala_asrama" | "admin") => {
    const emailLower = email.toLowerCase();
    
    // Check if user already exists
    const existingUserIndex = users.findIndex(u => u.email.toLowerCase() === emailLower);
    
    let roleLabel = "";
    if (role === "admin") roleLabel = "Admin / Pengurus Pusat";
    else if (role === "fasilitator") roleLabel = "Fasilitator Akademik";
    else roleLabel = "Kepala Asrama";

    if (existingUserIndex > -1) {
      // User already exists, we will update their role (promoting them!)
      const updatedUsers = [...users];
      updatedUsers[existingUserIndex].role = role;
      setUsers(updatedUsers);
      
      // Update simulatedRole if currently simulating this user
      if (simulatedUserId === users[existingUserIndex].uid) {
        setSimulatedRole(role);
      }
      
      return {
        success: true,
        message: `Akun '${name}' berhasil dipromosikan menjadi '${roleLabel}'!`
      };
    }
    
    const newUid = `staff-${Date.now()}`;
    const newUser: User = {
      uid: newUid,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    // Also store password if not already present
    setUserPasswords(prev => {
      if (prev[emailLower]) return prev;
      return {
        ...prev,
        [emailLower]: "password123" // Default password
      };
    });

    return { 
      success: true, 
      message: `Akun baru dengan peran '${roleLabel}' berhasil didaftarkan dengan kata sandi default 'password123'.` 
    };
  };

  // 4.7 Admin Delete Staff Handler
  const handleDeleteStaff = (uid: string) => {
    const staffUser = users.find(u => u.uid === uid);
    if (!staffUser) return;
    
    // Remove from users list
    setUsers(prev => prev.filter(u => u.uid !== uid));
    
    // Log out if they are the currently simulated user
    if (simulatedUserId === uid) {
      handleLogout();
    }
  };

  // 4.8 User Change Password Handler
  const handleChangePassword = (email: string, newPass: string): boolean => {
    const emailLower = email.toLowerCase();
    setUserPasswords(prev => ({
      ...prev,
      [emailLower]: newPass
    }));
    return true;
  };

  // 5. Callback: Update Awardee Profiling (Simulating Firestore doc update)
  const handleUpdateAwardee = (updated: AwardeeProfile) => {
    setAwardees((prev) => prev.map((a) => (a.awardeeId === updated.awardeeId ? updated : a)));
    if (currentUserProfile && currentUserProfile.awardeeId === updated.awardeeId) {
      setCurrentUserProfile(updated);
    }
  };

  // 5.1 Callback: Update Staff/User Profiling (e.g., graduationYear and batchYear)
  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.uid === updatedUser.uid ? updatedUser : u));
  };

  // 6. Callback: Atomic Addition of a New Program/Activity
  // Instantly increments involved awardees' service hours and re-aggregates impact_stats (Denormalization)
  const handleAddActivity = (newAct: Activity, involvedIds: string[], hoursGranted: number) => {
    // 1. Append the activity
    setActivities((prev) => [newAct, ...prev]);

    // 2. Update individual service hours of participating awardees
    setAwardees((prevAwardees) => 
      prevAwardees.map((aw) => {
        if (involvedIds.includes(aw.awardeeId)) {
          return {
            ...aw,
            totalServiceHours: aw.totalServiceHours + hoursGranted,
            updatedAt: new Date().toISOString()
          };
        }
        return aw;
      })
    );

    // 3. Update the global cached analytics denormalized variables
    setImpactStats((prevStats) => {
      let extraPembinaan = 0;
      let extraPengabdian = 0;

      if (newAct.category === "Pembinaan") {
        extraPembinaan = newAct.hoursEarned * involvedIds.length;
      } else {
        extraPengabdian = newAct.hoursEarned * involvedIds.length;
      }

      return {
        ...prevStats,
        totalActivitiesCount: prevStats.totalActivitiesCount + 1,
        totalServiceHours: prevStats.totalServiceHours + (newAct.hoursEarned * involvedIds.length),
        pembinaanHours: (prevStats.pembinaanHours || 0) + extraPembinaan,
        pengabdianHours: (prevStats.pengabdianHours || 0) + extraPengabdian,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const handleDeleteActivity = (activityId: string) => {
    const activityToDelete = activities.find(a => a.activityId === activityId);
    if (!activityToDelete) return;

    setActivities((prev) => prev.filter(a => a.activityId !== activityId));

    const involvedIds = activityToDelete.awardeesInvolved;
    const hoursGranted = activityToDelete.hoursEarned;

    setAwardees((prevAwardees) => 
      prevAwardees.map((aw) => {
        if (involvedIds.includes(aw.awardeeId)) {
          return {
            ...aw,
            totalServiceHours: Math.max(0, aw.totalServiceHours - hoursGranted),
            updatedAt: new Date().toISOString()
          };
        }
        return aw;
      })
    );

    setImpactStats((prevStats) => {
      let extraPembinaan = 0;
      let extraPengabdian = 0;

      if (activityToDelete.category === "Pembinaan") {
        extraPembinaan = hoursGranted * involvedIds.length;
      } else {
        extraPengabdian = hoursGranted * involvedIds.length;
      }

      return {
        ...prevStats,
        totalActivitiesCount: Math.max(0, prevStats.totalActivitiesCount - 1),
        totalServiceHours: Math.max(0, prevStats.totalServiceHours - (hoursGranted * involvedIds.length)),
        pembinaanHours: Math.max(0, (prevStats.pembinaanHours || 0) - extraPembinaan),
        pengabdianHours: Math.max(0, (prevStats.pengabdianHours || 0) - extraPengabdian),
        updatedAt: new Date().toISOString()
      };
    });
  };

  // 7. Callbacks: Upcoming Schedules State Management
  const handleAddSchedule = (newSched: UpcomingSchedule) => {
    setSchedules((prev) => [newSched, ...prev]);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.scheduleId !== id));
  };

  const handleUpdateRSVP = (id: string, enrolled: boolean) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.scheduleId === id) {
          return {
            ...s,
            registeredAwardeesCount: Math.max(0, s.registeredAwardeesCount + (enrolled ? 1 : -1))
          };
        }
        return s;
      })
    );
  };

  const handleUpdateSchedule = (updatedSched: UpcomingSchedule) => {
    setSchedules((prev) =>
      prev.map((s) => (s.scheduleId === updatedSched.scheduleId ? updatedSched : s))
    );
  };

  const renderSidebarContent = (isMobile: boolean = false) => {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Sidebar Brand Identity */}
        <div className="p-6 border-b border-slate-100 text-left flex items-center justify-between shrink-0">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2">
              <img 
                src="https://biologi.fkip.uns.ac.id/wp-content/uploads/2023/03/Logo-Bright-Scholarship.png" 
                alt="Bright Scholarship Logo" 
                referrerPolicy="no-referrer"
                className="h-9 w-auto object-contain max-w-[155px]"
              />
            </div>
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 md:hidden flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sidebar Nav links */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => {
              setCurrentTab("dashboard");
              if (isMobile) setIsMobileSidebarOpen(false);
            }}
            className={`w-full text-left rounded-lg px-3.5 py-3 text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer select-none ${
              currentTab === "dashboard"
                ? "bg-blue-50/80 text-blue-700 font-bold border border-blue-105/40"
                : "text-slate-600 hover:bg-slate-105/50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Beranda & Dampak</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab("directory");
              if (isMobile) setIsMobileSidebarOpen(false);
            }}
            className={`w-full text-left rounded-lg px-3.5 py-3 text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer select-none ${
              currentTab === "directory"
                ? "bg-blue-50/80 text-blue-700 font-bold border border-blue-105/40"
                : "text-slate-600 hover:bg-slate-105/50 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Awardee</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab("achievements");
              if (isMobile) setIsMobileSidebarOpen(false);
            }}
            className={`w-full text-left rounded-lg px-3.5 py-3 text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer select-none ${
              currentTab === "achievements"
                ? "bg-blue-50/80 text-blue-700 font-bold border border-blue-105/40"
                : "text-slate-600 hover:bg-slate-105/50 hover:text-slate-900"
            }`}
          >
            <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Awardee Berprestasi</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab("activities");
              if (isMobile) setIsMobileSidebarOpen(false);
            }}
            className={`w-full text-left rounded-lg px-3.5 py-3 text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer select-none ${
              currentTab === "activities"
                ? "bg-blue-50/80 text-blue-700 font-bold border border-blue-105/40"
                : "text-slate-600 hover:bg-slate-105/50 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Timeline & Kegiatan</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab("schedule");
              if (isMobile) setIsMobileSidebarOpen(false);
            }}
            className={`w-full text-left rounded-lg px-3.5 py-3 text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer select-none ${
              currentTab === "schedule"
                ? "bg-blue-50/80 text-blue-700 font-bold border border-blue-105/40"
                : "text-slate-600 hover:bg-slate-105/50 hover:text-slate-900"
            }`}
          >
            <CalendarDays className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Jadwal Pembinaan</span>
          </button>

          {currentUser === null && (
            <button
              onClick={() => {
                setCurrentTab("portal");
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full text-left rounded-lg px-3.5 py-3 text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer select-none ${
                currentTab === "portal"
                  ? "bg-blue-50/80 text-blue-700 font-bold border border-blue-105/40"
                  : "text-slate-600 hover:bg-slate-105/50 hover:text-slate-900"
              }`}
            >
              <Key className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Portal Akun & Registrasi</span>
            </button>
          )}

          {currentUser !== null && (
            <button
              onClick={() => {
                setCurrentTab("myProfile");
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full text-left rounded-lg px-3.5 py-3 text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer select-none ${
                currentTab === "myProfile"
                  ? "bg-blue-50/80 text-blue-700 font-bold border border-blue-105/40"
                  : "text-slate-600 hover:bg-slate-105/50 hover:text-slate-900"
              }`}
            >
              <UserIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profil Saya {simulatedRole === "admin" || simulatedRole === "fasilitator" || simulatedRole === "kepala_asrama" ? "(Staf/Pengurus)" : "(Info & Foto)"}</span>
            </button>
          )}

          {(simulatedRole === "admin" || simulatedRole === "fasilitator" || simulatedRole === "kepala_asrama") && (
            <button
              onClick={() => {
                setCurrentTab("adminPanel");
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full text-left rounded-lg px-3.5 py-3 text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer select-none ${
                currentTab === "adminPanel"
                  ? "bg-blue-50/80 text-blue-700 font-bold border border-blue-105/40"
                  : "text-slate-600 hover:bg-slate-105/50 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Panel Admin</span>
            </button>
          )}

          {simulatedRole === "admin" && (
            <button
              onClick={() => {
                setCurrentTab("nosql");
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full text-left rounded-lg px-3.5 py-3 text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer select-none ${
                currentTab === "nosql"
                  ? "bg-blue-50/80 text-blue-700 font-bold border border-blue-105/40"
                  : "text-slate-600 hover:bg-slate-105/50 hover:text-slate-900"
              }`}
            >
              <Database className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Arsitektur & NoSQL</span>
            </button>
          )}

          {simulatedRole === "admin" && (
            <button
              onClick={() => {
                setCurrentTab("aiCompiler");
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full text-left rounded-lg px-3.5 py-3 text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer select-none ${
                currentTab === "aiCompiler"
                  ? "bg-blue-50/80 text-blue-700 font-bold border border-blue-105/40"
                  : "text-slate-600 hover:bg-slate-105/50 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
              <span>Kompilator AI Laporan</span>
            </button>
          )}

        </nav>

        {/* User Session Footer Card */}
        {currentUser ? (
          <div className="p-4 border-t border-slate-105 bg-slate-50/50 text-left text-xs shrink-0 font-sans">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">Sesi Terautentikasi</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              <div className="min-w-0 flex-1">
                <span className="block font-bold text-slate-950 truncate text-[11px]">{currentUser.name}</span>
                <span className="block text-[9.5px] text-slate-500 font-mono truncate">{currentUser.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 hover:bg-slate-200 hover:text-slate-900 text-slate-500 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Keluar Sesi"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-105 bg-slate-50/50 text-left text-xs shrink-0 font-sans">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="block font-bold text-slate-800 text-[11px]">Sesi Pengunjung</span>
                <span className="block text-[10px] text-slate-400 leading-tight">Masuk untuk akses penuh</span>
              </div>
              <button
                onClick={() => setCurrentTab("portal")}
                className="px-2.5 py-1 text-[10px] bg-blue-600 hover:bg-blue-750 text-white font-bold rounded transition-all cursor-pointer"
              >
                Masuk
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* LEFT COLUMN: Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 hidden md:flex font-sans">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Overlay with AnimatePresence */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
            />
            {/* Slide-over Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 flex flex-col md:hidden border-r border-slate-200 font-sans"
            >
              {renderSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* RIGHT COLUMN: App Body */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 h-full relative font-sans">
        
        {/* Floating Toggle Button for Mobile Navigation Menu */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-30 w-12 h-12 bg-blue-950 text-white rounded-full shadow-xl md:hidden flex items-center justify-center cursor-pointer border border-emerald-500/10 active:scale-95 hover:bg-blue-900 transition-all"
          id="mobile-hamburger-trigger"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5 text-emerald-400" />
        </button>

        {/* MAIN BODY SCROLLABLE WINDOW */}
        <div className="flex-1 p-5 md:p-8 overflow-y-auto space-y-6">
          
          {/* Conditional View Router based on State tab indicators */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="space-y-6"
            >
              {currentTab === "dashboard" && (
                <BrightDashboard 
                  awardees={awardees.filter(a => a.status !== "menunggu")}
                  activities={activities}
                  impactStats={impactStats}
                  onNavigateToTab={(tab) => setCurrentTab(tab)}
                  currentUser={currentUser}
                  currentUserProfile={currentUserProfile}
                  simulatedRole={simulatedRole}
                  schedules={schedules}
                />
              )}

              {currentTab === "directory" && (
                <AwardeeDirectory 
                  awardees={awardees.filter(a => a.status === "active" || a.status === "alumni")}
                  onUpdateAwardee={handleUpdateAwardee}
                  currentRole={simulatedRole}
                  currentUserId={simulatedUserId}
                  onNavigateToTab={(tab) => setCurrentTab(tab)}
                  users={users}
                />
              )}

              {currentTab === "achievements" && (
                <AwardeeAchievements 
                  achievements={achievements}
                  onAddAchievement={handleAddAchievement}
                  onDeleteAchievement={handleDeleteAchievement}
                  onUpdateAchievement={handleUpdateAchievement}
                  currentRole={simulatedRole}
                  awardees={awardees}
                  currentUserProfile={currentUserProfile}
                />
              )}

              {currentTab === "activities" && (
                <ActivityRegistry 
                  activities={activities}
                  awardees={awardees.filter(a => a.status === "active" || a.status === "alumni")}
                  onAddActivity={handleAddActivity}
                  currentRole={simulatedRole}
                  onDeleteActivity={handleDeleteActivity}
                />
              )}

              {currentTab === "schedule" && (
                <UpcomingSchedules 
                  schedules={schedules}
                  onAddSchedule={handleAddSchedule}
                  onDeleteSchedule={handleDeleteSchedule}
                  onUpdateRSVP={handleUpdateRSVP}
                  currentRole={simulatedRole}
                  awardees={awardees.filter(a => a.status === "active" || a.status === "alumni")}
                  onUpdateSchedule={handleUpdateSchedule}
                  onAddActivity={handleAddActivity}
                  currentUserProfile={currentUserProfile}
                  batches={batches}
                />
              )}

              {currentTab === "portal" && (
                <AccountPortal 
                  currentUser={currentUser}
                  currentUserProfile={currentUserProfile}
                  awardees={awardees}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  onRegister={handleRegister}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  currentRole={simulatedRole}
                  emails={emails}
                  onViewEmail={(mail) => setActivePreviewEmail(mail)}
                  onUpdateAwardee={handleUpdateAwardee}
                  onDeleteAwardee={handleReject}
                  googleRegInfo={googleRegInfo}
                  onClearGoogleRegInfo={() => setGoogleRegInfo(null)}
                  batches={batches}
                  onForgotPassword={handleForgotPassword}
                />
              )}

              {currentTab === "myProfile" && (
                <MyProfile 
                  currentUserProfile={currentUserProfile}
                  onUpdateAwardee={handleUpdateAwardee}
                  currentRole={simulatedRole}
                  onNavigateToTab={(tab) => setCurrentTab(tab)}
                  batches={batches}
                  activities={activities}
                  currentUser={currentUser}
                  userPasswords={userPasswords}
                  onChangePassword={handleChangePassword}
                  onForgotPassword={handleForgotPassword}
                  onLogout={handleLogout}
                  onUpdateUser={handleUpdateUser}
                />
              )}

              {currentTab === "adminPanel" && (
                (simulatedRole === "admin" || simulatedRole === "fasilitator" || simulatedRole === "kepala_asrama") ? (
                  <AdminPanel 
                    currentUser={currentUser}
                    currentRole={simulatedRole}
                    awardees={awardees}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    emails={emails}
                    onViewEmail={(mail) => setActivePreviewEmail(mail)}
                    onUpdateAwardee={handleUpdateAwardee}
                    onDeleteAwardee={handleReject}
                    users={users}
                    onAddStaff={handleAddStaff}
                    onDeleteStaff={handleDeleteStaff}
                    batches={batches}
                    onAddBatch={handleAddBatch}
                    onDeleteBatch={handleDeleteBatch}
                  />
                ) : (
                  <div className="bg-white border border-slate-200 p-6 rounded-xl text-center space-y-3">
                    <p className="text-sm font-bold text-slate-700">Akses Ditolak: Halaman ini hanya untuk Pengurus Asrama.</p>
                    <button onClick={() => setCurrentTab("dashboard")} className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold">Kembali ke Beranda</button>
                  </div>
                )
              )}

              {currentTab === "nosql" && (
                simulatedRole === "admin" ? (
                  <NoSqlExplorer />
                ) : (
                  <div className="bg-white border border-slate-200 p-6 rounded-xl text-center space-y-3">
                    <p className="text-sm font-bold text-slate-700">Akses Ditolak: Halaman ini hanya untuk Administrator.</p>
                    <button onClick={() => setCurrentTab("dashboard")} className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold">Kembali ke Beranda</button>
                  </div>
                )
              )}

              {currentTab === "aiCompiler" && (
                simulatedRole === "admin" ? (
                  <AiCompiler 
                    awardees={awardees.filter(a => a.status !== "menunggu")}
                    activities={activities}
                  />
                ) : (
                  <div className="bg-white border border-slate-200 p-6 rounded-xl text-center space-y-3">
                    <p className="text-sm font-bold text-slate-700">Akses Ditolak: Halaman ini khusus untuk Administrator saja.</p>
                    <button onClick={() => setCurrentTab("dashboard")} className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold">Kembali ke Beranda</button>
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>



        </div>
      </main>

      {/* Real-time Outbound Notification Hub (Premium Modern Platform Spec) */}
      <AnimatePresence>
        {emailToast.visible && emailToast.email && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-4 max-w-[380px] w-full font-sans text-left animate-fadeIn"
          >
            <div className="flex gap-4">
              {/* Icon Status Badge */}
              <div className="shrink-0">
                {emailToast.email.id.startsWith("google-auth-login") || emailToast.email.id.startsWith("google-auth-admin") ? (
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                ) : emailToast.email.id.startsWith("google-auth-reg") ? (
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                    <Sparkles className="w-5 h-5" />
                  </div>
                ) : emailToast.email.isRealSent ? (
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50">
                    <Sparkles className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/50">
                    <Info className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                    {emailToast.email.id.startsWith("google-auth-login") || emailToast.email.id.startsWith("google-auth-admin") ? "Login Berhasil" :
                     emailToast.email.id.startsWith("google-auth-reg") ? "Registrasi Berhasil" :
                     emailToast.email.isRealSent ? "Surel Terkirim" : "Notifikasi Surel Terbentuk"}
                  </h4>
                  <button
                    onClick={() => setEmailToast({ visible: false, email: null })}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs font-semibold leading-relaxed text-slate-600">
                  {emailToast.email.id.startsWith("google-auth-login") || emailToast.email.id.startsWith("google-auth-admin") ? (
                    <span>Login berhasil</span>
                  ) : emailToast.email.id.startsWith("google-auth-reg") ? (
                    <span>Berhasil registrasi, mohon tunggu proses persetujuan oleh admin dari email</span>
                  ) : emailToast.email.isRealSent ? (
                    <span>Telah sukses mendispatch beasiswa resmi secara aman ke <strong className="text-slate-800 font-bold">{emailToast.email.toEmail}</strong> lewat SMTP.</span>
                  ) : (
                    <span>Format terbuat untuk <strong className="text-slate-800 font-bold">{emailToast.email.toEmail}</strong>. Masukkan <code className="bg-slate-100 text-slate-705 px-1 py-0.5 rounded text-[10px] font-mono font-bold">SMTP_USER & SMTP_PASS</code> agar terkirim asli!</span>
                  )}
                </p>

                {/* Sub-action panel */}
                <div className="pt-2 flex items-center gap-2">
                  {!emailToast.email.id.startsWith("google-auth") && (
                    <button
                      onClick={() => {
                        setActivePreviewEmail(emailToast.email);
                        setEmailToast({ visible: false, email: null });
                      }}
                      className="text-[11px] font-extrabold text-slate-700 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Buka Pratinjau Surat ↗
                    </button>
                  )}
                  <button
                    onClick={() => setEmailToast({ visible: false, email: null })}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 px-2 py-1.5 transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL EMAIL DIALOG VIEWER SYSTEM (HIGH FIDELITY PREVIEW) */}
      <AnimatePresence>
        {activePreviewEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans text-left">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-100 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="py-1 px-2.5 bg-emerald-600 text-white rounded font-extrabold text-[10px] font-mono">
                    EMAIL OUTBOUND (SMTP)
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Transmisi Terkirim</span>
                </div>
                <button
                  onClick={() => setActivePreviewEmail(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Envelope details */}
              <div className="p-4 bg-white border-b border-slate-200 space-y-1.5 text-xs">
                <div>
                  <span className="font-bold text-slate-400 inline-block w-16">Dari:</span>
                  <span className="text-slate-800 font-extrabold">Bright Scholarship Foundation &lt;no-reply@brightscholarship.org&gt;</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 inline-block w-16">Kepada:</span>
                  <span className="text-slate-800 font-extrabold">{activePreviewEmail.toName} &lt;{activePreviewEmail.toEmail}&gt;</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 inline-block w-16">Subjek:</span>
                  <span className="text-slate-900 font-black">{activePreviewEmail.subject}</span>
                </div>
              </div>

              {/* Email Client Simulated Content Frame */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-205/40">
                <div 
                  className="bg-white rounded-xl shadow-xs p-1"
                  dangerouslySetInnerHTML={{ __html: activePreviewEmail.bodyHtml }} 
                />
              </div>

              {/* Footer */}
              <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500 font-medium">
                <span>Terkirim melalui Saluran Keamanan SMTP pada {new Date(activePreviewEmail.sentAt).toLocaleTimeString()}</span>
                <button
                  onClick={() => setActivePreviewEmail(null)}
                  className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
