import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createTransport } from "nodemailer";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const app = express();

// Middleware to parse incoming payloads
app.use(express.json());

  // LAZY INITIALIZATION HELPER FOR THE GEMINI CLIENT (Prevents crash if API key is not yet set)
  let aiClient: any = null;
  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("GEMINI_API_KEY is not configured in the Secrets Panel. Please provide your Google AI Studio secret key.");
      }
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  }

  // ==========================================
  // SERVER SIDE API ROUTINGS
  // ==========================================

  // ==========================================
  // GOOGLE OAUTH2 UNIFIED DIRECT SHIELD HANDLERS
  // ==========================================
  
  // Scope settings for profile retrieval
  const GOOGLE_AUTH_SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
  ];

  // Route 1: Initiates Google auth code flow
  app.get("/api/auth/google", (req, res) => {
    try {
      const client_id = process.env.GOOGLE_CLIENT_ID;
      const client_secret = process.env.GOOGLE_CLIENT_SECRET;
      
      if (!client_id || !client_secret || client_id === "" || client_secret === "") {
        console.info("[GOOGLE OAUTH] No credentials set. Routing to Simulated Accounts Chooser Page.");
        return res.redirect("/api/auth/google/simulated-login");
      }

      const host = req.headers.host || "localhost:3000";
      const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";
      const protocol = isHttps ? "https" : "http";
      const app_url = process.env.APP_URL || `${protocol}://${host}`;
      const base_url = app_url.replace(/\/$/, "");
      const redirect_uri = `${base_url}/api/auth/google/callback`;

      const client = new OAuth2Client(client_id, client_secret, redirect_uri);
      const authorizeUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: GOOGLE_AUTH_SCOPES,
        prompt: 'consent'
      });

      return res.redirect(authorizeUrl);
    } catch (err: any) {
      console.error("[GOOGLE OAUTH INIT ERROR]:", err.message);
      return res.status(500).send(`Terjadi kesalahan ketika memproses autentikasi Google: ${err.message}`);
    }
  });

  // Route 2: Simulated google accounts selection GUI when credentials are not configured
  app.get("/api/auth/google/simulated-login", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pilih Akun - Google Accounts (Simulasi)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #131314;
    }
  </style>
