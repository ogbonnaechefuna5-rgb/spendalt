import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ReactNode } from 'react';
import { useTheme } from '@/context/theme-context';

type Props = TouchableOpacityProps & { label: string; icon: ReactNode };

export function SocialButton({ label, icon, style, ...props }: Props) {
  const { theme, textColor, borderColor } = useTheme();

  return (
    <TouchableOpacity style={[s.btn, { backgroundColor: theme.card, borderColor }, style]} {...props}>
      {icon}
      <Text style={[s.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12, paddingVertical: 14, borderWidth: 1 },
  label: { fontWeight: '600', fontSize: 15 },
});
