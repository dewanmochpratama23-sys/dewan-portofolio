const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Files required for static website deployment
const filesToDeploy = [
    'index.html',
    'cv.html',
    'dewan-foto.jpg',
    'Dewan_Mochamad_Pratama_CV.pdf'
];

filesToDeploy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(publicDir, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied: ${file} -> public/${file}`);
    } else {
        console.warn(`! Warning: ${file} not found at source.`);
    }
});

// Also sync CV_dan_Resume folder into public/CV_dan_Resume
const srcDocs = path.join(__dirname, 'CV_dan_Resume');
const destDocs = path.join(publicDir, 'CV_dan_Resume');
if (fs.existsSync(srcDocs)) {
    function copyFolderRecursiveSync(source, target) {
        if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
        const files = fs.readdirSync(source);
        files.forEach(file => {
            const curSource = path.join(source, file);
            const curTarget = path.join(target, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, curTarget);
            } else {
                fs.copyFileSync(curSource, curTarget);
            }
        });
    }
    copyFolderRecursiveSync(srcDocs, destDocs);
    console.log('✓ Synced: CV_dan_Resume folder -> public/CV_dan_Resume');
}

console.log('Static web portfolio build completed successfully! Output: public/');
