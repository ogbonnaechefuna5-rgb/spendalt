import { Logo } from '@/components/ui/logo';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/auth-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { NativeModules, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;
const PIN_LENGTH = 6;
const KEY_SIZE = 80;

const KEYS = [
  { num: '1', sub: '' }, { num: '2', sub: 'ABC' }, { num: '3', sub: 'DEF' },
  { num: '4', sub: 'GHI' }, { num: '5', sub: 'JKL' }, { num: '6', sub: 'MNO' },
  { num: '7', sub: 'PQRS' }, { num: '8', sub: 'TUV' }, { num: '9', sub: 'WXYZ' },
  { num: '', sub: '' }, { num: '0', sub: '+' }, { num: '⌫', sub: '' },
];

export default function LocalAuthScreen() {
  const router = useRouter();
  const { hasBiometrics, biometricTypes, biometricEnabled, passcodeEnabled, isFirstLaunch,
          verifyPasscode, unlockWithBiometric, refreshSession } = useAuth();

  const isFaceID = biometricTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  const biometricLabel = isFaceID ? 'Face ID' : 'Fingerprint';

  const { passcode: passcodeParam } = useLocalSearchParams<{ passcode?: string }>();
  const forcePasscode = passcodeParam === '1';

  const [showPasscode, setShowPasscode] = useState(forcePasscode);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutLeft, setLockoutLeft] = useState(0);
  const prompted = useRef(false);
  const lockoutTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NativeModules.RNScreenshotPrevent?.forbid?.();
      return () => NativeModules.RNScreenshotPrevent?.allow?.();
    }
  }, []);

  useEffect(() => {
    if (lockoutLeft <= 0) return;
    lockoutTimer.current = setInterval(() => {
      setLockoutLeft(s => {
        if (s <= 1) { clearInterval(lockoutTimer.current!); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(lockoutTimer.current!);
  }, [lockoutLeft > 0]);

  // Wait until auth state has loaded (isFirstLaunch transitions from null)
  useEffect(() => {
    if (isFirstLaunch === null) return; // still loading
    if (prompted.current) return;
    prompted.current = true;

    if (forcePasscode) {
      setShowPasscode(true);
      return;
    }

    if (biometricEnabled && hasBiometrics) {
      handleBiometric();
    } else if (passcodeEnabled) {
      SecureStore.getItemAsync('spendalt_refresh_token').then(token => {
        if (token) setShowPasscode(true);
        else router.replace('/login');
      });
    } else {
      router.replace('/login');
    }
  }, [isFirstLaunch]);

  const handleBiometric = async () => {
    setError('');
    setLoading(true);
    const success = await unlockWithBiometric();
    if (success) {
      router.replace('/(tabs)');
    } else {
      setError(`${biometricLabel} failed or session expired. Please log in again.`);
      if (passcodeEnabled) setShowPin(true);
    }
    setLoading(false);
  };

  const handlePasscodeKey = async (key: string) => {
    if (lockoutLeft > 0 || key === '') return;
    if (key === '⌫') { setPasscode(p => p.slice(0, -1)); setError(''); return; }
    if (passcode.length >= PIN_LENGTH) return;

    const next = passcode + key;
    setPasscode(next);

    if (next.length === PIN_LENGTH) {
      setTimeout(async () => {
        const ok = await verifyPasscode(next);
        if (ok) {
          setAttempts(0);
          refreshSession();
          router.replace('/(tabs)');
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          setPasscode('');
          if (newAttempts >= MAX_ATTEMPTS) {
            setAttempts(0);
            setLockoutLeft(LOCKOUT_SECONDS);
            setError(`Too many attempts. Try again in ${LOCKOUT_SECONDS}s.`);
          } else {
            setError(`Incorrect passcode. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts === 1 ? '' : 's'} remaining.`);
          }
        }
      }, 150);
    }
  };

  if (showPasscode) {
    return (
      <View style={s.container}>
        <Text style={s.title}>Enter Passcode</Text>

        <View style={s.dots}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View key={i} style={[s.dot, i < passcode.length && s.dotFilled]} />
          ))}
        </View>

        {lockoutLeft > 0
          ? <Text style={s.error}>Locked. Try again in {lockoutLeft}s.</Text>
          : error ? <Text style={s.error}>{error}</Text> : null
        }

        <View style={s.keypad}>
          {KEYS.map((k, i) => {
            const isEmpty = k.num === '';
            const isDelete = k.num === '⌫';
            return (
              <View key={i} style={s.cell}>
                {!isEmpty && (
                  <TouchableOpacity
                    style={[s.key, isDelete && s.keyGhost]}
                    onPress={() => handlePasscodeKey(k.num)}
                    disabled={lockoutLeft > 0}
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

        <TouchableOpacity style={s.switchLink} onPress={() => router.replace('/login')}>
          <Text style={s.switchText}>Sign in with a different account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Logo size="lg" showWordmark={false} />
      {loading && <Text style={s.hint}>Authenticating…</Text>}
      {error ? <Text style={s.error}>{error}</Text> : null}
      <TouchableOpacity style={s.switchLink} onPress={() => router.replace('/login')}>
        <Text style={s.switchText}>Sign in with a different account</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  title: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 32 },
  hint: { color: '#8e8e93', fontSize: 13, marginTop: 16 },
  dots: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#fff' },
  dotFilled: { backgroundColor: '#fff', borderColor: '#fff' },
  error: { color: '#ff453a', fontSize: 13, textAlign: 'center', marginBottom: 8 },
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
  switchLink: { position: 'absolute', bottom: 48 },
  switchText: { color: '#fff', fontSize: 13, textDecorationLine: 'underline' },
});
