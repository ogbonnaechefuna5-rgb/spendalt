import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SettingsRow } from '@/components/ui/settings-row';
import { useTheme } from '@/context/theme-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor, dividerColor, isDark, toggleTheme } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgDeep }} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <IconSymbol name="arrow.left" size={18} color={textColor} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: textColor }]}>Profile</Text>
        <View style={s.headerBtn} />
      </View>

      <View style={s.avatarSection}>
        <View style={s.avatarWrap}>
          <View style={[s.avatar, { backgroundColor: theme.card, borderColor: theme.green }]}>
            <IconSymbol name="person.fill" size={64} color={theme.green} />
          </View>
          <TouchableOpacity style={[s.editBadge, { backgroundColor: theme.green, borderColor: theme.bgDeep }]}>
            <IconSymbol name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={[s.name, { color: textColor }]}>Alex Thompson</Text>
        <Text style={[s.email, { color: theme.green }]}>alex.t@spendalt.io</Text>
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>ACCOUNT SETTINGS</Text>
      <View style={[s.section, { backgroundColor: theme.card, borderColor }]}>
        <SettingsRow icon={<IconSymbol name="person.fill" size={20} color={theme.green} />} title="Edit profile" subtitle="Update your personal details" onPress={() => router.push('/edit-profile')} />
        <View style={[s.divider, { backgroundColor: dividerColor }]} />
        <SettingsRow icon={<IconSymbol name="lock.shield.fill" size={20} color={theme.green} />} title="Security" subtitle="2FA, Password and Biometrics" onPress={() => router.push('/security')} />
        <View style={[s.divider, { backgroundColor: dividerColor }]} />
        <SettingsRow icon={<IconSymbol name="lock.fill" size={20} color={theme.green} />} title="Data permissions" subtitle="Manage connected bank accounts" onPress={() => router.push('/data-permissions')} />
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>FINANCIALS</Text>
      <View style={[s.section, { backgroundColor: theme.card, borderColor }]}>
        <SettingsRow icon={<IconSymbol name="doc.text.fill" size={20} color={theme.green} />} title="Export financial report" subtitle="Download PDF or CSV statements" rightIcon={<IconSymbol name="arrow.down.to.line" size={18} color={theme.green} />} />
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>SUPPORT</Text>
      <View style={[s.section, { backgroundColor: theme.card, borderColor }]}>
        <SettingsRow icon={<IconSymbol name="questionmark.circle.fill" size={20} color={theme.green} />} title="Help and support" subtitle="FAQs and direct chat" />
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>PREFERENCES</Text>
      <View style={[s.section, { backgroundColor: theme.card, borderColor }]}>
        <View style={s.themeRow}>
          <View style={[s.iconBox, { backgroundColor: theme.bgMid }]}>
            <IconSymbol name={isDark ? 'moon.fill' : 'sun.max.fill'} size={20} color={theme.green} />
          </View>
          <View style={s.themeText}>
            <Text style={[s.themeLabel, { color: textColor }]}>Dark Mode</Text>
            <Text style={[s.themeSub, { color: subTextColor }]}>Switch appearance</Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#ccc', true: theme.green }} thumbColor="#fff" />
        </View>
      </View>

      <TouchableOpacity style={[s.logoutBtn, { backgroundColor: theme.card, borderColor }]} onPress={() => router.replace('/login')}>
        <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color="#FF6B4A" />
        <Text style={s.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={[s.version, { color: subTextColor }]}>SPENDALT V2.4.0</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '800', fontSize: 18 },
  avatarSection: { alignItems: 'center', marginBottom: 36 },
  avatarWrap: { marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  name: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  email: { fontSize: 14 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.5, fontWeight: '700', marginBottom: 8, marginTop: 8 },
  section: { borderRadius: 16, paddingHorizontal: 16, marginBottom: 24, borderWidth: 1 },
  divider: { height: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 16, paddingVertical: 18, borderWidth: 1, marginBottom: 24 },
  logoutText: { color: '#FF6B4A', fontWeight: '700', fontSize: 16 },
  version: { textAlign: 'center', fontSize: 11, letterSpacing: 1.5, fontWeight: '600' },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 14 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  themeText: { flex: 1, gap: 3 },
  themeLabel: { fontWeight: '600', fontSize: 15 },
  themeSub: { fontSize: 12 },
});
