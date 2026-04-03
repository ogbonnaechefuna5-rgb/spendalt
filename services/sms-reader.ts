import { PermissionsAndroid, Platform } from 'react-native';
import { parseTransactionSMS, ParsedTransaction } from './sms-parser';

type RawSMS = { body: string; address: string; date: number };

export async function requestSMSPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_SMS,
    {
      title: 'SMS Permission',
      message: 'Spendalt needs access to read bank SMS alerts to automatically track your transactions.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    }
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function checkSMSPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
}

export async function readTransactionSMS(): Promise<ParsedTransaction[]> {
  const granted = await checkSMSPermission();
  if (!granted) return [];

  try {
    // Dynamic import so iOS bundler doesn't choke on the module
    const SmsAndroid = (await import('react-native-get-sms-android')).default;

    return new Promise((resolve) => {
      SmsAndroid.list(
        JSON.stringify({ box: 'inbox', maxCount: 300 }),
        () => resolve([]),
        (_: number, smsList: string) => {
          const parsed: ParsedTransaction[] = (JSON.parse(smsList) as RawSMS[])
            .map(sms => {
              const tx = parseTransactionSMS(sms.body);
              if (!tx) return null;
              return { ...tx, date: new Date(sms.date) };
            })
            .filter((t): t is ParsedTransaction => t !== null);
          resolve(parsed);
        }
      );
    });
  } catch {
    return [];
  }
}

export function startSMSListener(onTransaction: (t: ParsedTransaction) => void): (() => void) {
  if (Platform.OS !== 'android') return () => {};

  let subscription: { remove: () => void } | null = null;

  import('react-native-android-sms-listener').then(({ default: SmsListener }) => {
    subscription = SmsListener.addListener(message => {
      const parsed = parseTransactionSMS(message.body);
      if (parsed) onTransaction({ ...parsed, date: new Date() });
    });
  });

  return () => subscription?.remove();
}
