import { Animated, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useRef, View } from 'react-native';
import { useEffect, useRef as useR } from 'react';
import { useTheme } from '@/context/theme-context';

export type DialogAction = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'destructive' | 'ghost';
};

export type DialogConfig = {
  title: string;
  message?: string;
  actions: DialogAction[];
  icon?: string;
};

type Props = DialogConfig & { visible: boolean; onClose: () => void };

export function Dialog({ visible, title, message, actions, onClose }: Props) {
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const scale = useR(new Animated.Value(0.9)).current;
  const opacity = useR(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 250 }),
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0.9);
      opacity.setValue(0);
    }
  }, [visible]);

  const variantStyle = (variant: DialogAction['variant'] = 'ghost') => ({
    primary: { bg: theme.green, text: theme.bgDeep },
    destructive: { bg: '#EF444415', text: '#EF4444' },
    ghost: { bg: 'transparent', text: textColor },
  }[variant]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[s.overlay, { opacity }]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[s.card, { backgroundColor: theme.card, borderColor, transform: [{ scale }] }]}>
              <Text style={[s.title, { color: textColor }]}>{title}</Text>
              {message ? <Text style={[s.message, { color: subTextColor }]}>{message}</Text> : null}
              <View style={[s.divider, { backgroundColor: borderColor }]} />
              <View style={s.actions}>
                {actions.map((action, i) => {
                  const vs = variantStyle(action.variant);
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[s.actionBtn, { backgroundColor: vs.bg }, action.variant === 'primary' && s.primaryBtn]}
                      onPress={() => { action.onPress(); onClose(); }}
                      activeOpacity={0.75}
                    >
                      <Text style={[s.actionText, { color: vs.text }, action.variant === 'primary' && s.primaryText]}>
                        {action.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: '#00000070',
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  card: {
    width: '100%', borderRadius: 24, borderWidth: 1,
    paddingTop: 28, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 24, shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  title: { fontSize: 18, fontWeight: '800', textAlign: 'center', paddingHorizontal: 24, marginBottom: 8 },
  message: { fontSize: 14, lineHeight: 22, textAlign: 'center', paddingHorizontal: 24, marginBottom: 24 },
  divider: { height: 1 },
  actions: { flexDirection: 'row' },
  actionBtn: { flex: 1, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { borderRadius: 0 },
  actionText: { fontSize: 15, fontWeight: '600' },
  primaryText: { fontWeight: '800' },
});
