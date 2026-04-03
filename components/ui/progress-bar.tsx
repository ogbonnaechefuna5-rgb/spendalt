import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Brand } from '@/constants/theme';

type Props = { toValue?: number; duration?: number; onComplete?: () => void };

export function ProgressBar({ toValue = 1, duration = 2000, onComplete }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start(({ finished }) => finished && onComplete?.());
  }, []);

  return (
    <View style={styles.track}>
      <Animated.View
        style={[styles.fill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', height: 4, backgroundColor: '#ffffff15', borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Brand.green, borderRadius: 2 },
});
