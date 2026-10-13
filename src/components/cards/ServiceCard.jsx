// src/components/cards/ServiceCard.jsx
import { colors } from '@/theme/colors';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ServiceCard({ nome, preco, duracao, onSelect }) {
  return (
    <View style={styles.serviceCard}>
      <Text style={styles.titleService}>{nome}</Text>
      <Text style={styles.textInfo}>💵 Preço: R$ {preco}</Text>
      <Text style={styles.textInfo}>⏱️ Tempo: {duracao} min</Text>
      <TouchableOpacity style={styles.btn} onPress={onSelect} activeOpacity={0.8}>
        <Text style={styles.btnText}>Agende agora!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  serviceCard: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    width: 180,
    marginRight: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  titleService: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  textInfo: {
    fontSize: 13,
    color: colors.textSoft,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: {
    color: colors.bg,
    fontWeight: 'bold',
    fontSize: 13,
  },
});
