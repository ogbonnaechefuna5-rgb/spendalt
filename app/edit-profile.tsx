import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InputField } from '@/components/ui/input-field';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useTheme } from '@/context/theme-context';
import { getProfile, updateProfile, UserProfile } from '@/services/user-api';

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile().then(p => {
      setProfile(p);
      setFirstName(p.first_name);
      setLastName(p.last_name);
      setPhone(p.phone);
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await updateProfile({ first_name: firstName, last_name: lastName, phone });
      router.back();
    } catch (e: any) {
      setError(e.message ?? 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgDeep }} contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <IconSymbol name="arrow.left" size={18} color={textColor} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: textColor }]}>Edit Profile</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[s.cancel, { color: theme.green }]}>CANCEL</Text>
        </TouchableOpacity>
      </View>

      <View style={s.avatarSection}>
        <View style={s.avatarWrap}>
          <View style={[s.avatar, { backgroundColor: theme.card, borderColor: theme.green }]}>
            <IconSymbol name="person.fill" size={64} color={theme.green} />
          </View>
          <TouchableOpacity style={[s.cameraBadge, { backgroundColor: theme.green, borderColor: theme.bgDeep }]}>
            <IconSymbol name="camera.fill" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={[s.name, { color: textColor }]}>{profile ? `${profile.first_name} ${profile.last_name}` : '—'}</Text>
        <Text style={[s.since, { color: theme.green }]}>{profile ? profile.phone : ''}</Text>
      </View>

      <View style={s.form}>
        <InputField label="FIRST NAME" value={firstName} onChangeText={setFirstName} leftIcon={<IconSymbol name="person.fill" size={16} color={theme.green} />} />
        <InputField label="LAST NAME" value={lastName} onChangeText={setLastName} leftIcon={<IconSymbol name="person.fill" size={16} color={theme.green} />} />
        <InputField label="PHONE NUMBER" value={phone} onChangeText={setPhone} keyboardType="phone-pad" leftIcon={<IconSymbol name="phone.fill" size={16} color={theme.green} />} />
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}
      <PrimaryButton label={loading ? 'Saving…' : 'Save Changes'} onPress={handleSave} disabled={loading} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '800', fontSize: 18 },
  cancel: { fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },
  avatarSection: { alignItems: 'center', marginBottom: 36 },
  avatarWrap: { marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  name: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  since: { fontSize: 13 },
  form: { gap: 20, marginBottom: 24 },
  biometricRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 32 },
  biometricIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  biometricText: { flex: 1, gap: 3 },
  biometricTitle: { fontWeight: '700', fontSize: 15 },
  biometricSub: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  error: { color: '#ff6b6b', fontSize: 13, textAlign: 'center', marginBottom: 12 },
});
