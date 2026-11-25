const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

if (!fs.existsSync(edgePath)) {
    console.error('Microsoft Edge not found at:', edgePath);
    process.exit(1);
}

// 1. Read Photo as Base64
const photoPath = path.join(__dirname, 'dewan-foto.jpg');
let photoBase64 = '';
if (fs.existsSync(photoPath)) {
    const photoBuffer = fs.readFileSync(photoPath);
    photoBase64 = `data:image/jpeg;base64,${photoBuffer.toString('base64')}`;
    console.log('✓ Loaded dewan-foto.jpg (base64 size:', photoBase64.length, 'chars)');
} else {
    console.warn('⚠ dewan-foto.jpg not found, using fallback icon');
}

// 2. Count PDF Pages
function countPdfPages(pdfPath) {
    const buf = fs.readFileSync(pdfPath);
    const matches = buf.toString('latin1').match(/\/Type\s*\/Page\b/g);
    return matches ? matches.length : 0;
}

// SVG Icons
const icons = {
    check: `<svg style="width:13px;height:13px;fill:#10b981;flex-shrink:0;" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`,
    star: `<svg style="width:13px;height:13px;fill:#f59e0b;flex-shrink:0;" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`,
    globe: `<svg style="width:13px;height:13px;fill:#2563eb;flex-shrink:0;" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-.2a2 2 0 00-1.664-1.973l-.17-.028A2 2 0 017 12v-.5a1.5 1.5 0 00-1.5-1.5h-.168a2.983 2.983 0 01-1-.473z" clip-rule="evenodd"/></svg>`,
    github: `<svg style="width:13px;height:13px;fill:#1e293b;flex-shrink:0;" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
    phone: `<svg style="width:13px;height:13px;fill:#10b981;flex-shrink:0;" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 4V3z"/></svg>`,
    mail: `<svg style="width:13px;height:13px;fill:#0284c7;flex-shrink:0;" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>`,
    location: `<svg style="width:13px;height:13px;fill:#ef4444;flex-shrink:0;" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>`,
    chip: `<svg style="width:14px;height:14px;fill:#2563eb;flex-shrink:0;" viewBox="0 0 24 24"><path d="M6 4h12v2h2v2h2v2h-2v4h2v2h-2v2h-2v2H6v-2H4v-2H2v-2h2v-4H2V8h2V6h2V4zm2 4v8h8V8H8zm2 2h4v4h-4v-4z"/></svg>`,
    box: `<svg style="width:14px;height:14px;fill:#059669;flex-shrink:0;" viewBox="0 0 24 24"><path d="M12 1l10 5v12l-10 5L2 18V6l10-5zm0 2.236L4.472 7 12 10.764 19.528 7 12 3.236zM4 8.847v7.533l7 3.5v-7.533l-7-3.5zm9 11.033l7-3.5V8.847l-7 3.5v7.533z"/></svg>`,
    code: `<svg style="width:14px;height:14px;fill:#7c3aed;flex-shrink:0;" viewBox="0 0 24 24"><path d="M8.59 16.59L4 12l4.59-4.59L10 8.82 6.83 12 10 15.18l-1.41 1.41zm6.82 0L20 12l-4.59-4.59L14 8.82 17.17 12 14 15.18l1.41 1.41z"/></svg>`,
    sun: `<svg style="width:13px;height:13px;fill:#f59e0b;flex-shrink:0;" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`
};

