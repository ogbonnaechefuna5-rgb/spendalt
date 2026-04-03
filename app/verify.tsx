import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '@/components/ui/logo';
import { PrimaryButton } from '@/components/ui/primary-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand } from '@/constants/theme';
import { ScreenFooter } from '@/components/ui/screen-footer';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 54;

export default function VerifyScreen() {
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();

  useEffect(() => {
    if (seconds === 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const digits = code.padEnd(CODE_LENGTH, ' ').split('');

  return (
    <View style={s.container}>
      <TouchableOpacity style={s.back} onPress={() => router.back()}>
        <IconSymbol name="arrow.left" size={16} color="#ffffff60" />
        <Text style={s.backText}>Back to login</Text>
      </TouchableOpacity>

      <Text style={s.title}>Verify your phone</Text>
      <Text style={s.subtitle}>
        We've sent a 6-digit verification code to{' '}
        <Text style={s.phone}>+1 (555) •••• 42</Text>
      </Text>

      {/* Hidden real input */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={v => setCode(v.replace(/\D/g, '').slice(0, CODE_LENGTH))}
        keyboardType="number-pad"
        style={s.hiddenInput}
        autoFocus
      />

      {/* Visual digit boxes */}
      <TouchableOpacity style={s.codeRow} onPress={() => inputRef.current?.focus()} activeOpacity={1}>
        {digits.map((d, i) => (
          <View key={i} style={[s.digitBox, code.length === i && s.digitBoxActive]}>
            <Text style={s.digit}>{d.trim()}</Text>
          </View>
        ))}
      </TouchableOpacity>

      <PrimaryButton label="Verify Account" onPress={() => router.replace('/permissions')} style={s.cta} />

      <View style={s.resendRow}>
        <Text style={s.resendText}>Didn't receive the code? </Text>
        {seconds > 0 ? (
          <Text style={s.resendTimer}>
            Resend in 0:{String(seconds).padStart(2, '0')}
          </Text>
        ) : (
          <TouchableOpacity onPress={() => setSeconds(RESEND_SECONDS)}>
            <Text style={s.resendLink}>Resend</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScreenFooter />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Brand.bgDeep,
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32,
  },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 32 },
  backText: { color: '#ffffff60', fontSize: 14 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#ffffff60', lineHeight: 22, marginBottom: 36 },
  phone: { color: Brand.green, fontWeight: '700' },
  hiddenInput: { position: 'absolute', opacity: 0, width: 0, height: 0 },
  codeRow: { flexDirection: 'row', gap: 10, marginBottom: 36 },
  digitBox: {
    flex: 1, aspectRatio: 0.85,
    backgroundColor: Brand.card, borderRadius: 12,
    borderWidth: 1, borderColor: '#ffffff15',
    alignItems: 'center', justifyContent: 'center',
  },
  digitBoxActive: { borderColor: Brand.green },
  digit: { color: '#fff', fontSize: 22, fontWeight: '700' },
  cta: { marginBottom: 20 },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 'auto' },
  resendText: { color: '#ffffff50', fontSize: 13 },
  resendTimer: { color: Brand.green, fontWeight: '700', fontSize: 13 },
  resendLink: { color: Brand.green, fontWeight: '700', fontSize: 13 },
});
