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

// Try to safely import Expo Vector Icons, with graceful fallback
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

// Fallback Icon Component that never crashes if @expo/vector-icons is not installed
const SafeIcon = ({ name, size = 16, color = '#06b6d4', fallback = '•' }) => {
  if (FontAwesome5) {
    const isBrand = ['github', 'linkedin', 'whatsapp', 'google', 'twitter', 'facebook'].includes(name);
    return <FontAwesome5 name={name} size={size} color={color} brand={isBrand} solid={!isBrand} />;
  }
  return <Text style={{ fontSize: size, color }}>{fallback}</Text>;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Local photo reference
const PROFILE_IMAGE = require('./dewan-foto.jpg');

export default function App() {
  // 1. Cover Screen State & Animation
  const [isCoverOpen, setIsCoverOpen] = useState(true);
  const coverFadeAnim = useRef(new Animated.Value(1)).current;
  const coverSlideAnim = useRef(new Animated.Value(0)).current;

  // 2. Typing Animation Effect
  const phrases = [
    'Mahasiswa Teknik Informatika',
    'Web & Mobile App Developer',
    'UI/UX Design Explorer',
    'Tech & Creative Problem Solver',
  ];
  const [typedText, setTypedText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // 3. Floating Avatar Animation
  const floatAnim = useRef(new Animated.Value(0)).current;

  // 4. Guestbook State
  const [guestName, setGuestName] = useState('');
  const [guestRole, setGuestRole] = useState('Tamu Umum');
  const [guestMessage, setGuestMessage] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      name: 'Bpk. Dr. Hendra, M.Kom',
      role: 'Dosen Penguji',
      message:
        'Konsep pembuka portofolio ala undangan digital dan eksekusi React Native-nya sangat rapi. Struktur komponen dan responsivitasnya patut diapresiasi!',
      time: 'Baru saja',
    },
    {
      id: '2',
      name: 'Rian Pratama',
      role: 'Rekan Mahasiswa',
      message:
        'Keren banget Tama! Desain dark neon dan transisi komponen React Native-nya halus banget di layar HP.',
      time: '1 jam lalu',
    },
  ]);

  // 5. Interactive Particle & Lab Animation
  const [gravityActive, setGravityActive] = useState(true);
  const skillTokens = [
    'React Native', 'JavaScript', 'HTML5', 'CSS3', 'PHP',
    'MySQL', 'Tailwind', 'Figma', 'Git', 'Karawang'
  ];
  const [tokenPositions] = useState(
    skillTokens.map(() => new Animated.ValueXY({ x: 0, y: 0 }))
  );

  const scrollViewRef = useRef(null);

  // --- TYPING EFFECT ---
  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];
    const speed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting && charIdx < currentPhrase.length) {
        setTypedText(currentPhrase.substring(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      } else if (!isDeleting && charIdx === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && charIdx > 0) {
        setTypedText(currentPhrase.substring(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      } else if (isDeleting && charIdx === 0) {
        setIsDeleting(false);
        setPhraseIdx((phraseIdx + 1) % phrases.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, phraseIdx]);

  // --- FLOATING ANIMATION ---
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  // Auto-open cover screen after 3.5 seconds if user doesn't touch it
  useEffect(() => {
    let timer;
    if (isCoverOpen) {
      timer = setTimeout(() => {
        handleOpenPortfolio();
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [isCoverOpen]);

  // Open / Close Cover Screen
  const handleOpenPortfolio = () => {
    Animated.parallel([
      Animated.timing(coverFadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(coverSlideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsCoverOpen(false);
    });
  };

  const handleReopenCover = () => {
    coverFadeAnim.setValue(0);
    coverSlideAnim.setValue(0);
    setIsCoverOpen(true);
    Animated.timing(coverFadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  // Open External Links (WhatsApp, Email, LinkedIn, GitHub)
  const handleOpenLink = async (url, title = 'Tautan') => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Perhatian', `Tidak dapat membuka tautan ${title}: ${url}`);
    }
  };

  // Submit Guestbook Comment
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
    Alert.alert('Terima Kasih! 🎉', 'Pesan Anda telah berhasil ditambahkan ke Buku Tamu.');
  };

  // Particle Bounce Animation
  const bounceParticle = (index) => {
    const randomY = -25 - Math.random() * 20;
    const randomX = (Math.random() - 0.5) * 30;

    Animated.sequence([
      Animated.timing(tokenPositions[index], {
        toValue: { x: randomX, y: randomY },
        duration: 180,
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

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#080d1a" />

      {/* STICKY HEADER */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>DP</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Dewan M. Pratama</Text>
            <Text style={styles.headerSubtitle}>Informatics Student</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.btnHeaderCover}
            onPress={handleReopenCover}
            activeOpacity={0.7}
          >
            <SafeIcon name="id-card" size={12} color="#94a3b8" fallback="🪪" />
            <Text style={styles.btnHeaderCoverText}>Cover</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnHeaderContact}
            onPress={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.btnHeaderContactText}>Hubungi</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN SCROLLABLE CONTENT */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusBadgeText}>Ready for Collaboration & Internship</Text>
          </View>

          {/* Avatar Profile with Floating Animation */}
          <Animated.View
            style={[
              styles.avatarContainer,
              { transform: [{ translateY: floatAnim }] },
            ]}
          >
            {/* Decorative Floating Badges */}
            <View style={[styles.floatingTag, styles.floatingTagTop]}>
              <SafeIcon name="map-marker-alt" size={11} color="#06b6d4" fallback="📍" />
              <Text style={styles.floatingTagText}> Karawang, ID</Text>
            </View>

            <View style={[styles.floatingTag, styles.floatingTagBottom]}>
              <SafeIcon name="graduation-cap" size={11} color="#10b981" fallback="🎓" />
              <Text style={styles.floatingTagText}> Informatika</Text>
            </View>

            {/* Glowing Border Wrap */}
            <View style={styles.avatarBorder}>
              <View style={styles.avatarInner}>
                <Image
                  source={PROFILE_IMAGE}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
                <View style={styles.avatarOverlay}>
                  <Text style={styles.avatarLabel}>Dewan / Tama</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Name & Titles */}
          <Text style={styles.heroGreeting}>Halo semuanya! 👋 Saya,</Text>
          <Text style={styles.heroName}>
            Dewan Mochamad {'\n'}
            <Text style={styles.heroNameGradient}>Pratama</Text>
          </Text>

          {/* Typing Text Box */}
          <View style={styles.typingBox}>
            <Text style={styles.typingPrompt}>&gt;</Text>
            <Text style={styles.typingText}> {typedText}</Text>
            <Text style={styles.typingCursor}>|</Text>
          </View>

          <Text style={styles.heroBio}>
            Mahasiswa Informatika berusia 25 tahun asal Karawang. Berfokus pada perancangan
            antarmuka pengguna interaktif, rekayasa web modern, serta aplikasi mobile dengan
            React Native.
          </Text>

          {/* CTA Buttons */}
          <View style={styles.heroButtonRow}>
            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.85}
              onPress={() => {
                Alert.alert(
                  'Katalog Karya',
                  'Silakan gulir ke bawah untuk melihat dokumentasi proyek saya.'
                );
              }}
            >
              <SafeIcon name="code" size={13} color="#0f172a" fallback="💻" />
              <Text style={styles.btnPrimaryText}> Lihat Hasil Karya</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSecondary}
              activeOpacity={0.85}
              onPress={() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }}
            >
              <SafeIcon name="comment-dots" size={13} color="#ffffff" fallback="💬" />
              <Text style={styles.btnSecondaryText}> Tinggalkan Pesan</Text>
            </TouchableOpacity>
          </View>

          {/* Social Links */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => handleOpenLink('https://github.com/dewanmochpratama23-sys', 'GitHub')}
              activeOpacity={0.7}
            >
              <SafeIcon name="github" size={16} color="#94a3b8" fallback="🐙" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => handleOpenLink('https://www.linkedin.com/in/dewan-mochamad-pratama-8947452a6/', 'LinkedIn')}
              activeOpacity={0.7}
            >
              <SafeIcon name="linkedin" size={16} color="#06b6d4" fallback="💼" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => handleOpenLink('mailto:dewan.mochpratama23@gmail.com', 'Email')}
              activeOpacity={0.7}
            >
              <SafeIcon name="envelope" size={16} color="#10b981" fallback="✉️" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => handleOpenLink('https://wa.me/6283137538544', 'WhatsApp')}
              activeOpacity={0.7}
            >
              <SafeIcon name="whatsapp" size={16} color="#22c55e" fallback="📱" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: ABOUT ME */}
        <View style={styles.section}>
          <Text style={styles.sectionSub}>BIOGRAFI DIRI</Text>
          <Text style={styles.sectionTitle}>Tentang Saya</Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBox}>
                <SafeIcon name="user-astronaut" size={18} color="#06b6d4" fallback="🚀" />
              </View>
              <View>
                <Text style={styles.cardHeaderTitle}>Dewan Mochamad Pratama</Text>
                <Text style={styles.cardHeaderSub}>Nama Panggilan: Dewan / Tama</Text>
              </View>
            </View>

            <Text style={styles.cardParagraph}>
              Halo! Saya adalah mahasiswa program studi Informatika yang berdomisili di{' '}
              <Text style={styles.textHighlight}>Karawang, Jawa Barat</Text>. Saya memiliki antusiasme
              tinggi dalam merancang dan mengembangkan aplikasi mobile React Native serta antarmuka
              pengguna yang responsif.
            </Text>

            <Text style={styles.cardParagraphMuted}>
              Saya meyakini bahwa teknologi bukan hanya sekadar barisan logika kode, melainkan media
              komunikasi dan solusi nyata bagi permasalahan pengguna sehari-hari.
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaBadge}>🎂 25 Tahun</Text>
              <Text style={styles.metaBadge}>📍 Karawang, ID</Text>
              <Text style={styles.metaBadge}>🌙 Islam</Text>
            </View>
          </View>

          {/* Quick Info Cards */}
          <View style={[styles.card, styles.cardAccentCyan]}>
            <Text style={styles.accentLabelCyan}>STATUS AKADEMIK</Text>
            <Text style={styles.accentValue}>Mahasiswa Teknik Informatika</Text>
            <Text style={styles.cardParagraphMuted}>Fokus pada Mobile Apps, Web Engineering & Algoritma.</Text>
          </View>

          <View style={[styles.card, styles.cardAccentEmerald]}>
            <Text style={styles.accentLabelEmerald}>DOMISILI</Text>
            <Text style={styles.accentValue}>Karawang, Indonesia</Text>
            <Text style={styles.cardParagraphMuted}>Terbuka untuk kolaborasi lokal, on-site, maupun remote project.</Text>
          </View>
        </View>

        {/* SECTION: REACT NATIVE PARTICLE & GRAVITY LAB */}
        <View style={styles.section}>
          <Text style={styles.sectionSub}>EXPERIMENT INTERAKTIF</Text>
          <Text style={styles.sectionTitle}>Gravity Lab (React Native)</Text>
          <Text style={styles.sectionDesc}>
            Sentuh atau ketuk gelembung keahlian di bawah untuk memberikan dorongan gaya pegas
            (spring physics impulse)!
          </Text>

          <View style={styles.labContainer}>
            <View style={styles.labHeader}>
              <Text style={styles.labStatus}>
                Mode Gravitasi: {gravityActive ? '🟢 Aktif' : '⚪ Nol'}
              </Text>
              <TouchableOpacity
                style={styles.labToggleBtn}
                onPress={() => setGravityActive(!gravityActive)}
              >
                <Text style={styles.labToggleBtnText}>
                  {gravityActive ? 'Ganti Mode' : 'Aktifkan'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tokenGrid}>
              {skillTokens.map((token, idx) => (
                <TouchableOpacity
                  key={token}
                  activeOpacity={0.7}
                  onPress={() => bounceParticle(idx)}
                >
                  <Animated.View
                    style={[
                      styles.skillToken,
                      {
                        transform: [
                          { translateX: tokenPositions[idx].x },
                          { translateY: tokenPositions[idx].y },
                        ],
                      },
                    ]}
                  >
                    <Text style={styles.skillTokenText}>{token}</Text>
                  </Animated.View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* SECTION: SKILLS */}
        <View style={styles.section}>
          <Text style={styles.sectionSub}>KEMAMPUAN TEKNIS</Text>
          <Text style={styles.sectionTitle}>Keahlian & Teknologi</Text>

          {/* Frontend / Mobile Card */}
          <View style={styles.card}>
            <Text style={styles.skillGroupTitle}>Mobile & Frontend Development</Text>

            <View style={styles.skillBarItem}>
              <View style={styles.skillLabelRow}>
                <Text style={styles.skillName}>React Native / Expo</Text>
                <Text style={styles.skillPercent}>88%</Text>
              </View>
              <View style={styles.skillTrack}>
                <View style={[styles.skillFill, { width: '88%' }]} />
              </View>
            </View>

            <View style={styles.skillBarItem}>
              <View style={styles.skillLabelRow}>
                <Text style={styles.skillName}>JavaScript (ES6+) & DOM Logic</Text>
                <Text style={styles.skillPercent}>85%</Text>
              </View>
              <View style={styles.skillTrack}>
                <View style={[styles.skillFill, { width: '85%' }]} />
              </View>
            </View>

            <View style={styles.skillBarItem}>
              <View style={styles.skillLabelRow}>
                <Text style={styles.skillName}>HTML5 & Tailwind CSS / Responsive</Text>
                <Text style={styles.skillPercent}>90%</Text>
              </View>
              <View style={styles.skillTrack}>
                <View style={[styles.skillFill, { width: '90%' }]} />
              </View>
            </View>

            <View style={styles.skillBarItem}>
              <View style={styles.skillLabelRow}>
                <Text style={styles.skillName}>UI/UX Prototyping (Figma)</Text>
                <Text style={styles.skillPercent}>80%</Text>
              </View>
              <View style={styles.skillTrack}>
                <View style={[styles.skillFill, { width: '80%' }]} />
              </View>
            </View>
          </View>

          {/* Backend Card */}
          <View style={styles.card}>
            <Text style={styles.skillGroupTitle}>Backend, Database & Ecosystem</Text>

            <View style={styles.skillBarItem}>
              <View style={styles.skillLabelRow}>
                <Text style={styles.skillName}>PHP & OOP</Text>
                <Text style={styles.skillPercent}>80%</Text>
              </View>
              <View style={styles.skillTrack}>
                <View style={[styles.skillFill, { width: '80%', backgroundColor: '#10b981' }]} />
              </View>
            </View>

            <View style={styles.skillBarItem}>
              <View style={styles.skillLabelRow}>
                <Text style={styles.skillName}>MySQL / Relational Database</Text>
                <Text style={styles.skillPercent}>82%</Text>
              </View>
              <View style={styles.skillTrack}>
                <View style={[styles.skillFill, { width: '82%', backgroundColor: '#10b981' }]} />
              </View>
            </View>

            <View style={styles.skillBarItem}>
              <View style={styles.skillLabelRow}>
                <Text style={styles.skillName}>Git & Version Control (GitHub)</Text>
                <Text style={styles.skillPercent}>85%</Text>
              </View>
              <View style={styles.skillTrack}>
                <View style={[styles.skillFill, { width: '85%', backgroundColor: '#10b981' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* SECTION: JOURNEY */}
        <View style={styles.section}>
          <Text style={styles.sectionSub}>PERJALANAN & PENDIDIKAN</Text>
          <Text style={styles.sectionTitle}>Garis Waktu Perjalanan</Text>

          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineCard}>
                <Text style={styles.timelineYear}>2025 - Sekarang</Text>
                <Text style={styles.timelineHeading}>Pengembangan Full-Stack & Mobile</Text>
                <Text style={styles.cardParagraphMuted}>
                  Mendalami integrasi aplikasi mobile React Native, manajemen basis data, dan
                  penyusunan portofolio teknologi mutakhir.
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { borderColor: '#8b5cf6' }]} />
              <View style={styles.timelineCard}>
                <Text style={[styles.timelineYear, { color: '#c084fc', borderColor: '#581c87' }]}>
                  2024
                </Text>
                <Text style={styles.timelineHeading}>Eksplorasi UI/UX & Proyek Web</Text>
                <Text style={styles.cardParagraphMuted}>
                  Perancangan prototipe sistem di Figma, manipulasi DOM dinamis, serta integrasi REST API.
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { borderColor: '#10b981' }]} />
              <View style={styles.timelineCard}>
                <Text style={[styles.timelineYear, { color: '#6ee7b7', borderColor: '#065f46' }]}>
                  2023
                </Text>
                <Text style={styles.timelineHeading}>Fondasi Algoritma Komputer</Text>
                <Text style={styles.cardParagraphMuted}>
                  Fondasi logika komputasi, struktur data dasar, pemrograman berorientasi objek (OOP),
                  dan basis data relasional.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION: PROJECTS */}
        <View style={styles.section}>
          <Text style={styles.sectionSub}>KATALOG KARYA</Text>
          <Text style={styles.sectionTitle}>Proyek Pilihan</Text>

          {/* Project 1 */}
          <View style={styles.projectCard}>
            <View style={styles.projectBadgeRow}>
              <Text style={styles.projectTag}>PHP</Text>
              <Text style={styles.projectTag}>MySQL</Text>
              <Text style={styles.projectTag}>Bootstrap</Text>
            </View>
            <Text style={styles.projectTitle}>Sistem Manajemen Data Mahasiswa</Text>
            <Text style={styles.cardParagraphMuted}>
              Aplikasi berbasis web untuk rekapitulasi data nilai, absensi, serta pengelolaan peran
              dosen dan mahasiswa secara terstruktur.
            </Text>
            <View style={styles.projectFooter}>
              <Text style={styles.projectCategory}>Tugas Rekayasa Web</Text>
              <Text style={styles.projectStatus}>✓ Selesai</Text>
            </View>
          </View>

          {/* Project 2 */}
          <View style={styles.projectCard}>
            <View style={styles.projectBadgeRow}>
              <Text style={[styles.projectTag, { color: '#38bdf8' }]}>React Native</Text>
              <Text style={[styles.projectTag, { color: '#a78bfa' }]}>Expo</Text>
              <Text style={[styles.projectTag, { color: '#34d399' }]}>Mobile UI</Text>
            </View>
            <Text style={styles.projectTitle}>Portofolio Mobile Dewan M. Pratama</Text>
            <Text style={styles.cardParagraphMuted}>
              Aplikasi portofolio mobile interaktif yang dilengkapi layar gerbang undangan,
              animasi partikel pegas, serta buku tamu langsung.
            </Text>
            <View style={styles.projectFooter}>
              <Text style={styles.projectCategory}>Proyek Mandiri</Text>
              <Text style={styles.projectStatus}>✓ Aktif</Text>
            </View>
          </View>

          {/* Project 3 */}
          <View style={styles.projectCard}>
            <View style={styles.projectBadgeRow}>
              <Text style={[styles.projectTag, { color: '#c084fc' }]}>Figma</Text>
              <Text style={[styles.projectTag, { color: '#38bdf8' }]}>UI/UX</Text>
            </View>
            <Text style={styles.projectTitle}>Purwarupa Aplikasi Layanan Mahasiswa</Text>
            <Text style={styles.cardParagraphMuted}>
              Perancangan desain antarmuka mobile intuitif untuk akses jadwal perkuliahan, notifikasi,
              dan materi dosen.
            </Text>
            <View style={styles.projectFooter}>
              <Text style={styles.projectCategory}>Eksplorasi Desain</Text>
              <Text style={styles.projectStatus}>✓ Prototipe</Text>
            </View>
          </View>
        </View>

        {/* SECTION: GUESTBOOK */}
        <View style={styles.section}>
          <Text style={styles.sectionSub}>BUKU TAMU INTERAKTIF</Text>
          <Text style={styles.sectionTitle}>Ucapan & Feedback</Text>
          <Text style={styles.sectionDesc}>
            Dosen dan rekan dapat menulis pesan atau saran yang langsung muncul di aplikasi ini.
          </Text>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.formLabel}>Nama Lengkap / Instansi</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Pak Budi (Dosen Pembimbing)"
              placeholderTextColor="#64748b"
              value={guestName}
              onChangeText={setGuestName}
            />

            <Text style={styles.formLabel}>Peran / Hubungan</Text>
            <View style={styles.rolePickerRow}>
              {['Dosen', 'Rekan Mahasiswa', 'Tamu Umum', 'Recruiter'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleBadge,
                    guestRole === role && styles.roleBadgeActive,
                  ]}
                  onPress={() => setGuestRole(role)}
                >
                  <Text
                    style={[
                      styles.roleBadgeText,
                      guestRole === role && styles.roleBadgeTextActive,
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>Pesan / Catatan</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tuliskan masukan atau sapaan untuk Dewan di sini..."
              placeholderTextColor="#64748b"
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
              <SafeIcon name="paper-plane" size={14} color="#0f172a" fallback="✈️" />
              <Text style={styles.btnSubmitCommentText}> Kirim Pesan ke Buku Tamu</Text>
            </TouchableOpacity>
          </View>

          {/* Comment List Feed */}
          <View style={styles.commentFeedHeader}>
            <Text style={styles.commentFeedTitle}>Daftar Pesan Masuk</Text>
            <Text style={styles.commentCounter}>{comments.length} Pesan</Text>
          </View>

          {comments.map((item) => (
            <View key={item.id} style={styles.commentCard}>
              <View style={styles.commentTopRow}>
                <Text style={styles.commentAuthor}>👤 {item.name}</Text>
                <Text style={styles.commentRole}>{item.role}</Text>
              </View>
              <Text style={styles.commentBody}>"{item.message}"</Text>
              <Text style={styles.commentTime}>{item.time}</Text>
            </View>
          ))}
        </View>

        {/* SECTION: DIRECT CONTACT CARDS */}
        <View style={styles.section}>
          <Text style={styles.sectionSub}>HUBUNGI SAYA LANGSUNG</Text>
          <Text style={styles.sectionTitle}>Kontak & Media Sosial</Text>
          <Text style={styles.cardParagraphMuted}>
            Ketuk tombol di bawah untuk langsung terhubung dengan WhatsApp, Email, LinkedIn, atau GitHub saya:
          </Text>

          <View style={{ gap: 10, marginTop: 14 }}>
            {/* WhatsApp Card */}
            <TouchableOpacity
              style={[styles.directContactBtn, { borderColor: '#22c55e50', backgroundColor: '#052e16' }]}
              activeOpacity={0.8}
              onPress={() => handleOpenLink('https://wa.me/6283137538544', 'WhatsApp')}
            >
              <View style={[styles.directContactIconWrap, { backgroundColor: '#22c55e25' }]}>
                <SafeIcon name="whatsapp" size={22} color="#22c55e" fallback="📱" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.directContactLabel}>WhatsApp Pribadi</Text>
                <Text style={styles.directContactValue}>0831-3753-8544</Text>
              </View>
              <View style={[styles.directContactBadge, { backgroundColor: '#22c55e30' }]}>
                <Text style={{ color: '#4ade80', fontSize: 11, fontWeight: '800' }}>Chat ↗</Text>
              </View>
            </TouchableOpacity>

            {/* Email Card */}
            <TouchableOpacity
              style={[styles.directContactBtn, { borderColor: '#06b6d450', backgroundColor: '#083344' }]}
              activeOpacity={0.8}
              onPress={() => handleOpenLink('mailto:dewan.mochpratama23@gmail.com', 'Email')}
            >
              <View style={[styles.directContactIconWrap, { backgroundColor: '#06b6d425' }]}>
                <SafeIcon name="envelope" size={19} color="#38bdf8" fallback="✉️" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.directContactLabel}>Email Langsung</Text>
                <Text style={styles.directContactValue}>dewan.mochpratama23@gmail.com</Text>
              </View>
              <View style={[styles.directContactBadge, { backgroundColor: '#06b6d430' }]}>
                <Text style={{ color: '#38bdf8', fontSize: 11, fontWeight: '800' }}>Kirim ↗</Text>
              </View>
            </TouchableOpacity>

            {/* LinkedIn Card */}
            <TouchableOpacity
              style={[styles.directContactBtn, { borderColor: '#3b82f650', backgroundColor: '#172554' }]}
              activeOpacity={0.8}
              onPress={() => handleOpenLink('https://www.linkedin.com/in/dewan-mochamad-pratama-8947452a6/', 'LinkedIn')}
            >
              <View style={[styles.directContactIconWrap, { backgroundColor: '#3b82f625' }]}>
                <SafeIcon name="linkedin" size={19} color="#60a5fa" fallback="💼" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.directContactLabel}>Profil LinkedIn</Text>
                <Text style={styles.directContactValue}>Dewan Mochamad Pratama</Text>
              </View>
              <View style={[styles.directContactBadge, { backgroundColor: '#3b82f630' }]}>
                <Text style={{ color: '#60a5fa', fontSize: 11, fontWeight: '800' }}>Lihat ↗</Text>
              </View>
            </TouchableOpacity>

            {/* GitHub Card */}
            <TouchableOpacity
              style={[styles.directContactBtn, { borderColor: '#94a3b850', backgroundColor: '#0f172a' }]}
              activeOpacity={0.8}
              onPress={() => handleOpenLink('https://github.com/dewanmochpratama23-sys', 'GitHub')}
            >
              <View style={[styles.directContactIconWrap, { backgroundColor: '#94a3b825' }]}>
                <SafeIcon name="github" size={20} color="#e2e8f0" fallback="🐙" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.directContactLabel}>Repositori GitHub</Text>
                <Text style={styles.directContactValue}>@dewanmochpratama23-sys</Text>
              </View>
              <View style={[styles.directContactBadge, { backgroundColor: '#94a3b830' }]}>
                <Text style={{ color: '#cbd5e1', fontSize: 11, fontWeight: '800' }}>Lihat ↗</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Dewan Mochamad Pratama</Text>
          <Text style={styles.footerCopy}>© 2026. Karawang, Jawa Barat.</Text>
          <Text style={styles.footerNote}>
            Dibuat menggunakan React Native & Expo untuk demonstrasi portofolio mobile.
          </Text>
        </View>
      </ScrollView>

      {/* FULLSCREEN DIGITAL INVITATION COVER OVERLAY */}
      {isCoverOpen && (
        <Animated.View
          style={[
            styles.coverOverlay,
            {
              opacity: coverFadeAnim,
              transform: [{ translateY: coverSlideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={{ width: '100%', alignItems: 'center' }}
            activeOpacity={0.95}
            onPress={handleOpenPortfolio}
          >
            <View style={styles.coverCard}>
              <View style={styles.coverBadge}>
                <Text style={styles.coverBadgeText}>✨ OFFICIAL MOBILE PORTFOLIO</Text>
              </View>

              <View style={styles.coverAvatarBorder}>
                <Image
                  source={PROFILE_IMAGE}
                  style={styles.coverAvatarImage}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.coverSubtitle}>Kepada Yang Terhormat Dosen & Rekan,</Text>
              <Text style={styles.coverTitle}>Dewan Mochamad Pratama</Text>
              <Text style={styles.coverNick}>
                Panggilan akrab: <Text style={{ color: '#38bdf8' }}>Dewan / Tama</Text>
              </Text>

              <Text style={styles.coverDesc}>
                Selamat datang di aplikasi portofolio interaktif pribadi berbasis React Native.
                Menampilkan eksplorasi rekayasa perangkat lunak dan interaksi antarmuka mobile.
              </Text>

              <TouchableOpacity
                style={styles.btnOpenPortfolio}
                onPress={handleOpenPortfolio}
                activeOpacity={0.85}
              >
                <Text style={styles.btnOpenPortfolioText}>🚀 Buka Portofolio</Text>
              </TouchableOpacity>

              <Text style={styles.coverHint}>⚡ Otomatis terbuka dalam 3 detik, atau ketuk di mana saja</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#080d1a',
  },
  header: {
    height: 60,
    backgroundColor: 'rgba(11, 17, 32, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 20,
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
    backgroundColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#0a0f1d',
    fontWeight: '800',
    fontSize: 14,
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  headerSubtitle: {
    color: '#38bdf8',
    fontSize: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnHeaderCover: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  btnHeaderCoverText: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '600',
  },
  btnHeaderContact: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnHeaderContactText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // HERO SECTION
  heroSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  statusBadgeText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
  avatarContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatarBorder: {
    width: 200,
    height: 200,
    borderRadius: 32,
    padding: 3,
    backgroundColor: '#06b6d4',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 29,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  avatarLabel: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  floatingTag: {
    position: 'absolute',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  floatingTagTop: {
    top: -6,
    right: -4,
  },
  floatingTagBottom: {
    bottom: -6,
    left: -4,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  floatingTagText: {
    color: '#f8fafc',
    fontSize: 10,
    fontWeight: '700',
  },
  heroGreeting: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 2,
  },
  heroName: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 38,
  },
  heroNameGradient: {
    color: '#38bdf8',
  },
  typingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  typingPrompt: {
    color: '#06b6d4',
    fontWeight: '900',
    fontSize: 14,
  },
  typingText: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '600',
  },
  typingCursor: {
    color: '#06b6d4',
    fontWeight: '900',
    fontSize: 14,
  },
  heroBio: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
    marginBottom: 18,
  },
  heroButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  btnPrimary: {
    backgroundColor: '#06b6d4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnPrimaryText: {
    color: '#0a0f1d',
    fontWeight: '700',
    fontSize: 12,
  },
  btnSecondary: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnSecondaryText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // COMMON SECTION STYLES
  section: {
    marginTop: 34,
  },
  sectionSub: {
    color: '#06b6d4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  sectionDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },

  // CARDS
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 18,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardAccentCyan: {
    borderLeftWidth: 4,
    borderLeftColor: '#06b6d4',
  },
  cardAccentEmerald: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  cardHeaderSub: {
    color: '#94a3b8',
    fontSize: 11,
  },
  cardParagraph: {
    color: '#e2e8f0',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardParagraphMuted: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 17,
  },
  textHighlight: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  metaBadge: {
    color: '#cbd5e1',
    fontSize: 10,
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  accentLabelCyan: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  accentLabelEmerald: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  accentValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },

  // GRAVITY LAB
  labContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 18,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    borderWidth: 1,
    padding: 16,
  },
  labHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  labStatus: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  labToggleBtn: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  labToggleBtnText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '700',
  },
  tokenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  skillToken: {
    backgroundColor: '#1e293b',
    borderColor: '#06b6d4',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
  },
  skillTokenText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },

  // SKILLS PROGRESS
  skillGroupTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  skillBarItem: {
    marginBottom: 12,
  },
  skillLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  skillName: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
  skillPercent: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  skillTrack: {
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 3,
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
    backgroundColor: '#06b6d4',
    borderRadius: 3,
  },

  // TIMELINE
  timeline: {
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#06b6d4',
    marginLeft: 10,
    gap: 20,
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: 16,
  },
  timelineDot: {
    position: 'absolute',
    left: -17,
    top: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#080d1a',
    borderColor: '#06b6d4',
    borderWidth: 2,
  },
  timelineCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 14,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 14,
  },
  timelineYear: {
    alignSelf: 'flex-start',
    color: '#38bdf8',
    borderColor: '#0369a1',
    borderWidth: 1,
    backgroundColor: '#082f49',
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 6,
  },
  timelineHeading: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  // PROJECTS
  projectCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 18,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  projectBadgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  projectTag: {
    color: '#2dd4bf',
    backgroundColor: '#042f2e',
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  projectTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 10,
    marginTop: 10,
  },
  projectCategory: {
    color: '#64748b',
    fontSize: 11,
  },
  projectStatus: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },

  // GUESTBOOK FORM
  formLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 6,
  },
  input: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 12,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  rolePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roleBadgeActive: {
    backgroundColor: '#06b6d4',
  },
  roleBadgeText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  roleBadgeTextActive: {
    color: '#080d1a',
    fontWeight: '800',
  },
  btnSubmitComment: {
    backgroundColor: '#06b6d4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  btnSubmitCommentText: {
    color: '#080d1a',
    fontSize: 12,
    fontWeight: '800',
  },
  commentFeedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  commentFeedTitle: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  commentCounter: {
    color: '#38bdf8',
    backgroundColor: '#082f49',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  commentCard: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  commentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  commentRole: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '600',
  },
  commentBody: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 4,
  },
  commentTime: {
    color: '#64748b',
    fontSize: 9,
  },

  // FOOTER
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    alignItems: 'center',
  },
  footerBrand: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  footerCopy: {
    color: '#64748b',
    fontSize: 10,
    marginBottom: 4,
  },
  footerNote: {
    color: '#475569',
    fontSize: 9,
    textAlign: 'center',
    maxWidth: 280,
  },

  // COVER SCREEN MODAL
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#070b16',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 100,
  },
  coverCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 24,
    borderColor: 'rgba(6, 182, 212, 0.35)',
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    maxWidth: 360,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 20,
  },
  coverBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  coverBadgeText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  coverAvatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#06b6d4',
    padding: 3,
    marginBottom: 16,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  coverAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 57,
  },
  coverSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  coverTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 2,
  },
  coverNick: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 10,
  },
  coverDesc: {
    color: '#cbd5e1',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
  },
  btnOpenPortfolio: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  btnOpenPortfolioText: {
    color: '#080d1a',
    fontSize: 13,
    fontWeight: '900',
  },
  coverHint: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 12,
  },
  directContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  directContactIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directContactLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  directContactValue: {
    fontSize: 13,
    color: '#f8fafc',
    fontWeight: '700',
    marginTop: 2,
  },
  directContactBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
});

registerRootComponent(App);

