import { Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Brand } from '@/constants/theme';

const W = Dimensions.get('window').width - 40;
const H = 140;

const POINTS = [0.6, 0.3, 0.55, 0.25, 0.5, 0.35, 0.75];
const DAYS = 7;

function buildPath(filled: boolean) {
  const xs = POINTS.map((_, i) => (i / (DAYS - 1)) * W);
  const ys = POINTS.map(p => H - p * H);

  // Catmull-Rom to cubic bezier
  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 0; i < xs.length - 1; i++) {
    const x0 = xs[i - 1] ?? xs[i];
    const y0 = ys[i - 1] ?? ys[i];
    const x1 = xs[i], y1 = ys[i];
    const x2 = xs[i + 1], y2 = ys[i + 1];
    const x3 = xs[i + 2] ?? x2;
    const y3 = ys[i + 2] ?? y2;
    const cp1x = x1 + (x2 - x0) / 6;
    const cp1y = y1 + (y2 - y0) / 6;
    const cp2x = x2 - (x3 - x1) / 6;
    const cp2y = y2 - (y3 - y1) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  }

  if (filled) {
    d += ` L ${xs[xs.length - 1]} ${H} L ${xs[0]} ${H} Z`;
  }

  return d;
}

export function SpendingChart() {
  return (
    <Svg width={W} height={H}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={Brand.green} stopOpacity="0.35" />
          <Stop offset="1" stopColor={Brand.green} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={buildPath(true)} fill="url(#grad)" />
      <Path d={buildPath(false)} fill="none" stroke={Brand.green} strokeWidth={2.5} />
    </Svg>
  );
}
