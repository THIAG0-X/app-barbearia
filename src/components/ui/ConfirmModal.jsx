// Modal de confirmação reutilizável (substitui 3 cópias idênticas nas telas).
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export default function ConfirmModal({
  visivel,
  titulo,
  mensagem,
  labelCancelar = 'Não',
  labelConfirmar = 'Sim',
  corConfirmar = colors.success,
  onConfirmar,
  onCancelar,
}) {
  return (
    <Modal transparent animationType="fade" visible={visivel} onRequestClose={onCancelar}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.mensagem}>{mensagem}</Text>
          <View style={styles.botoes}>
            <TouchableOpacity style={styles.btnCancelar} onPress={onCancelar}>
              <Text style={styles.btnCancelarText}>{labelCancelar}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnConfirmar, { backgroundColor: corConfirmar }]}
              onPress={onConfirmar}
            >
              <Text style={styles.btnConfirmarText}>{labelConfirmar}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', alignItems: 'center' },
  box: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 360,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  titulo: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  mensagem: { color: colors.textSoft, fontSize: 14, lineHeight: 20 },
  botoes: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnCancelar: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: colors.border, alignItems: 'center' },
  btnCancelarText: { color: colors.textSoft, fontWeight: '600' },
  btnConfirmar: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnConfirmarText: { color: colors.white, fontWeight: 'bold' },
});
