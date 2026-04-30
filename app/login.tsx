import { IconSymbol } from '@/components/ui/icon-symbol';
import { InputField } from '@/components/ui/input-field';
import { Logo } from '@/components/ui/logo';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenFooter } from '@/components/ui/screen-footer';
import { SocialButton } from '@/components/ui/social-button';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const { login, hasBiometrics, biometricEnabled, passcodeEnabled, biometricTypes, authenticateBiometric } = useAuth();

  const isFaceID = biometricTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  const biometricIcon = isFaceID ? 'faceid' : 'touchid';
  const biometricLabel = isFaceID ? 'Face ID' : 'Fingerprint';

  const handleLogin = async () => {
    if (!identifier || !password) { setError('Phone/email and password are required.'); return; }
    setError('');
    setLoading(true);
    try {
      await login(identifier, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    setError('');
    const success = await authenticateBiometric();
    if (success) {
      router.replace('/(tabs)');
    } else {
      setError(`${biometricLabel} failed. Try again.`);
    }
  };

  const handlePasscode = () => {
    router.push('/local-auth?passcode=1');
  };

  const showBiometric = hasBiometrics && biometricEnabled;
  const showPasscode = passcodeEnabled;
  const showQuickAccess = showBiometric || showPasscode;

  return (
    <ScrollView contentContainerStyle={[s.container, { backgroundColor: theme.bgDeep }]} keyboardShouldPersistTaps="handled">
      <View style={s.header}>
        <Logo size="sm" />
        <TouchableOpacity style={[s.helpBtn, { borderColor }]}>
          <IconSymbol name="questionmark.circle" size={24} color={subTextColor} />
        </TouchableOpacity>
      </View>

      <Text style={[s.title, { color: textColor }]}>Grow your wealth</Text>
      <Text style={[s.subtitle, { color: subTextColor }]}>Enter your phone number to continue to your premium account.</Text>

      <View style={s.form}>
        <InputField
          label="Phone or Email"
          placeholder="+2348012345678 or jane@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={identifier}
          onChangeText={setIdentifier}
          maxLength={100}
          leftIcon={<IconSymbol name="person.fill" size={16} color={subTextColor} />}
        />
        <InputField
          label="Password"
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoComplete="off"
          leftIcon={<IconSymbol name="lock.fill" size={16} color={subTextColor} />}
          rightLabel={<TouchableOpacity onPress={() => router.push('/forgot-password')}><Text style={[s.forgot, { color: theme.green }]}>Forgot?</Text></TouchableOpacity>}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
              <IconSymbol name={showPassword ? 'eye.slash.fill' : 'eye.fill'} size={18} color={subTextColor} />
            </TouchableOpacity>
          }
        />
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}

      <PrimaryButton label={loading ? 'Signing in…' : 'Continue →'} onPress={handleLogin} style={s.cta} disabled={loading} />

      {showQuickAccess && (
        <>
          <Text style={[s.orText, { color: subTextColor }]}>Or unlock with</Text>
          <View style={s.quickRow}>
            {showBiometric && (
              <TouchableOpacity
                style={[s.quickBtn, { borderColor: theme.green + '50', backgroundColor: theme.green + '12' }]}
                onPress={handleBiometric}
                activeOpacity={0.7}
              >
                <IconSymbol name={biometricIcon} size={26} color={theme.green} />
                <Text style={[s.quickLabel, { color: theme.green }]}>{biometricLabel}</Text>
              </TouchableOpacity>
            )}
            {showPasscode && (
              <TouchableOpacity
                style={[s.quickBtn, { borderColor: subTextColor + '40', backgroundColor: subTextColor + '10' }]}
                onPress={handlePasscode}
                activeOpacity={0.7}
              >
                <IconSymbol name="lock.fill" size={26} color={subTextColor} />
                <Text style={[s.quickLabel, { color: subTextColor }]}>Passcode</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {!showQuickAccess && (
        <Text style={[s.orText, { color: subTextColor }]}>Or continue with</Text>
      )}

      <View style={s.socialRow}>
        <SocialButton label="Google" icon={<IconSymbol name="globe" size={20} color={textColor} />} />
        <SocialButton label="Apple" icon={<IconSymbol name="apple.logo" size={20} color={textColor} />} />
      </View>

      <View style={s.signupRow}>
        <Text style={[s.signupText, { color: subTextColor }]}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={[s.signupLink, { color: theme.green }]}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <ScreenFooter />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  helpBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 10 },
  subtitle: { fontSize: 14, lineHeight: 22, marginBottom: 32 },
  form: { gap: 20, marginBottom: 12 },
  cta: { marginBottom: 20 },
  orText: { textAlign: 'center', fontSize: 13, marginBottom: 14 },
  quickRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 20 },
  quickBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1.5,
  },
  quickLabel: { fontSize: 14, fontWeight: '600' },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  signupText: { fontSize: 14 },
  signupLink: { fontWeight: '700', fontSize: 14 },
  forgot: { fontSize: 13, fontWeight: '600' },
  error: { color: '#ff6b6b', fontSize: 13, marginBottom: 12, textAlign: 'center' },
});
