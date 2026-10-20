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
        'Keren banget Mas Dewan! Tampilan clean ala Apple/Stripe sangat nyaman dibaca di HP, dan semua link WhatsApp serta GitHub langsung aktif.',
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
    Alert.alert('Terima Kasih! 🎉', 'Pesan Anda telah berhasil ditambahkan ke Buku Tamu.');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* STICKY HEADER */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>DP</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Dewan M. Pratama</Text>
            <Text style={styles.headerSubtitle}>Informatics Engineering</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => handleOpenLink('https://github.com/dewanmochpratama23-sys', 'GitHub')}
            activeOpacity={0.7}
          >
            <SafeIcon name="github" size={15} color="#0f172a" fallback="GH" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtnWhatsApp}
            onPress={() => handleOpenLink('https://wa.me/6283137538544?text=Halo%20Dewan,%20saya%20melihat%20portofolio%20Anda', 'WhatsApp')}
            activeOpacity={0.7}
          >
            <SafeIcon name="whatsapp" size={15} color="#10b981" fallback="WA" />
            <Text style={styles.headerWhatsAppText}>Kontak</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN SCROLLABLE CONTENT */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. WELCOMING HERO CARD (Clean Modern Light) */}
        <View style={styles.heroCard}>
          {/* Status Badge */}
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusBadgeText}>Terbuka untuk Kolaborasi Tech</Text>
            </View>
            <Text style={styles.academicTrackText}>S1 Teknik Informatika</Text>
          </View>

          {/* Portrait Photo & Name */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarBorder}>
              <Image source={PROFILE_IMAGE} style={styles.avatarImage} resizeMode="cover" />
            </View>
            <View style={styles.profileHeaderTexts}>
              <Text style={styles.heroPretitle}>PORTOFOLIO REKAYASA PERANGKAT LUNAK</Text>
              <Text style={styles.heroTitle}>Dewan Mochamad Pratama</Text>
              <Text style={styles.heroSubtitle}>
                Panggilan: <Text style={{ fontWeight: '700', color: '#0f172a' }}>Dewan / Tama</Text>
              </Text>
              <Text style={styles.roleHighlight}>Software & Mobile App Developer</Text>
            </View>
          </View>

          {/* Narrative Bio */}
          <Text style={styles.heroBio}>
            Selamat datang di portofolio mobile resmi saya. Mahasiswa Teknik Informatika yang berfokus pada 
            rekayasa perangkat lunak modern, pengembangan aplikasi mobile cross-platform, dan Computer Vision (Face Recognition) berbasis Python.
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
                style={styles.btnSecondary}
                activeOpacity={0.8}
                onPress={() => handleOpenLink('mailto:dewan.mochpratama23@gmail.com', 'Email')}
              >
                <SafeIcon name="envelope" size={14} color="#0f172a" fallback="✉" />
                <Text style={styles.btnSecondaryText}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSecondary}
                activeOpacity={0.8}
                onPress={() => handleOpenLink('https://www.linkedin.com/in/dewan-mochamad-pratama-8947452a6/', 'LinkedIn')}
              >
                <SafeIcon name="linkedin" size={14} color="#2563eb" fallback="IN" />
                <Text style={styles.btnSecondaryText}>LinkedIn</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSecondary}
                activeOpacity={0.8}
                onPress={() => handleOpenLink('https://github.com/dewanmochpratama23-sys', 'GitHub')}
              >
                <SafeIcon name="github" size={14} color="#0f172a" fallback="GH" />
                <Text style={styles.btnSecondaryText}>GitHub</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Highlights Metrics */}
          <View style={styles.metricGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Fokus Bidang</Text>
              <Text style={styles.metricValue}>Software & Mobile</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Proyek Utama</Text>
              <Text style={styles.metricValue}>Face Recog & App</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Platform</Text>
              <Text style={styles.metricValue}>Desktop & Mobile</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Version Control</Text>
              <Text style={styles.metricValue}>Git & GitHub</Text>
            </View>
          </View>
        </View>

        {/* 2. PROYEK UNGGULAN (PORTFOLIO PROJECTS) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionBadge}>SHOWCASE KARYA</Text>
          <Text style={styles.sectionTitle}>Proyek & Implementasi Rekayasa</Text>
          <Text style={styles.sectionSubtitle}>Dua proyek utama yang telah selesai dibangun dan tersimpan di GitHub.</Text>
        </View>

        {/* Proyek 1: Face Recognition */}
        <View style={styles.projectCard}>
          <View style={styles.projectCardTop}>
            <View style={styles.tagBadgeIndigo}>
              <Text style={styles.tagBadgeIndigoText}>Computer Vision & AI</Text>
            </View>
            <Text style={styles.platformLabel}>Desktop Application</Text>
          </View>

          <Text style={styles.projectTitle}>Sistem Deteksi & Pengenalan Wajah (Face Recognition)</Text>
          <Text style={styles.projectStack}>Python 3, OpenCV, Tkinter GUI, NumPy</Text>

          <Text style={styles.projectDesc}>
            Aplikasi desktop berbasis Python dan OpenCV untuk mendeteksi wajah secara real-time melalui kamera komputer, 
            mengekstrak fitur biometrik, melatih dataset, dan mengenali identitas individu dengan akurasi tinggi.
          </Text>

          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✔ Deteksi wajah multi-frame real-time via OpenCV</Text>
            <Text style={styles.featureItem}>✔ Pelatihan dataset mandiri & verifikasi identitas</Text>
            <Text style={styles.featureItem}>✔ Antarmuka pengguna desktop berbasis Tkinter</Text>
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
        <View style={styles.projectCard}>
          <View style={styles.projectCardTop}>
            <View style={styles.tagBadgeBlue}>
              <Text style={styles.tagBadgeBlueText}>Mobile Engineering</Text>
            </View>
            <Text style={styles.platformLabel}>Android & iOS Native</Text>
          </View>

          <Text style={styles.projectTitle}>Interactive Mobile Portfolio & Identity App</Text>
          <Text style={styles.projectStack}>React Native, Expo SDK 57, JavaScript ES6+</Text>

          <Text style={styles.projectDesc}>
            Aplikasi mobile interaktif berbasis React Native untuk mempresentasikan rekam jejak rekayasa secara native. 
            Mendukung integrasi langsung WhatsApp, Telepon, Email, LinkedIn, dan form masukan interaktif.
          </Text>

          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✔ Cross-platform murni dengan dukungan Expo Go live debugging</Text>
            <Text style={styles.featureItem}>✔ Deep-linking otomatis ke WhatsApp, LinkedIn, GitHub & Email</Text>
            <Text style={styles.featureItem}>✔ Auto IP detection script (start.js) untuk Wi-Fi kampus & rumah</Text>
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
          <Text style={styles.sectionTitle}>Keahlian & Perkakas Pengembangan</Text>
        </View>

        <View style={styles.skillsCard}>
          <Text style={styles.skillsCardCategory}>📱 Mobile & Frontend Development</Text>
          <View style={styles.skillPillContainer}>
            {['React Native', 'Expo', 'JavaScript (ES6+)', 'HTML5', 'CSS3 & Tailwind', 'Responsive UI'].map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <Text style={styles.skillPillText}>{skill}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.skillsCardCategory, { marginTop: 16 }]}>🧠 Python & Computer Vision</Text>
          <View style={styles.skillPillContainer}>
            {['Python 3.x', 'OpenCV', 'Face Recognition', 'NumPy Matrix', 'Tkinter GUI'].map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <Text style={styles.skillPillText}>{skill}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.skillsCardCategory, { marginTop: 16 }]}>⚙️ Workflow & Tools</Text>
          <View style={styles.skillPillContainer}>
            {['Git Version Control', 'GitHub', 'VS Code', 'Node.js & npm', 'PowerShell / CLI'].map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <Text style={styles.skillPillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4. INTERACTIVE SKILL BOUNCE LAB */}
        <View style={styles.labCard}>
          <View style={styles.labHeader}>
            <Text style={styles.labTitle}>⚡ Lab Interaktif: Sentuh Token Keahlian</Text>
            <Text style={styles.labSubtitle}>Ketuk token untuk memicu simulasi fisika pegas (spring physics):</Text>
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
                  style={styles.tokenButton}
                  onPress={() => bounceToken(index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tokenButtonText}>{token}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* 5. BUKU TAMU INTERAKTIF */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionBadge}>INTERAKSI & MASUKAN</Text>
          <Text style={styles.sectionTitle}>Buku Tamu & Catatan Dosen</Text>
        </View>

        <View style={styles.guestbookCard}>
          <Text style={styles.formTitle}>Tulis Pesan / Masukan</Text>

          <Text style={styles.formLabel}>Nama Lengkap / Instansi</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Pak Budi (Dosen / Rekan)"
            placeholderTextColor="#94a3b8"
            value={guestName}
            onChangeText={setGuestName}
          />

          <Text style={styles.formLabel}>Peran / Kategori</Text>
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
            <Text style={styles.btnSubmitCommentText}> Kirim ke Buku Tamu</Text>
          </TouchableOpacity>

          {/* Comment List Feed */}
          <View style={styles.commentFeedHeader}>
            <Text style={styles.commentFeedTitle}>Daftar Pesan Masuk</Text>
            <Text style={styles.commentCounter}>{comments.length} Pesan</Text>
          </View>

          {comments.map((item) => (
            <View key={item.id} style={styles.commentCard}>
              <View style={styles.commentCardTop}>
                <Text style={styles.commentAuthor}>{item.name}</Text>
                <Text style={styles.commentTime}>{item.time}</Text>
              </View>
              <View style={styles.commentRolePill}>
                <Text style={styles.commentRolePillText}>{item.role}</Text>
              </View>
              <Text style={styles.commentBody}>{item.message}</Text>
            </View>
          ))}
        </View>

        {/* 6. KONTAK RESMI & SOSIAL MEDIA */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionBadge}>SALURAN KOMUNIKASI</Text>
          <Text style={styles.sectionTitle}>Hubungi & Terhubung</Text>
        </View>

        <View style={styles.contactGrid}>
          {/* WhatsApp */}
          <TouchableOpacity
            style={styles.contactCard}
            activeOpacity={0.8}
            onPress={() => handleOpenLink('https://wa.me/6283137538544?text=Halo%20Dewan,%20saya%20melihat%20portofolio%20Anda.', 'WhatsApp')}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: '#ecfdf5' }]}>
              <SafeIcon name="whatsapp" size={24} color="#10b981" fallback="WA" />
            </View>
            <Text style={styles.contactCardTitle}>WhatsApp</Text>
            <Text style={styles.contactCardSubtitle}>0831-3753-8544</Text>
            <Text style={[styles.contactCardAction, { color: '#10b981' }]}>Chat Langsung &rarr;</Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            style={styles.contactCard}
            activeOpacity={0.8}
            onPress={() => handleOpenLink('mailto:dewan.mochpratama23@gmail.com', 'Email')}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: '#eff6ff' }]}>
              <SafeIcon name="envelope" size={20} color="#2563eb" fallback="✉" />
            </View>
            <Text style={styles.contactCardTitle}>Email</Text>
            <Text style={styles.contactCardSubtitle} numberOfLines={1}>dewan.mochpratama23@gmail.com</Text>
            <Text style={[styles.contactCardAction, { color: '#2563eb' }]}>Kirim Email &rarr;</Text>
          </TouchableOpacity>

          {/* LinkedIn */}
          <TouchableOpacity
            style={styles.contactCard}
            activeOpacity={0.8}
            onPress={() => handleOpenLink('https://www.linkedin.com/in/dewan-mochamad-pratama-8947452a6/', 'LinkedIn')}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: '#eef2ff' }]}>
              <SafeIcon name="linkedin" size={22} color="#4f46e5" fallback="IN" />
            </View>
            <Text style={styles.contactCardTitle}>LinkedIn</Text>
            <Text style={styles.contactCardSubtitle}>Dewan Mochamad Pratama</Text>
            <Text style={[styles.contactCardAction, { color: '#4f46e5' }]}>Koneksi &rarr;</Text>
          </TouchableOpacity>

          {/* GitHub */}
          <TouchableOpacity
            style={styles.contactCard}
            activeOpacity={0.8}
            onPress={() => handleOpenLink('https://github.com/dewanmochpratama23-sys', 'GitHub')}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: '#f1f5f9' }]}>
              <SafeIcon name="github" size={22} color="#0f172a" fallback="GH" />
            </View>
            <Text style={styles.contactCardTitle}>GitHub</Text>
            <Text style={styles.contactCardSubtitle}>dewanmochpratama23-sys</Text>
            <Text style={[styles.contactCardAction, { color: '#0f172a' }]}>Repositori &rarr;</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dewan Mochamad Pratama &copy; 2026. Karawang, Jawa Barat.
          </Text>
          <Text style={styles.footerSubtext}>
            Dokumentasi Tugas Portofolio Mandiri S1 Teknik Informatika
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#64748b',
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
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
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
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },

  // Hero Card
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    borderBottomColor: '#f1f5f9',
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
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  avatarBorder: {
    width: 76,
    height: 76,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  heroSubtitle: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  roleHighlight: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  heroBio: {
    color: '#475569',
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
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  btnSecondaryText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '600',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#0f172a',
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
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  sectionSubtitle: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },

  // Project Cards
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
  },
  projectStack: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  projectDesc: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  featureList: {
    gap: 4,
    marginBottom: 14,
  },
  featureItem: {
    color: '#334155',
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
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  skillsCardCategory: {
    color: '#0f172a',
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
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  skillPillText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '600',
  },

  // Lab
  labCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  labHeader: {
    marginBottom: 12,
  },
  labTitle: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  labSubtitle: {
    color: '#64748b',
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
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  tokenButtonText: {
    color: '#1d4ed8',
    fontSize: 11,
    fontWeight: '700',
  },

  // Guestbook
  guestbookCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  formLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0f172a',
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
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  roleBadgeActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  roleBadgeText: {
    color: '#64748b',
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
    borderTopColor: '#f1f5f9',
    marginBottom: 10,
  },
  commentFeedTitle: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700',
  },
  commentCounter: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  commentCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 8,
  },
  commentCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentAuthor: {
    color: '#0f172a',
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
    color: '#475569',
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  contactCardSubtitle: {
    color: '#64748b',
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
    borderTopColor: '#e2e8f0',
    marginTop: 8,
  },
  footerText: {
    color: '#0f172a',
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
