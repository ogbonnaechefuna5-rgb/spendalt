import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { StatCard } from '@/components/dashboard/stat-card';
import { TransactionItem } from '@/components/dashboard/transaction-item';
import { useTheme } from '@/context/theme-context';
import { getTransactions, Transaction } from '@/services/transactions-api';
import { getInsights, Insights } from '@/services/analytics-api';

const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export default function HomeScreen() {
  const router = useRouter();
  const { theme, textColor, borderColor, dividerColor } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTransactions(1, 5), getInsights()])
      .then(([txs, ins]) => { setTransactions(txs); setInsights(ins); })
      .catch(() => {}) // 401 handled globally in api.ts
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgDeep }} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <View style={[s.avatarBox, { backgroundColor: theme.card, borderColor: theme.green }]}>
          <IconSymbol name="person.fill" size={22} color={theme.green} />
        </View>
        <Text style={[s.headerTitle, { color: textColor }]}>Dashboard</Text>
        <View style={s.headerActions}>
          <TouchableOpacity style={s.iconBtn}>
            <IconSymbol name="magnifyingglass" size={20} color={textColor} />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn}>
            <IconSymbol name="bell.fill" size={20} color={textColor} />
            <View style={[s.badge, { backgroundColor: theme.green, borderColor: theme.bgDeep }]} />
          </TouchableOpacity>
        </View>
      </View>

      <BalanceCard balance={insights ? fmt(insights.total_income - insights.total_spending) : '—'} account="Main Account" />

      <View style={s.statsRow}>
        <StatCard label="INCOME" amount={insights ? fmt(insights.total_income) : '—'} trend="" positive />
        <StatCard label="SPENDING" amount={insights ? fmt(insights.total_spending) : '—'} trend="" positive={false} />
      </View>

      <View style={s.txHeader}>
        <Text style={[s.txTitle, { color: textColor }]}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
          <Text style={[s.seeAll, { color: theme.green }]}>See all</Text>
        </TouchableOpacity>
      </View>

      {loading
        ? <ActivityIndicator color={theme.green} />
        : <View style={[s.txList, { backgroundColor: theme.card, borderColor }]}>
            {transactions.map((tx, i) => (
              <View key={tx.id}>
                <TransactionItem
                  id={tx.id} name={tx.merchant || tx.description}
                  category={tx.category} amount={tx.type === 'credit' ? tx.amount : -tx.amount}
                  date={tx.transaction_date} icon="cart.fill"
                />
                {i < transactions.length - 1 && <View style={[s.divider, { backgroundColor: dividerColor }]} />}
              </View>
            ))}
          </View>
      }
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { flex: 1, fontWeight: '700', fontSize: 20 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5 },
  statsRow: { flexDirection: 'row', gap: 12 },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txTitle: { fontWeight: '800', fontSize: 18 },
  seeAll: { fontWeight: '600', fontSize: 14 },
  txList: { borderRadius: 20, paddingHorizontal: 16, borderWidth: 1 },
  divider: { height: 1 },
});
