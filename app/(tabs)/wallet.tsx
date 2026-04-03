import { StyleSheet, Text, View } from 'react-native';
import { Brand } from '@/constants/theme';

export default function WalletScreen() {
  return (
    <View style={s.container}>
      <Text style={s.text}>Wallet</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bgDeep, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontSize: 24, fontWeight: '700' },
});
