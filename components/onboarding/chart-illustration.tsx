import { StyleSheet, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

const BARS = [0.3, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

export function ChartIllustration() {
  return (
    <View style={s.wrap}>
      <View style={s.bars}>
        {BARS.map((h, i) => (
          <View key={i} style={[s.bar, { height: h * 100 }]} />
        ))}
      </View>
      <View style={s.line} />
      <IconSymbol name="arrow.up.right" size={24} color="#ffffff40" style={s.arrow} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    width: 220, height: 140,
    borderWidth: 1, borderColor: '#ffffff15',
    borderRadius: 8, padding: 12, justifyContent: 'flex-end',
  },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 100 },
  bar: { flex: 1, backgroundColor: '#ffffff20', borderRadius: 3 },
  line: { position: 'absolute', bottom: 20, left: 12, right: 12, height: 1, backgroundColor: '#ffffff20' },
  arrow: { position: 'absolute', top: 8, right: 8 },
});
