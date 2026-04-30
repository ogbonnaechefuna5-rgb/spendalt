import { IconSymbol } from '@/components/ui/icon-symbol';
import { SettingsRow } from '@/components/ui/settings-row';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { getSessions, revokeAllSessions, revokeSession, changePassword, UserSession } from '@/services/user-api';
import { useUI } from '@/context/ui-context';

export default function SecurityScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor, dividerColor } = useTheme();
  const {
    hasBiometrics,
    biometricEnabled,
    passcodeEnabled,
    enableBiometric,
    disableBiometric,
    enablePasscode,
    disablePasscode,
    logout,
  } = useAuth();

  const [bioLoading, setBioLoading] = useState(false);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const { showDialog, showToast } = useUI();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => { getSessions().then(setSessions).catch(() => {}); }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) { setPwError('Both fields are required.'); return; }
    setPwLoading(true); setPwError('');
    try {
      await changePassword({ old_password: oldPassword, new_password: newPassword });
      setOldPassword(''); setNewPassword('');
      showToast({ message: 'Password changed successfully.', type: 'success' });
    } catch (e: any) {
      setPwError(e.message ?? 'Failed to change password.');
    } finally { setPwLoading(false); }
  };

  const handleRevokeAll = () => {
    showDialog({
      title: 'Logout All Sessions',
      message: 'This will sign you out of all devices.',
      actions: [
        { label: 'Cancel', variant: 'ghost', onPress: () => {} },
        { label: 'Logout All', variant: 'destructive', onPress: async () => {
          try {
            await revokeAllSessions();
          } catch { /* session already expired — treat as success */ }
          await logout();
          router.replace('/login');
        }},
      ],
    });
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      setBioLoading(true);
      const success = await enableBiometric();
      setBioLoading(false);
      if (!success) showToast({ message: 'Could not enable biometric login.', type: 'error' });
    } else {
      showDialog({
        title: 'Disable Biometric Login',
        message: 'Are you sure you want to disable biometric login?',
        actions: [
          { label: 'Cancel', variant: 'ghost', onPress: () => {} },
          { label: 'Disable', variant: 'destructive', onPress: disableBiometric },
        ],
      });
    }
  };

  const handlePasscodeToggle = async (value: boolean) => {
    if (value) {
      router.push('/setup-passcode');
    } else {
      showDialog({
        title: 'Disable Passcode',
        message: 'This will remove your saved passcode. Are you sure?',
        actions: [
          { label: 'Cancel', variant: 'ghost', onPress: () => {} },
          { label: 'Disable', variant: 'destructive', onPress: disablePasscode },
        ],
      });
    }
  };

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
        <SettingsRow icon={<IconSymbol name="lock.fill" size={20} color={theme.green} />} title="Change Password" subtitle="Last changed 3 months ago" onPress={() =>
          showDialog({
            title: 'Change Password',
            message: 'Use the security settings to update your password.',
            actions: [{ label: 'OK', variant: 'primary', onPress: () => {} }],
          })
        } />
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

        {/* Biometric */}
        <View style={s.toggleRow}>
          <View style={[s.toggleIcon, { backgroundColor: theme.bgMid }]}>
            <IconSymbol name="touchid" size={20} color={hasBiometrics ? theme.green : subTextColor} />
          </View>
          <View style={s.toggleText}>
            <Text style={[s.toggleTitle, { color: textColor }]}>Biometric Login</Text>
            <Text style={[s.toggleSub, { color: subTextColor }]}>
              {hasBiometrics ? 'Use Face ID or Fingerprint' : 'Not available on this device'}
            </Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={handleBiometricToggle}
            disabled={!hasBiometrics || bioLoading}
            trackColor={{ false: '#ccc', true: theme.green }}
            thumbColor="#fff"
          />
        </View>

        <View style={[s.divider, { backgroundColor: dividerColor }]} />

        {/* Passcode */}
        <View style={s.toggleRow}>
          <View style={[s.toggleIcon, { backgroundColor: theme.bgMid }]}>
            <IconSymbol name="number.square.fill" size={20} color={theme.green} />
          </View>
          <View style={s.toggleText}>
            <Text style={[s.toggleTitle, { color: textColor }]}>App Passcode</Text>
            <Text style={[s.toggleSub, { color: subTextColor }]}>
              {passcodeEnabled ? 'Passcode set — tap to change' : 'Set a 6-digit passcode to unlock'}
            </Text>
          </View>
          <View style={s.passcodeRight}>
            <Switch
              value={passcodeEnabled}
              onValueChange={handlePasscodeToggle}
              trackColor={{ false: '#ccc', true: theme.green }}
              thumbColor="#fff"
            />
            {passcodeEnabled && (
              <TouchableOpacity onPress={() => router.push('/setup-passcode')}>
                <Text style={[s.changePin, { color: theme.green }]}>Change</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>RECENT ACTIVITY</Text>
      <View style={[s.section, { backgroundColor: theme.card, borderColor }]}>
        <View style={s.sessionsHeader}>
          <View style={s.sessionsLeft}>
            <IconSymbol name="desktopcomputer" size={20} color={theme.green} />
            <Text style={[s.sessionsTitle, { color: textColor }]}>Active Sessions</Text>
          </View>
          <TouchableOpacity onPress={handleRevokeAll}>
            <Text style={[s.logoutAll, { color: theme.green }]}>LOGOUT ALL</Text>
          </TouchableOpacity>
        </View>
        {(sessions.length > 0 ? sessions : []).map((session, i) => (
          <View key={session.id}>
            <View style={[s.divider, { backgroundColor: dividerColor }]} />
            <View style={s.sessionRow}>
              <View style={[s.toggleIcon, { backgroundColor: theme.bgMid }]}>
                <IconSymbol name="iphone" size={20} color={theme.green} />
              </View>
              <View style={s.toggleText}>
                <Text style={[s.toggleTitle, { color: textColor }]}>
                  {session.device || session.os || 'Unknown Device'}
                </Text>
                <Text style={[s.toggleSub, { color: subTextColor }]}>
                  {[session.device_type, session.os, session.app_version].filter(Boolean).join(' · ')}
                </Text>
                <Text style={[s.toggleSub, { color: subTextColor }]}>
                  {session.ip_address} · {new Date(session.created_at).toLocaleDateString()}
                </Text>
              </View>
              {i === 0
                ? <View style={[s.currentBadge, { backgroundColor: theme.bgMid, borderColor: theme.green }]}><Text style={[s.currentText, { color: theme.green }]}>CURRENT</Text></View>
                : <TouchableOpacity onPress={async () => {
                    await revokeSession(session.id);
                    setSessions(prev => prev.filter(s => s.id !== session.id));
                  }}>
                    <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color={theme.green} />
                  </TouchableOpacity>
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
  passcodeRight: { alignItems: 'center', gap: 4 },
  changePin: { fontSize: 11, fontWeight: '700' },
  sessionsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  sessionsLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sessionsTitle: { fontWeight: '600', fontSize: 15 },
  logoutAll: { fontWeight: '700', fontSize: 12, letterSpacing: 0.5 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  currentBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  currentText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});
