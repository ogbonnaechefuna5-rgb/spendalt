import { StyleSheet, Text, View } from 'react-native';

export function ScreenFooter() {
  return (
    <View style={s.footer}>
      <Text style={s.link}>Privacy Policy</Text>
      <Text style={s.link}>Terms of Service</Text>
      <Text style={s.link}>Contact Support</Text>
    </View>
  );
}

const s = StyleSheet.create({
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto' },
  link: { color: '#ffffff30', fontSize: 11 },
});
