import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WeeklyBars } from '@/components/insights/weekly-bars';
import { useTheme } from '@/context/theme-context';
import { getInsights, getCategoryBreakdown, getWeeklyTrend, Insights, CategoryBreakdown, WeeklyTrend } from '@/services/analytics-api';

const PERIODS = ['Weekly', 'Monthly', 'Yearly'];
const CATEGORY_COLORS = ['#7C3AED', '#F5A623', '#4A8FFF', '#FF4D8F', '#22C55E', '#F59E0B'];

const fmt = (n: number) =>
  n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` :
  n >= 1_000     ? `₦${(n / 1_000).toFixed(0)}k` :
                   `₦${n.toLocaleString()}`;

export default function InsightsScreen() {
  const [period, setPeriod] = useState('Monthly');
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const [insights, setInsights] = useState<Insights | null>(null);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getInsights(), getCategoryBreakdown()])
      .then(([ins, bd]) => { setInsights(ins); setBreakdown(bd); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const topCategory = breakdown[0];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgDeep }} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <IconSymbol name="arrow.left" size={18} color={textColor} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: textColor }]}>Spending Insights</Text>
        <View style={s.iconBtn} />
      </View>

      <View style={s.periodRow}>
        {PERIODS.map(p => (
          <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={s.periodBtn}>
            <Text style={[s.periodText, { color: subTextColor }, period === p && { color: textColor, fontWeight: '800' }]}>{p}</Text>
            {period === p && <View style={[s.periodUnderline, { backgroundColor: theme.green }]} />}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={theme.green} style={{ marginTop: 40 }} />
      ) : (
        <>
          <Text style={[s.spendingLabel, { color: theme.green }]}>TOTAL SPENDING</Text>
          <View style={s.spendingRow}>
            <Text style={[s.spendingAmount, { color: textColor }]}>{fmt(insights?.total_spending ?? 0)}</Text>
          </View>
          <Text style={[s.spendingCompare, { color: subTextColor }]}>
            Income this month: {fmt(insights?.total_income ?? 0)}
          </Text>

          {topCategory && (
            <View style={[s.insightCard, { backgroundColor: theme.card, borderColor }]}>
              <View style={[s.insightIcon, { backgroundColor: theme.bgMid }]}>
                <IconSymbol name="fork.knife" size={20} color={theme.green} />
              </View>
              <View style={s.insightText}>
                <Text style={[s.insightTitle, { color: textColor }]}>{topCategory.category} is your top spend</Text>
                <Text style={[s.insightBody, { color: subTextColor }]}>
                  You spent{' '}
                  <Text style={[s.insightHighlight, { color: textColor }]}>{fmt(topCategory.total)}</Text>
                  {' '}on {topCategory.category} this month across {topCategory.count} transactions.
                </Text>
              </View>
            </View>
          )}

          <Text style={[s.sectionTitle, { color: textColor }]}>Category Breakdown</Text>
          {breakdown.length === 0 ? (
            <Text style={[s.empty, { color: subTextColor }]}>No transactions this month.</Text>
          ) : (
            <View style={[s.breakdownCard, { backgroundColor: theme.card, borderColor }]}>
              {breakdown.map((c, i) => {
                const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                const maxTotal = breakdown[0]?.total ?? 1;
                const pct = (c.total / maxTotal) * 100;
                return (
                  <View key={c.category} style={s.breakdownRow}>
                    <View style={[s.dot, { backgroundColor: color }]} />
                    <Text style={[s.breakdownLabel, { color: textColor }]}>{c.category}</Text>
                    <View style={s.barWrap}>
                      <View style={[s.bar, { backgroundColor: theme.bgMid }]}>
                        <View style={[s.barFill, { width: `${pct}%` as any, backgroundColor: color }]} />
                      </View>
                    </View>
                    <Text style={[s.breakdownAmt, { color: textColor }]}>{fmt(c.total)}</Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={s.sectionHeader}>
            <Text style={[s.sectionTitle, { color: textColor }]}>Weekly Trend</Text>
          </View>
          <WeeklyBars />
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 100, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '800', fontSize: 18 },
  periodRow: { flexDirection: 'row', gap: 24 },
  periodBtn: { alignItems: 'center', gap: 6 },
  periodText: { fontWeight: '600', fontSize: 15 },
  periodUnderline: { height: 2, width: '100%', borderRadius: 1 },
  spendingLabel: { fontSize: 11, letterSpacing: 2, fontWeight: '600' },
  spendingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  spendingAmount: { fontSize: 36, fontWeight: '800' },
  spendingCompare: { fontSize: 13, marginTop: -12 },
  insightCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, borderRadius: 16, padding: 16, borderWidth: 1 },
  insightIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  insightText: { flex: 1, gap: 4 },
  insightTitle: { fontWeight: '700', fontSize: 15 },
  insightBody: { fontSize: 13, lineHeight: 20 },
  insightHighlight: { fontWeight: '700' },
  sectionTitle: { fontWeight: '800', fontSize: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -8 },
  breakdownCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 14 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  breakdownLabel: { width: 80, fontSize: 13 },
  barWrap: { flex: 1 },
  bar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  breakdownAmt: { fontWeight: '700', fontSize: 13, width: 60, textAlign: 'right' },
  empty: { fontSize: 14, textAlign: 'center', marginTop: 20 },
});
