// Cabeçalho fixo exibido pelo _layout.jsx quando há usuário logado.
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

export default function Header() {
  const insets = useSafeAreaInsets(); // substitui o paddingTop: 40 fixo (notch/status bar)
  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>BarberPro</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { color: colors.primary, fontSize: 24, fontWeight: 'bold', letterSpacing: 2 },
});
