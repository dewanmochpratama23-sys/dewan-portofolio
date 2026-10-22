const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

if (!fs.existsSync(edgePath)) {
    console.error('Microsoft Edge not found at:', edgePath);
    process.exit(1);
}

function countPdfPages(pdfPath) {
    const buf = fs.readFileSync(pdfPath);
    const matches = buf.toString('latin1').match(/\/Type\s*\/Page\b/g);
    return matches ? matches.length : 0;
}

function renderHtmlToPdf(htmlFile, outputFile) {
    const htmlPath = path.resolve(__dirname, htmlFile);
    const pdfPath = path.resolve(__dirname, outputFile);
    const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

    console.log(`Generating PDF from ${htmlFile} -> ${outputFile}...`);

    const args = [
        '--headless=new',
        '--disable-gpu',
        '--no-pdf-header-footer',
        `--print-to-pdf=${pdfPath}`,
        fileUrl
    ];

    const res = cp.spawnSync(edgePath, args, { encoding: 'utf8', timeout: 30000 });
    if (res.error) {
        console.error('Error spawning Edge:', res.error);
        return false;
    }

    if (!fs.existsSync(pdfPath)) {
        console.error('Failed to create PDF:', pdfPath);
        return false;
    }

    const pages = countPdfPages(pdfPath);
    const stats = fs.statSync(pdfPath);
    console.log(`✓ Generated: ${outputFile} (${stats.size} bytes, ${pages} page(s))`);
    return { success: true, pages, size: stats.size };
}

console.log('=== RENDERING DOCUMENTS TO PDF ===');

// 1. Render CV
const cvResult = renderHtmlToPdf('template_cv_id.html', 'Dewan_Mochamad_Pratama_CV.pdf');

// 2. Render Resume
const resumeResult = renderHtmlToPdf('template_resume_id.html', 'Dewan_Mochamad_Pratama_Resume.pdf');

// Distribute to folders
const cvPdf = path.join(__dirname, 'Dewan_Mochamad_Pratama_CV.pdf');
const resumePdf = path.join(__dirname, 'Dewan_Mochamad_Pratama_Resume.pdf');

const destCvFolders = [
    path.join(__dirname, 'CV_dan_Resume', 'CV', 'Dewan_Mochamad_Pratama_CV.pdf'),
    path.join(__dirname, 'CV_dan_Resume', 'Dewan_Mochamad_Pratama_CV.pdf')
];

const destResumeFolders = [
    path.join(__dirname, 'CV_dan_Resume', 'Resume', 'Dewan_Mochamad_Pratama_Resume.pdf'),
    path.join(__dirname, 'CV_dan_Resume', 'Dewan_Mochamad_Pratama_Resume.pdf')
];

destCvFolders.forEach(dest => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(cvPdf, dest);
    console.log(`✓ Copied CV to: ${path.relative(__dirname, dest)}`);
});

destResumeFolders.forEach(dest => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(resumePdf, dest);
    console.log(`✓ Copied Resume to: ${path.relative(__dirname, dest)}`);
});

console.log('=== PDF GENERATION FINISHED ===');
