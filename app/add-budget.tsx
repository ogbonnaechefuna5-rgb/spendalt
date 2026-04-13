import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InputField } from '@/components/ui/input-field';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useTheme } from '@/context/theme-context';
import { createBudget } from '@/services/budgets-api';

const CATEGORIES = [
  { label: 'Food',      icon: '🍔' },
  { label: 'Transport', icon: '🚗' },
  { label: 'Shopping',  icon: '🛍️' },
  { label: 'Bills',     icon: '⚡' },
  { label: 'Health',    icon: '💊' },
  { label: 'Other',     icon: '📦' },
];

import { useUI } from '@/context/ui-context';

export default function AddBudgetScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const { showToast } = useUI();
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    const amount = parseFloat(limit.replace(/,/g, ''));
    if (!category || !amount) return;
    setLoading(true);
    setError('');
    try {
      await createBudget({ category, amount, period: 'monthly' });
      showToast({ message: 'Budget created successfully!', type: 'success' });
      router.back();
    } catch (e: any) {
      setError(e.message ?? 'Failed to create budget.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgDeep }} contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <IconSymbol name="arrow.left" size={18} color={textColor} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: textColor }]}>Add Budget</Text>
        <View style={s.headerBtn} />
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>CATEGORY</Text>
      <View style={s.categoryGrid}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c.label}
            style={[s.categoryCard, { backgroundColor: theme.card, borderColor }, category === c.label && { borderColor: theme.green, backgroundColor: `${theme.green}18` }]}
            onPress={() => setCategory(c.label)}
          >
            <Text style={s.categoryIcon}>{c.icon}</Text>
            <Text style={[s.categoryLabel, { color: textColor }, category === c.label && { color: theme.green }]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[s.sectionLabel, { color: theme.green }]}>MONTHLY LIMIT</Text>
      <InputField
        label=""
        placeholder="₦0.00"
        keyboardType="numeric"
        value={limit}
        onChangeText={setLimit}
        leftIcon={<IconSymbol name="banknote.fill" size={16} color={subTextColor} />}
      />

      {error ? <Text style={[s.error]}>{error}</Text> : null}
      <PrimaryButton label={loading ? 'Creating…' : 'Create Budget'} onPress={handleCreate} style={s.cta} disabled={!category || !limit || loading} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '800', fontSize: 18 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.5, fontWeight: '700', marginBottom: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  categoryCard: { width: '30%', borderRadius: 14, padding: 14, alignItems: 'center', gap: 6, borderWidth: 1 },
  categoryIcon: { fontSize: 26 },
  categoryLabel: { fontSize: 13, fontWeight: '600' },
  error: { color: '#ff6b6b', fontSize: 13, textAlign: 'center', marginTop: 12 },
  cta: { marginTop: 32 },
});
