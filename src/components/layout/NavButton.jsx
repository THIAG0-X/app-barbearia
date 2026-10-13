// Botão individual da navbar. Recebe só o NOME do ícone (sem cloneElement).
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export default function NavButton({ icon, title, isActive, onPress }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ selected: isActive }}
    >
      <View style={[styles.circle, isActive && styles.circleActive]}>
        <Ionicons name={icon} size={24} color={isActive ? colors.bg : colors.white} />
      </View>
      <Text style={[styles.label, isActive && styles.labelActive]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 4, minWidth: 64 },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  circleActive: { backgroundColor: colors.primary },
  label: { color: colors.textSoft, fontSize: 11, fontWeight: '600' },
  labelActive: { color: colors.primary },
});
