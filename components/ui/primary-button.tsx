import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Brand } from '@/constants/theme';

type Props = TouchableOpacityProps & { label: string };

export function PrimaryButton({ label, style, ...props }: Props) {
  return (
    <TouchableOpacity style={[s.btn, style]} {...props}>
      <Text style={s.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    backgroundColor: Brand.green, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
  },
  label: { color: Brand.bgDeep, fontWeight: '700', fontSize: 16 },
});
