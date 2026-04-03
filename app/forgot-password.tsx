import { IconSymbol } from '@/components/ui/icon-symbol';
import { InputField } from '@/components/ui/input-field';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Brand } from '@/constants/theme';
import { ScreenFooter } from '@/components/ui/screen-footer';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <ScreenHeader title="Forgot Password" />

      <View style={s.iconWrap}>
        <IconSymbol name="lock.rotation" size={48} color={Brand.green} />
      </View>

      <Text style={s.title}>Reset your password</Text>
      <Text style={s.subtitle}>
        Enter the phone number linked to your account. We'll send a verification code to reset your password.
      </Text>

      <InputField
        label="Phone Number"
        placeholder="+1 (555) 000-0000"
        keyboardType="phone-pad"
        leftIcon={<IconSymbol name="phone.fill" size={16} color="#ffffff40" />}
        style={s.input}
      />

      <PrimaryButton label="Send Code →" onPress={() => router.push('/verify')} style={s.cta} />

      <ScreenFooter />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Brand.bgDeep,
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32,
  },
  iconWrap: {
    width: 96, height: 96, borderRadius: 24,
    backgroundColor: Brand.card, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#ffffff10', marginBottom: 32,
  },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#ffffff60', lineHeight: 22, marginBottom: 32 },
  // input: { marginBottom: 20 },
  cta: { marginTop: 24 },
});
