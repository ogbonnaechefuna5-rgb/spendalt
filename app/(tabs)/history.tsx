import { TransactionItem } from '@/components/dashboard/transaction-item';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TRANSACTION_GROUPS } from '@/constants/transactions';
import { useTheme } from '@/context/theme-context';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const FILTERS = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Income'];

type UploadState = 'idle' | 'picked' | 'uploading' | 'done' | 'error';

type PickedFile = { name: string; size: number; type: string };

function UploadSheet({ onClose }: { onClose: () => void }) {
  const { theme, textColor, subTextColor, borderColor } = useTheme();
  const [state, setState] = useState<UploadState>('idle');
  const [file, setFile] = useState<PickedFile | null>(null);

  const pick = async (type: 'pdf' | 'csv') => {
    const result = await DocumentPicker.getDocumentAsync({
      type: type === 'pdf' ? 'application/pdf' : 'text/csv',
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setFile({ name: asset.name, size: asset.size ?? 0, type: type.toUpperCase() });
    setState('picked');
  };

  const upload = () => {
    setState('uploading');
    // Simulate upload — replace with real API call
    setTimeout(() => setState('done'), 2000);
  };

  const reset = () => { setState('idle'); setFile(null); };

  const fmtSize = (bytes: number) =>
    bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${(bytes / 1_000).toFixed(0)} KB`;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={sheet.overlay}>
        <TouchableWithoutFeedback>
          <View style={[sheet.tray, { backgroundColor: theme.card, borderColor }]}>
            {/* Handle */}
            <View style={[sheet.handle, { backgroundColor: borderColor }]} />

            <Text style={[sheet.title, { color: textColor }]}>Upload Statement</Text>
            <Text style={[sheet.subtitle, { color: subTextColor }]}>
              Import your bank statement to automatically parse and categorize transactions.
            </Text>

            {state === 'idle' && (
              <>
                {/* Format options */}
                <View style={sheet.options}>
                  <TouchableOpacity style={[sheet.option, { backgroundColor: theme.bgDeep, borderColor }]} onPress={() => pick('pdf')}>
                    <View style={[sheet.optionIcon, { backgroundColor: '#EF444420' }]}>
                      <Text style={sheet.optionEmoji}>📄</Text>
                    </View>
                    <Text style={[sheet.optionLabel, { color: textColor }]}>PDF Statement</Text>
                    <Text style={[sheet.optionSub, { color: subTextColor }]}>Bank-issued PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[sheet.option, { backgroundColor: theme.bgDeep, borderColor }]} onPress={() => pick('csv')}>
                    <View style={[sheet.optionIcon, { backgroundColor: '#22C55E20' }]}>
                      <Text style={sheet.optionEmoji}>📊</Text>
                    </View>
                    <Text style={[sheet.optionLabel, { color: textColor }]}>CSV Export</Text>
                    <Text style={[sheet.optionSub, { color: subTextColor }]}>Spreadsheet format</Text>
                  </TouchableOpacity>
                </View>

                <View style={[sheet.infoRow, { backgroundColor: theme.bgDeep, borderColor }]}>
                  <IconSymbol name="lock.shield.fill" size={14} color={theme.green} />
                  <Text style={[sheet.infoText, { color: subTextColor }]}>
                    Files are processed securely and never stored on our servers.
                  </Text>
                </View>
              </>
            )}

            {state === 'picked' && file && (
              <>
                <View style={[sheet.fileCard, { backgroundColor: theme.bgDeep, borderColor }]}>
                  <View style={[sheet.fileIcon, { backgroundColor: file.type === 'PDF' ? '#EF444420' : '#22C55E20' }]}>
                    <Text style={{ fontSize: 24 }}>{file.type === 'PDF' ? '📄' : '📊'}</Text>
                  </View>
                  <View style={sheet.fileInfo}>
                    <Text style={[sheet.fileName, { color: textColor }]} numberOfLines={1}>{file.name}</Text>
                    <Text style={[sheet.fileMeta, { color: subTextColor }]}>{file.type} · {fmtSize(file.size)}</Text>
                  </View>
                  <TouchableOpacity onPress={reset}>
                    <IconSymbol name="xmark.circle.fill" size={20} color={subTextColor} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={[sheet.uploadBtn, { backgroundColor: theme.green }]} onPress={upload}>
                  <IconSymbol name="arrow.up.circle.fill" size={18} color={theme.bgDeep} />
                  <Text style={[sheet.uploadBtnText, { color: theme.bgDeep }]}>Upload & Parse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={sheet.changeBtn} onPress={reset}>
                  <Text style={[sheet.changeBtnText, { color: subTextColor }]}>Choose different file</Text>
                </TouchableOpacity>
              </>
            )}

            {state === 'uploading' && (
              <View style={sheet.statusWrap}>
                <Image
                  source={require('@/assets/images/rotating_hourglass_gif.webp')}
                  style={sheet.successGif}
                  contentFit="contain"
                />
                <Text style={[sheet.statusTitle, { color: textColor }]}>Parsing statement…</Text>
                <Text style={[sheet.statusSub, { color: subTextColor }]}>This usually takes a few seconds.</Text>
              </View>
            )}

            {state === 'done' && (
              <View style={sheet.statusWrap}>
                <Image
                  source={require('@/assets/images/success_gif5.gif')}
                  style={sheet.successGif}
                  contentFit="contain"
                />
                <Text style={[sheet.statusTitle, { color: textColor }]}>Import complete!</Text>
                <Text style={[sheet.statusSub, { color: subTextColor }]}>Your transactions have been added and categorized.</Text>
                <TouchableOpacity style={[sheet.uploadBtn, { backgroundColor: theme.green }]} onPress={onClose}>
                  <Text style={[sheet.uploadBtnText, { color: theme.bgDeep }]}>Done</Text>
                </TouchableOpacity>
              </View>
            )}

            {state === 'error' && (
              <View style={sheet.statusWrap}>
                <Text style={{ fontSize: 48 }}>❌</Text>
                <Text style={[sheet.statusTitle, { color: textColor }]}>Upload failed</Text>
                <Text style={[sheet.statusSub, { color: subTextColor }]}>Please check the file format and try again.</Text>
                <TouchableOpacity style={[sheet.uploadBtn, { backgroundColor: theme.green, marginTop: 8 }]} onPress={reset}>
                  <Text style={[sheet.uploadBtnText, { color: theme.bgDeep }]}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const sheet = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', backgroundColor: '#00000060' },
  tray: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 48, borderWidth: 1, gap: 16 },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 13, lineHeight: 20, marginTop: -8 },
  options: { flexDirection: 'row', gap: 12 },
  option: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8, borderWidth: 1 },
  optionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  optionEmoji: { fontSize: 24 },
  optionLabel: { fontWeight: '700', fontSize: 14 },
  optionSub: { fontSize: 11, textAlign: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, padding: 12, borderWidth: 1 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
  fileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 14, borderWidth: 1 },
  fileIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  fileInfo: { flex: 1, gap: 3 },
  fileName: { fontWeight: '600', fontSize: 14 },
  fileMeta: { fontSize: 12 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16, width: '100%' },
  uploadBtnText: { fontWeight: '700', fontSize: 16 },
  changeBtn: { alignItems: 'center', paddingVertical: 4 },
  changeBtnText: { fontSize: 13 },
  statusWrap: { alignItems: 'center', gap: 4, paddingVertical: 8 },
  statusTitle: { fontSize: 18, fontWeight: '800' },
  statusSub: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  successGif: { width: 100, height: 100 },
});

export default function HistoryScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [uploadOpen, setUploadOpen] = useState(false);
  const router = useRouter();
  const { theme, textColor, subTextColor, borderColor, dividerColor } = useTheme();

  const filtered = TRANSACTION_GROUPS.map(group => ({
    ...group,
    data: group.data.filter(tx => {
      const matchesQuery = tx.name.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = activeFilter === 'All' || tx.category.toLowerCase().includes(activeFilter.toLowerCase());
      return matchesQuery && matchesFilter;
    }),
  })).filter(group => group.data.length > 0);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgDeep }}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <IconSymbol name="arrow.left" size={18} color={textColor} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: textColor }]}>Transactions</Text>
        <TouchableOpacity style={s.headerBtn} onPress={() => setUploadOpen(true)}>
          <IconSymbol name="ellipsis" size={18} color={textColor} />
        </TouchableOpacity>
      </View>

      <View style={[s.searchRow, { backgroundColor: theme.card, borderColor }]}>
        <IconSymbol name="magnifyingglass" size={16} color={subTextColor} />
        <TextInput
          style={[s.searchInput, { color: textColor }]}
          placeholder="Search merchants or bills"
          placeholderTextColor={subTextColor}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtersScroll} contentContainerStyle={s.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[s.chip, { backgroundColor: theme.card, borderColor }, activeFilter === f && { backgroundColor: theme.green, borderColor: theme.green }]}
            onPress={() => setActiveFilter(f)}
          >
            {f !== 'All' && (
              <IconSymbol
                name={f === 'Food' ? 'fork.knife' : f === 'Transport' ? 'car.fill' : f === 'Shopping' ? 'bag.fill' : f === 'Bills' ? 'bolt.fill' : 'banknote.fill'}
                size={13}
                color={activeFilter === f ? theme.bgDeep : subTextColor}
              />
            )}
            <Text style={[s.chipText, { color: subTextColor }, activeFilter === f && { color: theme.bgDeep }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
        {filtered.map(group => (
          <View key={group.title}>
            <Text style={[s.groupTitle, { color: theme.green }]}>{group.title}</Text>
            <View style={[s.groupCard, { backgroundColor: theme.card, borderColor }]}>
              {group.data.map((tx, i) => (
                <View key={tx.id}>
                  <TransactionItem {...tx} />
                  {i < group.data.length - 1 && <View style={[s.divider, { backgroundColor: dividerColor }]} />}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={[s.fab, { backgroundColor: theme.green, shadowColor: theme.green }]} onPress={() => router.push('/add-expense')}>
        <IconSymbol name="plus" size={24} color={theme.bgDeep} />
      </TouchableOpacity>

      <Modal visible={uploadOpen} transparent animationType="slide" onRequestClose={() => setUploadOpen(false)}>
        <UploadSheet onClose={() => setUploadOpen(false)} />
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '800', fontSize: 20 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, marginHorizontal: 20, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 14 },
  filtersScroll: { flexShrink: 0, marginBottom: 8 },
  filters: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderWidth: 1 },
  chipText: { fontWeight: '600', fontSize: 13 },
  list: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100, gap: 24 },
  groupTitle: { fontWeight: '700', fontSize: 12, letterSpacing: 1, marginBottom: 10 },
  groupCard: { borderRadius: 20, paddingHorizontal: 16, borderWidth: 1 },
  divider: { height: 1 },
  fab: { position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
});
