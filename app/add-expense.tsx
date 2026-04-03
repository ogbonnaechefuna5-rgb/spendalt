import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useTheme } from '@/context/theme-context';

const KEYS = ['1','2','3','4','5','6','7','8','9','.','0','⌫'];
const CATEGORIES = ['Shopping','Food','Transport','Bills','Income','Other'];

export default function AddExpenseScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor, isDark } = useTheme();
  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState('Shopping');
  const [catOpen, setCatOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [dateOpen, setDateOpen] = useState(false);

  const handleKey = (key: string) => {
    setAmount(prev => {
      if (key === '⌫') return prev.slice(0, -1) || '0';
      if (key === '.' && prev.includes('.')) return prev;
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  };

  const formatDate = (d: Date) => {
    const isToday = d.toDateString() === new Date().toDateString();
    const label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    return isToday ? `Today, ${label}` : label;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgDeep }}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
            <IconSymbol name="xmark" size={18} color={theme.green} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: textColor }]}>Add Expense</Text>
          <View style={s.headerBtn} />
        </View>

        <View style={s.amountSection}>
          <Text style={[s.amountLabel, { color: theme.green }]}>How much?</Text>
          <View style={s.amountRow}>
            <Text style={[s.currency, { color: theme.green }]}>$</Text>
            <Text style={[s.amount, { color: textColor }]}>{amount}</Text>
          </View>
        </View>

        <View style={s.fields}>
          <TouchableOpacity style={[s.field, { backgroundColor: theme.card, borderColor }]} onPress={() => setCatOpen(v => !v)}>
            <View style={[s.fieldIcon, { backgroundColor: theme.bgMid }]}>
              <IconSymbol name="square.grid.2x2.fill" size={20} color={theme.green} />
            </View>
            <View style={s.fieldText}>
              <Text style={[s.fieldLabel, { color: theme.green }]}>CATEGORY</Text>
              <Text style={[s.fieldValue, { color: textColor }]}>{category}</Text>
            </View>
            <IconSymbol name="chevron.right" size={14} color={theme.green} />
          </TouchableOpacity>
          {catOpen && (
            <View style={[s.dropdown, { backgroundColor: theme.card, borderColor }]}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} style={s.dropdownItem} onPress={() => { setCategory(c); setCatOpen(false); }}>
                  <Text style={[s.dropdownText, { color: subTextColor }, c === category && { color: theme.green, fontWeight: '700' }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={[s.field, { backgroundColor: theme.card, borderColor }]}>
            <View style={[s.fieldIcon, { backgroundColor: theme.bgMid }]}>
              <IconSymbol name="list.bullet" size={20} color={theme.green} />
            </View>
            <View style={s.fieldText}>
              <Text style={[s.fieldLabel, { color: theme.green }]}>DESCRIPTION</Text>
              <TextInput
                style={[s.input, { color: textColor }]}
                placeholder="What did you buy?"
                placeholderTextColor={subTextColor}
                value={description}
                onChangeText={setDescription}
                returnKeyType="done"
              />
            </View>
          </View>

          <TouchableOpacity style={[s.field, { backgroundColor: theme.card, borderColor }]} onPress={() => setDateOpen(true)}>
            <View style={[s.fieldIcon, { backgroundColor: theme.bgMid }]}>
              <IconSymbol name="calendar" size={20} color={theme.green} />
            </View>
            <View style={s.fieldText}>
              <Text style={[s.fieldLabel, { color: theme.green }]}>DATE</Text>
              <Text style={[s.fieldValue, { color: textColor }]}>{formatDate(date)}</Text>
            </View>
            <IconSymbol name="chevron.right" size={14} color={theme.green} />
          </TouchableOpacity>
        </View>

        <View style={s.numpad}>
          {KEYS.map(key => (
            <TouchableOpacity key={key} style={s.key} onPress={() => handleKey(key)}>
              {key === '⌫'
                ? <IconSymbol name="delete.left.fill" size={22} color={textColor} />
                : <Text style={[s.keyText, { color: textColor }]}>{key}</Text>
              }
            </TouchableOpacity>
          ))}
        </View>

        <PrimaryButton label="Add Transaction" onPress={() => router.back()} />
      </ScrollView>

      <Modal visible={dateOpen} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setDateOpen(false)}>
          <View style={s.pickerOverlay}>
            <TouchableWithoutFeedback>
              <View style={[s.pickerSheet, { backgroundColor: theme.card, borderColor }]}>
                <View style={[s.pickerHeader, { borderBottomColor: borderColor }]}>
                  <Text style={[s.pickerTitle, { color: textColor }]}>Select Date</Text>
                  <TouchableOpacity onPress={() => setDateOpen(false)}>
                    <Text style={[s.pickerDone, { color: theme.green }]}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={(_, d) => d && setDate(d)}
                  themeVariant={isDark ? 'dark' : 'light'}
                  style={{ width: '100%' }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '800', fontSize: 18 },
  amountSection: { alignItems: 'center', marginBottom: 32 },
  amountLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  currency: { fontSize: 36, fontWeight: '700' },
  amount: { fontSize: 56, fontWeight: '800' },
  fields: { gap: 10, marginBottom: 24 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 14, padding: 16, borderWidth: 1 },
  fieldIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  fieldText: { flex: 1, gap: 3 },
  fieldLabel: { fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },
  fieldValue: { fontWeight: '600', fontSize: 15 },
  input: { fontWeight: '600', fontSize: 15, padding: 0 },
  dropdown: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginTop: -6 },
  dropdownItem: { paddingHorizontal: 20, paddingVertical: 12 },
  dropdownText: { fontSize: 14 },
  numpad: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  key: { width: '33.33%', alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  keyText: { fontSize: 26, fontWeight: '600' },
  pickerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000070' },
  pickerSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, borderWidth: 1 },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1 },
  pickerTitle: { fontWeight: '700', fontSize: 16 },
  pickerDone: { fontWeight: '700', fontSize: 16 },
});
