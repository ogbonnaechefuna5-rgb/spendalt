import { StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand } from '@/constants/theme';

type Props = { size?: 'sm' | 'lg'; showWordmark?: boolean };

const config = {
  sm: { box: 32, radius: 8, icon: 16, font: 16 },
  lg: { box: 100, radius: 24, icon: 48, font: 48 },
};

export function Logo({ size = 'sm', showWordmark = true }: Props) {
  const c = config[size];
  return (
    <View style={styles.row}>
      <View style={[styles.box, { width: c.box, height: c.box, borderRadius: c.radius }]}>
        <IconSymbol name="creditcard.fill" size={c.icon} color={Brand.green} />
      </View>
      {showWordmark && <Text style={[styles.wordmark, { fontSize: c.font }]}>Spendalt</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  box: {
    backgroundColor: Brand.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  wordmark: { color: '#fff', fontWeight: '700' },
});
