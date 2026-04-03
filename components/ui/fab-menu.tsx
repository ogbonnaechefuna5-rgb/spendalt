import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SymbolViewProps } from 'expo-symbols';
import { useTheme } from '@/context/theme-context';

type NavItem = { label: string; icon: SymbolViewProps['name']; route: string };

const ITEMS: NavItem[] = [
  { label: 'Add Expense',  icon: 'plus.circle.fill',       route: '/add-expense'      },
  { label: 'Savings',      icon: 'banknote.fill',          route: '/savings'           },
  { label: 'Health',       icon: 'heart.text.square.fill', route: '/financial-health'  },
  { label: 'History',      icon: 'clock.arrow.circlepath', route: '/(tabs)/history'    },
  { label: 'Budget',       icon: 'chart.pie.fill',         route: '/(tabs)/budget'     },
];

type Props = { onClose: () => void };

export function FabMenu({ onClose }: Props) {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();

  const go = (route: string) => { onClose(); router.push(route as any); };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={s.overlay}>
        <TouchableWithoutFeedback>
          <View style={[s.tray, { backgroundColor: theme.card, borderColor }]}>
            <Text style={[s.trayTitle, { color: subTextColor }]}>Quick Navigate</Text>
            <View style={s.grid}>
              {ITEMS.map(item => (
                <TouchableOpacity key={item.label} style={[s.item, { backgroundColor: theme.bgDeep, borderColor }]} onPress={() => go(item.route)}>
                  <View style={[s.iconBox, { backgroundColor: theme.bgMid }]}>
                    <IconSymbol name={item.icon} size={22} color={theme.green} />
                  </View>
                  <Text style={[s.itemLabel, { color: textColor }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const s = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', backgroundColor: '#00000060' },
  tray: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 100, borderWidth: 1, gap: 20 },
  trayTitle: { fontSize: 12, fontWeight: '600', letterSpacing: 1.5, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  item: { width: '30%', flexGrow: 1, borderRadius: 16, paddingVertical: 16, alignItems: 'center', gap: 8, borderWidth: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontSize: 12, fontWeight: '600' },
});
