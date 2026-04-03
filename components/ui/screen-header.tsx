import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/theme-context';

type Props = { title: string };

export function ScreenHeader({ title }: Props) {
  const router = useRouter();
  const { textColor } = useTheme();

  return (
    <View style={s.row}>
      <TouchableOpacity onPress={() => router.back()} style={s.back}>
        <IconSymbol name="arrow.left" size={18} color={textColor} />
      </TouchableOpacity>
      <Text style={[s.title, { color: textColor }]}>{title}</Text>
      <View style={s.back} />
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  back: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '700', fontSize: 17 },
});
