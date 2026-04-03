import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/theme-context';
import { SAVINGS_GOALS, TOTAL_SAVED, TOTAL_TARGET, SavingsGoal } from '@/constants/savings';

const fmt = (n: number) =>
  n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` :
  n >= 1_000     ? `₦${(n / 1_000).toFixed(0)}k` :
                   `₦${n.toLocaleString()}`;

const SIZE = 80, STROKE = 7;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

function GoalRing({ pct, color, textColor }: { pct: number; color: string; textColor: string }) {
  const filled = (pct / 100) * CIRC;
  return (
    <View style={ring.wrap}>
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke="#00000015" strokeWidth={STROKE} />
        <Circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke={color} strokeWidth={STROKE}
          strokeDasharray={`${filled} ${CIRC - filled}`} strokeLinecap="round"
          transform={`rotate(-90 ${SIZE/2} ${SIZE/2})`} />
      </Svg>
      <Text style={[ring.label, { color: textColor }]}>{pct}%</Text>
    </View>
  );
}

const ring = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  label: { position: 'absolute', fontSize: 13, fontWeight: '700' },
});

function GoalCard({ goal }: { goal: SavingsGoal }) {
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const pct = Math.round((goal.saved / goal.target) * 100);
  const STATUS_COLOR: Record<string, string> = {
    'ACTIVE': theme.green, 'ON TRACK': theme.green, 'SLOW': '#F59E0B', 'COMPLETE': '#3B82F6',
  };
  const statusColor = STATUS_COLOR[goal.status] ?? theme.green;

  return (
    <View style={[s.card, { backgroundColor: theme.card, borderColor }]}>
      <GoalRing pct={pct} color={goal.color} textColor={textColor} />
      <View style={s.cardBody}>
        <View style={s.cardTop}>
          <Text style={[s.cardName, { color: textColor }]}>{goal.name}</Text>
          <View style={[s.badge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[s.badgeText, { color: statusColor }]}>{goal.status}</Text>
          </View>
        </View>
        <Text style={[s.cardSub, { color: subTextColor }]}>{goal.subtitle}</Text>
        <View style={s.cardAmounts}>
          <View>
            <Text style={[s.amtLabel, { color: subTextColor }]}>Saved</Text>
            <Text style={[s.amtValue, { color: textColor }]}>₦{goal.saved.toLocaleString()}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[s.amtLabel, { color: subTextColor }]}>Target</Text>
            <Text style={[s.amtValue, { color: textColor }]}>{fmt(goal.target)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function SavingsScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgDeep }}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
            <IconSymbol name="arrow.left" size={18} color={textColor} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: textColor }]}>Savings Goals</Text>
          <TouchableOpacity style={s.headerBtn}>
            <IconSymbol name="plus" size={18} color={theme.green} />
          </TouchableOpacity>
        </View>

        <View style={s.statsRow}>
          <View style={[s.statCard, { backgroundColor: theme.card, borderColor }]}>
            <Text style={[s.statLabel, { color: theme.green }]}>Total Saved</Text>
            <Text style={[s.statValue, { color: textColor }]}>₦{TOTAL_SAVED.toLocaleString()}</Text>
            <View style={s.statBadge}>
              <IconSymbol name="arrow.up.right" size={10} color={theme.green} />
              <Text style={[s.statBadgeText, { color: theme.green }]}>+12%</Text>
            </View>
          </View>
          <View style={[s.statCard, { backgroundColor: theme.card, borderColor }]}>
            <Text style={[s.statLabel, { color: theme.green }]}>Active Goals</Text>
            <Text style={[s.statValue, { color: textColor }]}>{SAVINGS_GOALS.length}</Text>
            <Text style={[s.statSub, { color: subTextColor }]}>Targeting {fmt(TOTAL_TARGET)}</Text>
          </View>
        </View>

        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: textColor }]}>Your Progress</Text>
          <TouchableOpacity>
            <Text style={[s.sectionLink, { color: theme.green }]}>View History</Text>
          </TouchableOpacity>
        </View>

        {SAVINGS_GOALS.map(g => <GoalCard key={g.id} goal={g} />)}

        <View style={[s.banner, { backgroundColor: theme.bgMid, borderColor: `${theme.green}30` }]}>
          <View style={s.bannerText}>
            <Text style={[s.bannerTitle, { color: textColor }]}>Start a new goal?</Text>
            <Text style={[s.bannerSub, { color: subTextColor }]}>Automate your savings and reach your dreams faster.</Text>
            <TouchableOpacity style={[s.bannerBtn, { backgroundColor: theme.green }]}>
              <Text style={[s.bannerBtnText, { color: theme.bgDeep }]}>Create Goal</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.piggy}>🐷</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '800', fontSize: 18 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: { flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, gap: 4 },
  statLabel: { fontSize: 12, fontWeight: '600' },
  statValue: { fontSize: 24, fontWeight: '800' },
  statBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  statBadgeText: { fontSize: 12, fontWeight: '700' },
  statSub: { fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  sectionLink: { fontSize: 14, fontWeight: '600' },
  card: { flexDirection: 'row', gap: 16, borderRadius: 18, padding: 18, marginBottom: 12, borderWidth: 1 },
  cardBody: { flex: 1, gap: 4 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontWeight: '800', fontSize: 16 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cardSub: { fontSize: 12 },
  cardAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  amtLabel: { fontSize: 11, marginBottom: 2 },
  amtValue: { fontWeight: '700', fontSize: 15 },
  banner: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 24, marginTop: 8, borderWidth: 1 },
  bannerText: { flex: 1, gap: 6 },
  bannerTitle: { fontWeight: '800', fontSize: 18 },
  bannerSub: { fontSize: 13, lineHeight: 18 },
  bannerBtn: { borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, alignSelf: 'flex-start', marginTop: 8 },
  bannerBtnText: { fontWeight: '800', fontSize: 14 },
  piggy: { fontSize: 64, opacity: 0.4 },
});
