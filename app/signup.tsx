import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ui/screen-header';
import { InputField } from '@/components/ui/input-field';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SocialButton } from '@/components/ui/social-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ScreenFooter } from '@/components/ui/screen-footer';
import { useTheme } from '@/context/theme-context';

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { theme, textColor, subTextColor } = useTheme();

  return (
    <ScrollView contentContainerStyle={[s.container, { backgroundColor: theme.bgDeep }]} keyboardShouldPersistTaps="handled">
      <ScreenHeader title="Create Account" />

      <Text style={[s.title, { color: textColor }]}>Start your journey</Text>
      <Text style={[s.subtitle, { color: subTextColor }]}>Create an account to take control of your finances.</Text>

      <View style={s.form}>
        <InputField label="Full Name" placeholder="Jane Doe" autoCapitalize="words" leftIcon={<IconSymbol name="person.fill" size={16} color={subTextColor} />} />
        <InputField label="Phone Number" placeholder="+1 (555) 000-0000" keyboardType="phone-pad" leftIcon={<IconSymbol name="phone.fill" size={16} color={subTextColor} />} />
        <InputField
          label="Password"
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          leftIcon={<IconSymbol name="lock.fill" size={16} color={subTextColor} />}
          rightIcon={<TouchableOpacity onPress={() => setShowPassword(v => !v)}><IconSymbol name={showPassword ? 'eye.slash.fill' : 'eye.fill'} size={18} color={subTextColor} /></TouchableOpacity>}
        />
        <InputField
          label="Confirm Password"
          placeholder="••••••••"
          secureTextEntry={!showConfirm}
          leftIcon={<IconSymbol name="lock.fill" size={16} color={subTextColor} />}
          rightIcon={<TouchableOpacity onPress={() => setShowConfirm(v => !v)}><IconSymbol name={showConfirm ? 'eye.slash.fill' : 'eye.fill'} size={18} color={subTextColor} /></TouchableOpacity>}
        />
      </View>

      <PrimaryButton label="Create Account →" onPress={() => router.push('/verify')} style={s.cta} />

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
  form: { gap: 20, marginBottom: 24 },
  cta: { marginBottom: 24 },
  orText: { textAlign: 'center', fontSize: 13, marginBottom: 16 },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  loginText: { fontSize: 14 },
  loginLink: { fontWeight: '700', fontSize: 14 },
});
