import { clearToken, getToken, setUnauthorizedListener, setRefreshHandler } from '@/services/api';
import { login as apiLogin, logout as apiLogout, refresh as apiRefresh, signup as apiSignup } from '@/services/auth-api';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

const FIRST_LAUNCH_KEY = 'spendalt_first_launch_done';
const BIOMETRIC_ENABLED_KEY = 'spendalt_biometric_enabled';
const PASSCODE_ENABLED_KEY = 'spendalt_passcode_enabled';
const PASSCODE_KEY = 'spendalt_passcode';
const REFRESH_TOKEN_KEY = 'spendalt_refresh_token';

export type AuthUser = { user_id: string; token: string };

type AuthContextType = {
  // First-launch
  isFirstLaunch: boolean | null;
  markOnboardingDone: () => Promise<void>;

  // Device biometrics capability
  hasBiometrics: boolean;
  biometricTypes: LocalAuthentication.AuthenticationType[];

  // User-configured security preferences
  biometricEnabled: boolean;
  passcodeEnabled: boolean;
  enableBiometric: () => Promise<boolean>; // prompts OS verify, returns success
  disableBiometric: () => Promise<void>;
  enablePasscode: () => Promise<void>;     // navigate to setup-passcode after calling
  disablePasscode: () => Promise<void>;
  savePasscode: (passcode: string) => Promise<void>;
  verifyPasscode: (passcode: string) => Promise<boolean>;

  // Auth methods for unlock screen
  authenticateBiometric: () => Promise<boolean>;
  authenticatePasscode: () => Promise<boolean>;
  unlockWithBiometric: () => Promise<boolean>;
  refreshSession: () => Promise<string | null>;

  // Session
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (phone: string, password: string, firstName: string, lastName: string, email?: string, middleName?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [biometricTypes, setBiometricTypes] = useState<LocalAuthentication.AuthenticationType[]>([]);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshSessionRef = useRef<(() => Promise<string | null>) | undefined>(undefined);

  useEffect(() => {
    setUnauthorizedListener(() => { setUser(null); });
    setRefreshHandler(() => refreshSessionRef.current?.() ?? Promise.resolve(null));
  }, []);

  useEffect(() => {
    (async () => {
      const [done, token, hasHW, bioEnabled, pcEnabled, passcode] = await Promise.all([
        SecureStore.getItemAsync(FIRST_LAUNCH_KEY),
        getToken(),
        LocalAuthentication.hasHardwareAsync(),
        SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY),
        SecureStore.getItemAsync(PASSCODE_ENABLED_KEY),
        SecureStore.getItemAsync(PASSCODE_KEY),
      ]);

      const resolvedPcEnabled = pcEnabled === 'true' && !!passcode;
      const resolvedBioEnabled = bioEnabled === 'true';
      if (pcEnabled === 'true' && !passcode) await SecureStore.setItemAsync(PASSCODE_ENABLED_KEY, 'false');
      if (!hasHW && bioEnabled === 'true') await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'false');

      if (token) {
        const userId = await SecureStore.getItemAsync('spendalt_user_id');
        if (userId) setUser({ user_id: userId, token });
      }

      if (hasHW) {
        const [enrolled, types] = await Promise.all([
          LocalAuthentication.isEnrolledAsync(),
          LocalAuthentication.supportedAuthenticationTypesAsync(),
        ]);
        if (enrolled) {
          setHasBiometrics(true);
          setBiometricTypes(types);
        }
      }

      setBiometricEnabled(resolvedBioEnabled);
      setPasscodeEnabled(resolvedPcEnabled);
      setIsFirstLaunch(done !== 'true');
    })();
  }, []);

  // ── Security preference methods ──────────────────────────────────────────

  const enableBiometric = async (): Promise<boolean> => {
    // Verify with OS first before enabling
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Verify to enable biometric login',
      disableDeviceFallback: false,
    });
    if (result.success) {
      await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true');
      setBiometricEnabled(true);
    }
    return result.success;
  };

  const disableBiometric = async () => {
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'false');
    setBiometricEnabled(false);
  };

  const enablePasscode = async () => {
    // Passcode is only marked enabled after savePin completes, not here
  };

  const disablePasscode = async () => {
    await SecureStore.setItemAsync(PASSCODE_ENABLED_KEY, 'false');
    await SecureStore.deleteItemAsync(PASSCODE_KEY);
    setPasscodeEnabled(false);
  };

  const savePasscode = async (passcode: string) => {
    await SecureStore.setItemAsync(PASSCODE_KEY, passcode);
    await SecureStore.setItemAsync(PASSCODE_ENABLED_KEY, 'true');
    setPasscodeEnabled(true);
  };

  const verifyPasscode = async (passcode: string): Promise<boolean> => {
    const stored = await SecureStore.getItemAsync(PASSCODE_KEY);
    if (!stored || stored.length !== passcode.length) return false;
    // Constant-time comparison to prevent timing attacks
    let diff = 0;
    for (let i = 0; i < stored.length; i++) diff |= stored.charCodeAt(i) ^ passcode.charCodeAt(i);
    return diff === 0;
  };

  // ── Unlock methods ───────────────────────────────────────────────────────

  const refreshSession = async (): Promise<string | null> => {
    const storedRefresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!storedRefresh) return null;
    try {
      const data = await apiRefresh(storedRefresh);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refresh_token);
      const userId = await SecureStore.getItemAsync('spendalt_user_id');
      if (userId) setUser({ user_id: userId, token: data.token });
      return data.token;
    } catch {
      return null;
    }
  };

  refreshSessionRef.current = refreshSession;

  const unlockWithBiometric = async (): Promise<boolean> => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Spendalt',
      fallbackLabel: '',
      disableDeviceFallback: true,
    });
    if (!result.success) return false;
    return (await refreshSession()) !== null;
  };

  const authenticateBiometric = async (): Promise<boolean> => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Spendalt',
      fallbackLabel: '', // empty string hides the passcode fallback button — biometric only
      disableDeviceFallback: true,
    });
    return result.success;
  };

  const authenticatePasscode = async (): Promise<boolean> => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Enter your device passcode',
      disableDeviceFallback: false,
    });
    return result.success;
  };

  // ── Session methods ──────────────────────────────────────────────────────

  const markOnboardingDone = async () => {
    await SecureStore.setItemAsync(FIRST_LAUNCH_KEY, 'true');
    setIsFirstLaunch(false);
  };

  const login = async (identifier: string, password: string) => {
    const data = await apiLogin(identifier, password);
    await SecureStore.setItemAsync('spendalt_user_id', data.user_id);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refresh_token);
    setUser({ user_id: data.user_id, token: data.token });
  };

  const signup = async (phone: string, password: string, firstName: string, lastName: string, email?: string, middleName?: string) => {
    const data = await apiSignup(phone, password, firstName, lastName, email, middleName);
    await SecureStore.setItemAsync('spendalt_user_id', data.user_id);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refresh_token);
    setUser({ user_id: data.user_id, token: data.token });
  };

  const logout = async () => {
    const storedRefresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    try { await apiLogout(storedRefresh ?? undefined); } catch { /* best-effort */ }
    await clearToken();
    await SecureStore.deleteItemAsync('spendalt_user_id');
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isFirstLaunch,
      markOnboardingDone,
      hasBiometrics,
      biometricTypes,
      biometricEnabled,
      passcodeEnabled,
      enableBiometric,
      disableBiometric,
      enablePasscode,
      disablePasscode,
      savePasscode,
      verifyPasscode,
      authenticateBiometric,
      authenticatePasscode,
      unlockWithBiometric,
      refreshSession,
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
