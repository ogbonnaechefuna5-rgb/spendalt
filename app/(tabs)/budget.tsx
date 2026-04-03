import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FabMenu } from '@/components/ui/fab-menu';
import { useTheme } from '@/context/theme-context';
import { BUDGETS, Budget } from '@/constants/budgets';

const totalSpent = BUDGETS.reduce((s, b) => s + b.spent, 0);
const totalLimit = BUDGETS.reduce((s, b) => s + b.limit, 0);
const overallPct = Math.round((totalSpent / totalLimit) * 100);

function BudgetBar({ budget }: { budget: Budget }) {
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const pct = Math.min((budget.spent / budget.limit) * 100, 100);
  const over = budget.spent > budget.limit;
  const remaining = budget.limit - budget.spent;

  return (
    <View style={[s.card, { backgroundColor: theme.card, borderColor }]}>
      <View style={s.cardTop}>
        <View style={s.cardLeft}>
          <Text style={s.cardIcon}>{budget.icon}</Text>
          <View>
            <Text style={[s.cardCategory, { color: textColor }]}>{budget.category}</Text>
            <Text style={[s.cardSub, { color: subTextColor }]}>
              {over ? `$${Math.abs(remaining)} over budget` : `$${remaining} remaining`}
            </Text>
          </View>
        </View>
        <View style={s.cardRight}>
          <Text style={[s.cardSpent, { color: textColor }]}>${budget.spent}</Text>
          <Text style={[s.cardLimit, { color: subTextColor }]}>/ ${budget.limit}</Text>
        </View>
      </View>
      <View style={[s.track, { backgroundColor: theme.bgMid }]}>
        <View style={[s.fill, { width: `${pct}%` as any, backgroundColor: over ? '#EF4444' : budget.color }]} />
      </View>
    </View>
  );
}

export default function BudgetScreen() {
  const [fabOpen, setFabOpen] = useState(false);
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgDeep }}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={[s.title, { color: textColor }]}>Budget</Text>
          <TouchableOpacity style={s.addBtn} onPress={() => router.push('/add-expense')}>
            <IconSymbol name="plus" size={18} color={theme.green} />
          </TouchableOpacity>
        </View>

        <View style={[s.overview, { backgroundColor: theme.card, borderColor }]}>
          <View style={s.overviewTop}>
            <View>
              <Text style={[s.overviewLabel, { color: theme.green }]}>TOTAL SPENT</Text>
              <Text style={[s.overviewAmount, { color: textColor }]}>${totalSpent.toLocaleString()}</Text>
              <Text style={[s.overviewSub, { color: subTextColor }]}>of ${totalLimit.toLocaleString()} budget</Text>
            </View>
            <View style={[s.pctBadge, { backgroundColor: theme.bgMid }]}>
              <Text style={[s.pctText, { color: overallPct > 90 ? '#EF4444' : theme.green }]}>{overallPct}%</Text>
              <Text style={[s.pctLabel, { color: subTextColor }]}>used</Text>
            </View>
          </View>
          <View style={[s.track, { marginTop: 16, backgroundColor: theme.bgMid }]}>
            <View style={[s.fill, { width: `${overallPct}%` as any, backgroundColor: overallPct > 90 ? '#EF4444' : theme.green }]} />
          </View>
          <View style={[s.statsRow, { borderTopColor: borderColor }]}>
            <View style={s.stat}>
              <Text style={[s.statValue, { color: theme.green }]}>{BUDGETS.filter(b => b.spent <= b.limit).length}</Text>
              <Text style={[s.statLabel, { color: subTextColor }]}>On Track</Text>
            </View>
            <View style={[s.statDivider, { backgroundColor: borderColor }]} />
            <View style={s.stat}>
              <Text style={[s.statValue, { color: '#EF4444' }]}>{BUDGETS.filter(b => b.spent > b.limit).length}</Text>
              <Text style={[s.statLabel, { color: subTextColor }]}>Over Budget</Text>
            </View>
            <View style={[s.statDivider, { backgroundColor: borderColor }]} />
            <View style={s.stat}>
              <Text style={[s.statValue, { color: theme.green }]}>{BUDGETS.length}</Text>
              <Text style={[s.statLabel, { color: subTextColor }]}>Categories</Text>
            </View>
          </View>
        </View>

        <Text style={[s.sectionTitle, { color: subTextColor }]}>CATEGORIES</Text>
        {BUDGETS.map(b => <BudgetBar key={b.id} budget={b} />)}
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={[s.fab, { backgroundColor: theme.green, shadowColor: theme.green }]} onPress={() => setFabOpen(true)}>
        <IconSymbol name="plus" size={26} color={theme.bgDeep} />
      </TouchableOpacity>

      <Modal visible={fabOpen} transparent animationType="fade">
        <FabMenu onClose={() => setFabOpen(false)} />
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800' },
  addBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  overview: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 28 },
  overviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  overviewLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  overviewAmount: { fontSize: 32, fontWeight: '800' },
  overviewSub: { fontSize: 13, marginTop: 2 },
  pctBadge: { alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10 },
  pctText: { fontSize: 22, fontWeight: '800' },
  pctLabel: { fontSize: 11, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11 },
  statDivider: { width: 1 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { fontSize: 28 },
  cardCategory: { fontWeight: '700', fontSize: 15 },
  cardSub: { fontSize: 12, marginTop: 2 },
  cardRight: { alignItems: 'flex-end' },
  cardSpent: { fontWeight: '700', fontSize: 16 },
  cardLimit: { fontSize: 12 },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  fab: { position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
});
