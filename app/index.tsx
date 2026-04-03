import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '@/components/ui/logo';
import { ProgressBar } from '@/components/ui/progress-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <Logo size="lg" showWordmark={false} />
      <Text style={s.title}>Spendalt</Text>
      <Text style={s.subtitle}>Understand Your Money</Text>

      <View style={s.progressSection}>
        <Text style={s.label}>SYNCHRONIZING</Text>
        <ProgressBar onComplete={() => router.replace('/onboarding')} />
      </View>

      <View style={s.badge}>
        <IconSymbol name="lock.fill" size={14} color={Brand.green} />
        <Text style={s.badgeText}>BANK-LEVEL SECURITY</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Brand.bgDark,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40,
  },
  title: { fontSize: 48, fontWeight: '800', color: '#fff', marginBottom: 8, marginTop: 32 },
  subtitle: { fontSize: 18, fontWeight: '600', color: Brand.green, marginBottom: 60 },
  progressSection: { width: '100%', alignItems: 'center', gap: 12 },
  label: { fontSize: 12, letterSpacing: 2, color: '#ffffff80', fontWeight: '600' },
  badge: {
    position: 'absolute', bottom: 48,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Brand.bgMid, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 32,
  },
  badgeText: { fontSize: 12, letterSpacing: 2, fontWeight: '700', color: Brand.green },
});
