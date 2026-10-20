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

console.log('Static web portfolio build completed successfully! Output: public/');
