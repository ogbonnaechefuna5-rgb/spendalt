import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { ParsedTransaction } from '@/services/sms-parser';
import { readTransactionSMS, startSMSListener } from '@/services/sms-reader';

export function useSMSTransactions() {
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    setLoading(true);
    readTransactionSMS().then(txs => {
      setTransactions(txs);
      setLoading(false);
    });

    // Also listen for new incoming SMS in real-time
    const stop = startSMSListener(tx => {
      setTransactions(prev => [tx, ...prev]);
    });

    return stop;
  }, []);

  return { transactions, loading };
}
