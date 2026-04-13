import { IconSymbol } from '@/components/ui/icon-symbol';
import { InputField } from '@/components/ui/input-field';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenFooter } from '@/components/ui/screen-footer';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SocialButton } from '@/components/ui/social-button';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { theme, textColor, subTextColor } = useTheme();
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!firstName || !lastName || !phone || !password) { setError('Please fill in all required fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    try {
      await signup(phone, password, firstName, lastName, email || undefined, middleName || undefined);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[s.container, { backgroundColor: theme.bgDeep }]} keyboardShouldPersistTaps="handled">
      <ScreenHeader title="Create Account" />

      <Text style={[s.title, { color: textColor }]}>Start your journey</Text>
      <Text style={[s.subtitle, { color: subTextColor }]}>Create an account to take control of your finances.</Text>

      <View style={s.form}>
        <InputField label="First Name" placeholder="Jane" autoCapitalize="words" value={firstName} onChangeText={setFirstName} maxLength={50} leftIcon={<IconSymbol name="person.fill" size={16} color={subTextColor} />} />
        <InputField label="Middle Name (optional)" placeholder="Marie" autoCapitalize="words" value={middleName} onChangeText={setMiddleName} maxLength={50} leftIcon={<IconSymbol name="person.fill" size={16} color={subTextColor} />} />
        <InputField label="Last Name" placeholder="Doe" autoCapitalize="words" value={lastName} onChangeText={setLastName} maxLength={50} leftIcon={<IconSymbol name="person.fill" size={16} color={subTextColor} />} />
        <InputField label="Email (optional)" placeholder="jane@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} maxLength={100} leftIcon={<IconSymbol name="envelope.fill" size={16} color={subTextColor} />} />
        <InputField label="Phone Number" placeholder="+2348012345678" keyboardType="phone-pad" value={phone} onChangeText={setPhone} maxLength={20} leftIcon={<IconSymbol name="phone.fill" size={16} color={subTextColor} />} />
        <InputField label="Password" placeholder="••••••••" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} maxLength={128} leftIcon={<IconSymbol name="lock.fill" size={16} color={subTextColor} />} rightIcon={<TouchableOpacity onPress={() => setShowPassword(v => !v)}><IconSymbol name={showPassword ? 'eye.slash.fill' : 'eye.fill'} size={18} color={subTextColor} /></TouchableOpacity>} />
        <InputField label="Confirm Password" placeholder="••••••••" secureTextEntry={!showConfirm} value={confirm} onChangeText={setConfirm} maxLength={128} leftIcon={<IconSymbol name="lock.fill" size={16} color={subTextColor} />} rightIcon={<TouchableOpacity onPress={() => setShowConfirm(v => !v)}><IconSymbol name={showConfirm ? 'eye.slash.fill' : 'eye.fill'} size={18} color={subTextColor} /></TouchableOpacity>} />
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}

      <PrimaryButton label={loading ? 'Creating account…' : 'Create Account →'} onPress={handleSignup} style={s.cta} disabled={loading} />

      <Text style={[s.orText, { color: subTextColor }]}>Or sign up with</Text>

      <View style={s.socialRow}>
        <SocialButton label="Google" icon={<IconSymbol name="globe" size={20} color={textColor} />} />
        <SocialButton label="Apple" icon={<IconSymbol name="apple.logo" size={20} color={textColor} />} />
      </View>

      <View style={s.loginRow}>
        <Text style={[s.loginText, { color: subTextColor }]}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={[s.loginLink, { color: theme.green }]}>Log in</Text>
        </TouchableOpacity>
      </View>

      <ScreenFooter />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 10 },
  subtitle: { fontSize: 14, lineHeight: 22, marginBottom: 32 },
  form: { gap: 20, marginBottom: 12 },
  cta: { marginBottom: 24 },
  orText: { textAlign: 'center', fontSize: 13, marginBottom: 16 },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  loginText: { fontSize: 14 },
  loginLink: { fontWeight: '700', fontSize: 14 },
  error: { color: '#ff6b6b', fontSize: 13, marginBottom: 12, textAlign: 'center' },
});
