import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/theme-context';

type Props = { balance: string; account: string };

export function BalanceCard({ balance, account }: Props) {
  const { theme, textColor, borderColor } = useTheme();

  return (
    <View style={[s.card, { backgroundColor: theme.card, borderColor }]}>
      <View style={[s.top, { backgroundColor: theme.bgMid }]}>
        <Text style={[s.premiumLabel, { color: theme.green }]}>SPENDALT PREMIUM</Text>
        <Text style={[s.balance, { color: textColor }]}>{balance}</Text>
      </View>
      <View style={s.bottom}>
        <View style={s.accountRow}>
          <View>
            <Text style={[s.accountName, { color: theme.green }]}>{account}</Text>
            <Text style={[s.accountLabel, { color: textColor }]}>Total Balance</Text>
          </View>
          <View style={s.logoMark}>
            <IconSymbol name="creditcard.fill" size={20} color={textColor} />
          </View>
        </View>
        <View style={s.actions}>
          <TouchableOpacity style={[s.btnPrimary, { backgroundColor: theme.green }]}>
            <Text style={[s.btnPrimaryText, { color: theme.bgDeep }]}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btnSecondary, { borderColor }]}>
            <Text style={[s.btnSecondaryText, { color: textColor }]}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 20, overflow: 'hidden', borderWidth: 1 },
  top: { padding: 24, paddingBottom: 20, minHeight: 140, justifyContent: 'flex-end' },
  premiumLabel: { fontSize: 11, letterSpacing: 2, fontWeight: '600', marginBottom: 8 },
  balance: { fontSize: 36, fontWeight: '800' },
  bottom: { padding: 20, gap: 16 },
  accountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accountName: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  accountLabel: { fontSize: 18, fontWeight: '700' },
  logoMark: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#00000015', alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 12 },
  btnPrimary: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnPrimaryText: { fontWeight: '700', fontSize: 15 },
  btnSecondary: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1 },
  btnSecondaryText: { fontWeight: '600', fontSize: 15 },
});
