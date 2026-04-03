import { StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '@/context/theme-context';

export default function SettingsScreen() {
  const { theme, textColor, subTextColor, borderColor, isDark, toggleTheme } = useTheme();

  return (
    <View style={[s.container, { backgroundColor: theme.bgDeep }]}>
      <Text style={[s.title, { color: textColor }]}>Settings</Text>

      <View style={[s.row, { backgroundColor: theme.card, borderColor }]}>
        <View style={s.rowText}>
          <Text style={[s.rowLabel, { color: textColor }]}>Dark Mode</Text>
          <Text style={[s.rowSub, { color: subTextColor }]}>Switch between light and dark theme</Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#ccc', true: theme.green }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 64 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 32 },
  row: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, borderWidth: 1, gap: 12 },
  rowText: { flex: 1, gap: 3 },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowSub: { fontSize: 12 },
});
