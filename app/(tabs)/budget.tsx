import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/theme-context';
import { getBudgets, deleteBudget, Budget } from '@/services/budgets-api';

const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '⚡', Health: '💊', Other: '📦',
};
const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F59E0B', Transport: '#3B82F6', Shopping: '#EC4899', Bills: '#8B5CF6', Health: '#10B981', Other: '#6B7280',
};

function BudgetBar({ budget, onDelete }: { budget: Budget; onDelete: () => void }) {
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const pct = Math.min((budget.amount / budget.amount) * 100, 100); // spent not returned yet, show full bar
  const color = CATEGORY_COLORS[budget.category] ?? '#6B7280';
  const icon = CATEGORY_ICONS[budget.category] ?? '📦';

  return (
    <View style={[s.card, { backgroundColor: theme.card, borderColor }]}>
      <View style={s.cardTop}>
        <View style={s.cardLeft}>
          <Text style={s.cardIcon}>{icon}</Text>
          <View>
            <Text style={[s.cardCategory, { color: textColor }]}>{budget.category}</Text>
            <Text style={[s.cardSub, { color: subTextColor }]}>{budget.period}</Text>
          </View>
        </View>
        <View style={s.cardRight}>
          <Text style={[s.cardSpent, { color: textColor }]}>₦{budget.amount.toLocaleString()}</Text>
          <TouchableOpacity onPress={onDelete}>
            <IconSymbol name="trash.fill" size={14} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[s.track, { backgroundColor: theme.bgMid }]}>
        <View style={[s.fill, { width: '100%', backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function BudgetScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getBudgets().then(setBudgets).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    await deleteBudget(id);
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const totalLimit = budgets.reduce((s, b) => s + b.amount, 0);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgDeep }}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={[s.title, { color: textColor }]}>Budget</Text>
          <TouchableOpacity style={s.addBtn} onPress={() => router.push({ pathname: '/add-budget', params: { onDone: 'reload' } })}>
            <IconSymbol name="plus" size={18} color={theme.green} />
          </TouchableOpacity>
        </View>

        <View style={[s.overview, { backgroundColor: theme.card, borderColor }]}>
          <View style={s.overviewTop}>
            <View>
              <Text style={[s.overviewLabel, { color: theme.green }]}>TOTAL BUDGET</Text>
              <Text style={[s.overviewAmount, { color: textColor }]}>₦{totalLimit.toLocaleString()}</Text>
              <Text style={[s.overviewSub, { color: subTextColor }]}>{budgets.length} active categories</Text>
            </View>
          </View>
        </View>

        <Text style={[s.sectionTitle, { color: subTextColor }]}>CATEGORIES</Text>
        {loading
          ? <ActivityIndicator color={theme.green} style={{ marginTop: 32 }} />
          : budgets.map(b => <BudgetBar key={b.id} budget={b} onDelete={() => handleDelete(b.id)} />)
        }
        <View style={{ height: 100 }} />
      </ScrollView>
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
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { fontSize: 28 },
  cardCategory: { fontWeight: '700', fontSize: 15 },
  cardSub: { fontSize: 12, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  cardSpent: { fontWeight: '700', fontSize: 16 },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});
