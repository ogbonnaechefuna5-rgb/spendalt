import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 72;
const STROKE = 6;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

type Props = { pct: number; color?: string };

export function CircularProgress({ pct, color = '#2ECC9A' }: Props) {
  const filled = (pct / 100) * CIRCUMFERENCE;
  const gap = CIRCUMFERENCE - filled;

  return (
    <View style={s.wrap}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none" stroke="#ffffff10" strokeWidth={STROKE}
        />
        <Circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none" stroke={color} strokeWidth={STROKE}
          strokeDasharray={`${filled} ${gap}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      <Text style={s.label}>{pct}%</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  label: { position: 'absolute', color: '#fff', fontSize: 13, fontWeight: '700' },
});
