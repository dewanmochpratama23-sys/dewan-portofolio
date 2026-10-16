const os = require('os');

// Deteksi otomatis alamat IP Wi-Fi asli laptop (melewati IP VirtualBox / emulator)
function getRealWifiIP() {
  const interfaces = os.networkInterfaces();
  
  // Prioritas 1: Interface Wi-Fi / WLAN
  for (const name of Object.keys(interfaces)) {
    if (/wi-?fi|wlan|wireless/i.test(name)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  
  // Prioritas 2: Interface non-virtual
  for (const name of Object.keys(interfaces)) {
    if (!/virtual|vbox|vmware|loopback/i.test(name)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal && !iface.address.startsWith('192.168.56.')) {
          return iface.address;
        }
      }
    }
  }
  
  return '192.168.1.13';
}

const wifiIP = getRealWifiIP();
process.env.REACT_NATIVE_PACKAGER_HOSTNAME = wifiIP;

console.log('====================================================');
console.log(`📡 [Expo Auto-IP] Terkoneksi ke IP Wi-Fi: ${wifiIP}`);
console.log('====================================================\n');

// Teruskan argumen ke Expo CLI
require('./node_modules/expo/bin/cli');
