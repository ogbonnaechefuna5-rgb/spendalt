import { StyleSheet, Text, View } from 'react-native';
import { SymbolViewProps } from 'expo-symbols';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand } from '@/constants/theme';

type Props = { icon: SymbolViewProps['name']; label: string };

export function FeaturePill({ icon, label }: Props) {
  return (
    <View style={styles.pill}>
      <IconSymbol name={icon} size={22} color={Brand.green} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    backgroundColor: Brand.card,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#ffffff0a',
  },
  label: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
