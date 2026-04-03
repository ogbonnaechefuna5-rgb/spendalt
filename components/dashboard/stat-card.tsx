import { StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/theme-context';

type Props = { label: string; amount: string; trend: string; positive: boolean };

export function StatCard({ label, amount, trend, positive }: Props) {
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const trendColor = positive ? theme.green : '#FF6B4A';

  return (
    <View style={[s.card, { backgroundColor: theme.card, borderColor }]}>
      <View style={s.labelRow}>
        <IconSymbol name={positive ? 'arrow.up' : 'arrow.down'} size={12} color={trendColor} />
        <Text style={[s.label, { color: subTextColor }]}>{label}</Text>
      </View>
      <Text style={[s.amount, { color: textColor }]}>{amount}</Text>
      <Text style={[s.trend, { color: trendColor }]}>
        {trend} <Text style={[s.trendSub, { color: subTextColor }]}>vs last month</Text>
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, gap: 6 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontSize: 11, letterSpacing: 1.5, fontWeight: '600' },
  amount: { fontSize: 22, fontWeight: '800' },
  trend: { fontSize: 13, fontWeight: '700' },
  trendSub: { fontWeight: '400' },
});
