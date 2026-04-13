import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PIN_LENGTH = 6;

const KEYS = [
  { num: '1', sub: '' },
  { num: '2', sub: 'ABC' },
  { num: '3', sub: 'DEF' },
  { num: '4', sub: 'GHI' },
  { num: '5', sub: 'JKL' },
  { num: '6', sub: 'MNO' },
  { num: '7', sub: 'PQRS' },
  { num: '8', sub: 'TUV' },
  { num: '9', sub: 'WXYZ' },
  { num: '', sub: '' },
  { num: '0', sub: '+' },
  { num: '⌫', sub: '' },
];

export default function SetupPinScreen() {
  const router = useRouter();
  const { savePin } = useAuth();

  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');

  const handleKey = (key: string) => {
    if (key === '') return;
    if (key === '⌫') {
      setPin(p => p.slice(0, -1));
      setError('');
      return;
    }
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + key;
    setPin(next);
    if (next.length === PIN_LENGTH) setTimeout(() => advance(next), 150);
  };

  const advance = (entered: string) => {
    if (step === 'create') {
      setFirstPin(entered);
      setPin('');
      setStep('confirm');
    } else {
      if (entered === firstPin) {
        savePin(entered).then(() => router.back());
      } else {
        setError('Passcodes did not match. Try again.');
        setPin('');
        setStep('create');
        setFirstPin('');
      }
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>
        {step === 'create' ? 'Enter a Passcode' : 'Re-enter Passcode'}
      </Text>
      <Text style={s.subtitle}>
        {step === 'create'
          ? 'Create a 6-digit passcode'
          : 'Enter your new passcode again'}
      </Text>

      {/* Dots */}
      <View style={s.dots}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View key={i} style={[s.dot, i < pin.length && s.dotFilled]} />
        ))}
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}

      {/* Keypad */}
      <View style={s.keypad}>
        {KEYS.map((k, i) => {
          const isEmpty = k.num === '';
          const isDelete = k.num === '⌫';
          return (
            <View key={i} style={s.cell}>
              {!isEmpty && (
                <TouchableOpacity
                  style={[s.key, isDelete && s.keyGhost]}
                  onPress={() => handleKey(k.num)}
                  activeOpacity={0.5}
                >
                  {isDelete ? (
                    <IconSymbol name="delete.left" size={24} color="#fff" />
                  ) : (
                    <>
                      <Text style={s.keyNum}>{k.num}</Text>
                      {k.sub ? <Text style={s.keySub}>{k.sub}</Text> : null}
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={s.cancel} onPress={() => router.back()}>
        <Text style={s.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const KEY_SIZE = 80;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 6 },
  subtitle: { color: '#8e8e93', fontSize: 14, marginBottom: 32 },
  dots: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  dot: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 1, borderColor: '#fff',
  },
  dotFilled: { backgroundColor: '#fff', borderColor: '#fff' },
  error: { color: '#ff453a', fontSize: 13, marginBottom: 8 },
  keypad: {
    flexDirection: 'row', flexWrap: 'wrap',
    width: KEY_SIZE * 3 + 48, marginTop: 24,
    rowGap: 12, columnGap: 16,
    justifyContent: 'center',
  },
  cell: { width: KEY_SIZE, height: KEY_SIZE, alignItems: 'center', justifyContent: 'center' },
  key: {
    width: KEY_SIZE, height: KEY_SIZE, borderRadius: KEY_SIZE / 2,
    backgroundColor: '#2C2C2E',
    alignItems: 'center', justifyContent: 'center',
  },
  keyGhost: { backgroundColor: 'transparent' },
  keyNum: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
  keySub: { color: '#fff', fontSize: 10, fontWeight: '600', letterSpacing: 1.5, marginTop: -2 },
  cancel: { marginTop: 24 },
  cancelText: { color: '#fff', fontSize: 17 },
});
