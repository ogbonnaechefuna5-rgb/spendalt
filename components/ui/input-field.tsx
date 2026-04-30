import { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '@/context/theme-context';

type Props = TextInputProps & {
  label: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  rightLabel?: ReactNode;
};

export function InputField({ label, leftIcon, rightIcon, rightLabel, style, ...props }: Props) {
  const { theme, textColor, borderColor } = useTheme();

  return (
    <View style={s.wrapper}>
      <View style={s.labelRow}>
        <Text style={[s.label, { color: theme.green }]}>{label}</Text>
        {rightLabel}
      </View>
      <View style={[s.inputRow, { backgroundColor: theme.card, borderColor }]}>
        {leftIcon && <View style={s.iconSlot}>{leftIcon}</View>}
        <TextInput
          maxLength={255}
          style={[s.input, { color: textColor }, leftIcon && s.inputWithLeft, rightIcon && s.inputWithRight, style]}
          placeholderTextColor={theme.bgMid === theme.bgDeep ? '#ffffff30' : '#00000030'}
          {...props}
        />
        {rightIcon && <View style={s.iconSlot}>{rightIcon}</View>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { gap: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, overflow: 'visible' },
  iconSlot: { paddingHorizontal: 14, justifyContent: 'center', alignItems: 'center', minWidth: 44, minHeight: 44 },
  input: { flex: 1, fontSize: 15, paddingVertical: 16 },
  inputWithLeft: { paddingLeft: 0 },
  inputWithRight: { paddingRight: 0 },
});
