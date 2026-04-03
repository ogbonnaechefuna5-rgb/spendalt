import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Brand } from '@/constants/theme';
import { requestSMSPermission } from '@/services/sms-reader';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PermissionsScreen() {
  const router = useRouter();
  const next = () => router.replace('/(tabs)');

  const handleAllow = async () => {
    if (Platform.OS === 'android') await requestSMSPermission();
    next();
  };

  return (
    <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader title="Permissions" />

      {/* Illustration card */}
      <View style={s.card}>
        <View style={s.illustrationBox}>
          <View style={s.bubbleBox}>
            <IconSymbol name="message.fill" size={40} color={Brand.green} />
          </View>
          <View style={s.dots}>
            <View style={[s.dot, s.dotActive]} />
            <View style={s.dot} />
            <View style={s.dot} />
          </View>
        </View>
      </View>

      <Text style={s.title}>Secure Transaction{'\n'}Detection</Text>
      <Text style={s.subtitle}>
        Spendalt encrypts all data. We only read bank-related messages to help you manage your budget automatically.
      </Text>

      {/* Permission row */}
      <View style={s.permRow}>
        <View style={s.permIcon}>
          <IconSymbol name="creditcard.fill" size={20} color={Brand.green} />
        </View>
        <View style={s.permText}>
          <Text style={s.permTitle}>SMS Permission</Text>
          <Text style={s.permDesc}>Allow Spendalt to detect bank alerts automatically.</Text>
        </View>
      </View>

      <Text style={s.body}>
        We use this to categorize your spending and provide real-time insights without manual entry. Your personal conversations are never accessed.
      </Text>

      <TouchableOpacity style={s.privacyRow}>
        <IconSymbol name="info.circle.fill" size={16} color={Brand.green} />
        <Text style={s.privacyLink}>Learn more about privacy</Text>
      </TouchableOpacity>

      <View style={s.actions}>
        <PrimaryButton label="Allow Access" onPress={handleAllow} />
        <TouchableOpacity onPress={next} style={s.skipBtn}>
          <Text style={s.skipText}>Skip for now</Text>
        </TouchableOpacity>
        <Text style={s.hint}>You can change these permissions anytime in Settings.</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: Brand.bgDeep,
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32,
  },
  card: {
    width: '100%', height: 200,
    backgroundColor: Brand.card, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#ffffff0a', marginBottom: 32,
  },
  illustrationBox: { alignItems: 'center', gap: 16 },
  bubbleBox: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: Brand.bgMid, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#ffffff10',
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff20' },
  dotActive: { width: 24, backgroundColor: Brand.green },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 12, lineHeight: 34 },
  subtitle: { fontSize: 14, color: Brand.green, lineHeight: 22, marginBottom: 24, textAlign: 'center' },
  permRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: Brand.card, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#ffffff0a', marginBottom: 20,
  },
  permIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: Brand.bgMid, alignItems: 'center', justifyContent: 'center',
  },
  permText: { flex: 1, gap: 4 },
  permTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  permDesc: { color: Brand.green, fontSize: 13, lineHeight: 20 },
  body: { fontSize: 14, color: '#ffffff60', lineHeight: 22, marginBottom: 20 },
  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 40 },
  privacyLink: { color: Brand.green, fontWeight: '600', fontSize: 14 },
  actions: { gap: 4 },
  skipBtn: { paddingVertical: 16, alignItems: 'center' },
  skipText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  hint: { textAlign: 'center', color: Brand.green, fontSize: 12, opacity: 0.5, marginTop: 8 },
});
