import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '@/components/ui/logo';
import { FeaturePill } from '@/components/ui/feature-pill';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Brand } from '@/constants/theme';
import type { OnboardingSlide } from '@/constants/onboarding-slides';

const WIDTH = Dimensions.get('window').width;

type Props = {
  slide: OnboardingSlide;
  index: number;
  total: number;
  onNext: () => void;
};

export function OnboardingSlideView({ slide, index, total, onNext }: Props) {
  const router = useRouter();

  return (
    <View style={s.slide}>
      <View style={s.header}>
        <Logo size="sm" />
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={s.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        <slide.Illustration />
      </View>

      <Text style={s.title}>{slide.title}</Text>
      <Text style={s.body}>{slide.body}</Text>

      <View style={s.features}>
        {slide.features.map(f => (
          <FeaturePill key={f.label} icon={f.icon} label={f.label} />
        ))}
      </View>

      <PrimaryButton label="Next Step →" onPress={onNext} />

      <View style={s.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={[s.dot, i === index && s.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  slide: { width: WIDTH, flex: 1, paddingHorizontal: 20, paddingTop: 56 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  skip: { color: Brand.green, fontWeight: '600', fontSize: 15 },
  card: {
    width: '100%', height: 240, backgroundColor: Brand.card,
    borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    marginBottom: 28, borderWidth: 1, borderColor: '#ffffff0a',
  },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12, lineHeight: 36 },
  body: { fontSize: 14, color: '#ffffff70', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  features: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ffffff30' },
  dotActive: { backgroundColor: Brand.green, width: 18 },
});
