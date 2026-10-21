import React, { useState, useEffect, useRef } from 'react';
import { registerRootComponent } from 'expo';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  StatusBar,
  Linking,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';

// Safe Vector Icons import
let FontAwesome5;
let Ionicons;
try {
  const icons = require('@expo/vector-icons');
  FontAwesome5 = icons.FontAwesome5;
  Ionicons = icons.Ionicons;
} catch (e) {
  FontAwesome5 = null;
  Ionicons = null;
}

const SafeIcon = ({ name, size = 16, color = '#2563eb', fallback = '•' }) => {
  if (FontAwesome5) {
    const isBrand = ['github', 'linkedin', 'whatsapp', 'google', 'twitter', 'facebook'].includes(name);
    return <FontAwesome5 name={name} size={size} color={color} brand={isBrand} solid={!isBrand} />;
  }
  return <Text style={{ fontSize: size, color }}>{fallback}</Text>;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PROFILE_IMAGE = require('./dewan-foto.jpg');

export default function App() {
  // Theme State (Dark & Light Mode)
  const [isDark, setIsDark] = useState(false);

  // Biometric Face Scanner Simulation State & Animation
  const [isScanning, setIsScanning] = useState(false);
  const laserAnim = useRef(new Animated.Value(0)).current;

  // Guestbook State
  const [guestName, setGuestName] = useState('');
  const [guestRole, setGuestRole] = useState('Tamu Umum');
  const [guestMessage, setGuestMessage] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      name: 'Ir. Hendra Wijaya, M.Kom',
      role: 'Dosen Pembimbing / Penguji',
      message:
        'Struktur aplikasi dan portofolio React Native tersusun sangat rapi dan representatif. Implementasi proyek Face Recognition dan Mobile App membuktikan pemahaman rekayasa perangkat lunak yang matang.',
      time: 'Kemarin',
    },
    {
      id: '2',
      name: 'Fauzan Ramadhan',
      role: 'Rekan Mahasiswa',
      message:
        'Keren banget Mas Dewan! Tampilan clean ala Apple/Stripe sangat nyaman dibaca di HP, dan fitur simulasi pemindai wajahnya mantap.',
      time: '2 hari lalu',
    },
  ]);

  // Interactive Skill Token Animation
  const skillTokens = [
    'React Native', 'Expo', 'JavaScript', 'Python 3', 'OpenCV',
    'HTML5', 'Tailwind', 'Git', 'GitHub', 'VS Code'
  ];
  const [tokenPositions] = useState(
    skillTokens.map(() => new Animated.ValueXY({ x: 0, y: 0 }))
  );

  const bounceToken = (index) => {
    const randomY = -18 - Math.random() * 12;
    const randomX = (Math.random() - 0.5) * 20;

    Animated.sequence([
      Animated.timing(tokenPositions[index], {
        toValue: { x: randomX, y: randomY },
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(tokenPositions[index], {
        toValue: { x: 0, y: 0 },
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Trigger Face Scanner Simulation
  const handleScanFace = () => {
    if (isScanning) return;
    setIsScanning(true);
    laserAnim.setValue(0);

    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 66,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 }
    ).start(() => {
      setIsScanning(false);
      Alert.alert(
        '✅ Wajah Terverifikasi 100%',
        'Algoritma OpenCV Python mengidentifikasi: Dewan Mochamad Pratama (Teknik Informatika).'
      );
    });
  };

  // Open External Links
  const handleOpenLink = async (url, title = 'Tautan') => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Perhatian', `Tidak dapat membuka tautan ${title}: ${url}`);
      }
    } catch (error) {
      Alert.alert('Perhatian', `Gagal membuka ${title}: ${url}`);
    }
  };

  // Submit Comment
  const handleSendComment = () => {
    if (!guestName.trim() || !guestMessage.trim()) {
      Alert.alert('Perhatian', 'Mohon isi nama dan pesan Anda terlebih dahulu.');
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      name: guestName.trim(),
      role: guestRole,
      message: guestMessage.trim(),
      time: 'Baru saja',
    };

    setComments([newComment, ...comments]);
    setGuestName('');
    setGuestMessage('');
    Alert.alert('Terima Kasih! 🎉', 'Pesan Anda telah berhasil ditambahkan ke Buku Tamu Dewan.');
  };

  // Dynamic Theme Colors
  const theme = {
    bg: isDark ? '#090d16' : '#f8fafc',
    headerBg: isDark ? '#0f172a' : '#ffffff',
    cardBg: isDark ? '#111827' : '#ffffff',
    border: isDark ? '#1f2937' : '#e2e8f0',
    textMain: isDark ? '#f8fafc' : '#0f172a',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    subtleBg: isDark ? '#1f2937' : '#f1f5f9',
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.headerBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.headerBg} />

      {/* STICKY HEADER WITH DARK MODE TOGGLE */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <View style={styles.headerBrand}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>DP</Text>
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: theme.textMain }]}>Dewan M. Pratama</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>Informatics Engineering</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          {/* THEME TOGGLE BUTTON */}
          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: theme.subtleBg, borderColor: theme.border }]}
            onPress={() => setIsDark(!isDark)}
            activeOpacity={0.7}
          >
            <SafeIcon name={isDark ? 'sun' : 'moon'} size={14} color={isDark ? '#fbbf24' : '#0f172a'} fallback="🌓" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: theme.subtleBg, borderColor: theme.border }]}
            onPress={() => handleOpenLink('https://github.com/dewanmochpratama23-sys', 'GitHub')}
            activeOpacity={0.7}
          >
            <SafeIcon name="github" size={15} color={theme.textMain} fallback="GH" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtnWhatsApp}
            onPress={() => handleOpenLink('https://wa.me/6283137538544?text=Halo%20Dewan,%20saya%20melihat%20portofolio%20Anda', 'WhatsApp')}
            activeOpacity={0.7}
          >
            <SafeIcon name="whatsapp" size={14} color="#10b981" fallback="WA" />
            <Text style={styles.headerWhatsAppText}>Kontak</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN SCROLLABLE CONTENT */}
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: theme.bg }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. WELCOMING HERO CARD WITH BIOMETRIC SCANNER */}
        <View style={[styles.heroCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          {/* Status Badge */}
          <View style={[styles.statusRow, { borderBottomColor: theme.subtleBg }]}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusBadgeText}>Terbuka untuk Kolaborasi Tech</Text>
            </View>
            <Text style={[styles.academicTrackText, { color: theme.textMuted }]}>S1 Teknik Informatika</Text>
          </View>

          {/* Portrait Photo with Interactive Biometric Scanner */}
          <View style={styles.profileHeader}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleScanFace}
              style={[styles.avatarBorder, { borderColor: isScanning ? '#22d3ee' : theme.border }]}
            >
              <Image source={PROFILE_IMAGE} style={styles.avatarImage} resizeMode="cover" />
              {isScanning && (
                <View style={styles.scannerOverlay}>
                  <Animated.View
                    style={[
                      styles.scannerLaser,
                      { transform: [{ translateY: laserAnim }] },
                    ]}
                  />
                  <Text style={styles.scannerLiveText}>SCANNING CV</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.profileHeaderTexts}>
              <Text style={styles.heroPretitle}>PORTOFOLIO REKAYASA PERANGKAT LUNAK</Text>
              <Text style={[styles.heroTitle, { color: theme.textMain }]}>Dewan Mochamad Pratama</Text>
              <Text style={[styles.heroSubtitle, { color: theme.textMuted }]}>
                Panggilan: <Text style={{ fontWeight: '700', color: theme.textMain }}>Dewan / Tama</Text>
              </Text>
              <Text style={styles.roleHighlight}>Software & Mobile App Developer</Text>
            </View>
          </View>

          {/* Biometric Scan Trigger Button */}
          <TouchableOpacity
            style={[styles.btnScanMini, { backgroundColor: theme.subtleBg, borderColor: theme.border }]}
            onPress={handleScanFace}
            activeOpacity={0.8}
          >
            <SafeIcon name="expand" size={13} color="#2563eb" fallback="⚡" />
            <Text style={styles.btnScanMiniText}>
              {isScanning ? 'Sedang Memindai Biometrik 68-Pts...' : '⚡ Uji Simulasi Face Scanner AI'}
            </Text>
          </TouchableOpacity>

          {/* Narrative Bio */}
          <Text style={[styles.heroBio, { color: theme.textMuted }]}>
            Selamat datang di portofolio mobile resmi saya. Mahasiswa Teknik Informatika yang berfokus pada 
            rekayasa perangkat lunak modern, aplikasi mobile cross-platform, dan Computer Vision (Face Recognition) berbasis Python.
          </Text>

          {/* Quick Action Button Row */}
          <View style={styles.heroBtnRow}>
            <TouchableOpacity
              style={styles.btnPrimaryWhatsApp}
              activeOpacity={0.85}
              onPress={() => handleOpenLink('https://wa.me/6283137538544?text=Halo%20Dewan,%20saya%20tertarik%20dengan%20portofolio%20Anda', 'WhatsApp')}
            >
              <SafeIcon name="whatsapp" size={16} color="#ffffff" fallback="WA" />
              <Text style={styles.btnPrimaryWhatsAppText}>WhatsApp (0831-3753-8544)</Text>
            </TouchableOpacity>

            <View style={styles.heroSecondaryBtns}>
              <TouchableOpacity
                style={[styles.btnSecondary, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => handleOpenLink('mailto:dewan.mochpratama23@gmail.com', 'Email')}
              >
                <SafeIcon name="envelope" size={13} color={theme.textMain} fallback="✉" />
                <Text style={[styles.btnSecondaryText, { color: theme.textMain }]}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSecondary, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => handleOpenLink('https://www.linkedin.com/in/dewan-mochamad-pratama-8947452a6/', 'LinkedIn')}
              >
                <SafeIcon name="linkedin" size={13} color="#2563eb" fallback="IN" />
                <Text style={[styles.btnSecondaryText, { color: theme.textMain }]}>LinkedIn</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSecondary, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => handleOpenLink('https://github.com/dewanmochpratama23-sys', 'GitHub')}
              >
                <SafeIcon name="github" size={13} color={theme.textMain} fallback="GH" />
                <Text style={[styles.btnSecondaryText, { color: theme.textMain }]}>GitHub</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Highlights Metrics */}
          <View style={[styles.metricGrid, { borderTopColor: theme.subtleBg }]}>
            <View style={[styles.metricItem, { backgroundColor: theme.subtleBg, borderColor: theme.border }]}>
              <Text style={styles.metricLabel}>Fokus Bidang</Text>
              <Text style={[styles.metricValue, { color: theme.textMain }]}>Software & Mobile</Text>
            </View>
            <View style={[styles.metricItem, { backgroundColor: theme.subtleBg, borderColor: theme.border }]}>
              <Text style={styles.metricLabel}>Proyek & Bisnis</Text>
              <Text style={[styles.metricValue, { color: theme.textMain }]}>3+ Unit & App</Text>
            </View>
            <View style={[styles.metricItem, { backgroundColor: theme.subtleBg, borderColor: theme.border }]}>
              <Text style={styles.metricLabel}>Platform</Text>
              <Text style={[styles.metricValue, { color: theme.textMain }]}>Desktop & Mobile</Text>
            </View>
            <View style={[styles.metricItem, { backgroundColor: theme.subtleBg, borderColor: theme.border }]}>
              <Text style={styles.metricLabel}>Version Control</Text>
              <Text style={[styles.metricValue, { color: theme.textMain }]}>Git & GitHub</Text>
            </View>
          </View>
        </View>

        {/* 2. PROYEK UNGGULAN & BISNIS OPERASIONAL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionBadge}>SHOWCASE KARYA & BISNIS</Text>
          <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Proyek Rekayasa & Platform Bisnis</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>Tiga implementasi nyata perangkat lunak, sistem AI, dan platform bisnis operasional.</Text>
        </View>

        {/* Proyek 1: Kosan Murah PT MIM (Live Production Web) */}
        <View style={[styles.projectCard, { backgroundColor: theme.cardBg, borderColor: '#10b981', borderWidth: 1.5 }]}>
          <View style={styles.projectCardTop}>
            <View style={[styles.tagBadgeBlue, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
              <Text style={[styles.tagBadgeBlueText, { color: '#065f46' }]}>● Live Production Web & Bisnis</Text>
            </View>
            <Text style={styles.platformLabel}>Vercel & Maps</Text>
          </View>

          <Text style={[styles.projectTitle, { color: theme.textMain }]}>Kosan Murah PT MIM</Text>
          <Text style={[styles.projectStack, { color: '#10b981', fontWeight: '700' }]}>Platform Web Properti & Sewa Kontrakan</Text>

          <Text style={[styles.projectDesc, { color: theme.textMuted }]}>
            Platform web komersial resmi untuk unit bisnis sewa kontrakan 'Kosan Murah PT MIM' di Karawang. Dideploy di Vercel dan terintegrasi resmi dengan Google Maps.
          </Text>

          <View style={styles.featureList}>
            <Text style={[styles.featureItem, { color: theme.textMain }]}>✔ Website aktif di Vercel: kosan-mim.vercel.app</Text>
            <Text style={[styles.featureItem, { color: theme.textMain }]}>✔ Terverifikasi resmi di Google Profil Bisnis & Maps</Text>
            <Text style={[styles.featureItem, { color: theme.textMain }]}>✔ Katalog kamar dan pemesanan via WhatsApp</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[styles.btnProjectBlue, { flex: 1, backgroundColor: '#10b981' }]}
              activeOpacity={0.85}
              onPress={() => handleOpenLink('https://kosan-mim.vercel.app/', 'Web Kosan Murah')}
            >
              <SafeIcon name="globe" size={14} color="#ffffff" fallback="🌐" />
              <Text style={styles.btnProjectGithubText}>Buka Web Live</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnProjectGithub, { flex: 1, backgroundColor: theme.subtleBg, borderWidth: 1, borderColor: theme.border }]}
              activeOpacity={0.85}
              onPress={() => handleOpenLink('https://share.google/Nkv9zsm7dAbXj1pvy', 'Google Maps Kosan Murah')}
            >
              <SafeIcon name="map-marker-alt" size={14} color="#ef4444" fallback="📍" />
              <Text style={[styles.btnProjectGithubText, { color: theme.textMain }]}>Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Proyek 2: Face Recognition */}
        <View style={[styles.projectCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={styles.projectCardTop}>
            <View style={styles.tagBadgeIndigo}>
              <Text style={styles.tagBadgeIndigoText}>Computer Vision & AI</Text>
            </View>
            <Text style={styles.platformLabel}>Desktop Application</Text>
          </View>

          <Text style={[styles.projectTitle, { color: theme.textMain }]}>Sistem Deteksi & Pengenalan Wajah (Face Recognition)</Text>
          <Text style={[styles.projectStack, { color: theme.textMuted }]}>Python 3, OpenCV, Tkinter GUI, NumPy</Text>

          <Text style={[styles.projectDesc, { color: theme.textMuted }]}>
            Aplikasi desktop berbasis Python dan OpenCV untuk mendeteksi wajah secara real-time melalui kamera komputer, 
            mengekstrak fitur biometrik, melatih dataset, dan mengenali identitas individu dengan akurasi tinggi.
          </Text>

          <View style={styles.featureList}>
            <Text style={[styles.featureItem, { color: theme.textMain }]}>✔ Deteksi wajah multi-frame real-time via OpenCV</Text>
            <Text style={[styles.featureItem, { color: theme.textMain }]}>✔ Pelatihan dataset mandiri & verifikasi identitas</Text>
            <Text style={[styles.featureItem, { color: theme.textMain }]}>✔ Antarmuka pengguna desktop berbasis Tkinter</Text>
          </View>

          <TouchableOpacity
            style={styles.btnProjectGithub}
            activeOpacity={0.85}
            onPress={() => handleOpenLink('https://github.com/dewanmochpratama23-sys', 'GitHub Face Recognition')}
          >
            <SafeIcon name="github" size={14} color="#ffffff" fallback="GH" />
            <Text style={styles.btnProjectGithubText}>Lihat Kode di GitHub</Text>
          </TouchableOpacity>
        </View>

        {/* Proyek 2: Cross-Platform Mobile Portfolio */}
        <View style={[styles.projectCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={styles.projectCardTop}>
            <View style={styles.tagBadgeBlue}>
              <Text style={styles.tagBadgeBlueText}>Mobile Engineering</Text>
            </View>
            <Text style={styles.platformLabel}>Android & iOS Native</Text>
          </View>

          <Text style={[styles.projectTitle, { color: theme.textMain }]}>Interactive Mobile Portfolio & Identity App</Text>
          <Text style={[styles.projectStack, { color: theme.textMuted }]}>React Native, Expo SDK 57, JavaScript ES6+</Text>

          <Text style={[styles.projectDesc, { color: theme.textMuted }]}>
            Aplikasi mobile interaktif berbasis React Native untuk mempresentasikan rekam jejak rekayasa secara native. 
            Mendukung integrasi langsung WhatsApp, Telepon, Email, LinkedIn, dan form masukan interaktif.
          </Text>

          <View style={styles.featureList}>
            <Text style={[styles.featureItem, { color: theme.textMain }]}>✔ Cross-platform murni dengan dukungan Expo Go live debugging</Text>
            <Text style={[styles.featureItem, { color: theme.textMain }]}>✔ Deep-linking otomatis ke WhatsApp, LinkedIn, GitHub & Email</Text>
            <Text style={[styles.featureItem, { color: theme.textMain }]}>✔ Auto IP detection script (start.js) untuk Wi-Fi kampus & rumah</Text>
          </View>

          <TouchableOpacity
            style={styles.btnProjectBlue}
            activeOpacity={0.85}
            onPress={() => handleOpenLink('https://github.com/dewanmochpratama23-sys/dewan-portofolio', 'GitHub Mobile Portfolio')}
          >
            <SafeIcon name="github" size={14} color="#ffffff" fallback="GH" />
            <Text style={styles.btnProjectGithubText}>Repositori Mobile Portfolio</Text>
          </TouchableOpacity>
        </View>

        {/* 3. KEAHLIAN & TEKNOLOGI */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionBadge}>KOMPETENSI TEKNIS</Text>
          <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Keahlian & Perkakas Pengembangan</Text>
        </View>

        <View style={[styles.skillsCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.skillsCardCategory, { color: theme.textMain }]}>📱 Mobile & Frontend Development</Text>
          <View style={styles.skillPillContainer}>
            {['React Native', 'Expo', 'JavaScript (ES6+)', 'HTML5', 'CSS3 & Tailwind', 'Responsive UI'].map((skill) => (
              <View key={skill} style={[styles.skillPill, { backgroundColor: theme.subtleBg, borderColor: theme.border }]}>
                <Text style={[styles.skillPillText, { color: theme.textMain }]}>{skill}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.skillsCardCategory, { color: theme.textMain, marginTop: 16 }]}>🧠 Python & Computer Vision</Text>
          <View style={styles.skillPillContainer}>
            {['Python 3.x', 'OpenCV', 'Face Recognition', 'NumPy Matrix', 'Tkinter GUI'].map((skill) => (
              <View key={skill} style={[styles.skillPill, { backgroundColor: theme.subtleBg, borderColor: theme.border }]}>
                <Text style={[styles.skillPillText, { color: theme.textMain }]}>{skill}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.skillsCardCategory, { color: theme.textMain, marginTop: 16 }]}>⚙️ Workflow & Tools</Text>
          <View style={styles.skillPillContainer}>
            {['Git Version Control', 'GitHub', 'VS Code', 'Node.js & npm', 'PowerShell / CLI'].map((skill) => (
              <View key={skill} style={[styles.skillPill, { backgroundColor: theme.subtleBg, borderColor: theme.border }]}>
                <Text style={[styles.skillPillText, { color: theme.textMain }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4. INTERACTIVE SKILL BOUNCE LAB */}
        <View style={[styles.labCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={styles.labHeader}>
            <Text style={[styles.labTitle, { color: theme.textMain }]}>⚡ Lab Interaktif: Sentuh Token Keahlian</Text>
            <Text style={[styles.labSubtitle, { color: theme.textMuted }]}>Ketuk token untuk memicu simulasi fisika pegas (spring physics):</Text>
          </View>

          <View style={styles.tokenWall}>
            {skillTokens.map((token, index) => (
              <Animated.View
                key={token}
                style={[
                  styles.animatedToken,
                  {
                    transform: [
                      { translateX: tokenPositions[index].x },
                      { translateY: tokenPositions[index].y },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.tokenButton, { backgroundColor: isDark ? '#1e3a8a' : '#eff6ff', borderColor: isDark ? '#3b82f6' : '#bfdbfe' }]}
                  onPress={() => bounceToken(index)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tokenButtonText, { color: isDark ? '#93c5fd' : '#1d4ed8' }]}>{token}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* 5. BUKU TAMU INTERAKTIF */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionBadge}>INTERAKSI & MASUKAN</Text>
          <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Buku Tamu & Catatan Dosen</Text>
        </View>

        <View style={[styles.guestbookCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.formTitle, { color: theme.textMain }]}>Tulis Pesan / Masukan</Text>

          <Text style={[styles.formLabel, { color: theme.textMuted }]}>Nama Lengkap / Instansi</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.subtleBg, borderColor: theme.border, color: theme.textMain }]}
            placeholder="Contoh: Pak Budi (Dosen / Rekan)"
            placeholderTextColor="#94a3b8"
            value={guestName}
            onChangeText={setGuestName}
          />

          <Text style={[styles.formLabel, { color: theme.textMuted }]}>Peran / Kategori</Text>
          <View style={styles.rolePickerRow}>
            {['Dosen', 'Rekan Mahasiswa', 'Tamu Umum', 'Recruiter'].map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleBadge,
                  { backgroundColor: theme.subtleBg, borderColor: theme.border },
                  guestRole === role && styles.roleBadgeActive,
                ]}
                onPress={() => setGuestRole(role)}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    { color: theme.textMuted },
                    guestRole === role && styles.roleBadgeTextActive,
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.formLabel, { color: theme.textMuted }]}>Pesan / Catatan</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.subtleBg, borderColor: theme.border, color: theme.textMain }]}
            placeholder="Tuliskan ulasan atau apresiasi untuk Dewan..."
            placeholderTextColor="#94a3b8"
            value={guestMessage}
            onChangeText={setGuestMessage}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={styles.btnSubmitComment}
            activeOpacity={0.85}
            onPress={handleSendComment}
          >
            <SafeIcon name="paper-plane" size={14} color="#ffffff" fallback="✈" />
            <Text style={styles.btnSubmitCommentText}> Kirim ke Buku Tamu 🎉</Text>
          </TouchableOpacity>

          {/* Comment List Feed */}
          <View style={[styles.commentFeedHeader, { borderTopColor: theme.subtleBg }]}>
            <Text style={[styles.commentFeedTitle, { color: theme.textMain }]}>Daftar Pesan Masuk</Text>
            <Text style={[styles.commentCounter, { color: theme.textMuted }]}>{comments.length} Pesan</Text>
          </View>

          {comments.map((item) => (
            <View key={item.id} style={[styles.commentCard, { backgroundColor: theme.subtleBg, borderColor: theme.border }]}>
              <View style={styles.commentCardTop}>
                <Text style={[styles.commentAuthor, { color: theme.textMain }]}>{item.name}</Text>
                <Text style={styles.commentTime}>{item.time}</Text>
              </View>
              <View style={styles.commentRolePill}>
                <Text style={styles.commentRolePillText}>{item.role}</Text>
              </View>
              <Text style={[styles.commentBody, { color: theme.textMuted }]}>{item.message}</Text>
            </View>
          ))}
        </View>

        {/* 6. KONTAK RESMI & SOSIAL MEDIA */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionBadge}>SALURAN KOMUNIKASI</Text>
          <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Hubungi & Terhubung</Text>
        </View>

        <View style={styles.contactGrid}>
          {/* WhatsApp */}
          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            activeOpacity={0.8}
            onPress={() => handleOpenLink('https://wa.me/6283137538544?text=Halo%20Dewan,%20saya%20melihat%20portofolio%20Anda.', 'WhatsApp')}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: isDark ? '#064e3b' : '#ecfdf5' }]}>
              <SafeIcon name="whatsapp" size={24} color="#10b981" fallback="WA" />
            </View>
            <Text style={[styles.contactCardTitle, { color: theme.textMain }]}>WhatsApp</Text>
            <Text style={[styles.contactCardSubtitle, { color: theme.textMuted }]}>0831-3753-8544</Text>
            <Text style={[styles.contactCardAction, { color: '#10b981' }]}>Chat Langsung &rarr;</Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            activeOpacity={0.8}
            onPress={() => handleOpenLink('mailto:dewan.mochpratama23@gmail.com', 'Email')}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: isDark ? '#1e3a8a' : '#eff6ff' }]}>
              <SafeIcon name="envelope" size={20} color="#2563eb" fallback="✉" />
            </View>
            <Text style={[styles.contactCardTitle, { color: theme.textMain }]}>Email</Text>
            <Text style={[styles.contactCardSubtitle, { color: theme.textMuted }]} numberOfLines={1}>dewan.mochpratama23@gmail.com</Text>
            <Text style={[styles.contactCardAction, { color: '#2563eb' }]}>Kirim Email &rarr;</Text>
          </TouchableOpacity>

          {/* LinkedIn */}
          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            activeOpacity={0.8}
            onPress={() => handleOpenLink('https://www.linkedin.com/in/dewan-mochamad-pratama-8947452a6/', 'LinkedIn')}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: isDark ? '#312e81' : '#eef2ff' }]}>
              <SafeIcon name="linkedin" size={22} color="#4f46e5" fallback="IN" />
            </View>
            <Text style={[styles.contactCardTitle, { color: theme.textMain }]}>LinkedIn</Text>
            <Text style={[styles.contactCardSubtitle, { color: theme.textMuted }]}>Dewan Mochamad Pratama</Text>
            <Text style={[styles.contactCardAction, { color: '#4f46e5' }]}>Koneksi &rarr;</Text>
          </TouchableOpacity>

          {/* GitHub */}
          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            activeOpacity={0.8}
            onPress={() => handleOpenLink('https://github.com/dewanmochpratama23-sys', 'GitHub')}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: isDark ? '#1f2937' : '#f1f5f9' }]}>
              <SafeIcon name="github" size={22} color={theme.textMain} fallback="GH" />
            </View>
            <Text style={[styles.contactCardTitle, { color: theme.textMain }]}>GitHub</Text>
            <Text style={[styles.contactCardSubtitle, { color: theme.textMuted }]}>dewanmochpratama23-sys</Text>
            <Text style={[styles.contactCardAction, { color: theme.textMain }]}>Repositori &rarr;</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <Text style={[styles.footerText, { color: theme.textMain }]}>
            Dewan Mochamad Pratama &copy; 2026. Karawang, Jawa Barat.
          </Text>
          <Text style={styles.footerSubtext}>
            Portofolio & Rekam Jejak Rekayasa S1 Teknik Informatika
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  header: {
    height: 60,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBtnWhatsApp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  headerWhatsAppText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },

  // Hero Card
  heroCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusBadgeText: {
    color: '#065f46',
    fontSize: 10,
    fontWeight: '700',
  },
  academicTrackText: {
    fontSize: 10,
    fontWeight: '600',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  avatarBorder: {
    width: 76,
    height: 76,
    borderRadius: 18,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerLaser: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#22d3ee',
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  scannerLiveText: {
    color: '#22d3ee',
    fontSize: 8,
    fontWeight: '800',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginTop: 24,
  },
  profileHeaderTexts: {
    flex: 1,
  },
  heroPretitle: {
    color: '#2563eb',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  heroSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  roleHighlight: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  btnScanMini: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 10,
  },
  btnScanMiniText: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '700',
  },
  heroBio: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  heroBtnRow: {
    gap: 10,
    marginBottom: 16,
  },
  btnPrimaryWhatsApp: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnPrimaryWhatsAppText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  heroSecondaryBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  btnSecondaryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },

  // Section Headers
  sectionHeader: {
    marginTop: 4,
    marginBottom: -4,
  },
  sectionBadge: {
    color: '#2563eb',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },

  // Project Cards
  projectCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  projectCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tagBadgeIndigo: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  tagBadgeIndigoText: {
    color: '#4338ca',
    fontSize: 10,
    fontWeight: '700',
  },
  tagBadgeBlue: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  tagBadgeBlueText: {
    color: '#1d4ed8',
    fontSize: 10,
    fontWeight: '700',
  },
  platformLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '500',
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  projectStack: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  projectDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  featureList: {
    gap: 4,
    marginBottom: 14,
  },
  featureItem: {
    fontSize: 11,
  },
  btnProjectGithub: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnProjectBlue: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnProjectGithubText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  // Skills
  skillsCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  skillsCardCategory: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  skillPillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  skillPillText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Lab
  labCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  labHeader: {
    marginBottom: 12,
  },
  labTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  labSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  tokenWall: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  animatedToken: {},
  tokenButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  tokenButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Guestbook
  guestbookCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  rolePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleBadgeActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  roleBadgeTextActive: {
    color: '#ffffff',
  },
  btnSubmitComment: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  btnSubmitCommentText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  commentFeedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    marginBottom: 10,
  },
  commentFeedTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  commentCounter: {
    fontSize: 10,
    fontWeight: '600',
  },
  commentCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  commentCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
  },
  commentTime: {
    color: '#94a3b8',
    fontSize: 10,
  },
  commentRolePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginVertical: 4,
  },
  commentRolePillText: {
    color: '#2563eb',
    fontSize: 9,
    fontWeight: '600',
  },
  commentBody: {
    fontSize: 11,
    lineHeight: 16,
  },

  // Contact
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  contactCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  contactIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactCardTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  contactCardSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  contactCardAction: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footerSubtext: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
});

registerRootComponent(App);
