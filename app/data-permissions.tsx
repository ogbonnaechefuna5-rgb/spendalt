import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SettingsRow } from '@/components/ui/settings-row';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useTheme } from '@/context/theme-context';

export default function DataPermissionsScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor, dividerColor } = useTheme();
  const [sms, setSms] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [offers, setOffers] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgDeep }} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <IconSymbol name="arrow.left" size={18} color={textColor} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: textColor }]}>Data Permissions</Text>
        <View style={s.headerBtn} />
      </View>

      <Text style={[s.pageTitle, { color: textColor }]}>Account Privacy</Text>
      <Text style={[s.pageSubtitle, { color: theme.green }]}>Manage how Spendalt accesses your financial data to help you save more.</Text>

      <Text style={[s.sectionLabel, { color: theme.green }]}>FINANCIAL CONNECTIONS</Text>
      <View style={[s.section, { backgroundColor: theme.card, borderColor }]}>
        <SettingsRow icon={<IconSymbol name="building.columns.fill" size={20} color={theme.green} />} title="Linked Bank Accounts" subtitle="2 accounts connected" onPress={() => router.push('/linked-accounts')} />
      </View>
      <View style={s.infoBox}>
        <IconSymbol name="info.circle.fill" size={16} color={theme.green} />
        <Text style={[s.infoText, { color: subTextColor }]}>
          We need access to your bank accounts to automatically categorize your spending and provide real-time balance updates. Data is encrypted and read-only.
        </Text>
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>DETECTION & AUTOMATION</Text>
      <View style={[s.section, { backgroundColor: theme.card, borderColor }]}>
        <View style={s.toggleRow}>
          <View style={[s.toggleIcon, { backgroundColor: theme.bgMid }]}>
            <IconSymbol name="message.fill" size={20} color={theme.green} />
          </View>
          <View style={s.toggleText}>
            <Text style={[s.toggleTitle, { color: textColor }]}>SMS Transaction{'\n'}Detection</Text>
            <Text style={[s.toggleSub, { color: subTextColor }]}>Real-time alert parsing</Text>
          </View>
          <Switch value={sms} onValueChange={setSms} trackColor={{ false: '#ccc', true: theme.green }} thumbColor="#fff" />
        </View>
      </View>
      <View style={s.infoBox}>
        <IconSymbol name="checkmark.shield.fill" size={16} color={theme.green} />
        <Text style={[s.infoText, { color: subTextColor }]}>
          Spendalt scans for bank SMS notifications to capture cash expenses and transactions not yet visible in your bank feed. We never read personal messages.
        </Text>
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>PREFERENCES</Text>
      <View style={[s.section, { backgroundColor: theme.card, borderColor }]}>
        <View style={s.toggleRow}>
          <View style={[s.toggleIcon, { backgroundColor: theme.bgMid }]}>
            <IconSymbol name="chart.bar.fill" size={20} color={theme.green} />
          </View>
          <View style={s.toggleText}>
            <Text style={[s.toggleTitle, { color: textColor }]}>Anonymized Analytics</Text>
            <Text style={[s.toggleSub, { color: subTextColor }]}>Improve app performance</Text>
          </View>
          <Switch value={analytics} onValueChange={setAnalytics} trackColor={{ false: '#ccc', true: theme.green }} thumbColor="#fff" />
        </View>
        <View style={[s.divider, { backgroundColor: dividerColor }]} />
        <View style={s.toggleRow}>
          <View style={[s.toggleIcon, { backgroundColor: theme.bgMid }]}>
            <IconSymbol name="square.and.arrow.up.fill" size={20} color={theme.green} />
          </View>
          <View style={s.toggleText}>
            <Text style={[s.toggleTitle, { color: textColor }]}>Partner Offers</Text>
            <Text style={[s.toggleSub, { color: subTextColor }]}>Better loan & credit rates</Text>
          </View>
          <Switch value={offers} onValueChange={setOffers} trackColor={{ false: '#ccc', true: theme.green }} thumbColor="#fff" />
        </View>
      </View>

      <Text style={[s.legal, { color: subTextColor }]}>
        By enabling these permissions, you agree to Spendalt's{' '}
        <Text style={[s.legalLink, { color: theme.green }]}>Privacy Policy</Text> and{' '}
        <Text style={[s.legalLink, { color: theme.green }]}>Terms of Service</Text>.
      </Text>

      <PrimaryButton label="Save Preferences" onPress={() => router.back()} style={s.cta} />

      <TouchableOpacity style={s.revokeBtn}>
        <Text style={[s.revokeText, { color: theme.green }]}>Revoke All Access</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '800', fontSize: 18 },
  pageTitle: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  pageSubtitle: { fontSize: 14, lineHeight: 22, marginBottom: 28 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.5, fontWeight: '700', marginBottom: 8, marginTop: 8 },
  section: { borderRadius: 16, paddingHorizontal: 16, marginBottom: 12, borderWidth: 1 },
  divider: { height: 1 },
  infoBox: { flexDirection: 'row', gap: 10, marginBottom: 20, paddingHorizontal: 4 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  toggleIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  toggleText: { flex: 1, gap: 3 },
  toggleTitle: { fontWeight: '600', fontSize: 15 },
  toggleSub: { fontSize: 12 },
  legal: { fontSize: 12, lineHeight: 20, textAlign: 'center', marginBottom: 24, marginTop: 8 },
  legalLink: { fontWeight: '700' },
  cta: { marginBottom: 16 },
  revokeBtn: { alignItems: 'center', paddingVertical: 8 },
  revokeText: { fontSize: 14, fontWeight: '600' },
});
