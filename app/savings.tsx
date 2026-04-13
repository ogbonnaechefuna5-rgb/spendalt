import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useTheme } from '@/context/theme-context';
import { getSavingsGoals, createSavingsGoal, deleteSavingsGoal, SavingsGoal } from '@/services/savings-api';
import { useUI } from '@/context/ui-context';

const fmt = (n: number) =>
  n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` :
  n >= 1_000     ? `₦${(n / 1_000).toFixed(0)}k` :
                   `₦${n.toLocaleString()}`;

const GOAL_COLORS = ['#7C3AED', '#F59E0B', '#3B82F6', '#22C55E', '#EC4899', '#F97316'];

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

function GoalCard({ goal, color, onDelete }: { goal: SavingsGoal; color: string; onDelete: () => void }) {
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const pct = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
  const statusColor = goal.status === 'completed' ? '#3B82F6' : goal.status === 'active' ? theme.green : '#F59E0B';

  return (
    <View style={[s.card, { backgroundColor: theme.card, borderColor }]}>
      <GoalRing pct={pct} color={color} textColor={textColor} />
      <View style={s.cardBody}>
        <View style={s.cardTop}>
          <Text style={[s.cardName, { color: textColor }]}>{goal.name}</Text>
          <View style={s.cardTopRight}>
            <View style={[s.badge, { backgroundColor: `${statusColor}20` }]}>
              <Text style={[s.badgeText, { color: statusColor }]}>{goal.status.toUpperCase()}</Text>
            </View>
            <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <IconSymbol name="trash.fill" size={14} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
        {goal.deadline && (
          <Text style={[s.cardSub, { color: subTextColor }]}>
            Due {new Date(goal.deadline).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        )}
        <View style={s.cardAmounts}>
          <View>
            <Text style={[s.amtLabel, { color: subTextColor }]}>Saved</Text>
            <Text style={[s.amtValue, { color: textColor }]}>₦{goal.current_amount.toLocaleString()}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[s.amtLabel, { color: subTextColor }]}>Target</Text>
            <Text style={[s.amtValue, { color: textColor }]}>{fmt(goal.target_amount)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function CreateGoalSheet({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const { showToast } = useUI();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const amount = parseFloat(target.replace(/,/g, ''));
    if (!name || !amount) return;
    setLoading(true);
    try {
      await createSavingsGoal({ name, target_amount: amount });
      showToast({ message: 'Savings goal created!', type: 'success' });
      onCreated();
      onClose();
    } catch (e: any) {
      showToast({ message: e.message ?? 'Failed to create goal.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={sheet.overlay}>
        <TouchableWithoutFeedback>
          <View style={[sheet.tray, { backgroundColor: theme.card, borderColor }]}>
            <View style={[sheet.handle, { backgroundColor: borderColor }]} />
            <Text style={[sheet.title, { color: textColor }]}>New Savings Goal</Text>

            <View style={[sheet.field, { backgroundColor: theme.bgDeep, borderColor }]}>
              <Text style={[sheet.fieldLabel, { color: theme.green }]}>GOAL NAME</Text>
              <TextInput
                style={[sheet.input, { color: textColor }]}
                placeholder="e.g. Emergency Fund"
                placeholderTextColor={subTextColor}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={[sheet.field, { backgroundColor: theme.bgDeep, borderColor }]}>
              <Text style={[sheet.fieldLabel, { color: theme.green }]}>TARGET AMOUNT (₦)</Text>
              <TextInput
                style={[sheet.input, { color: textColor }]}
                placeholder="0.00"
                placeholderTextColor={subTextColor}
                keyboardType="numeric"
                value={target}
                onChangeText={setTarget}
              />
            </View>

            <PrimaryButton
              label={loading ? 'Creating…' : 'Create Goal'}
              onPress={handleCreate}
              disabled={!name || !target || loading}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const sheet = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000060' },
  tray: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 48, borderWidth: 1, gap: 16 },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '800' },
  field: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 4 },
  fieldLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  input: { fontSize: 15, fontWeight: '600', padding: 0 },
});

export default function SavingsScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const { showDialog, showToast } = useUI();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const load = () => {
    setLoading(true);
    getSavingsGoals().then(setGoals).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id: string) => {
    showDialog({
      title: 'Delete Goal',
      message: 'Are you sure you want to delete this savings goal?',
      actions: [
        { label: 'Cancel', variant: 'ghost', onPress: () => {} },
        { label: 'Delete', variant: 'destructive', onPress: async () => {
          await deleteSavingsGoal(id);
          setGoals(prev => prev.filter(g => g.id !== id));
          showToast({ message: 'Goal deleted.', type: 'info' });
        }},
      ],
    });
  };

  const totalSaved = goals.reduce((s, g) => s + g.current_amount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgDeep }}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
            <IconSymbol name="arrow.left" size={18} color={textColor} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: textColor }]}>Savings Goals</Text>
          <TouchableOpacity style={s.headerBtn} onPress={() => setCreateOpen(true)}>
            <IconSymbol name="plus" size={18} color={theme.green} />
          </TouchableOpacity>
        </View>

        <View style={s.statsRow}>
          <View style={[s.statCard, { backgroundColor: theme.card, borderColor }]}>
            <Text style={[s.statLabel, { color: theme.green }]}>Total Saved</Text>
            <Text style={[s.statValue, { color: textColor }]}>₦{totalSaved.toLocaleString()}</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: theme.card, borderColor }]}>
            <Text style={[s.statLabel, { color: theme.green }]}>Active Goals</Text>
            <Text style={[s.statValue, { color: textColor }]}>{goals.length}</Text>
            <Text style={[s.statSub, { color: subTextColor }]}>Targeting {fmt(totalTarget)}</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={theme.green} style={{ marginTop: 32 }} />
        ) : goals.length === 0 ? (
          <View style={[s.emptyCard, { backgroundColor: theme.card, borderColor }]}>
            <Text style={{ fontSize: 48 }}>🐷</Text>
            <Text style={[s.emptyTitle, { color: textColor }]}>No savings goals yet</Text>
            <Text style={[s.emptySub, { color: subTextColor }]}>Tap + to create your first goal</Text>
          </View>
        ) : (
          <>
            <Text style={[s.sectionTitle, { color: textColor }]}>Your Progress</Text>
            {goals.map((g, i) => (
              <GoalCard
                key={g.id}
                goal={g}
                color={GOAL_COLORS[i % GOAL_COLORS.length]}
                onDelete={() => handleDelete(g.id)}
              />
            ))}
          </>
        )}

        <TouchableOpacity
          style={[s.banner, { backgroundColor: theme.bgMid, borderColor: `${theme.green}30` }]}
          onPress={() => setCreateOpen(true)}
        >
          <View style={s.bannerText}>
            <Text style={[s.bannerTitle, { color: textColor }]}>Start a new goal?</Text>
            <Text style={[s.bannerSub, { color: subTextColor }]}>Automate your savings and reach your dreams faster.</Text>
            <View style={[s.bannerBtn, { backgroundColor: theme.green }]}>
              <Text style={[s.bannerBtnText, { color: theme.bgDeep }]}>Create Goal</Text>
            </View>
          </View>
          <Text style={s.piggy}>🐷</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={createOpen} transparent animationType="slide" onRequestClose={() => setCreateOpen(false)}>
        <CreateGoalSheet onClose={() => setCreateOpen(false)} onCreated={load} />
      </Modal>
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
  statSub: { fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  card: { flexDirection: 'row', gap: 16, borderRadius: 18, padding: 18, marginBottom: 12, borderWidth: 1 },
  cardBody: { flex: 1, gap: 4 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTopRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardName: { fontWeight: '800', fontSize: 16, flex: 1 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cardSub: { fontSize: 12 },
  cardAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  amtLabel: { fontSize: 11, marginBottom: 2 },
  amtValue: { fontWeight: '700', fontSize: 15 },
  emptyCard: { borderRadius: 20, padding: 32, borderWidth: 1, alignItems: 'center', gap: 8, marginBottom: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '800' },
  emptySub: { fontSize: 13 },
  banner: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 24, marginTop: 8, borderWidth: 1 },
  bannerText: { flex: 1, gap: 6 },
  bannerTitle: { fontWeight: '800', fontSize: 18 },
  bannerSub: { fontSize: 13, lineHeight: 18 },
  bannerBtn: { borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, alignSelf: 'flex-start', marginTop: 8 },
  bannerBtnText: { fontWeight: '800', fontSize: 14 },
  piggy: { fontSize: 64, opacity: 0.4 },
});
