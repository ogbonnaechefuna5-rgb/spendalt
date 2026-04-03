import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 140;
const STROKE = 22;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

type Segment = { color: string; pct: number };

const SEGMENTS: Segment[] = [
  { color: '#2ECC9A', pct: 0.40 },
  { color: '#F5A623', pct: 0.25 },
  { color: '#4A8FFF', pct: 0.20 },
  { color: '#FF4D8F', pct: 0.15 },
];

export function DonutChart() {
  let offset = 0;

  return (
    <View style={s.wrap}>
      <Svg width={SIZE} height={SIZE}>
        {/* Track */}
        <Circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none" stroke="#ffffff10" strokeWidth={STROKE}
        />
        {SEGMENTS.map((seg, i) => {
          const dash = seg.pct * CIRCUMFERENCE;
          const gap = CIRCUMFERENCE - dash;
          const rotation = offset * 360 - 90;
          offset += seg.pct;
          return (
            <Circle
              key={i}
              cx={SIZE / 2} cy={SIZE / 2} r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={0}
              transform={`rotate(${rotation} ${SIZE / 2} ${SIZE / 2})`}
              strokeLinecap="butt"
            />
          );
        })}
      </Svg>
      <View style={s.center}>
        <Text style={s.label}>TOP</Text>
        <Text style={s.pct}>40%</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center' },
  label: { color: '#ffffff60', fontSize: 10, fontWeight: '600', letterSpacing: 1 },
  pct: { color: '#fff', fontSize: 20, fontWeight: '800' },
});
