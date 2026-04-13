import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/theme-context';

export type NotificationConfig = {
  title: string;
  body: string;
  icon?: string;
  iconColor?: string;
  action?: { label: string; onPress: () => void };
  duration?: number;
};

type Props = NotificationConfig & { onHide: () => void };

export function Notification({ title, body, icon = 'bell.fill', iconColor, action, duration = 4500, onHide }: Props) {
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-160)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const accentColor = iconColor ?? theme.green;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 180 }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(hide, duration);
    return () => clearTimeout(timer);
  }, []);

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -160, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onHide());
  };

  return (
    <Animated.View style={[s.wrap, { top: insets.top + 8, opacity, transform: [{ translateY }] }]}>
      <View style={[s.card, { backgroundColor: theme.card, borderColor }]}>
        <View style={[s.iconBox, { backgroundColor: `${accentColor}20` }]}>
          <IconSymbol name={icon} size={22} color={accentColor} />
        </View>
        <View style={s.body}>
          <Text style={[s.title, { color: textColor }]} numberOfLines={1}>{title}</Text>
          <Text style={[s.message, { color: subTextColor }]} numberOfLines={2}>{body}</Text>
          {action && (
            <TouchableOpacity onPress={() => { action.onPress(); hide(); }}>
              <Text style={[s.actionText, { color: accentColor }]}>{action.label}</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={hide} style={s.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <IconSymbol name="xmark" size={13} color={subTextColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12, zIndex: 9998 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    borderRadius: 20, padding: 16, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  body: { flex: 1, gap: 3 },
  title: { fontSize: 15, fontWeight: '700' },
  message: { fontSize: 13, lineHeight: 18 },
  actionText: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  closeBtn: { padding: 2 },
});
