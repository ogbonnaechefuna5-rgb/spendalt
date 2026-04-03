import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SpendingChart } from '@/components/insights/spending-chart';
import { DonutChart } from '@/components/insights/donut-chart';
import { WeeklyBars } from '@/components/insights/weekly-bars';
import { useTheme } from '@/context/theme-context';

const PERIODS = ['Weekly', 'Monthly', 'Yearly'];
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const CATEGORIES = [
  { label: 'Food',   amount: '₦58k', color: '#2ECC9A' },
  { label: 'Rent',   amount: '₦36k', color: '#F5A623' },
  { label: 'Travel', amount: '₦29k', color: '#4A8FFF' },
  { label: 'Other',  amount: '₦22k', color: '#FF4D8F' },
];

export default function InsightsScreen() {
  const [period, setPeriod] = useState('Weekly');
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgDeep }} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <IconSymbol name="arrow.left" size={18} color={textColor} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: textColor }]}>Spending Insights</Text>
        <TouchableOpacity style={s.iconBtn}>
          <IconSymbol name="calendar" size={20} color={textColor} />
        </TouchableOpacity>
      </View>

      <View style={s.periodRow}>
        {PERIODS.map(p => (
          <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={s.periodBtn}>
            <Text style={[s.periodText, { color: subTextColor }, period === p && { color: textColor, fontWeight: '800' }]}>{p}</Text>
            {period === p && <View style={[s.periodUnderline, { backgroundColor: theme.green }]} />}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[s.spendingLabel, { color: theme.green }]}>TOTAL SPENDING</Text>
      <View style={s.spendingRow}>
        <Text style={[s.spendingAmount, { color: textColor }]}>₦145,000</Text>
        <View style={s.trendBadge}>
          <IconSymbol name="arrow.up.right" size={11} color="#FF6B4A" />
          <Text style={s.trendText}>12%</Text>
        </View>
      </View>
      <Text style={[s.spendingCompare, { color: subTextColor }]}>Vs ₦129,500 last week</Text>

      <View style={s.chartWrap}>
        <SpendingChart />
        <View style={s.dayLabels}>
          {DAYS.map(d => <Text key={d} style={[s.dayLabel, { color: subTextColor }]}>{d}</Text>)}
        </View>
      </View>

      <View style={[s.insightCard, { backgroundColor: theme.card, borderColor }]}>
        <View style={[s.insightIcon, { backgroundColor: theme.bgMid }]}>
          <IconSymbol name="fork.knife" size={20} color={theme.green} />
        </View>
        <View style={s.insightText}>
          <Text style={[s.insightTitle, { color: textColor }]}>Food & Drinks Insight</Text>
          <Text style={[s.insightBody, { color: subTextColor }]}>
            You spent <Text style={[s.insightHighlight, { color: textColor }]}>₦32,000</Text> on food this week. That's 15% more than average.
          </Text>
        </View>
      </View>

      <Text style={[s.sectionTitle, { color: textColor }]}>Category Breakdown</Text>
      <View style={s.breakdownRow}>
        <DonutChart />
        <View style={s.legendList}>
          {CATEGORIES.map(c => (
            <View key={c.label} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: c.color }]} />
              <Text style={[s.legendLabel, { color: textColor }]}>{c.label}</Text>
              <Text style={[s.legendAmount, { color: textColor }]}>{c.amount}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={s.sectionHeader}>
        <Text style={[s.sectionTitle, { color: textColor }]}>Weekly Comparison</Text>
        <TouchableOpacity>
          <Text style={[s.viewHistory, { color: theme.green }]}>View History</Text>
        </TouchableOpacity>
      </View>
      <WeeklyBars />
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
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#2D1A0E', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  trendText: { color: '#FF6B4A', fontWeight: '700', fontSize: 13 },
  spendingCompare: { fontSize: 13, marginTop: -12 },
  chartWrap: { gap: 12 },
  dayLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  dayLabel: { fontSize: 11, fontWeight: '600' },
  insightCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, borderRadius: 16, padding: 16, borderWidth: 1 },
  insightIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  insightText: { flex: 1, gap: 4 },
  insightTitle: { fontWeight: '700', fontSize: 15 },
  insightBody: { fontSize: 13, lineHeight: 20 },
  insightHighlight: { fontWeight: '700' },
  sectionTitle: { fontWeight: '800', fontSize: 18 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  legendList: { flex: 1, gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { flex: 1, fontSize: 14 },
  legendAmount: { fontWeight: '700', fontSize: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -8 },
  viewHistory: { fontWeight: '600', fontSize: 14 },
});
