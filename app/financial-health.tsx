import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useTheme } from '@/context/theme-context';

const SCORE = 82;
const SCORE_LABEL = 'EXCELLENT';
const RING_SIZE = 200, RING_STROKE = 12;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;
const ARC_PCT = 0.78;

function ScoreRing({ green, textColor, subTextColor }: { green: string; textColor: string; subTextColor: string }) {
  const filled = (SCORE / 100) * RING_CIRC * ARC_PCT;
  const total = RING_CIRC * ARC_PCT;
  const gap = total - filled;
  const offset = RING_CIRC * (1 - ARC_PCT) / 2;

  return (
    <View style={ring.wrap}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Circle cx={RING_SIZE/2} cy={RING_SIZE/2} r={RING_R} fill="none" stroke="#00000015" strokeWidth={RING_STROKE}
          strokeDasharray={`${RING_CIRC * ARC_PCT} ${RING_CIRC * (1 - ARC_PCT)}`}
          strokeDashoffset={-offset} strokeLinecap="round"
          transform={`rotate(90 ${RING_SIZE/2} ${RING_SIZE/2})`} />
        <Circle cx={RING_SIZE/2} cy={RING_SIZE/2} r={RING_R} fill="none" stroke={green} strokeWidth={RING_STROKE}
          strokeDasharray={`${filled} ${gap + RING_CIRC * (1 - ARC_PCT)}`}
          strokeDashoffset={-offset} strokeLinecap="round"
          transform={`rotate(90 ${RING_SIZE/2} ${RING_SIZE/2})`} />
      </Svg>
      <View style={ring.center}>
        <Text style={[ring.score, { color: textColor }]}>{SCORE}</Text>
        <Text style={[ring.label, { color: green }]}>{SCORE_LABEL}</Text>
      </View>
    </View>
  );
}

const ring = StyleSheet.create({
  wrap: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center' },
  score: { fontSize: 52, fontWeight: '800' },
  label: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5 },
});

export default function FinancialHealthScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();

  const INSIGHTS = [
    { icon: '💵', label: 'Spending Discipline', desc: 'Impulse purchases down by 12% compared to last month.', value: 'Stable', valueColor: theme.green },
    { icon: '🐷', label: 'Savings Ratio', desc: "Great! You're exceeding the recommended 20% savings goal.", value: '22%', valueColor: theme.green },
    { icon: '✅', label: 'Budget Adherence', desc: 'You overspent in "Dining Out" but stayed under in "Grocery".', value: '92%', valueColor: '#F59E0B' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgDeep }}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
            <IconSymbol name="arrow.left" size={18} color={textColor} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: textColor }]}>Financial Health</Text>
          <TouchableOpacity style={s.headerBtn}>
            <IconSymbol name="square.and.arrow.up" size={18} color={textColor} />
          </TouchableOpacity>
        </View>

        <View style={s.ringWrap}>
          <ScoreRing green={theme.green} textColor={textColor} subTextColor={subTextColor} />
          <Text style={[s.scoreCaption, { color: subTextColor }]}>
            Your score increased by{' '}
            <Text style={{ color: theme.green }}>+4 pts</Text>
            {' '}this month
          </Text>
        </View>

        <View style={[s.rankCard, { backgroundColor: theme.card, borderColor }]}>
          <View style={s.rankTop}>
            <Text style={[s.rankLabel, { color: textColor }]}>Percentile Rank</Text>
            <Text style={[s.rankValue, { color: theme.green }]}>TOP 15%</Text>
          </View>
          <View style={[s.track, { backgroundColor: theme.bgMid }]}>
            <View style={[s.trackFill, { backgroundColor: theme.green }]} />
          </View>
          <Text style={[s.rankDesc, { color: subTextColor }]}>
            You're doing better than 85% of Spendalt users in your age bracket.
          </Text>
        </View>

        <Text style={[s.sectionTitle, { color: textColor }]}>Key Insights</Text>
        <View style={s.insightsList}>
          {INSIGHTS.map(item => (
            <View key={item.label} style={[s.insightRow, { backgroundColor: theme.card, borderColor }]}>
              <View style={[s.insightIcon, { backgroundColor: theme.bgMid }]}>
                <Text style={{ fontSize: 22 }}>{item.icon}</Text>
              </View>
              <View style={s.insightBody}>
                <View style={s.insightTop}>
                  <Text style={[s.insightLabel, { color: textColor }]}>{item.label}</Text>
                  <Text style={[s.insightValue, { color: item.valueColor }]}>{item.value}</Text>
                </View>
                <Text style={[s.insightDesc, { color: subTextColor }]}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
        <PrimaryButton label="View Improvement Plan  ↗" onPress={() => {}} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '800', fontSize: 18 },
  ringWrap: { alignItems: 'center', marginVertical: 16, gap: 12 },
  scoreCaption: { fontSize: 14, textAlign: 'center' },
  rankCard: { borderRadius: 16, padding: 18, marginBottom: 28, borderWidth: 1, gap: 10 },
  rankTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rankLabel: { fontWeight: '700', fontSize: 15 },
  rankValue: { fontWeight: '800', fontSize: 14 },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  trackFill: { width: '85%', height: '100%', borderRadius: 3 },
  rankDesc: { fontSize: 12, lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  insightsList: { gap: 4 },
  insightRow: { flexDirection: 'row', gap: 14, borderRadius: 16, padding: 16, borderWidth: 1 },
  insightIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  insightBody: { flex: 1, gap: 4 },
  insightTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  insightLabel: { fontWeight: '700', fontSize: 15 },
  insightValue: { fontWeight: '700', fontSize: 14 },
  insightDesc: { fontSize: 12, lineHeight: 17 },
});
