import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '@/components/ui/logo';
import { InputField } from '@/components/ui/input-field';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SocialButton } from '@/components/ui/social-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ScreenFooter } from '@/components/ui/screen-footer';
import { useTheme } from '@/context/theme-context';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();

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
        <InputField label="Phone Number" placeholder="+1 (555) 000-0000" keyboardType="phone-pad" leftIcon={<IconSymbol name="phone.fill" size={16} color={subTextColor} />} />
        <InputField
          label="Password"
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          leftIcon={<IconSymbol name="lock.fill" size={16} color={subTextColor} />}
          rightLabel={<TouchableOpacity onPress={() => router.push('/forgot-password')}><Text style={[s.forgot, { color: theme.green }]}>Forgot?</Text></TouchableOpacity>}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
              <IconSymbol name={showPassword ? 'eye.slash.fill' : 'eye.fill'} size={18} color={subTextColor} />
            </TouchableOpacity>
          }
        />
      </View>

      <PrimaryButton label="Continue →" onPress={() => router.replace('/(tabs)')} style={s.cta} />

      <Text style={[s.orText, { color: subTextColor }]}>Or continue with</Text>

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
  form: { gap: 20, marginBottom: 24 },
  cta: { marginBottom: 24 },
  orText: { textAlign: 'center', fontSize: 13, marginBottom: 16 },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  signupText: { fontSize: 14 },
  signupLink: { fontWeight: '700', fontSize: 14 },
  forgot: { fontSize: 13, fontWeight: '600' },
});
