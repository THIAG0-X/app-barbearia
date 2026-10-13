// src/components/cards/BarberCard.jsx
import { colors } from '@/theme/colors';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BarberCard({ nome, especialidade, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={28} color={colors.primary} />
      </View>
      <Text style={styles.nome}>{nome}</Text>
      {especialidade && <Text style={styles.especialidade}>{especialidade}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    width: 130,
    marginRight: 10,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  nome: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  especialidade: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});