// 3. Generate HTML Template
const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Portofolio Teknik & Rekayasa - Dewan Mochamad Pratama</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #e2e8f0;
            color: #1e293b;
            font-size: 8.6pt;
            line-height: 1.34;
        }
        .page {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            overflow: hidden;
            margin: 0 auto;
            background: #ffffff;
            box-sizing: border-box;
            padding: 10mm 13mm 9mm 13mm;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-after: always;
            break-after: page;
        }

        /* Running Header */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1.5px solid #0f172a;
            padding-bottom: 4px;
            margin-bottom: 6px;
        }
        .header-brand {
            font-size: 7.8pt;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .header-brand .dot {
            width: 6px;
            height: 6px;
            background: #2563eb;
            border-radius: 50%;
            display: inline-block;
        }
        .header-tag {
            font-size: 7.2pt;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Running Footer */
        .page-footer {
            border-top: 1px solid #cbd5e1;
            padding-top: 4px;
            margin-top: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 7.2pt;
            color: #64748b;
        }
        .page-footer a {
            color: #2563eb;
            text-decoration: underline;
            font-weight: 600;
        }

        /* Typography & Components */
        h1, h2, h3, h4 {
            color: #0f172a;
            font-weight: 800;
        }
        .section-heading {
            font-size: 9.8pt;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 6px;
            border-bottom: 1.2px solid #cbd5e1;
            padding-bottom: 3px;
            margin-bottom: 5px;
            margin-top: 4px;
        }

        /* Badges */
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 7.2pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .badge-blue { background: #eff6ff; color: #1d4ed8; border: 0.8px solid #bfdbfe; }
        .badge-emerald { background: #ecfdf5; color: #047857; border: 0.8px solid #a7f3d0; }
        .badge-indigo { background: #eef2ff; color: #4338ca; border: 0.8px solid #c7d2fe; }
        .badge-amber { background: #fffbeb; color: #b45309; border: 0.8px solid #fde68a; }
        .badge-rose { background: #fff1f2; color: #be123c; border: 0.8px solid #fecdd3; }
        .badge-slate { background: #f1f5f9; color: #334155; border: 0.8px solid #cbd5e1; }

        /* Cards */
        .card {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 6px 9px;
            box-sizing: border-box;
        }
        .card-highlight {
            border: 1.2px solid #3b82f6;
            background: #f8fafc;
        }

        /* Grid utilities */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
        .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px; }

        /* Tables */
        .spec-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7.4pt;
            margin: 3px 0;
        }
        .spec-table th, .spec-table td {
            border: 0.8px solid #cbd5e1;
            padding: 3px 5px;
            text-align: left;
        }
        .spec-table th {
            background: #f1f5f9;
            font-weight: 700;
            color: #0f172a;
        }

        .checklist {
            list-style: none;
            padding: 0;
            margin: 3px 0;
        }
        .checklist li {
            display: flex;
            align-items: flex-start;
            gap: 5px;
            font-size: 7.9pt;
            color: #334155;
            margin-bottom: 2.5px;
            line-height: 1.27;
        }
        .checklist li strong {
            color: #0f172a;
        }

        /* Hero Layout on Page 1 */
        .hero-banner {
            display: flex;
            align-items: center;
            gap: 13px;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #ffffff;
            padding: 9px 13px;
            border-radius: 8px;
            margin-bottom: 6px;
        }
        .hero-avatar {
            width: 63px;
            height: 63px;
            border-radius: 8px;
            object-fit: cover;
            border: 2px solid #3b82f6;
            flex-shrink: 0;
        }
        .hero-info h1 {
            color: #ffffff;
            font-size: 13.5pt;
            line-height: 1.15;
            letter-spacing: 0.2px;
            margin-bottom: 2px;
        }
        .hero-title {
            color: #60a5fa;
            font-size: 8.3pt;
            font-weight: 700;
            margin-bottom: 3px;
        }
        .hero-contact {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            font-size: 7.3pt;
            color: #cbd5e1;
        }
        .hero-contact a {
            color: #93c5fd;
            text-decoration: underline;
        }

        .tech-chip {
            display: inline-block;
            background: #f1f5f9;
            color: #334155;
            border: 0.6px solid #cbd5e1;
            padding: 1.5px 5px;
            border-radius: 3px;
            font-size: 7pt;
            font-weight: 600;
            font-family: monospace;
            margin: 1px 2px 1px 0;
        }
    </style>
</head>
<body>

    <!-- ========================================== -->
    <!-- HALAMAN 1: COVER & PROFIL EKSEKUTIF        -->
    <!-- ========================================== -->
    <div class="page">
        <div>
            <!-- Header -->
            <div class="page-header">
                <div class="header-brand">
                    <span class="dot"></span>
                    <span>Dewan Mochamad Pratama &bull; Dokumen Portofolio Resmi</span>
                </div>
                <div class="header-tag">Halaman 1 dari 5 &bull; Profil &amp; Kompetensi</div>
            </div>

            <!-- Hero Banner -->
            <div class="hero-banner">
                <img src="${photoBase64}" alt="Dewan Mochamad Pratama" class="hero-avatar" />
                <div class="hero-info" style="flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h1>DEWAN MOCHAMAD PRATAMA</h1>
                        <span class="badge badge-emerald" style="border-color:#34d399; color:#065f46; font-size:6.8pt;">Terverifikasi Profesional</span>
                    </div>
                    <div class="hero-title">Software Engineer &bull; Embedded IoT Developer &bull; Logistics Operations Specialist</div>
                    <div class="hero-contact">
                        <span>${icons.phone} <strong>+62 823-1873-0894</strong></span>
                        <span>${icons.mail} <strong>dewanmochpratama23@gmail.com</strong></span>
                        <span>${icons.location} <strong>Klari, Karawang, Jawa Barat</strong></span>
                    </div>
                    <div class="hero-contact" style="margin-top:2px;">
                        <span>${icons.globe} Web Portofolio: <a href="https://dewan-portofolio-delta.vercel.app/" target="_blank">dewan-portofolio-delta.vercel.app</a></span>
                        <span>${icons.github} GitHub: <a href="https://github.com/dewanmochpratama23-sys" target="_blank">github.com/dewanmochpratama23-sys</a></span>
                    </div>
                </div>
            </div>

            <!-- Ringkasan Eksekutif -->
            <div class="section-heading">
                ${icons.star} <span>Ringkasan Eksekutif &amp; Nilai Tambah</span>
            </div>
            <div class="card card-highlight" style="font-size:8.1pt; line-height:1.32; text-align:justify; margin-bottom:6px;">
                Praktisi rekayasa teknologi dan operasional industri dengan kombinasi langka antara <strong>keahlian pengembangan perangkat lunak modern (Full-Stack Web, Mobile App, AI Computer Vision, &amp; Embedded IoT)</strong> serta <strong>pengalaman nyata lebih dari 4 tahun di industri logistik manufaktur berskala besar (PT Multi Indomandiri / Wings Group)</strong>. Terbukti mampu merekayasa solusi teknologi dari tahap perancangan firmware hardware mikrokontroler (ESP32, sensor telemetri suhu &amp; cahaya), deployment web komersial aktif yang menghasilkan pendapatan riil, hingga pengelolaan sistem pergudangan (WMS), kontrol inventaris presisi, dan implementasi budaya kerja 5S/5R dengan integritas tinggi.
            </div>

            <!-- Matriks Keahlian Terpadu -->
            <div class="section-heading">
                ${icons.code} <span>Matriks Keahlian Teknis &amp; Rekayasa</span>
            </div>
            <div class="grid-2" style="margin-bottom:6px;">
                <div class="card">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                        <strong style="font-size:8.2pt; color:#047857;">1. Embedded Systems &amp; IoT Hardware</strong>
                        <span class="badge badge-emerald">Hardware &amp; IoT</span>
                    </div>
                    <p style="font-size:7.5pt; color:#475569; margin-bottom:4px;">Desain sirkuit mikrokontroler, interfacing sensor real-time, dan modulasi sinyal frekuensi.</p>
                    <div>
                        <span class="tech-chip">ESP32 32-bit</span>
                        <span class="tech-chip">Arduino C++</span>
                        <span class="tech-chip">DHT Temperature/Humidity</span>
                        <span class="tech-chip">LDR Light Sensor</span>
                        <span class="tech-chip">4-Color Traffic Light</span>
                        <span class="tech-chip">I2C LCD 16x2</span>
                        <span class="tech-chip">HC-SR04 Ultrasonic</span>
                        <span class="tech-chip">PWM Modulator</span>
                        <span class="tech-chip">ADC Calibration</span>
                    </div>
                </div>

                <div class="card">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                        <strong style="font-size:8.2pt; color:#1e40af;">2. Full-Stack Web &amp; Cloud Architecture</strong>
                        <span class="badge badge-blue">Web Platform</span>
                    </div>
                    <p style="font-size:7.5pt; color:#475569; margin-bottom:4px;">Rekayasa aplikasi web modern, performa tinggi, SEO teroptimasi, dan siap skala bisnis.</p>
                    <div>
                        <span class="tech-chip">Next.js 16</span>
                        <span class="tech-chip">React.js</span>
                        <span class="tech-chip">TypeScript</span>
                        <span class="tech-chip">Tailwind CSS</span>
                        <span class="tech-chip">Node.js</span>
                        <span class="tech-chip">Vercel CI/CD</span>
                        <span class="tech-chip">REST API</span>
                        <span class="tech-chip">Native PHP</span>
                        <span class="tech-chip">Figma UI/UX</span>
                    </div>
                </div>

                <div class="card">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                        <strong style="font-size:8.2pt; color:#6d28d9;">3. AI Computer Vision &amp; Mobile App</strong>
                        <span class="badge badge-indigo">AI &amp; Mobile</span>
                    </div>
                    <p style="font-size:7.5pt; color:#475569; margin-bottom:4px;">Pengolahan citra digital biometrik serta aplikasi mobile native Android dan iOS.</p>
                    <div>
                        <span class="tech-chip">Python 3</span>
                        <span class="tech-chip">OpenCV</span>
                        <span class="tech-chip">NumPy</span>
                        <span class="tech-chip">Tkinter GUI</span>
                        <span class="tech-chip">Haar Cascade / Dlib</span>
                        <span class="tech-chip">React Native</span>
                        <span class="tech-chip">Expo SDK</span>
                        <span class="tech-chip">Mobile Deep-Linking</span>
                    </div>
                </div>

                <div class="card">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                        <strong style="font-size:8.2pt; color:#b45309;">4. Logistics Operations &amp; Supply Chain</strong>
                        <span class="badge badge-amber">Manufaktur FMCG</span>
                    </div>
                    <p style="font-size:7.5pt; color:#475569; margin-bottom:4px;">Manajemen alur pergudangan skala pabrik industri, akurasi stok, dan standar K3/5S.</p>
                    <div>
                        <span class="tech-chip">WMS Inventory</span>
                        <span class="tech-chip">Stock Opname</span>
                        <span class="tech-chip">Inbound / Outbound</span>
                        <span class="tech-chip">Material Handling</span>
                        <span class="tech-chip">5S / 5R Methodology</span>
                        <span class="tech-chip">K3 Pabrik</span>
                        <span class="tech-chip">SOP Operasional</span>
                    </div>
                </div>
            </div>

            <!-- Rekam Jejak Pendidikan & Karir Singkat -->
            <div class="section-heading">
                ${icons.box} <span>Riwayat Karir &amp; Latar Belakang Akademik</span>
            </div>
            <div class="grid-2">
                <div class="card" style="font-size:7.9pt;">
                    <div style="display:flex; justify-content:space-between; font-weight:700;">
                        <span style="color:#0f172a;">PT Multi Indomandiri (Wings Group)</span>
                        <span style="color:#64748b;">2020 &ndash; Sekarang (4+ Tahun)</span>
                    </div>
                    <div style="color:#2563eb; font-weight:600; margin-bottom:2px;">Warehouse &amp; Operational Logistics Specialist &bull; Karawang</div>
                    <p style="color:#475569; font-size:7.6pt; line-height:1.25;">
                        Mengelola arus distribusi barang jadi (*finished goods*), rekonsiliasi data fisik dan digital melalui WMS, supervisi *loading-unloading*, serta memimpin kedisiplinan 5S dan keselamatan kerja di lantai gudang.
                    </p>
                </div>

                <div class="card" style="font-size:7.9pt;">
                    <div style="display:flex; justify-content:space-between; font-weight:700;">
                        <span style="color:#0f172a;">Universitas Terakreditasi</span>
                        <span style="color:#64748b;">Lulusan Sarjana</span>
                    </div>
                    <div style="color:#2563eb; font-weight:600; margin-bottom:2px;">S1 Teknik Informatika (Fokus Rekayasa Sistem)</div>
                    <p style="color:#475569; font-size:7.6pt; line-height:1.25;">
                        Konsentrasi mendalam pada Algoritma Pemrograman, Arsitektur Komputer &amp; Mikrokontroler, Rekayasa Perangkat Lunak, Basis Data Relasional, serta Sistem Kecerdasan Buatan Terapan.
                    </p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="page-footer">
            <span>Dokumen Portofolio Resmi &bull; Dewan Mochamad Pratama</span>
            <span>Live Portfolio: <a href="https://dewan-portofolio-delta.vercel.app/" target="_blank">dewan-portofolio-delta.vercel.app</a></span>
            <span>Halaman 1 dari 5</span>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- HALAMAN 2: PROYEK 1 - IOT MULTI-SENSOR     -->
    <!-- (PROYEK BARU: SUHU, CAHAYA, TRAFFIC LIGHT) -->
    <!-- ========================================== -->
    <div class="page">
        <div>
            <!-- Header -->
            <div class="page-header">
                <div class="header-brand">
                    <span class="dot"></span>
                    <span>Dewan Mochamad Pratama &bull; Dokumen Portofolio Resmi</span>
                </div>
                <div class="header-tag">Halaman 2 dari 5 &bull; Showcase Proyek Unggulan I</div>
            </div>

            <!-- Proyek Banner -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:5px;">
                <div>
                    <span class="badge badge-emerald" style="margin-bottom:2px;">Proyek Rekayasa Perangkat Keras &bull; IoT &amp; Embedded Systems (2026)</span>
                    <h2 style="font-size:12pt; color:#0f172a; line-height:1.2;">IoT Multi-Sensor Smart Environment &amp; 4-Stage Traffic Light Alert System</h2>
                    <div style="font-size:8pt; font-weight:700; color:#2563eb;">Sistem Telemetri Suhu, Kelembapan, dan Deteksi Cahaya Terintegrasi dengan LCD 16x2 I2C &amp; Visual Andon Alert</div>
                </div>
                <div style="text-align:right;">
                    <span class="badge badge-blue">Hardware Assembly Aktif</span>
                    <div style="font-size:7.2pt; color:#64748b; margin-top:2px;">Platform: ESP32 / Arduino C++</div>
                </div>
            </div>

            <!-- Overview Box -->
            <div class="card card-highlight" style="margin-bottom:6px; font-size:7.9pt; line-height:1.32; text-align:justify;">
                <strong>Ikhtisar Rekayasa:</strong> Sistem stasiun telemetri lingkungan dan keselamatan kerja cerdas yang dirancang untuk memantau suhu, kelembapan udara, serta intensitas cahaya ambien secara simultan. Menggunakan mikrokontroler <strong>ESP32 32-bit Xtensa Dual-Core</strong> berkecepatan tinggi, sistem mengolah data sensor suhu/kelembapan <strong>DHT</strong> dan sensor cahaya <strong>LDR (Light Dependent Resistor)</strong>, menampilkan metrik pengukuran real-time pada layar <strong>LCD 16x2 dengan antarmuka I2C</strong>, serta memicu <strong>modul lampu Traffic Light 4-Warna (Merah, Kuning, Hijau, Biru)</strong> secara otomatis berdasarkan ambang batas termal bertingkat (*multi-stage thermal logic*).
            </div>

            <!-- Matriks Logika Traffic Light 4 Level -->
            <div class="section-heading">
                ${icons.chip} <span>Matriks Logika Kontrol Suhu &amp; Sinyal Indikator Traffic Light 4-Warna</span>
            </div>
            <table class="spec-table" style="margin-bottom:6px;">
                <thead>
                    <tr>
                        <th style="width:16%;">Rentang Suhu (°C)</th>
                        <th style="width:16%;">Klasifikasi Kondisi</th>
                        <th style="width:22%;">Status Lampu Traffic Light</th>
                        <th style="width:23%;">Tampilan Layar LCD 16x2</th>
                        <th style="width:23%;">Respons Otomasi &amp; Industri</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background:#fef2f2;">
                        <td><strong>&gt; 25 °C</strong></td>
                        <td><span class="badge badge-rose" style="font-size:6.8pt;">Suhu Tinggi (Hot Alert)</span></td>
                        <td><span style="color:#dc2626; font-weight:800;">🔴 LAMPU MERAH</span> (Solid)</td>
                        <td><code>T: [XX]°C  H: [XX]%<br/>STATUS: PANAS/ALERT!</code></td>
                        <td>Peringatan bahaya *overheat*; rekomendasi pemicu kipas/exhaust darurat.</td>
                    </tr>
                    <tr style="background:#fffbeb;">
                        <td><strong>20 °C &ndash; 25 °C</strong></td>
                        <td><span class="badge badge-amber" style="font-size:6.8pt;">Hangat (Moderate/Normal)</span></td>
                        <td><span style="color:#d97706; font-weight:800;">🟡 LAMPU KUNING</span> (Solid)</td>
                        <td><code>T: [XX]°C  H: [XX]%<br/>STATUS: HANGAT/NORMAL</code></td>
                        <td>Kondisi suhu ruang kerja reguler; pemantauan fluktuasi secara berkala.</td>
                    </tr>
                    <tr style="background:#ecfdf5;">
                        <td><strong>15 °C &ndash; 20 °C</strong></td>
                        <td><span class="badge badge-emerald" style="font-size:6.8pt;">Sejuk (Comfort / Optimal)</span></td>
                        <td><span style="color:#059669; font-weight:800;">🟢 LAMPU HIJAU</span> (Solid)</td>
                        <td><code>T: [XX]°C  H: [XX]%<br/>STATUS: SUHU OPTIMAL</code></td>
                        <td>Rentang suhu paling ideal untuk kenyamanan kerja dan operasional mesin.</td>
                    </tr>
                    <tr style="background:#eff6ff;">
                        <td><strong>0 °C &ndash; 15 °C</strong></td>
                        <td><span class="badge badge-blue" style="font-size:6.8pt;">Dingin (Cool / Low Temp)</span></td>
                        <td><span style="color:#2563eb; font-weight:800;">🔵 LAMPU BIRU</span> (Solid)</td>
                        <td><code>T: [XX]°C  H: [XX]%<br/>STATUS: SUHU DINGIN</code></td>
                        <td>Peringatan suhu dingin; mitigasi kondensasi uap air pada komponen kelistrikan.</td>
                    </tr>
                </tbody>
            </table>

            <!-- Sub-Sistem Sensor Cahaya LDR & LCD Display -->
            <div class="section-heading">
                ${icons.sun} <span>Sub-Sistem Deteksi Cahaya Ambien (LDR) &amp; Display LCD 16x2 I2C</span>
            </div>
            <div class="grid-2" style="margin-bottom:6px;">
                <div class="card" style="font-size:7.8pt;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                        <strong style="color:#0f172a;">1. Logika Sensor Cahaya LDR (Photodiode):</strong>
                        <span class="badge badge-amber">Analog to Digital</span>
                    </div>
                    <ul class="checklist">
                        <li>
                            ${icons.check}
                            <span><strong>Pendeteksian Foton Real-Time:</strong> Menggunakan sirkuit pembagi tegangan (*voltage divider*) LDR yang dihubungkan ke pin ADC ESP32.</span>
                        </li>
                        <li>
                            ${icons.check}
                            <span><strong>Status Deteksi Cahaya Aktif:</strong> Saat cahaya menyinari sensor di atas nilai kalibrasi ambang (*threshold*), sistem mengonfirmasi status bahwa sumber cahaya aktif.</span>
                        </li>
                        <li>
                            ${icons.check}
                            <span><strong>Feedback Visual LCD:</strong> Baris kedua LCD 16x2 secara otomatis menampilkan: <code>Cahaya: AKTIF (ON)</code> ketika terang, dan <code>Cahaya: GELAP (OFF)</code> ketika redup.</span>
                        </li>
                    </ul>
                </div>

                <div class="card" style="font-size:7.8pt;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                        <strong style="color:#0f172a;">2. Layar LCD 16x2 dengan Komunikasi I2C:</strong>
                        <span class="badge badge-indigo">Bus 2-Kawat</span>
                    </div>
                    <ul class="checklist">
                        <li>
                            ${icons.check}
                            <span><strong>Efisiensi Pin Mikrokontroler:</strong> Modul PCF8574 I2C adapter memungkinkan layar beroperasi hanya dengan 2 jalur data (SDA D21 &amp; SCL D22), menghemat GPIO ESP32.</span>
                        </li>
                        <li>
                            ${icons.check}
                            <span><strong>Tampilan Informasi Terpadu:</strong> Menampilkan pembacaan suhu (°C), kelembapan (%RH), dan status sensor cahaya secara bergantian atau simultan tanpa *flicker*.</span>
                        </li>
                        <li>
                            ${icons.check}
                            <span><strong>Potensiometer Kontras:</strong> Kalibrasi kejelasan teks di lingkungan pencahayaan pabrik yang bervariasi.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Arsitektur Hardware & Relevansi Industri (Honda / Manufaktur) -->
            <div class="section-heading">
                ${icons.box} <span>Spesifikasi Pinout Hardware &amp; Relevansi Manufaktur Otomotif</span>
            </div>
            <div class="grid-2">
                <div class="card" style="font-size:7.7pt;">
                    <strong style="color:#0f172a; display:block; margin-bottom:2px;">Pemetaan Pinout Sirkuit (Wiring Map):</strong>
                    <table class="spec-table" style="font-size:7.1pt;">
                        <tr><th style="width:35%;">Komponen</th><th style="width:25%;">Pin ESP32</th><th>Deskripsi Fungsi</th></tr>
                        <tr><td><strong>Sensor Suhu DHT</strong></td><td>GPIO D4</td><td>Data digital suhu (°C) &amp; kelembapan (%RH)</td></tr>
                        <tr><td><strong>Sensor Cahaya LDR</strong></td><td>GPIO D34 (ADC1)</td><td>Input analog intensitas cahaya ambien</td></tr>
                        <tr><td><strong>Display LCD 16x2 I2C</strong></td><td>GPIO D21 (SDA), D22 (SCL)</td><td>Komunikasi data 2-kawat display metrik</td></tr>
                        <tr><td><strong>LED Merah (>25°C)</strong></td><td>GPIO D19</td><td>Sinyal peringatan panas (Hot Warning)</td></tr>
                        <tr><td><strong>LED Kuning (20-25°C)</strong></td><td>GPIO D18</td><td>Sinyal kondisi hangat/moderat (Moderate)</td></tr>
                        <tr><td><strong>LED Hijau (15-20°C)</strong></td><td>GPIO D5</td><td>Sinyal kondisi suhu optimal (Comfort)</td></tr>
                        <tr><td><strong>LED Biru (0-15°C)</strong></td><td>GPIO D17</td><td>Sinyal peringatan dingin (Cold Warning)</td></tr>
                    </table>
                </div>

                <div class="card" style="font-size:7.7pt; line-height:1.27;">
                    <strong style="color:#0f172a; display:block; margin-bottom:2px;">Relevansi Industri Manufaktur &amp; Pabrik Otomotif:</strong>
                    <ul class="checklist">
                        <li>
                            ${icons.check}
                            <span><strong>Visual Andon Management:</strong> Lampu traffic light berfungsi sebagai indikator visual 360° yang memudahkan operator lini perakitan pabrik mengetahui status lingkungan dari jarak jauh.</span>
                        </li>
                        <li>
                            ${icons.check}
                            <span><strong>Quality Control Ruang Material Sensitif:</strong> Pengawasan suhu ketat untuk area penyimpanan cat bodi mobil, ruang server TI pabrik, dan gudang bahan kimia agar tidak rusak.</span>
                        </li>
                        <li>
                            ${icons.check}
                            <span><strong>Otomasi Efisiensi Energi:</strong> Sensor LDR dapat diekspansi untuk mematikan lampu penerangan lorong gudang secara otomatis saat cahaya matahari memadai.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="page-footer">
            <span>Dokumen Portofolio Resmi &bull; Dewan Mochamad Pratama</span>
            <span>Live Portfolio: <a href="https://dewan-portofolio-delta.vercel.app/" target="_blank">dewan-portofolio-delta.vercel.app</a></span>
            <span>Halaman 2 dari 5</span>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- HALAMAN 3: PROYEK 2 - IOT SMART PARKING    -->
    <!-- ========================================== -->
    <div class="page">
        <div>
            <!-- Header -->
            <div class="page-header">
                <div class="header-brand">
                    <span class="dot"></span>
                    <span>Dewan Mochamad Pratama &bull; Dokumen Portofolio Resmi</span>
                </div>
                <div class="header-tag">Halaman 3 dari 5 &bull; Showcase Proyek Unggulan II</div>
            </div>

            <!-- Proyek Banner -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                <div>
                    <span class="badge badge-emerald" style="margin-bottom:3px;">Proyek Rekayasa Perangkat Keras &bull; IoT &amp; Embedded Systems (2026)</span>
                    <h2 style="font-size:12.5pt; color:#0f172a; line-height:1.2;">IoT Smart Car Reverse Parking Sensor System</h2>
                    <div style="font-size:8.2pt; font-weight:700; color:#2563eb;">Sistem Asistensi Parkir &amp; Mundur Mobil Cerdas Berbasis Mikrokontroler ESP32 32-bit</div>
                </div>
                <div style="text-align:right;">
                    <span class="badge badge-blue">Hardware Prototype Aktif</span>
                    <div style="font-size:7.2pt; color:#64748b; margin-top:2px;">Platform: ESP32 / Arduino C++</div>
                </div>
            </div>

            <!-- Overview Box -->
            <div class="card card-highlight" style="margin-bottom:7px; font-size:8pt; line-height:1.33; text-align:justify;">
                <strong>Ikhtisar Rekayasa:</strong> Sistem asistensi keselamatan manuver mundur kendaraan yang dirancang untuk mengeliminasi *blind spot* pengemudi secara real-time. Menggunakan mikrokontroler <strong>ESP32 32-bit Xtensa Dual-Core</strong> yang dipadukan dengan transduser ultrasonik <strong>HC-SR04</strong>, sistem menghitung jarak rintangan secara akurat berdasarkan kecepatan rambat suara, memvisualisasikan metrik pada layar <strong>LCD Crystal 16x2</strong>, memicu <strong>lampu LED 3 warna</strong> sesuai zonasi risiko, serta memodulasikan <strong>frekuensi audio buzzer (PWM)</strong> adaptif seiring mendekatnya halangan.
            </div>

            <!-- Diagram Alur & Zonasi Jarak (Tabel Spesifikasi Teknis) -->
            <div class="section-heading">
                ${icons.chip} <span>Matriks Logika Zonasi Jarak &amp; Sistem Peringatan Multimodal</span>
            </div>
            <table class="spec-table" style="margin-bottom:7px;">
                <thead>
                    <tr>
                        <th style="width:18%;">Zona Jarak Halangan</th>
                        <th style="width:14%;">Status Risiko</th>
                        <th style="width:20%;">Indikator Visual LED</th>
                        <th style="width:23%;">Peringatan Akustik Buzzer</th>
                        <th style="width:25%;">Tampilan Layar LCD 16x2</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>&gt; 80 cm</strong></td>
                        <td><span class="badge badge-emerald">Aman (Safe)</span></td>
                        <td>LED Hijau Menyala Solid</td>
                        <td>Beep lambat (Interval 1.000 ms / 1 Hz)</td>
                        <td><code>JARAK: [XX] cm<br/>STATUS: AMAN</code></td>
                    </tr>
                    <tr>
                        <td><strong>30 cm &ndash; 80 cm</strong></td>
                        <td><span class="badge badge-amber">Waspada (Caution)</span></td>
                        <td>LED Kuning Menyala Solid</td>
                        <td>Beep sedang (Interval 250 ms / 4 Hz)</td>
                        <td><code>JARAK: [XX] cm<br/>STATUS: WASPADA</code></td>
                    </tr>
                    <tr>
                        <td><strong>15 cm &ndash; 30 cm</strong></td>
                        <td><span class="badge badge-blue" style="color:#b91c1c; background:#fef2f2; border-color:#fecaca;">Bahaya (Hazard)</span></td>
                        <td>LED Merah Menyala Solid</td>
                        <td>Beep sangat rapat (Interval 100 ms / 10 Hz)</td>
                        <td><code>JARAK: [XX] cm<br/>STATUS: BAHAYA!</code></td>
                    </tr>
                    <tr style="background:#fff1f2;">
                        <td><strong>&lt; 15 cm (Batas Kritis)</strong></td>
                        <td><span class="badge badge-slate" style="background:#991b1b; color:#ffffff;">Kritis / Stop</span></td>
                        <td>LED Merah Berkedip Cepat (Strobe)</td>
                        <td><strong>Bunyi KONTINU (Tanpa Jeda / 0 ms)</strong></td>
                        <td><code>JARAK: &lt;15 cm!<br/>*** STOP! CRITICAL ***</code></td>
                    </tr>
                </tbody>
            </table>

            <!-- Arsitektur Hardware & Komponen Kunci -->
            <div class="section-heading">
                ${icons.code} <span>Arsitektur Perangkat Keras &amp; Firmware Berbasis C++</span>
            </div>
            <div class="grid-2" style="margin-bottom:7px;">
                <div class="card" style="font-size:7.8pt;">
                    <strong style="color:#0f172a; display:block; margin-bottom:3px;">Komponen Fisik &amp; Spesifikasi Pinout:</strong>
                    <ul class="checklist">
                        <li>
                            ${icons.check}
                            <span><strong>MCU ESP32 (Xtensa LX6):</strong> Frekuensi clock hingga 240 MHz, 520 KB SRAM, respons mikrodik detik.</span>
                        </li>
                        <li>
                            ${icons.check}
                            <span><strong>Transduser HC-SR04:</strong> Pin Trigger (D5) &amp; Echo (D18). Rentang deteksi efektif 2 cm s.d. 400 cm.</span>
                        </li>
                        <li>
                            ${icons.check}
                            <span><strong>Layar LCD 16x2 I2C:</strong> Komunikasi 2-kawat (SDA D21, SCL D22) hemat pin I/O mikrokontroler.</span>
                        </li>
                        <li>
                            ${icons.check}
                            <span><strong>Cluster LED 3-Warna:</strong> D19 (Merah), D2 (Kuning), D4 (Hijau) dengan resistor proteksi 220&Omega;.</span>
                        </li>
                        <li>
                            ${icons.check}
                            <span><strong>Piezo Buzzer Transistor Driver:</strong> Pin D15 dimodulasikan sinyal gelombang suara proporsional.</span>
                        </li>
                    </ul>
                </div>

                <div class="card" style="font-size:7.8pt;">
                    <strong style="color:#0f172a; display:block; margin-bottom:3px;">Prinsip &amp; Formula Kalkulasi Fisika:</strong>
                    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px; padding:4px 6px; font-family:monospace; font-size:7.3pt; margin-bottom:4px;">
                        // Rumus Waktu Pantul ke Jarak Metrik:<br/>
                        Distance (cm) = (Duration_microseconds * 0.0343) / 2;<br/>
                        // Akurasi tinggi dengan toleransi deviasi &lt; 1 cm.
                    </div>
                    <ul class="checklist">
                        <li>
                            ${icons.check}
                            <span><strong>Non-Blocking Timing Architecture:</strong> Menghilangkan fungsi <code>delay()</code>, menggantinya dengan evaluasi timer <code>millis()</code> non-blocking sehingga pembacaan sensor bebas lag (*zero jitter*).</span>
                        </li>
                        <li>
                            ${icons.check}
                            <span><strong>Kesiapan Telemetri IoT (IoT-Ready):</strong> Arsitektur modular siap diekspansi untuk pengiriman data jarak nirkabel melalui protokol MQTT/HTTP via Wi-Fi ESP32.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Manfaat Industri & Implementasi Lapangan -->
            <div class="section-heading">
                ${icons.box} <span>Aplikasi Terapan pada Industri Manufaktur &amp; Otomotif</span>
            </div>
            <div class="card" style="font-size:7.8pt; line-height:1.32;">
                <div class="grid-3">
                    <div>
                        <strong style="color:#0f172a; display:block; margin-bottom:2px;">1. Truk &amp; Forklift Pabrik</strong>
                        <p style="color:#475569; font-size:7.4pt;">Mengeliminasi blind spot di dermaga muat barang (*loading dock*) pergudangan guna mencegah tabrakan palet dan rak tinggi.</p>
                    </div>
                    <div>
                        <strong style="color:#0f172a; display:block; margin-bottom:2px;">2. Otomasi Robotika / AGV</strong>
                        <p style="color:#475569; font-size:7.4pt;">Sebagai sensor navigasi pencegah benturan (*obstacle collision prevention*) pada robot pembawa muatan di lorong sempit gudang.</p>
                    </div>
                    <div>
                        <strong style="color:#0f172a; display:block; margin-bottom:2px;">3. Mobil Penumpang</strong>
                        <p style="color:#475569; font-size:7.4pt;">Solusi asistensi parkir mandiri hemat biaya (*cost-efficient retrofit*) untuk armada kendaraan operasional perusahaan.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="page-footer">
            <span>Dokumen Portofolio Resmi &bull; Dewan Mochamad Pratama</span>
            <span>Simulasi Proyek: <a href="https://dewan-portofolio-delta.vercel.app/" target="_blank">dewan-portofolio-delta.vercel.app</a></span>
            <span>Halaman 3 dari 5</span>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- HALAMAN 4: PROYEK 3 & 4 (WEB & AI VISION)  -->
    <!-- ========================================== -->
    <div class="page">
        <div>
            <!-- Header -->
            <div class="page-header">
                <div class="header-brand">
                    <span class="dot"></span>
                    <span>Dewan Mochamad Pratama &bull; Dokumen Portofolio Resmi</span>
                </div>
                <div class="header-tag">Halaman 4 dari 5 &bull; Showcase Proyek Unggulan III &amp; IV</div>
            </div>

            <!-- PROYEK 3: KOSAN MURAH PT MIM -->
            <div style="margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:3px;">
                    <div>
                        <span class="badge badge-emerald" style="margin-bottom:2px;">Proyek Web Produksi Komersial &bull; Bisnis Riil (Live)</span>
                        <h2 style="font-size:11.5pt; color:#0f172a; line-height:1.15;">Kosan Murah PT MIM &mdash; Platform Properti &amp; Ekosistem Sewa</h2>
                        <div style="font-size:7.8pt; font-weight:700; color:#2563eb;">Full-Stack Web Engineering: Next.js 16, TypeScript, Tailwind CSS, Vercel &amp; Google AdSense</div>
                    </div>
                    <div style="text-align:right;">
                        <span class="badge badge-blue">Domain Resmi Live</span>
                        <div style="font-size:7.2pt; color:#64748b; margin-top:2px;">
                            <a href="https://kosan.portalmediakita.com/" target="_blank" style="color:#2563eb; font-weight:700;">kosan.portalmediakita.com</a>
                        </div>
                    </div>
                </div>

                <div class="card card-highlight" style="font-size:7.8pt; line-height:1.3; text-align:justify; margin-bottom:4px;">
                    <strong>Deskripsi &amp; Hasil Bisnis:</strong> Platform web resmi untuk unit usaha sewa kontrakan "Kosan Murah PT MIM" yang melayani ratusan pekerja pabrik di kawasan industri Klari, Karawang Timur (tepat di belakang PT Multi Indomandiri / Wings Group). Sistem telah beroperasi secara live, terindeks di mesin pencari Google, terverifikasi resmi pada Google Maps, serta telah memenuhi standar monetisasi Google AdSense (otorisasi file <code>ads.txt</code> dan tata kelola privasi transparan).
                </div>

                <div class="grid-2">
                    <div class="card" style="font-size:7.6pt;">
                        <strong style="color:#0f172a; display:block; margin-bottom:2px;">Fitur Kunci &amp; Arsitektur Web:</strong>
                        <ul class="checklist">
                            <li>
                                ${icons.check}
                                <span><strong>Katalog Kamar Dinamis:</strong> Visualisasi 5 tipe kamar (A2 AC, A1 Kipas, B, D, C Hemat) dengan rincian fasilitas lengkap dan status ketersediaan real-time.</span>
                            </li>
                            <li>
                                ${icons.check}
                                <span><strong>Portal Layanan Laundry (/laundry):</strong> Integrasi langsung dengan mitra resmi cucian kiloan (M. Ilyas Laundry) dilengkapi transisi halus *Framer Motion*.</span>
                            </li>
                            <li>
                                ${icons.check}
                                <span><strong>Direct WhatsApp Reservation:</strong> Otomasi pemicu pesan teks survei lokasi langsung ke pengelola properti tanpa perantara calo.</span>
                            </li>
                        </ul>
                    </div>

                    <div class="card" style="font-size:7.6pt;">
                        <strong style="color:#0f172a; display:block; margin-bottom:2px;">Keunggulan Teknis &amp; Dampak Riil:</strong>
                        <ul class="checklist">
                            <li>
                                ${icons.check}
                                <span><strong>Kinerja Serverless Berkecepatan Tinggi:</strong> Dibangun dengan arsitektur Next.js 16 App Router dengan skor performa PageSpeed prima dan responsif multi-device.</span>
                            </li>
                            <li>
                                ${icons.check}
                                <span><strong>Kepatuhan Standar Industri (E-E-A-T):</strong> Halaman Tentang Kami, Kebijakan Privasi, dan Syarat Ketentuan yang membangun kepercayaan tinggi calon penghuni.</span>
                            </li>
                            <li>
                                ${icons.check}
                                <span><strong>Dampak Langsung:</strong> Tingkat okupansi hunian stabil dan transparansi biaya (listrik token mandiri &amp; gratis air bersih).</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- PROYEK 4: FACE RECOGNITION AI -->
            <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:3px;">
                    <div>
                        <span class="badge badge-indigo" style="margin-bottom:2px;">Proyek Kecerdasan Buatan &bull; Computer Vision &amp; Biometrics</span>
                        <h2 style="font-size:11.5pt; color:#0f172a; line-height:1.15;">Sistem Presensi &amp; Pengenalan Wajah Otomatis (Face Recognition)</h2>
                        <div style="font-size:7.8pt; font-weight:700; color:#6d28d9;">Teknologi: Python 3, OpenCV (Open Source Computer Vision), Tkinter Desktop GUI, NumPy</div>
                    </div>
                    <div style="text-align:right;">
                        <span class="badge badge-slate">Desktop AI Software</span>
                        <div style="font-size:7.2pt; color:#64748b; margin-top:2px;">
                            <a href="https://github.com/dewanmochpratama23-sys" target="_blank" style="color:#2563eb; font-weight:700;">GitHub Repository</a>
                        </div>
                    </div>
                </div>

                <div class="card" style="font-size:7.8pt; line-height:1.3; text-align:justify; margin-bottom:4px; background:#faf5ff; border-color:#e9d5ff;">
                    <strong>Deskripsi &amp; Konsep Solusi:</strong> Perangkat lunak AI berbasis desktop yang mampu mendeteksi wajah secara real-time melalui kamera digital, mengekstraksi titik koordinat fitur wajah (*facial landmark embeddings*), melatih dataset model pengenalan secara mandiri, dan mengidentifikasi identitas pengguna dengan tingkat akurasi tinggi untuk kebutuhan presensi karyawan otomatis tanpa sentuhan (*touchless biometric attendance*).
                </div>

                <div class="grid-2">
                    <div class="card" style="font-size:7.6pt;">
                        <strong style="color:#0f172a; display:block; margin-bottom:2px;">Alur Kerja Pipeline Machine Vision:</strong>
                        <ul class="checklist">
                            <li>
                                ${icons.check}
                                <span><strong>1. Video Capture Real-Time:</strong> Inisialisasi streaming kamera webcam frame-by-frame dengan konversi ruang warna grayscale berkecepatan tinggi.</span>
                            </li>
                            <li>
                                ${icons.check}
                                <span><strong>2. Facial Feature Detection:</strong> Segmentasi wajah secara otomatis menggunakan Haar Cascade Classifier / Dlib HOG detector.</span>
                            </li>
                            <li>
                                ${icons.check}
                                <span><strong>3. Automated Dataset Gathering:</strong> Pengambilan sampel wajah pengguna secara terstruktur (puluhan sudut pencahayaan) ke dalam direktori data.</span>
                            </li>
                            <li>
                                ${icons.check}
                                <span><strong>4. Model Training &amp; Matching:</strong> Melatih model pengenal wajah mandiri dan membandingkan matriks histogram untuk menghasilkan skor keyakinan (*confidence level*).</span>
                            </li>
                        </ul>
                    </div>

                    <div class="card" style="font-size:7.6pt;">
                        <strong style="color:#0f172a; display:block; margin-bottom:2px;">Keunggulan &amp; Nilai Praktis:</strong>
                        <ul class="checklist">
                            <li>
                                ${icons.check}
                                <span><strong>Antarmuka Ramah Pengguna (GUI):</strong> Dibangun menggunakan framework Tkinter desktop yang memudahkan staf operasional mendaftarkan karyawan baru dalam beberapa klik.</span>
                            </li>
                            <li>
                                ${icons.check}
                                <span><strong>Kecepatan Identifikasi Cepat:</strong> Proses inferensi pengenalan berlangsung dalam waktu kurang dari 500 ms per wajah yang terdeteksi.</span>
                            </li>
                            <li>
                                ${icons.check}
                                <span><strong>Pencegahan Kecurangan (Anti-Fraud):</strong> Mengurangi risiko titip presensi (*buddy punching*) secara signifikan di area operasional pabrik atau gudang.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="page-footer">
            <span>Dokumen Portofolio Resmi &bull; Dewan Mochamad Pratama</span>
            <span>Repositori Kode: <a href="https://github.com/dewanmochpratama23-sys" target="_blank">github.com/dewanmochpratama23-sys</a></span>
            <span>Halaman 4 dari 5</span>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- HALAMAN 5: PROYEK 5, OPERASIONAL & PENUTUP -->
    <!-- ========================================== -->
    <div class="page">
        <div>
            <!-- Header -->
            <div class="page-header">
                <div class="header-brand">
                    <span class="dot"></span>
                    <span>Dewan Mochamad Pratama &bull; Dokumen Portofolio Resmi</span>
                </div>
                <div class="header-tag">Halaman 5 dari 5 &bull; Mobile Engineering &amp; Operational Excellence</div>
            </div>

            <!-- PROYEK 5: MOBILE PORTFOLIO APP -->
            <div style="margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:3px;">
                    <div>
                        <span class="badge badge-blue" style="margin-bottom:2px;">Proyek Rekayasa Aplikasi Mobile &bull; Cross-Platform (Android &amp; iOS)</span>
                        <h2 style="font-size:11.5pt; color:#0f172a; line-height:1.15;">Interactive Mobile Portfolio &amp; Digital Identity App</h2>
                        <div style="font-size:7.8pt; font-weight:700; color:#1d4ed8;">Teknologi: React Native, Expo SDK 57, JavaScript ES6+, Native Deep Linking</div>
                    </div>
                    <div style="text-align:right;">
                        <span class="badge badge-emerald">Mobile Native</span>
                        <div style="font-size:7.2pt; color:#64748b; margin-top:2px;">
                            <a href="https://github.com/dewanmochpratama23-sys/dewan-portofolio" target="_blank" style="color:#2563eb; font-weight:700;">GitHub Repo</a>
                        </div>
                    </div>
                </div>

                <div class="card" style="font-size:7.8pt; line-height:1.3; text-align:justify; margin-bottom:4px; background:#f0fdfa; border-color:#99f6e4;">
                    <strong>Deskripsi Proyek:</strong> Aplikasi mobile native yang dirancang khusus untuk mempresentasikan profil rekayasa, karya proyek, dan keahlian teknis secara langsung di smartphone Android dan iOS. Dibangun menggunakan React Native dan Expo framework yang memberikan pengalaman pengguna sekelas aplikasi enterprise dengan performa halus 60 FPS dan dukungan navigasi sentuh interaktif.
                </div>

                <div class="grid-2">
                    <div class="card" style="font-size:7.6pt;">
                        <strong style="color:#0f172a; display:block; margin-bottom:2px;">Arsitektur &amp; Fitur Unggulan Mobile:</strong>
                        <ul class="checklist">
                            <li>
                                ${icons.check}
                                <span><strong>Single Codebase Multi-Platform:</strong> Satu basis kode React Native yang terkompilasi optimal untuk platform Android maupun iOS tanpa perbedaan tampilan antarmuka.</span>
                            </li>
                            <li>
                                ${icons.check}
                                <span><strong>Sistem Native Deep-Linking:</strong> Integrasi langsung protokol <code>tel:</code>, <code>mailto:</code>, dan <code>whatsapp://</code> untuk komunikasi instan dengan klien.</span>
                            </li>
                        </ul>
                    </div>

                    <div class="card" style="font-size:7.6pt;">
                        <strong style="color:#0f172a; display:block; margin-bottom:2px;">Inovasi Tooling Pengembang:</strong>
                        <ul class="checklist">
                            <li>
                                ${icons.check}
                                <span><strong>Script Auto-IP Discovery (start.js):</strong> Otomasi deteksi alamat IP antarmuka jaringan lokal untuk mempermudah koneksi debugging Expo Go di jaringan Wi-Fi apapun.</span>
                            </li>
                            <li>
                                ${icons.check}
                                <span><strong>Responsive Screen Adaptation:</strong> Layout responsif yang secara otomatis beradaptasi dengan dimensi berbagai tipe layar HP.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- KOMPETENSI OPERASIONAL INDUSTRI & DISIPLIN GUDANG -->
            <div class="section-heading">
                ${icons.box} <span>Keahlian Operasional Industri &amp; Manajemen Logistik (PT Multi Indomandiri / Wings Group)</span>
            </div>
            <div class="card card-highlight" style="margin-bottom:8px; font-size:7.8pt; line-height:1.3;">
                <p style="text-align:justify; margin-bottom:4px;">
                    Pengalaman lapangan selama lebih dari <strong>4 tahun di lingkungan manufaktur FMCG berskala besar</strong> membentuk karakter kerja yang sangat disiplin, teliti terhadap data angka, dan terbiasa bekerja di bawah target ketat.
                </p>
                <div class="grid-3" style="gap:6px;">
                    <div style="background:#ffffff; padding:4px 6px; border-radius:4px; border:1px solid #e2e8f0;">
                        <strong style="color:#0f172a; display:block; font-size:7.6pt;">Kontrol Inventaris &amp; WMS</strong>
                        <span style="font-size:7.2pt; color:#475569;">Pencatatan data alur barang masuk/keluar, pelacakan lot batch produksi, dan audit stok opname berkala dengan akurasi 99%+.</span>
                    </div>
                    <div style="background:#ffffff; padding:4px 6px; border-radius:4px; border:1px solid #e2e8f0;">
                        <strong style="color:#0f172a; display:block; font-size:7.6pt;">Penerapan Budaya 5S / 5R</strong>
                        <span style="font-size:7.2pt; color:#475569;">Penerapan konsisten Seiri, Seiton, Seiso, Seiketsu, Shitsuke guna menciptakan area kerja yang rapi, efisien, dan bebas hambatan.</span>
                    </div>
                    <div style="background:#ffffff; padding:4px 6px; border-radius:4px; border:1px solid #e2e8f0;">
                        <strong style="color:#0f172a; display:block; font-size:7.6pt;">Keselamatan Kerja (K3)</strong>
                        <span style="font-size:7.2pt; color:#475569;">Kepatuhan ketat terhadap SOP keselamatan kerja operasional, penanganan alat angkut berat, dan mitigasi resiko di area kerja gudang.</span>
                    </div>
                </div>
            </div>

            <!-- PERNYATAAN PENUTUP & KOMITMEN PROFESIONAL -->
            <div class="section-heading">
                ${icons.star} <span>Komitmen Profesional &amp; Kesiapan Kontribusi</span>
            </div>
            <div class="card" style="background:#0f172a; color:#ffffff; font-size:7.8pt; line-height:1.32; padding:8px 10px;">
                <p style="text-align:justify; margin-bottom:6px; color:#e2e8f0;">
                    Saya berdedikasi untuk memberikan kontribusi nyata bagi perusahaan dengan mengintegrasikan <strong>kecakapan rekayasa perangkat lunak dan sistem IoT modern</strong> dengan <strong>etos kerja tangguh operasional industri manufaktur</strong>. Terbuka untuk peluang karir di bidang <em>Software Engineering, Web/Mobile Development, Embedded IoT Engineering, maupun peran Strategis Operasional &amp; Manajemen Logistik Pergudangan</em>.
                </p>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #334155; padding-top:5px; font-size:7.4pt;">
                    <div>
                        <span style="color:#94a3b8;">Kontak Resmi:</span>
                        <strong style="color:#38bdf8; margin-left:4px;">+62 823-1873-0894</strong> &bull; <strong style="color:#38bdf8;">dewanmochpratama23@gmail.com</strong>
                    </div>
                    <div>
                        <span style="color:#94a3b8;">Verifikasi Portofolio Online:</span>
                        <a href="https://dewan-portofolio-delta.vercel.app/" target="_blank" style="color:#60a5fa; text-decoration:underline; font-weight:700; margin-left:4px;">dewan-portofolio-delta.vercel.app</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="page-footer">
            <span>Dokumen Portofolio Resmi &bull; Dewan Mochamad Pratama</span>
            <span>Karawang, Jawa Barat &bull; Indonesia</span>
            <span>Halaman 5 dari 5</span>
        </div>
    </div>

</body>
</html>`;

// 4. Write HTML to Disk
const htmlPath = path.join(__dirname, 'portfolio_document.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('✓ Successfully wrote portfolio_document.html (5 Pages)');

// 5. Render HTML to PDF using Headless Edge (with --no-sandbox)
const outputPdf = path.join(__dirname, 'Portofolio_Dewan_Mochamad_Pratama.pdf');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

console.log('Generating 5-Page PDF using Microsoft Edge Headless...');
const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${outputPdf}`,
    fileUrl
];

try {
    const res = cp.spawnSync(edgePath, args, { encoding: 'utf8', timeout: 30000 });
    if (res.error) {
        console.warn('Edge spawn warning:', res.error.message);
    }
} catch (e) {
    console.warn('Caught Edge spawn error:', e.message);
}

// Check output
setTimeout(() => {
    if (fs.existsSync(outputPdf)) {
        const stats = fs.statSync(outputPdf);
        const pages = countPdfPages(outputPdf);
        console.log(`===============================================`);
        console.log(`✓ SUKSES! PDF Portofolio 5-Halaman Berhasil Dibuat:`);
        console.log(`  File: ${outputPdf}`);
        console.log(`  Ukuran: ${(stats.size / 1024).toFixed(1)} KB`);
        console.log(`  Jumlah Halaman: ${pages} Halaman`);
        console.log(`===============================================`);

        // Copy to CV_dan_Resume folder as well
        const destFolder = path.join(__dirname, 'CV_dan_Resume');
        if (fs.existsSync(destFolder)) {
            const destPdf = path.join(destFolder, 'Portofolio_Dewan_Mochamad_Pratama.pdf');
            fs.copyFileSync(outputPdf, destPdf);
            console.log(`✓ Salinan disimpan ke: ${destPdf}`);
        }
    } else {
        console.error('PDF file was not created at expected path');
    }
}, 1500);
