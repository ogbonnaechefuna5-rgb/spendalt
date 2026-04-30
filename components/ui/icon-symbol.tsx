// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'person.fill': 'person',
  'lock.fill': 'lock',
  'questionmark.circle': 'help',
  'questionmark.circle.fill': 'help',
  'faceid': 'face',
  'touchid': 'fingerprint',
  'globe': 'language',
  'apple.logo': 'apple',
  'creditcard.fill': 'credit-card',
  'arrow.clockwise': 'refresh',
  'arrow.down.to.line': 'download',
  'arrow.left': 'arrow-back',
  'arrow.left.arrow.right': 'swap-horiz',
  'arrow.up.circle.fill': 'arrow-circle-up',
  'arrow.up.right': 'open-in-new',
  'banknote.fill': 'attach-money',
  'bell.fill': 'notifications',
  'building.columns.fill': 'account-balance',
  'calendar': 'calendar-today',
  'camera.fill': 'camera-alt',
  'chart.bar.fill': 'bar-chart',
  'chart.pie.fill': 'pie-chart',
  'checkmark.circle.fill': 'check-circle',
  'checkmark.shield.fill': 'verified-user',
  'delete.left': 'backspace',
  'delete.left.fill': 'backspace',
  'desktopcomputer': 'computer',
  'doc.text.fill': 'description',
  'ellipsis': 'more-horiz',
  'envelope.fill': 'email',
  'exclamationmark.triangle.fill': 'warning',
  'fork.knife': 'restaurant',
  'info.circle.fill': 'info',
  'iphone': 'smartphone',
  'list.bullet': 'list',
  'lock.rotation': 'lock-reset',
  'lock.shield.fill': 'security',
  'magnifyingglass': 'search',
  'message.fill': 'message',
  'number.square.fill': 'tag',
  'pencil': 'edit',
  'phone.fill': 'phone',
  'plus': 'add',
  'rectangle.portrait.and.arrow.right': 'logout',
  'square.and.arrow.up.fill': 'share',
  'square.grid.2x2.fill': 'grid-view',
  'trash.fill': 'delete',
  'xmark': 'close',
  'xmark.circle.fill': 'cancel',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
