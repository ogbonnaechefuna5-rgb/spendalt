import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useTheme } from '@/context/theme-context';
import { BANK_ACCOUNTS, BankAccount } from '@/constants/banks';

const TOTAL_NGN = '₦1,820,450.00';

function StatusBadge({ status }: { status: BankAccount['status'] }) {
  const { theme } = useTheme();
  const config = {
    active:  { label: 'CONNECTED', color: theme.green,  bg: `${theme.green}20` },
    error:   { label: 'SYNC ERROR', color: '#EF4444',   bg: '#EF444420' },
    pending: { label: 'PENDING',    color: '#F59E0B',   bg: '#F59E0B20' },
  }[status];

  return (
    <View style={[badge.wrap, { backgroundColor: config.bg }]}>
      <View style={[badge.dot, { backgroundColor: config.color }]} />
      <Text style={[badge.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  text: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
});

function AccountCard({ account, onRemove, onSync }: { account: BankAccount; onRemove: () => void; onSync: () => void }) {
  const { theme, textColor, subTextColor, borderColor } = useTheme();

  return (
    <View style={[card.wrap, { backgroundColor: theme.card, borderColor }]}>
      {/* Top row */}
      <View style={card.top}>
        <View style={[card.logoBox, { backgroundColor: `${account.color}18` }]}>
          <Text style={card.emoji}>{account.emoji}</Text>
        </View>
        <View style={card.info}>
          <Text style={[card.bankName, { color: textColor }]}>{account.bankName}</Text>
          <Text style={[card.accountType, { color: subTextColor }]}>{account.accountType}</Text>
        </View>
        <StatusBadge status={account.status} />
      </View>

      {/* Divider */}
      <View style={[card.divider, { backgroundColor: borderColor }]} />

      {/* Balance row */}
      <View style={card.balanceRow}>
        <View>
          <Text style={[card.balanceLabel, { color: subTextColor }]}>BALANCE</Text>
          <Text style={[card.balance, { color: textColor }]}>{account.balance}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[card.balanceLabel, { color: subTextColor }]}>ACCOUNT</Text>
          <Text style={[card.accountNum, { color: subTextColor }]}>{account.accountNumber}</Text>
        </View>
      </View>

      {/* Sync info + actions */}
      <View style={card.footer}>
        <View style={card.syncRow}>
          <IconSymbol
            name={account.status === 'error' ? 'exclamationmark.circle.fill' : 'arrow.clockwise'}
            size={12}
            color={account.status === 'error' ? '#EF4444' : subTextColor}
          />
          <Text style={[card.syncText, { color: account.status === 'error' ? '#EF4444' : subTextColor }]}>
            {account.lastSync}
          </Text>
        </View>
        <View style={card.actions}>
          <TouchableOpacity style={[card.actionBtn, { borderColor }]} onPress={onSync}>
            <IconSymbol name="arrow.clockwise" size={13} color={theme.green} />
            <Text style={[card.actionText, { color: theme.green }]}>Sync</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[card.actionBtn, { borderColor }]} onPress={onRemove}>
            <IconSymbol name="trash.fill" size={13} color="#EF4444" />
            <Text style={[card.actionText, { color: '#EF4444' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const card = StyleSheet.create({
  wrap: { borderRadius: 20, padding: 18, borderWidth: 1, marginBottom: 14, gap: 14 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  logoBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 24 },
  info: { flex: 1, gap: 2 },
  bankName: { fontWeight: '700', fontSize: 15 },
  accountType: { fontSize: 12 },
  divider: { height: 1 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  balanceLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 3 },
  balance: { fontSize: 22, fontWeight: '800' },
  accountNum: { fontSize: 13, fontWeight: '500', letterSpacing: 1 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  syncRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  syncText: { fontSize: 11 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1 },
  actionText: { fontSize: 12, fontWeight: '600' },
});

export default function LinkedAccountsScreen() {
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const [accounts, setAccounts] = useState(BANK_ACCOUNTS);

  const handleRemove = (id: string) => {
    Alert.alert('Remove Account', 'Disconnect this bank account from Spendalt?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setAccounts(prev => prev.filter(a => a.id !== id)) },
    ]);
  };

  const handleSync = (id: string) => {
    // placeholder — would trigger API sync
  };

  const activeCount = accounts.filter(a => a.status === 'active').length;
  const errorCount  = accounts.filter(a => a.status === 'error').length;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgDeep }}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
            <IconSymbol name="arrow.left" size={18} color={textColor} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: textColor }]}>Linked Accounts</Text>
          <View style={s.headerBtn} />
        </View>

        {/* Summary card */}
        <View style={[s.summaryCard, { backgroundColor: theme.bgMid, borderColor: `${theme.green}30` }]}>
          <View style={s.summaryTop}>
            <View>
              <Text style={[s.summaryLabel, { color: theme.green }]}>TOTAL BALANCE</Text>
              <Text style={[s.summaryAmount, { color: textColor }]}>{TOTAL_NGN}</Text>
            </View>
            <View style={[s.summaryIcon, { backgroundColor: `${theme.green}20` }]}>
              <IconSymbol name="building.columns.fill" size={24} color={theme.green} />
            </View>
          </View>
          <View style={s.summaryStats}>
            <View style={s.summaryStat}>
              <Text style={[s.summaryStatValue, { color: theme.green }]}>{activeCount}</Text>
              <Text style={[s.summaryStatLabel, { color: subTextColor }]}>Connected</Text>
            </View>
            <View style={[s.summaryDivider, { backgroundColor: borderColor }]} />
            <View style={s.summaryStat}>
              <Text style={[s.summaryStatValue, { color: errorCount > 0 ? '#EF4444' : subTextColor }]}>{errorCount}</Text>
              <Text style={[s.summaryStatLabel, { color: subTextColor }]}>Errors</Text>
            </View>
            <View style={[s.summaryDivider, { backgroundColor: borderColor }]} />
            <View style={s.summaryStat}>
              <Text style={[s.summaryStatValue, { color: textColor }]}>{accounts.length}</Text>
              <Text style={[s.summaryStatLabel, { color: subTextColor }]}>Total</Text>
            </View>
          </View>
        </View>

        {/* Error banner */}
        {errorCount > 0 && (
          <View style={[s.errorBanner, { backgroundColor: '#EF444415', borderColor: '#EF444430' }]}>
            <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#EF4444" />
            <Text style={s.errorBannerText}>
              {errorCount} account{errorCount > 1 ? 's' : ''} failed to sync. Tap "Sync" to retry.
            </Text>
          </View>
        )}

        {/* Account cards */}
        <Text style={[s.sectionLabel, { color: theme.green }]}>YOUR ACCOUNTS</Text>
        {accounts.map(account => (
          <AccountCard
            key={account.id}
            account={account}
            onRemove={() => handleRemove(account.id)}
            onSync={() => handleSync(account.id)}
          />
        ))}

        {/* Security note */}
        <View style={[s.securityNote, { backgroundColor: theme.card, borderColor }]}>
          <IconSymbol name="lock.shield.fill" size={18} color={theme.green} />
          <Text style={[s.securityText, { color: subTextColor }]}>
            Your credentials are never stored. Connections use read-only access via 256-bit encryption.
          </Text>
        </View>

        {/* Add account CTA */}
        <PrimaryButton label="+ Link New Account" onPress={() => {}} style={s.cta} />

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '800', fontSize: 18 },

  summaryCard: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 16, gap: 16 },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  summaryAmount: { fontSize: 30, fontWeight: '800' },
  summaryIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  summaryStats: { flexDirection: 'row', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#ffffff10' },
  summaryStat: { flex: 1, alignItems: 'center', gap: 3 },
  summaryStatValue: { fontSize: 20, fontWeight: '800' },
  summaryStatLabel: { fontSize: 11 },
  summaryDivider: { width: 1 },

  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 16 },
  errorBannerText: { flex: 1, color: '#EF4444', fontSize: 13, fontWeight: '500' },

  sectionLabel: { fontSize: 11, letterSpacing: 1.5, fontWeight: '700', marginBottom: 12 },

  securityNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 20 },
  securityText: { flex: 1, fontSize: 12, lineHeight: 18 },

  cta: {},
});
