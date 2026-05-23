import type { TranslationShape } from "./en";

export const id: TranslationShape = {
  meta: {
    title:
      "Dedy Priyatna · Engineering Lead & Full-Stack Architect",
    description:
      "Dedy Priyatna — Lead E-commerce & Full-Stack Architect. Membangun perangkat lunak yang scalable dan berpusat pada manusia sejak 2019.",
    languageName: "Bahasa Indonesia",
    languageCode: "ID",
  },
  nav: {
    about: "Tentang",
    experience: "Pengalaman",
    projects: "Proyek",
    skills: "Keahlian",
    contact: "Kontak",
    blog: "Blog",
    letsTalk: "Mari bicara",
    downloadCV: "Unduh CV",
    generating: "Memproses…",
    toggleMenu: "Buka menu",
    languageLabel: "Bahasa",
    themeLabel: "Tema",
    themeDark: "Gelap",
    themeLight: "Terang",
    commandPalette: "Command palette",
  },
  hero: {
    statusOpen: "Terbuka untuk peluang baru",
    statusBusy: "Sedang sibuk",
    greeting: "Halo, saya",
    headlineLine1: "Saya membangun software",
    headlineHighlight: "yang benar-benar dirilis.",
    primaryCta: "Mari bangun sesuatu",
    seeWork: "Lihat karya saya",
    portraitNowLabel: "Saat ini",
    portraitNowValue: "Lead E-commerce · Vigo",
    chipSinceLabel: "Sejak",
    chipSinceValue: "2019",
    chipStackLabel: "Stack",
    chipStackValue: "TS · Node · React",
    stats: [
      { label: "Tahun pengalaman", value: "6+" },
      { label: "Proyek production dirilis", value: "15+" },
      { label: "Tim dipimpin & dibimbing", value: "5" },
      { label: "Stack dikuasai", value: "12+" },
    ],
  },
  about: {
    eyebrow: "Tentang",
    title: "Engineer pragmatis yang memimpin langsung dari keyboard.",
    description:
      "Saya memimpin tim engineering yang merilis fitur dengan cepat tanpa merusak yang sudah ada. Mulai dari platform e-commerce yang melayani ribuan pengguna sampai tools internal yang menghemat ratusan jam kerja, saya fokus pada detail yang berdampak besar — kode yang mudah dibaca, arsitektur yang dipikirkan matang, dan pengalaman pengguna yang menghargai waktu mereka.",
    items: [
      {
        title: "Arsitektur yang tumbuh bersama tim",
        body: "Saya merancang sistem yang tetap mudah dibaca di hari pertama dan di hari ke-1000 — modular, observable, dan 'membosankan' dalam arti yang baik.",
      },
      {
        title: "Memimpin dengan membersihkan jalan",
        body: "Tugas saya sebagai lead adalah membuat tim lebih cepat dari yang pernah saya capai sendiri. Pair, review, mentor, lalu menyingkir.",
      },
      {
        title: "Kirim nilai, bukan kemewahan",
        body: "Setiap baris kode harus terhubung ke kebutuhan pengguna atau tujuan bisnis. Kalau tidak, kita potong.",
      },
    ],
    tagline:
      "Mengubah masalah bisnis yang rumit menjadi produk bersih dan scalable yang dicintai penggunanya.",
    role: "Engineering Lead · Full-Stack Architect",
  },
  experience: {
    eyebrow: "Pengalaman",
    title:
      "Enam tahun, dua belas stack, satu tujuan konsisten: rilis hal yang tepat.",
    description:
      "Lini masa singkat perjalanan saya — dari full-stack freelancer hingga engineering lead — dan jenis masalah yang saya nikmati untuk dipecahkan.",
    types: {
      fulltime: "Full-time",
      freelance: "Freelance",
      projectBased: "Project Based",
    },
    items: {
      vigo: {
        period: "Mar 2024 — Sekarang",
        role: "Lead E-commerce",
        company: "PT. Vigo Technologi Indonesia",
        location: "Jakarta",
        highlights: [
          "Memimpin tim engineering lintas fungsi untuk merilis fitur tepat waktu tanpa mengorbankan kualitas.",
          "Merancang arsitektur sistem yang scalable dan modular untuk portofolio produk e-commerce yang terus berkembang.",
          "Tetap turun tangan menulis kode — menangani fitur inti dan masalah teknis paling rumit secara langsung.",
          "Mendorong budaya testing menyeluruh: unit, integration, dan UAT, melekat di setiap rilis.",
          "Membimbing engineer, melakukan code review, dan menumbuhkan mereka menjadi senior yang dibutuhkan tahun depan.",
          "Bekerja erat dengan tim product, design, dan stakeholder agar setiap sprint selaras dengan visi produk.",
          "Merencanakan timeline, mengestimasi effort, dan menerjemahkan ambiguitas menjadi milestone yang bisa dirilis.",
          "Memantau performa secara berkelanjutan dan menerapkan optimasi sebelum menjadi insiden.",
          "Mempromosikan best practice dan ritual Agile yang benar-benar membuat tim lebih cepat.",
        ],
      },
      sinarsakti: {
        period: "Jan 2024 — Mar 2024",
        role: "Front-End Developer",
        company: "PT. Sinar Sakti International",
        location: "Jakarta",
        highlights: [
          "Mendesain dan merilis interface responsif untuk TV, mobile, tablet, dan desktop.",
          "Membangun pengalaman mobile dengan Flutter, berkolaborasi erat dengan tim desain.",
          "Menutup celah keamanan dan merilis fitur baru tanpa merusak alur yang sudah ada.",
          "Mempresentasikan pembaruan produk dan fitur baru langsung kepada eksekutif level-C.",
          "Mengintegrasikan layanan pihak ketiga untuk memperluas kemampuan platform.",
        ],
      },
      sproutdigital: {
        period: "Okt 2023 — Des 2023",
        role: "Senior Software Engineer",
        company: "Sprout Digital Lab",
        location: "Tangerang",
        highlights: [
          "Membangun service yang bersih dan ter-test dengan NestJS menggunakan pendekatan service-oriented / microservices.",
          "Menangani tiket Jira end to end — dari reproduksi sampai deploy production.",
          "Mengintegrasikan API pihak ketiga untuk memperkaya produk yang ada.",
          "Menulis library bersama yang menjadi building block andalan tim.",
          "Membantu QA menyusun test case dan mereproduksi bug edge-case.",
        ],
      },
      anekajuragan: {
        period: "Jul 2022 — Agu 2023",
        role: "Senior Backend Engineer",
        company: "PT. Aneka Juragan Material",
        location: "Jakarta",
        highlights: [
          "Merancang backend scalable dan aman untuk juraganmaterial.id — marketplace B2B bahan bangunan.",
          "Membangun API, database, dan integrasi yang menghubungkan customer, vendor, payment gateway, dan logistik.",
          "Mengatur pipeline CI/CD, workflow Docker, dan deployment di Google Cloud.",
          "Membimbing engineer junior lewat code review dan pair-programming.",
          "Menyelidiki dan menyelesaikan masalah production dengan debugging yang tenang dan berbasis data.",
        ],
      },
      jafra: {
        period: "Jun 2021 — Jul 2022",
        role: "Full-Stack Developer",
        company: "PT. Jafra Cosmetic Indonesia",
        location: "Jakarta",
        highlights: [
          "Merancang backend Jafra Office Management (JOM) — order karyawan, request vendor, dan approval.",
          "Merilis modul reimbursement dengan submission dan tracking end-to-end.",
          "Membangun sistem ticketing IT internal untuk merampingkan support.",
          "Melakukan lokalisasi platform untuk berbagai negara tempat Jafra beroperasi.",
          "Mengoptimalkan performa, memperketat keamanan, dan menjaga aplikasi tetap stabil di beban nyata.",
        ],
      },
      solusiekosistem: {
        period: "Mar 2020 — Mar 2021",
        role: "Senior Backend Engineer",
        company: "PT. Solusi Ekosistem Global",
        location: "Jakarta",
        highlights: [
          "Merilis platform commerce lintas-negara: idnstore.tw, indomatjar.com, dan China event store.",
          "Menerjemahkan kebutuhan teknis menjadi sistem yang reliable dan mudah dipelihara bersama tim desain.",
          "Memodernisasi kode legacy untuk meningkatkan UX dan performa.",
          "Menyiapkan prosedur testing dan validasi otomatis untuk rilis yang berulang.",
        ],
      },
      rekayasa: {
        period: "Nov 2019 — Mar 2020",
        role: "Full-Stack Engineer",
        company: "PT. Rekayasa Aplikasi Digital",
        location: "Jakarta",
        highlights: [
          "Mengerjakan proyek remote berbasis target termasuk platform interview online PLN dan KampusDigi.",
          "Memelihara produk legacy sambil memodernisasinya secara bertahap dengan stack baru.",
          "Bekerja dengan DevOps untuk deploy ke production dengan disrupsi minimum.",
          "Membantu PM dalam scoping, estimasi, dan forecasting milestone yang realistis.",
        ],
      },
    },
  },
  projects: {
    eyebrow: "Karya Pilihan",
    title: "Produk yang saya kirim, tim yang saya bantu, masalah yang saya pecahkan.",
    description:
      "Tur singkat ke berbagai platform, aplikasi mobile, dan tools internal di bidang e-commerce, B2B, finance, dan edukasi.",
    filters: {
      all: "Semua",
      Web: "Web",
      Mobile: "Mobile",
      Backend: "Backend",
      Landing: "Landing",
    },
    items: {
      elefin: {
        name: "Elefin",
        tagline: "Platform B2B di bawah Mayapada Group",
        description:
          "Aplikasi web B2B enterprise yang dibangun untuk Mayapada Group — memadukan front-end React dengan backend Node.js untuk menyederhanakan workflow bisnis dalam skala besar.",
      },
      juraganmaterial: {
        name: "Juragan Material",
        tagline: "Marketplace B2B untuk bahan bangunan",
        description:
          "Startup yang menghubungkan UKM Indonesia dengan vendor bahan bangunan se-nusantara. Didukung kemitraan pay-later fleksibel (Paper, Coint Work, Credilink) dan logistik terintegrasi.",
      },
      jom: {
        name: "JOM — Jafra Office Management",
        tagline: "Kantor tanpa kertas dalam satu klik",
        description:
          "Sistem manajemen yang menggantikan workflow manual penuh tanda tangan dengan satu klik — approval, request, dan tracking dalam satu tempat.",
      },
      indomatjar: {
        name: "Indomatjar",
        tagline: "Commerce lintas-negara untuk UKM Indonesia",
        description:
          "Platform yang membantu UKM Indonesia menjual ke negara-negara Arab, China, Taiwan, dan Hong Kong — dengan dukungan UnionPay, Alipay, WeChat Pay, dan kartu kredit, serta pengiriman via Pos Indonesia, DHL, dan TGI.",
      },
      pdekpor: {
        name: "PDEkpor",
        tagline: "Memberdayakan UKM Indonesia menembus pasar global",
        description:
          "Produk saudara dari Indomatjar — membimbing usaha kecil dan menengah Indonesia menavigasi realita ekspor ke pasar internasional.",
      },
      labamu: {
        name: "Labamu",
        tagline: "Aplikasi kasir mobile untuk pedagang harian",
        description:
          "Aplikasi point-of-sale mobile yang dibangun dengan Flutter — dirancang bersama tim kecil agar transaksi harian terasa mudah bagi para mikro-merchant.",
      },
      pln: {
        name: "Interview Online PLN",
        tagline: "Rekrutmen era pandemi, dipercepat",
        description:
          "Dibangun saat pandemi untuk memberi kandidat PLN pengalaman interview online real-time yang cepat dengan feedback langsung — mengubah hitungan hari menjadi menit.",
      },
      generalledger: {
        name: "General Ledger Web",
        tagline: "Dari desktop ke mana saja",
        description:
          "Re-platforming aplikasi desktop legacy ke Laravel + MySQL — memungkinkan karyawan mengakses data keuangan dengan aman dari rumah.",
      },
      anggaranweb: {
        name: "Anggaran Web",
        tagline: "Penganggaran di atas General Ledger",
        description:
          "Dibangun dengan Laravel 8 dan Vue 2.6, mengonsumsi data dari General Ledger Web untuk perencanaan dan tracking anggaran.",
      },
      befinance: {
        name: "BeFinance",
        tagline: "Keuangan personal yang sederhana",
        description:
          "Aplikasi mobile Flutter yang bersih untuk mencatat pemasukan dan pengeluaran — dirancang untuk kejelasan, bukan tumpukan fitur.",
      },
      hijaiyah: {
        name: "Game Anak Hijaiyah",
        tagline: "Belajar huruf Hijaiyah lewat permainan",
        description:
          "Game edukasi Flutter untuk anak-anak — mengajarkan huruf Hijaiyah lewat suara dan mini-game pencocokan suara dengan huruf yang muncul di layar.",
      },
      landingpages: {
        name: "Bram Enterprise · Pendi Jaya",
        tagline: "Landing page yang punya tujuan",
        description:
          "Dua landing page berbasis Bootstrap: Bram Enterprise (konsultan IT) dan Pendi Jaya Aluminium — keduanya fokus pada kejelasan, konversi, dan ketelitian.",
      },
    },
  },
  skills: {
    eyebrow: "Toolkit",
    title:
      "Stack yang saya andalkan — dan praktik yang menjaganya tetap solid.",
    description:
      "Tools berganti tiap tahun. Insting untuk memilih yang paling sederhana namun tepat menyelesaikan masalah, tidak.",
    groupTitles: {
      languages: "Bahasa",
      frontend: "Frontend",
      backend: "Backend",
      dataCloud: "Data & Cloud",
      practices: "Praktik",
    },
    practices: [
      "Kepemimpinan Tim",
      "Desain Arsitektur",
      "Code Review",
      "Mentoring",
      "Agile / Scrum",
      "CI/CD",
    ],
    education: {
      degree: "Sarjana, Pendidikan Guru Sekolah Dasar",
      school: "Universitas Pamulang",
      location: "Tangerang",
      period: "2019 — 2022",
    },
  },
  contact: {
    eyebrow: "Kontak",
    title: "Punya masalah yang menarik untuk dipecahkan?",
    description:
      "Entah produk greenfield ambisius, sistem legacy yang macet, atau tim engineering yang butuh kepemimpinan — saya senang mendengarnya.",
    cardTitle: "Mari mulai obrolan.",
    cardDescription:
      "Cara tercepat menghubungi saya lewat email. Biasanya saya balas dalam satu hari kerja.",
    emailMe: "Kirim email",
    elsewhereTitle: "Temukan saya di tempat lain",
    elsewhereDescription:
      "Saya paling aktif di LinkedIn untuk kolaborasi dan di GitHub untuk kode.",
    statusOpen:
      "Saat ini terbuka untuk role senior / lead engineering & konsultasi.",
  },
  caseStudy: {
    eyebrow: "Studi Kasus",
    title: "Juragan Material: membangun fondasi marketplace B2B.",
    description:
      "Pendalaman tentang bagaimana saya merancang arsitektur backend, integrasi, dan delivery untuk marketplace bahan bangunan dengan vendor, pembayaran, dan logistik dalam satu alur.",
    metrics: [
      { value: "B2B", label: "Model marketplace" },
      { value: "4+", label: "Integrasi eksternal" },
      { value: "CI/CD", label: "Workflow deploy" },
      { value: "GCP", label: "Fondasi cloud" },
    ],
    overviewTitle: "Konteks",
    overviewBody:
      "Juragan Material membantu bisnis Indonesia mendapatkan bahan bangunan dari vendor di berbagai wilayah. Platform ini perlu mendukung katalog vendor, pemesanan customer, kemitraan pay-later, handoff logistik, dan CMS internal tanpa berubah menjadi monolit yang rapuh.",
    challengeTitle: "Tantangan utama",
    challenges: [
      "Mengintegrasikan beberapa partner pembayaran dan logistik tanpa mengganggu flow marketplace inti.",
      "Merancang modul backend yang bisa mengikuti eksperimen produk dan kebutuhan onboarding vendor.",
      "Menjaga operasional production tetap terprediksi dengan Docker, CI/CD, dan praktik deployment yang jelas.",
      "Membimbing engineer junior agar codebase bisa tumbuh bersama tim, bukan hanya bersama traffic.",
    ],
    solutionTitle: "Yang saya kerjakan",
    solutions: [
      "Merancang batas backend untuk catalog, order, payment, logistics, dan tanggung jawab CMS internal.",
      "Membangun REST API dan struktur database yang membuat workflow marketplace eksplisit dan lebih mudah dites.",
      "Menyiapkan development dan deployment pipeline berbasis Docker untuk mengurangi perbedaan environment.",
      "Melakukan code review, pairing, dan dokumentasi sistem supaya ownership bisa tersebar di tim.",
    ],
    architectureTitle: "Pilihan arsitektur",
    architecture: [
      {
        label: "Backend core",
        body: "Service Node.js dengan PostgreSQL sebagai transactional source of truth.",
      },
      {
        label: "Cloud & deploy",
        body: "Workflow Docker yang dideploy ke Google Cloud Platform dengan otomatisasi CI/CD.",
      },
      {
        label: "Integrasi",
        body: "Adapter pembayaran dan logistik dipisahkan dari domain logic marketplace.",
      },
    ],
    impactTitle: "Dampak",
    impact: [
      "Membuat fondasi backend yang siap untuk pertumbuhan marketplace dan workflow vendor baru.",
      "Mengurangi risiko delivery dengan integrasi yang lebih terisolasi dan mudah dites.",
      "Meningkatkan velocity tim lewat standar code review, mentoring, dan dokumentasi.",
    ],
  },
  command: {
    placeholder: "Ketik command atau lompat ke section...",
    hint: "Tekan Esc untuk tutup · Enter untuk jalankan",
    groups: {
      navigation: "Navigasi",
      actions: "Aksi",
      preferences: "Preferensi",
    },
    actions: {
      downloadCv: "Unduh CV sesuai bahasa aktif",
      copyEmail: "Salin alamat email",
      emailCopied: "Email disalin",
      toggleTheme: "Ganti tema terang/gelap",
      switchLanguage: "Ganti bahasa",
    },
  },
  chat: {
    bubbleLabel: "Ngobrol dengan asisten AI Dedy",
    title: "Tanya tentang Dedy",
    subtitle: "Asisten AI yang dilatih dari portofolio-nya",
    online: "Online",
    greeting:
      "Halo 👋 aku bot yang Dedy taruh di sini buat nemenin kamu mumpung dia lagi sibuk ngoding. Tanya aja soal project, stack, atau ketersediaan dia — santai aja, ga usah formal.",
    suggestionLabel: "Coba tanya:",
    suggestions: [
      {
        label: "TL;DR",
        prompt: "Ceritain singkat dong, Dedy ini siapa sih?",
      },
      {
        label: "Project paling keren",
        prompt: "Project Dedy yang paling keren belakangan ini apa? Kenapa?",
      },
      {
        label: "Stack favoritnya",
        prompt: "Stack andalan Dedy apa aja, dan yang dia suka banget yang mana?",
      },
      {
        label: "Mau ngajak kerja",
        prompt: "Dedy lagi open buat opportunity baru ga? Cara paling cepet ngehubungin dia gimana?",
      },
    ],
    inputPlaceholder: "Tanya apa aja soal Dedy…",
    send: "Kirim",
    stop: "Hentikan",
    reset: "Mulai dari awal",
    typing: "Lagi mikir…",
    poweredBy: "Didukung Gemini",
    disclaimer: "Jawaban AI bisa keliru — verifikasi info penting.",
    errorGeneric:
      "Ada gangguan saat menghubungi AI. Silakan coba sebentar lagi.",
    errorRateLimit: "Terlalu banyak pesan. Mohon tunggu sebentar sebelum coba lagi.",
    closeLabel: "Tutup chat",
    quickActionsTitle: "Hubungi Dedy langsung:",
    quickActions: {
      email: "Email",
      whatsapp: "WhatsApp",
      linkedin: "LinkedIn",
    },
    cooldownHint: "Mohon tunggu sebentar sebelum mengirim pesan berikutnya.",
  },
  footer: {
    crafted:
      "Dibangun dengan React, Vite, TypeScript & Tailwind CSS.",
    location: "Dirancang dan dirilis dari Indonesia.",
  },
  pdf: {
    summary: "Ringkasan",
    experience: "Pengalaman",
    skills: "Keahlian",
    projects: "Proyek Pilihan",
    education: "Pendidikan",
    pageOf: "Halaman {{n}} dari {{total}}",
  },
};
