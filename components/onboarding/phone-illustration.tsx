import { StyleSheet, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export function PhoneIllustration() {
  return (
    <View style={s.phone}>
      <View style={s.screen}>
        <View style={s.notch} />
        <View style={s.row}><View style={[s.bar, { width: 60 }]} /></View>
        <View style={s.circle}>
          <IconSymbol name="chart.pie.fill" size={28} color="#F5A623" />
        </View>
        <View style={s.row}><View style={[s.bar, { width: 100 }]} /></View>
        <View style={s.row}>
          <View style={[s.bar, { width: 44, height: 20, borderRadius: 4 }]} />
          <View style={[s.bar, { width: 44, height: 20, borderRadius: 4 }]} />
        </View>
        <View style={s.row}><View style={[s.bar, { width: 130, height: 8 }]} /></View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  phone: {
    width: 160, height: 200, borderRadius: 20,
    backgroundColor: '#1a1a1a', borderWidth: 6, borderColor: '#2a2a2a', overflow: 'hidden',
  },
  screen: { flex: 1, backgroundColor: '#f0f0f0', padding: 10, gap: 8, alignItems: 'center' },
  notch: { width: 40, height: 6, borderRadius: 3, backgroundColor: '#ccc', marginBottom: 4 },
  circle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
  },
  row: { flexDirection: 'row', gap: 6 },
  bar: { height: 10, borderRadius: 5, backgroundColor: '#ddd' },
});
