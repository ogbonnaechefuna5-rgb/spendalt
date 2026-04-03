import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ReactNode } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/theme-context';

type Props = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  rightIcon?: ReactNode;
  onPress?: () => void;
};

export function SettingsRow({ icon, title, subtitle, rightIcon, onPress }: Props) {
  const { theme, textColor, subTextColor } = useTheme();

  return (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[s.iconBox, { backgroundColor: theme.bgMid }]}>{icon}</View>
      <View style={s.text}>
        <Text style={[s.title, { color: textColor }]}>{title}</Text>
        <Text style={[s.subtitle, { color: subTextColor }]}>{subtitle}</Text>
      </View>
      {rightIcon ?? <IconSymbol name="chevron.right" size={16} color={subTextColor} />}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 14 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 3 },
  title: { fontWeight: '600', fontSize: 15 },
  subtitle: { fontSize: 12 },
});
