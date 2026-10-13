import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATUS_CONFIG } from '@/constants/status';

export default function StatusBadge({ status, compact = false }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <View style={[styles.badge, compact && styles.compact, { backgroundColor: `${cfg.cor}20` }]}>
      <Ionicons name={cfg.icone} size={compact ? 12 : 14} color={cfg.cor} />
      <Text style={[styles.text, compact && styles.textCompact, { color: cfg.cor }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  compact: { gap: 3, paddingVertical: 3, paddingHorizontal: 8 },
  text: { fontSize: 12, fontWeight: '600' },
  textCompact: { fontSize: 11 },
});
