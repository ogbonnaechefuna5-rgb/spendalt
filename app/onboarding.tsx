import { OnboardingSlideView } from '@/components/onboarding/onboarding-slide';
import { ONBOARDING_SLIDES } from '@/constants/onboarding-slides';
import { Brand } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';

const WIDTH = Dimensions.get('window').width;

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const router = useRouter();
  const { markOnboardingDone } = useAuth();

  const next = async () => {
    if (index < ONBOARDING_SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      await markOnboardingDone();
      router.replace('/login');
    }
  };

  return (
    <View style={s.container}>
      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        onMomentumScrollEnd={e => setIndex(Math.round(e.nativeEvent.contentOffset.x / WIDTH))}
        renderItem={({ item }) => (
          <OnboardingSlideView
            slide={item}
            index={index}
            total={ONBOARDING_SLIDES.length}
            onNext={next}
          />
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bgDeep },
});
