import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SettingsRow } from '@/components/ui/settings-row';
import { useTheme } from '@/context/theme-context';

const SESSIONS = [
  { id: '1', device: 'iPhone 15 Pro', info: 'San Francisco, USA • App v4.2.1', icon: 'iphone' as const, current: true },
  { id: '2', device: 'MacBook Pro M2', info: 'Chrome Browser • 2 hours ago', icon: 'laptopcomputer' as const, current: false },
];

export default function SecurityScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor, dividerColor } = useTheme();
  const [biometric, setBiometric] = useState(false);
  const [txPin, setTxPin] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgDeep }} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <IconSymbol name="arrow.left" size={18} color={textColor} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: textColor }]}>Security Settings</Text>
        <TouchableOpacity style={s.helpBtn}>
          <IconSymbol name="questionmark.circle.fill" size={26} color={theme.green} />
        </TouchableOpacity>
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>ACCOUNT PROTECTION</Text>
      <View style={[s.section, { backgroundColor: theme.card, borderColor }]}>
        <SettingsRow icon={<IconSymbol name="lock.fill" size={20} color={theme.green} />} title="Change Password" subtitle="Last changed 3 months ago" />
        <View style={[s.divider, { backgroundColor: dividerColor }]} />
        <SettingsRow
          icon={<IconSymbol name="checkmark.shield.fill" size={20} color={theme.green} />}
          title="Two-Factor Auth"
          subtitle=""
          rightIcon={
            <View style={[s.enabledBadge, { backgroundColor: theme.bgMid, borderColor: theme.green }]}>
              <Text style={[s.enabledText, { color: theme.green }]}>ENABLED</Text>
            </View>
          }
        />
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>ACCESS METHODS</Text>
      <View style={[s.section, { backgroundColor: theme.card, borderColor }]}>
        <View style={s.toggleRow}>
          <View style={[s.toggleIcon, { backgroundColor: theme.bgMid }]}>
            <IconSymbol name="touchid" size={20} color={theme.green} />
          </View>
          <View style={s.toggleText}>
            <Text style={[s.toggleTitle, { color: textColor }]}>Biometric Login</Text>
            <Text style={[s.toggleSub, { color: subTextColor }]}>Use Face ID or Fingerprint</Text>
          </View>
          <Switch value={biometric} onValueChange={setBiometric} trackColor={{ false: '#ccc', true: theme.green }} thumbColor="#fff" />
        </View>
        <View style={[s.divider, { backgroundColor: dividerColor }]} />
        <View style={s.toggleRow}>
          <View style={[s.toggleIcon, { backgroundColor: theme.bgMid }]}>
            <IconSymbol name="number.square.fill" size={20} color={theme.green} />
          </View>
          <View style={s.toggleText}>
            <Text style={[s.toggleTitle, { color: textColor }]}>Transaction PIN</Text>
            <Text style={[s.toggleSub, { color: subTextColor }]}>Required for transfers</Text>
          </View>
          <Switch value={txPin} onValueChange={setTxPin} trackColor={{ false: '#ccc', true: theme.green }} thumbColor="#fff" />
        </View>
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>RECENT ACTIVITY</Text>
      <View style={[s.section, { backgroundColor: theme.card, borderColor }]}>
        <View style={s.sessionsHeader}>
          <View style={s.sessionsLeft}>
            <IconSymbol name="desktopcomputer" size={20} color={theme.green} />
            <Text style={[s.sessionsTitle, { color: textColor }]}>Active Sessions</Text>
          </View>
          <TouchableOpacity>
            <Text style={[s.logoutAll, { color: theme.green }]}>LOGOUT ALL</Text>
          </TouchableOpacity>
        </View>
        {SESSIONS.map(session => (
          <View key={session.id}>
            <View style={[s.divider, { backgroundColor: dividerColor }]} />
            <View style={s.sessionRow}>
              <View style={[s.toggleIcon, { backgroundColor: theme.bgMid }]}>
                <IconSymbol name={session.icon} size={20} color={theme.green} />
              </View>
              <View style={s.toggleText}>
                <Text style={[s.toggleTitle, { color: textColor }]}>{session.device}</Text>
                <Text style={[s.toggleSub, { color: subTextColor }]}>{session.info}</Text>
              </View>
              {session.current
                ? <View style={[s.currentBadge, { backgroundColor: theme.bgMid, borderColor: theme.green }]}><Text style={[s.currentText, { color: theme.green }]}>CURRENT</Text></View>
                : <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color={theme.green} />
              }
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  helpBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '800', fontSize: 18 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.5, fontWeight: '700', marginBottom: 8, marginTop: 8 },
  section: { borderRadius: 16, paddingHorizontal: 16, marginBottom: 24, borderWidth: 1 },
  divider: { height: 1 },
  enabledBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  enabledText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  toggleIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  toggleText: { flex: 1, gap: 3 },
  toggleTitle: { fontWeight: '600', fontSize: 15 },
  toggleSub: { fontSize: 12 },
  sessionsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  sessionsLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sessionsTitle: { fontWeight: '600', fontSize: 15 },
  logoutAll: { fontWeight: '700', fontSize: 12, letterSpacing: 0.5 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  currentBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  currentText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});
