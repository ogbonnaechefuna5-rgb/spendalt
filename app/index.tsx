import { IconSymbol } from '@/components/ui/icon-symbol';
import { Logo } from '@/components/ui/logo';
import { Brand } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const { isFirstLaunch } = useAuth();

  useEffect(() => {
    if (isFirstLaunch === null) return; // still loading

    const timer = setTimeout(async () => {
      if (isFirstLaunch) {
        router.replace('/onboarding');
      } else {
        const refreshToken = await SecureStore.getItemAsync('spendalt_refresh_token');
        if (refreshToken) {
          router.replace('/local-auth'); // has a session → unlock screen
        } else {
          router.replace('/login'); // no session → regular login
        }
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [isFirstLaunch]);

  return (
    <View style={s.container}>
      <Logo size="lg" showWordmark={false} />
      <Text style={s.title}>Spendalt</Text>
      <Text style={s.subtitle}>Understand Your Money</Text>

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
  badge: {
    position: 'absolute', bottom: 48,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Brand.bgMid, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 32,
  },
  badgeText: { fontSize: 12, letterSpacing: 2, fontWeight: '700', color: Brand.green },
});
