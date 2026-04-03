import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Brand } from '@/constants/theme';

const W = Dimensions.get('window').width - 40;
const H = 100;
const BAR_W = 28;

const WEEKS = [
  { label: 'W1', value: 0.5 },
  { label: 'W2', value: 0.65 },
  { label: 'W3', value: 0.4 },
  { label: 'W4', value: 0.85 },
];

export function WeeklyBars() {
  const spacing = W / WEEKS.length;

  return (
    <View>
      <Svg width={W} height={H}>
        {WEEKS.map((w, i) => {
          const barH = w.value * (H - 10);
          const x = i * spacing + spacing / 2 - BAR_W / 2;
          const isLast = i === WEEKS.length - 1;
          return (
            <Rect
              key={i}
              x={x} y={H - barH}
              width={BAR_W} height={barH}
              rx={8}
              fill={isLast ? Brand.green : '#ffffff15'}
            />
          );
        })}
      </Svg>
      <View style={s.labels}>
        {WEEKS.map(w => (
          <Text key={w.label} style={s.label}>{w.label}</Text>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  labels: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  label: { color: '#ffffff40', fontSize: 12, fontWeight: '600' },
});