</head>
<body class="bg-[#131314] text-white flex flex-col justify-between min-h-screen select-none font-sans overflow-x-hidden">
  
  <div>
    <!-- Top Header Bar -->
    <div class="h-14 border-b border-[#2d2e30] flex items-center px-6 gap-3.5">
      <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
      </svg>
      <span class="text-[14px] font-medium tracking-wide text-[#e3e2e6]">Masuk dengan Google</span>
    </div>

    <!-- Main Content Container -->
    <div class="max-w-[440px] mx-auto px-6 pt-8 pb-6 w-full flex flex-col items-center">
      
      <!-- Warning Box informing about config -->
      <div class="w-full bg-[#2a1b1b] border border-[#f28b82]/30 rounded-xl p-4 mb-6 text-left">
        <p class="text-xs text-[#f28b82] font-semibold mb-1 flex items-center gap-1.5 uppercase tracking-wider">
          💡 Mode Pengembangan Aktif
        </p>
        <p class="text-[11px] text-[#f2c4c4] leading-relaxed">
          Sistem mendeteksi <code class="bg-[#412727] px-1 py-0.5 rounded text-white font-mono shrink-0">GOOGLE_CLIENT_ID</code> belum dipasang di Secrets Panel. Anda berada dalam Mode Simulasi Interaktif! Pilih akun di bawah ini atau buat profile baru untuk menguji integrasi beasiswa secara aman.
        </p>
      </div>

      <!-- Brand Logo Indicator -->
      <div class="w-14 h-14 bg-[#1f1f20] border border-[#2d2e30] rounded-full flex items-center justify-center mb-6">
        <svg class="w-7 h-7 text-[#8ab4f8]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      </div>

      <!-- Header Section -->
      <div class="text-left w-full pl-1">
        <h2 class="text-[26px] font-normal text-[#f2f2f2] tracking-tight leading-9 mb-1">Pilih akun</h2>
        <p class="text-[14px] font-normal text-[#c4c7c5] mb-6">
          Lanjutkan ke <span class="text-[#8ab4f8] font-medium">Bright Scholarship</span>
        </p>
      </div>

      <!-- Accounts Choices -->
      <div class="w-full text-left" id="account-chooser">
        
        <!-- Account Item 1: abhyy333 -->
        <button 
          type="button" 
          onclick="selectAccount('abhyy333@gmail.com', 'Abhyy (Pengurus Pusat)')"
          class="w-full py-3.5 px-2.5 hover:bg-[#202124] rounded-lg text-left transition-colors flex items-center gap-4 cursor-pointer focus:outline-none focus:bg-[#202124]"
        >
          <div class="w-8 h-8 rounded-full bg-[#0f9d58] text-white flex items-center justify-center font-bold text-[14px] shadow-sm uppercase shrink-0">
            A
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-[13.5px] font-medium text-[#e3e2e6] tracking-wide">Abhyy (Pengurus Pusat)</div>
            <div class="text-[11.5px] text-[#9aa0a6] truncate font-sans">abhyy333@gmail.com</div>
          </div>
        </button>

        <!-- Divider -->
        <div class="h-[1px] bg-[#303134] my-1"></div>

        <!-- Account Item 2: abdul habir -->
        <button 
          type="button" 
          onclick="selectAccount('abdulhabir66@gmail.com', 'Abdul Habir')"
          class="w-full py-3.5 px-2.5 hover:bg-[#202124] rounded-lg text-left transition-colors flex items-center gap-4 cursor-pointer focus:outline-none focus:bg-[#202124]"
        >
          <div class="w-8 h-8 rounded-full bg-[#673ab7] text-white flex items-center justify-center font-bold text-[14px] shadow-sm uppercase shrink-0">
            A
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-[13.5px] font-medium text-[#e3e2e6] tracking-wide">abdul habir</div>
            <div class="text-[11.5px] text-[#9aa0a6] truncate font-sans">abdulhabir66@gmail.com</div>
          </div>
        </button>

        <!-- Divider -->
        <div class="h-[1px] bg-[#303134] my-1"></div>

        <!-- Use another account -->
        <button 
          type="button" 
          onclick="toggleCustomForm(true)"
          class="w-full py-3.5 px-2.5 hover:bg-[#202124] rounded-lg text-left transition-colors flex items-center gap-4 cursor-pointer focus:outline-none focus:bg-[#202124]"
        >
          <div class="w-8 h-8 rounded-full bg-transparent border border-[#5f6368] text-white flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-[#e3e2e6]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2.5" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="text-[13.5px] font-medium text-[#e3e2e6] tracking-wide">Gunakan akun lain</div>
          </div>
        </button>

        <div class="h-[1px] bg-[#303134] my-1"></div>

      </div>

      <!-- Custom Form -->
      <div id="custom-account-form" class="w-full text-left hidden space-y-4">
        <div class="space-y-3">
          <div>
            <label class="text-[11px] font-bold text-[#8ab4f8] uppercase tracking-wider block mb-1">Email Google Baru</label>
            <input 
              type="email" 
              id="custom-email"
              placeholder="nama@gmail.com" 
              class="w-full px-4 py-3 bg-[#1e1f20] border border-[#525355] rounded-lg focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] outline-none text-white transition-all font-sans text-[13.5px]"
              required
            />
          </div>
          <div>
            <label class="text-[11px] font-bold text-[#8ab4f8] uppercase tracking-wider block mb-1">Nama Lengkap Anda</label>
            <input 
              type="text" 
              id="custom-name"
              placeholder="Ketik nama lengkap Anda" 
              class="w-full px-4 py-3 bg-[#1e1f20] border border-[#525355] rounded-lg focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] outline-none text-white transition-all font-sans text-[13.5px]"
              required
            />
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button 
            type="button"
            onclick="toggleCustomForm(false)"
            class="flex-1 py-2.5 hover:bg-[#2a2b2d] border border-[#5f6368] text-[#c4c7c5] font-medium text-xs rounded-lg transition-all cursor-pointer text-center"
          >
            Kembali
          </button>
          <button 
            type="button"
            onclick="submitCustomAccount()"
            class="flex-1 py-2.5 bg-[#8ab4f8] hover:bg-[#92baff] text-[#131314] font-bold text-xs rounded-lg shadow transition-all cursor-pointer text-center"
          >
            Lanjutkan
          </button>
        </div>
      </div>

    </div>
  </div>

  <div class="w-full max-w-[440px] mx-auto px-6 pb-8 text-left">
    <p class="text-[12px] leading-relaxed text-[#c4c7c5] font-normal">
      Sebelum menggunakan aplikasi ini, Anda dapat meninjau 
      <a href="#" class="text-[#8ab4f8] hover:underline font-medium">Kebijakan Privasi</a> 
      dan 
      <a href="#" class="text-[#8ab4f8] hover:underline font-medium">Persyaratan Layanan</a> 
      Bright Scholarship.
    </p>
  </div>

  <script>
    function selectAccount(email, name) {
      window.location.href = "/api/auth/google/callback?simulated=true&email=" + encodeURIComponent(email) + "&name=" + encodeURIComponent(name);
    }
    
    function toggleCustomForm(show) {
      if (show) {
        document.getElementById('account-chooser').classList.add('hidden');
        document.getElementById('custom-account-form').classList.remove('hidden');
      } else {
        document.getElementById('custom-account-form').classList.add('hidden');
        document.getElementById('account-chooser').classList.remove('hidden');
      }
    }

    function submitCustomAccount() {
      const email = document.getElementById('custom-email').value.trim();
      const name = document.getElementById('custom-name').value.trim();
      if (!email || !email.includes('@')) {
        alert("Masukkan alamat email yang valid!");
        return;
      }
      if (!name) {
        alert("Nama lengkap tidak boleh kosong!");
        return;
      }
      selectAccount(email, name);
    }
  </script>
</body>
</html>
    `);
  });

  // Route 3: Google redirect callback handler.
  // Exchanges authorization code for Google user details and signs custom server-side JWT session token.
  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      const code = req.query.code as string;
      const isSimulated = req.query.simulated === "true";
      
      let email = "";
      let name = "";

      const client_id = process.env.GOOGLE_CLIENT_ID;

      if (isSimulated || !client_id || client_id === "") {
        // Retrieve virtual simulation parameters
        email = (req.query.email as string) || "user@gmail.com";
        name = (req.query.name as string) || "Google User";
      } else {
        // Real production exchange using google-auth-library
        const client_secret = process.env.GOOGLE_CLIENT_SECRET;
        const host = req.headers.host || "localhost:3000";
        const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";
        const protocol = isHttps ? "https" : "http";
        const app_url = process.env.APP_URL || `${protocol}://${host}`;
        const base_url = app_url.replace(/\/$/, "");
        const redirect_uri = `${base_url}/api/auth/google/callback`;

        const client = new OAuth2Client(client_id, client_secret, redirect_uri);
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const idToken = tokens.id_token;
        if (!idToken) {
          throw new Error("No id_token received from Google Authorization engine.");
        }

        const ticket = await client.verifyIdToken({
          idToken: idToken,
          audience: client_id
        });
        const payload = ticket.getPayload();
        if (!payload) {
          throw new Error("Google Token Payload verification returned null value.");
        }

        email = payload.email || "";
        name = payload.name || payload.given_name || "Google User";
      }

      if (!email) {
        throw new Error("Unable to retrieve user credentials from Google Service.");
      }

      // Generate a Secure custom server-side JWT session
      const jwtSecret = process.env.JWT_SECRET || "SUPER_SECRET_BRIGHT_SCHOLARSHIP_KEY_2026";
      const custom_token = jwt.sign(
        { email: email.toLowerCase(), name: name, isSimulated },
        jwtSecret,
        { expiresIn: "7d" }
      );

      // Steps D & E Integration: Dispatch result back via cross-origin postMessage, or direct redirect fallback
      return res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Koneksi Akun Sukses - Bright Scholarship</title>
  <style>
    body {
      background-color: #131314;
      color: #e3e2e6;
      font-family: 'Roboto', sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .spinner {
      border: 3px solid #303134;
      border-top: 3px solid #8ab4f8;
      border-radius: 50%;
      width: 38px;
      height: 38px;
      animation: rotate 1s linear infinite;
      margin-bottom: 22px;
    }
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .title {
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.01em;
      margin-bottom: 6px;
    }
    .sub {
      font-size: 11px;
      color: #9aa0a6;
    }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <div class="title">Mengamankan kredensial keamanan...</div>
  <div class="sub">Menyinkronkan status beasiswa dengan sistem pusat</div>

  <script>
    const token = ${JSON.stringify(custom_token)};
    const email = ${JSON.stringify(email)};
    const name = ${JSON.stringify(name)};

    if (window.opener) {
      window.opener.postMessage({
        type: "GOOGLE_OAUTH_SUCCESS",
        token: token,
        email: email,
        name: name
      }, "*");
      window.close();
    } else {
      window.location.href = "/?token=" + encodeURIComponent(token) + "&email=" + encodeURIComponent(email) + "&name=" + encodeURIComponent(name);
    }
  </script>
</body>
</html>
      `);
    } catch (err: any) {
      console.error("[GOOGLE CALLBACK ERROR]:", err.message);
      return res.status(500).send(`
        <div style="background-color:#1c1010; color:#f28b82; font-family:sans-serif; padding:24px; border-radius:12px; margin:40px auto; max-width:500px; border:1px solid rgba(242,139,130,0.25);">
          <h3 style="margin-top:0;">🔐 Kesalahan Otorisasi Google</h3>
          <p style="font-size:13.5px; line-height:1.5;">Gagal memproses kode otorisasi OAuth Google Anda. Kemungkinan besar disebabkan oleh konfigurasi credentials Google Client ID yang belum sesuai.</p>
          <p style="font-size:11.5px; font-family:monospace; background-color:rgba(0,0,0,0.2); padding:10px; border-radius:6px; color:#f2c4c4;">${err.message}</p>
          <button onclick="window.close()" style="background-color:#f28b82; color:#1c1010; border:none; padding:8px 16px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:11.5px; margin-top:8px;">Tutup Jendela</button>
        </div>
      `);
    }
  });

  // Route 4: API to verify session token and return user metadata
  app.post("/api/auth/verify", (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ success: false, message: "Token is required for verification." });
      }

      const jwtSecret = process.env.JWT_SECRET || "SUPER_SECRET_BRIGHT_SCHOLARSHIP_KEY_2026";
      const decoded = jwt.verify(token, jwtSecret) as any;

      return res.json({ 
        success: true, 
        email: decoded.email, 
        name: decoded.name, 
        isSimulated: !!decoded.isSimulated 
      });
    } catch (err: any) {
      console.error("[OAUTH VERIFY ERROR]:", err.message);
      return res.status(401).json({ success: false, message: "Session expired or invalid: " + err.message });
    }
  });

  // ==========================================
  // SERVER SIDE API ROUTINGS
  // ==========================================

  // ==========================================
  // SERVER SIDE API ROUTE 1: Awardee Professional Insight
  // ==========================================
  app.post("/api/generateAwardeeInsight", async (req, res) => {
    try {
      const {
        name,
        university,
        major,
        batch,
        gpa,
        bio,
        skills,
        totalServiceHours,
        status
      } = req.body;

      const ai = getAiClient();

      const prompt = `
        Anda adalah Pembimbing Akademik dan Konsultan Karir Profesional untuk Program "Bright Scholarship".
        Berikan Laporan Analisis Kompetensi dan Rencana Pengembangan Karir Terarah dalam Bahasa Indonesia (Formal) berdasarkan profil awardee berikut:
        
        DATA UTAMA AWARDEE:
        - Nama Lengkap: ${name}
        - Universitas: ${university}
        - Jurusan/Program Studi: ${major}
        - Angkatan Penerima: ${batch}
        - IPK Terakhir: ${gpa} (Skala 4.00)
        - Bio Singkat: ${bio || "Belum diisi"}
        - Keterampilan/Skills: ${skills ? skills.join(", ") : "Belum diisi"}
        - Total Jam Pengabdian Masyarakat: ${totalServiceHours || 0} jam
        - Status Beasiswa: ${status === "active" ? "Aktif" : "Alumni"}
        
        Sajikan respon Anda dengan format MARKDOWN yang rapi dan terstruktur sebagai berikut:
        
        ### ANALISIS KOMPETENSI AWARDEE: ${name.toUpperCase()} (BRIGHT SCHOLARSHIP)
        
        #### A. EVALUASI AKADEMIS DAN INTEGRITAS DIRI
        (Berikan apresiasi atas pencapaian IPK dan berikan tinjauan akademis terkait jurusannya, dikaitkan dengan total jam pengabdian)
        
        #### B. STRATEGI RELEVANSI INDUSTRI & PENGEMBANGAN SKILLS
        (Berikan roadmap konkret untuk memperdalam skills yang tertulis, serta rekomendasi sertifikasi atau karir yang relevan dengan jurusan ${major})
        
        #### C. REKOMENDASI PEMBINAAN & PENGABDIAN BERIKUTNYA
        (Saran 2 ide proyek pemberdayaan atau kegiatan pengabdian sosial konkrit yang selaras dengan rumpun ilmunya untuk menambah jam pengabdian)
        
        #### D. PRINSIP KEPEMIMPINAN BRIGHT SCHOLARSHIP
        (Kalimat motivasi profesional yang menyalakan semangat kepemimpinan berwawasan sosial tinggi)
        
        Gunakan nada bahasa yang memotivasi, profesional, taktis, berbobot ilmiah namun ramah, memperkuat jati diri Bright Scholarship sebagai inkubator pemimpin bangsa.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const reportText = response.text || "Gagal mendapatkan analisis kompetensi dari AI.";
      res.json({ success: true, report: reportText });

    } catch (error: any) {
      console.error("Gemini Awardee Insight API Error:", error.message);
      res.status(500).json({
        success: false,
        error: error.message || "Gagal menghubungi asisten AI"
      });
    }
  });

  // ==========================================
  // SERVER SIDE API ROUTE 2: Collective Impact Analytical Synthesizer
  // ==========================================
  app.post("/api/generateImpactReport", async (req, res) => {
    try {
      const {
        totalAwardees,
        totalActivities,
        totalHours,
        pembinaanHours,
        pengabdianHours,
        activityCategories
      } = req.body;

      const ai = getAiClient();

      const prompt = `
        Anda adalah Auditor Evaluasi Dampak Sosial dan Program Lead Bright Scholarship Nasional.
        Rancanglah sebuah Laporan Sintesis Dampak Sosial Komprehensif (Social Impact Report) dalam Bahasa Indonesia untuk Dewan Pembina Bright Scholarship menggunakan metrik kegiatan asrama berikut:
        
        METRIK AKUMULATIF PROGRAM:
        - Total Awardees Terdaftar: ${totalAwardees} Mahasiswa
        - Total Kegiatan yang Berlangsung: ${totalActivities} Event
        - Total Akumulasi Jam Kegiatan Sosial/Pengabdian: ${totalHours} Jam Kerja Sosial
        - Jam Pembinaan Karakter/Asrama: ${pembinaanHours || 0} Jam
        - Jam Pengabdian Masyarakat Riil: ${pengabdianHours || 0} Jam
        - Distribusi Kategori Kegiatan: ${JSON.stringify(activityCategories)}
        
        STRUKTUR DOKUMEN MARKDOWN HARUS SEBAGAI BERIKUT:
        
        ### SOCIAL IMPACT COMPREHENSIVE ASSESSMENT - BRIGHT SCHOLARSHIP
        
        #### 1. ANALISIS KUANTITATIF & KUALITATIF SINERGI DAMPAK
        (Ulas secara mendalam pencapaian rasio jam per awardee, sinergi antara Pembinaan Karakter vs Pengabdian Masyarakat secara teoritis / praktis, serta efisiensi program)
        
        #### 2. PEMETAAN NILAI TAMBAH (BATU PIJAKAN IMPACT)
        - **Value for Universities (Dampak Terhadap Kampus)**: (Analisis representasi mahasiswa)
        - **Value for Underprivileged Communities (Dampak Terhadap Masyarakat Sasaran)**: (Manfaat nyata pengabdian)
        - **Value for Corporate/Donors (Dampak Kepercayaan Donator)**: (Pengelolaan nilai akuntabilitas)
        
        #### 3. REKOMENDASI TAKTIS STRATEGI PROGRAM TAJAM DAMPAK (N+1)
        - (Tuliskan 3 inovasi program pemberdayaan sosial baru yang berkelanjutan (sustainable) yang bisa dieksekusi awardee di semester hadapan)
        
        Buat tulisan yang formal, elegan, inspiratif, kaya akan istilah manajemen pemberdayaan masyarakat, dan siap diajukan ke Dewan Kehormatan/Donatur Utama.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const auditText = response.text || "Gagal mendapatkan laporan dampak sosial dari AI.";
      res.json({ success: true, analysis: auditText });

    } catch (error: any) {
      console.error("Gemini Impact Assessment API Error:", error.message);
      res.status(500).json({
        success: false,
        error: error.message || "Gagal menyusun asesmen dampak dari AI"
      });
    }
  });

  // ==========================================
  // SERVER SIDE API ROUTE 3: SMTP Real Email Dispatcher
  // ==========================================
  app.post("/api/sendApprovedEmail", async (req, res) => {
    try {
      const { toEmail, toName, subject, bodyHtml } = req.body;

      if (!toEmail || !toName || !subject || !bodyHtml) {
        return res.status(400).json({
          success: false,
          error: "Harap lengkapi semua parameter email (toEmail, toName, subject, bodyHtml)."
        });
      }

      // Check if SMTP is configured
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpUser || !smtpPass || smtpUser === "" || smtpPass === "") {
        console.warn("[SMTP DISPATCHER] SMTP credentials not set. Simulated delivery logged.");
        return res.json({
          success: true,
          smtpConfigured: false,
          message: "Informasi pengiriman disimpan di log virtual. Agar dikirim ke email asli penerima, pasang kredensial SMTP_USER dan SMTP_PASS di Settings -> Secrets Panel."
        });
      }

      let smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      
      // Auto-remedy if SMTP_HOST was mistakenly set to an email address (e.g. abdulhabir66@gmail.com)
      if (smtpHost.includes("@")) {
        console.warn(`[SMTP DISPATCHER] Detected email inside SMTP_HOST: "${smtpHost}". Auto-healing to appropriate SMTP server address.`);
        const emailDomain = smtpHost.split("@")[1];
        if (emailDomain === "gmail.com") {
          smtpHost = "smtp.gmail.com";
        } else if (emailDomain) {
          smtpHost = `smtp.${emailDomain}`;
        } else {
          smtpHost = "smtp.gmail.com";
        }
      }

      const smtpPort = parseInt(process.env.SMTP_PORT || "587");
      
      const transporter = createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false // Avoid blockages associated with virtual environment certificates
        }
      });

      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Bright Scholarship Foundation'}" <${process.env.SMTP_FROM_EMAIL || smtpUser}>`,
        to: `"${toName}" <${toEmail}>`,
        subject: subject,
        html: bodyHtml
      };

      console.info(`[SMTP DISPATCHER] Attempting outbound transport of official email to ${toEmail}...`);
      const info = await transporter.sendMail(mailOptions);
      console.info(`[SMTP DISPATCHER] Real Email successfully dispatched! MessageId: ${info.messageId}`);

      return res.json({
        success: true,
        smtpConfigured: true,
        messageId: info.messageId,
        message: `Surat elektronik resmi berhasil dikirimkan secara langsung ke alamat email terdaftar: ${toEmail}!`
      });

    } catch (error: any) {
      console.error("[SMTP DISPATCHER ERROR]:", error.message);
      return res.status(500).json({
        success: false,
        smtpConfigured: true,
        error: error.message || "Gagal mengirimkan email melalui server SMTP."
      });
    }
  });

  // ==========================================
  // INTEGRATE VITE FOR MIDDLEWARE (DEV VS PROD)
  // ==========================================
  async function runDevOrProdServer() {
    const PORT = 3000;
    if (!process.env.VERCEL) {
      if (process.env.NODE_ENV !== "production") {
        const { createServer: createViteServer } = await import("vite");
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "spa",
        });
        // This connects Vite asset serving and route handling to Express
        app.use(vite.middlewares);
      } else {
        const distPath = path.join(process.cwd(), "dist");
        app.use(express.static(distPath));
        // Serve client SPA fallback
        app.get("*", (req, res) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
      }

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`[FULL-STACK ENGINE] Bright Scholarship Server listening on port ${PORT}`);
      });
    }
  }

  runDevOrProdServer();

export default app;
