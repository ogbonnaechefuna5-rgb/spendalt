import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/theme-context';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastConfig = {
  message: string;
  type?: ToastType;
  duration?: number;
};

type Props = ToastConfig & { onHide: () => void };

const ICONS: Record<ToastType, string> = {
  success: 'checkmark.circle.fill',
  error: 'xmark.circle.fill',
  warning: 'exclamationmark.triangle.fill',
  info: 'info.circle.fill',
};

const COLORS: Record<ToastType, string> = {
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#7C3AED',
};

export function Toast({ message, type = 'info', duration = 3000, onHide }: Props) {
  const { theme, textColor, borderColor } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const color = COLORS[type];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => hide(), duration);
    return () => clearTimeout(timer);
  }, []);

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -100, duration: 250, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => onHide());
  };

  return (
    <Animated.View style={[s.wrap, { top: insets.top + 12, opacity, transform: [{ translateY }] }]}>
      <View style={[s.toast, { backgroundColor: theme.card, borderColor, borderLeftColor: color }]}>
        <IconSymbol name={ICONS[type]} size={20} color={color} />
        <Text style={[s.message, { color: textColor }]} numberOfLines={2}>{message}</Text>
        <TouchableOpacity onPress={hide} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <IconSymbol name="xmark" size={14} color={textColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, zIndex: 9999 },
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  message: { flex: 1, fontSize: 14, fontWeight: '500', lineHeight: 20 },
});
