import { StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SymbolViewProps } from 'expo-symbols';
import { useTheme } from '@/context/theme-context';

type Props = {
  icon: SymbolViewProps['name'];
  iconBg: string;
  iconColor: string;
  name: string;
  category?: string;
  time?: string;
  date?: string;
  amount: string;
  positive: boolean;
};

export function TransactionItem({ icon, iconBg, iconColor, name, category, time, date, amount, positive }: Props) {
  const { theme, textColor, subTextColor } = useTheme();
  const subtitle = category && time ? `${category} • ${time}` : date ?? '';

  return (
    <View style={s.row}>
      <View style={[s.iconBox, { backgroundColor: iconBg }]}>
        <IconSymbol name={icon} size={20} color={iconColor} />
      </View>
      <View style={s.info}>
        <Text style={[s.name, { color: textColor }]}>{name}</Text>
        <Text style={[s.sub, { color: subTextColor }]}>{subtitle}</Text>
      </View>
      <Text style={[s.amount, { color: positive ? theme.green : textColor }]}>{amount}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  iconBox: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 4 },
  name: { fontWeight: '600', fontSize: 15 },
  sub: { fontSize: 12 },
  amount: { fontWeight: '700', fontSize: 15 },
});
