import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useTheme } from '@/context/theme-context';
import { getHealthScore, HealthScore } from '@/services/analytics-api';
import { useUI } from '@/context/ui-context';

const RING_SIZE = 200, RING_STROKE = 12;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;
const ARC_PCT = 0.78;

function ScoreRing({ score, green, textColor }: { score: number; green: string; textColor: string }) {
  const filled = (score / 100) * RING_CIRC * ARC_PCT;
  const gap = RING_CIRC * ARC_PCT - filled;
  const offset = RING_CIRC * (1 - ARC_PCT) / 2;
  const label = score >= 80 ? 'EXCELLENT' : score >= 65 ? 'GOOD' : score >= 50 ? 'FAIR' : 'POOR';

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
        <Text style={[ring.score, { color: textColor }]}>{score}</Text>
        <Text style={[ring.label, { color: green }]}>{label}</Text>
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

const INSIGHT_ICONS: Record<string, string> = {
  'Savings Ratio': '🐷',
  'Spending Discipline': '💵',
  'Budget Adherence': '✅',
};

export default function FinancialHealthScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const { showNotification } = useUI();
  const [health, setHealth] = useState<HealthScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHealthScore()
      .then(setHealth)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleImprovementPlan = () => {
    if (!health) return;
    showNotification({
      title: 'Improvement Plan',
      body: health.recommendations[0] ?? 'Keep up the great work!',
      icon: 'lightbulb.fill',
      iconColor: '#F59E0B',
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgDeep }}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
            <IconSymbol name="arrow.left" size={18} color={textColor} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: textColor }]}>Financial Health</Text>
          <View style={s.headerBtn} />
        </View>

        {loading ? (
          <ActivityIndicator color={theme.green} style={{ marginTop: 60 }} />
        ) : health ? (
          <>
            <View style={s.ringWrap}>
              <ScoreRing score={health.score} green={theme.green} textColor={textColor} />
              <Text style={[s.scoreCaption, { color: subTextColor }]}>
                Based on your spending and savings this month
              </Text>
            </View>

            <View style={[s.rankCard, { backgroundColor: theme.card, borderColor }]}>
              <View style={s.rankTop}>
                <Text style={[s.rankLabel, { color: textColor }]}>Percentile Rank</Text>
                <Text style={[s.rankValue, { color: theme.green }]}>TOP {100 - health.percentile}%</Text>
              </View>
              <View style={[s.track, { backgroundColor: theme.bgMid }]}>
                <View style={[s.trackFill, { backgroundColor: theme.green, width: `${health.percentile}%` as any }]} />
              </View>
              <Text style={[s.rankDesc, { color: subTextColor }]}>
                Your financial health score is {health.grade.toLowerCase()} this month.
              </Text>
            </View>

            <Text style={[s.sectionTitle, { color: textColor }]}>Key Insights</Text>
            <View style={s.insightsList}>
              {health.insights.map(item => {
                const valueColor = item.score >= 65 ? theme.green : item.score >= 50 ? '#F59E0B' : '#EF4444';
                return (
                  <View key={item.category} style={[s.insightRow, { backgroundColor: theme.card, borderColor }]}>
                    <View style={[s.insightIcon, { backgroundColor: theme.bgMid }]}>
                      <Text style={{ fontSize: 22 }}>{INSIGHT_ICONS[item.category] ?? '📊'}</Text>
                    </View>
                    <View style={s.insightBody}>
                      <View style={s.insightTop}>
                        <Text style={[s.insightLabel, { color: textColor }]}>{item.category}</Text>
                        <Text style={[s.insightValue, { color: valueColor }]}>{item.status}</Text>
                      </View>
                      <Text style={[s.insightDesc, { color: subTextColor }]}>{item.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {health.recommendations.length > 0 && (
              <View style={[s.recsCard, { backgroundColor: theme.card, borderColor }]}>
                <Text style={[s.recsTitle, { color: textColor }]}>Recommendations</Text>
                {health.recommendations.map((r, i) => (
                  <View key={i} style={s.recRow}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color={theme.green} />
                    <Text style={[s.recText, { color: subTextColor }]}>{r}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ height: 24 }} />
            <PrimaryButton label="View Improvement Plan  ↗" onPress={handleImprovementPlan} />
            <View style={{ height: 40 }} />
          </>
        ) : (
          <Text style={[s.empty, { color: subTextColor }]}>Could not load health score.</Text>
        )}
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
  trackFill: { height: '100%', borderRadius: 3 },
  rankDesc: { fontSize: 12, lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  insightsList: { gap: 4, marginBottom: 20 },
  insightRow: { flexDirection: 'row', gap: 14, borderRadius: 16, padding: 16, borderWidth: 1 },
  insightIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  insightBody: { flex: 1, gap: 4 },
  insightTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  insightLabel: { fontWeight: '700', fontSize: 15 },
  insightValue: { fontWeight: '700', fontSize: 14 },
  insightDesc: { fontSize: 12, lineHeight: 17 },
  recsCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10, marginBottom: 8 },
  recsTitle: { fontWeight: '700', fontSize: 15 },
  recRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  recText: { flex: 1, fontSize: 13, lineHeight: 20 },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 14 },
});
