// src/app/agendamentos.jsx  —  Lista de agendamentos do Cliente
import { colors } from '@/theme/colors';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAgenda } from '@/hooks/useAgenda';
import ConfirmModal from '@/components/ui/ConfirmModal';
import StatusBadge from '@/components/ui/StatusBadge';
import { FILTROS_STATUS, STATUS_CONFIG } from '@/constants/status';
import { formatarData, parseISODate } from '@/utils/date';

const labelFiltro = (f) => (f === 'todos' ? 'Todos' : STATUS_CONFIG[f].label);

export default function Agendamentos() {
  const router = useRouter();
  const { usuario, getUsuario } = useAuth();
  const { agendamentosCliente, cancelarAgendamento, getServico, precoDoAgendamento } = useAgenda();

  const [filtro, setFiltro] = useState('todos');
  const [idParaCancelar, setIdParaCancelar] = useState(null);

  const todos = useMemo(
    () =>
      [...agendamentosCliente(usuario?.id)].sort(
        (a, b) => parseISODate(b.data, b.horario) - parseISODate(a.data, a.horario),
      ), // mais recente primeiro
    [agendamentosCliente, usuario?.id],
  );
  const filtrados = useMemo(
    () => (filtro === 'todos' ? todos : todos.filter((a) => a.status === filtro)),
    [todos, filtro],
  );

  if (!usuario) return null;

  const confirmarCancelamento = () => {
    cancelarAgendamento(idParaCancelar);
    setIdParaCancelar(null);
  };

  return (
    <View style={styles.container}>
      <ConfirmModal
        visivel={idParaCancelar !== null}
        titulo="Cancelar agendamento"
        mensagem="Tem certeza que deseja cancelar?"
        labelCancelar="Não"
        labelConfirmar="Sim, cancelar"
        corConfirmar={colors.danger}
        onConfirmar={confirmarCancelamento}
        onCancelar={() => setIdParaCancelar(null)}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosScroll}>
        <View style={styles.filtrosRow}>
          {FILTROS_STATUS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filtroBtn, filtro === f && styles.filtroBtnActive]}
              onPress={() => setFiltro(f)}
            >
              <Text style={[styles.filtroBtnText, filtro === f && styles.filtroBtnTextActive]}>
                {labelFiltro(f)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.lista}>
        {filtrados.length === 0 && (
          <View style={styles.vazio}>
            <Ionicons name="calendar-outline" size={48} color={colors.border} />
            <Text style={styles.vazioText}>Nenhum agendamento encontrado</Text>
            <TouchableOpacity style={styles.btnNovo} onPress={() => router.push('/agendar')}>
              <Text style={styles.btnNovoText}>Agendar agora</Text>
            </TouchableOpacity>
          </View>
        )}

        {filtrados.map((ag) => {
          const barbeiro = getUsuario(ag.barbeiroId);
          const servico = getServico(ag.servicoId);
          const dataFmt = formatarData(ag.data, { weekday: 'short', day: '2-digit', month: 'short' });

          return (
            <View key={ag.id} style={styles.card}>
              <StatusBadge status={ag.status} />
              <Text style={styles.servicoNome}>{servico?.nome}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="person" size={14} color={colors.textMuted} />
                <Text style={styles.infoText}>{barbeiro?.nome}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={14} color={colors.textMuted} />
                <Text style={styles.infoText}>
                  {dataFmt} às {ag.horario}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="cash" size={14} color={colors.textMuted} />
                <Text style={styles.infoText}>R$ {precoDoAgendamento(ag)}</Text>
              </View>

              {ag.status === 'pendente' && (
                <TouchableOpacity style={styles.btnCancelar} onPress={() => setIdParaCancelar(ag.id)}>
                  <Ionicons name="close-circle-outline" size={16} color={colors.danger} />
                  <Text style={styles.btnCancelarText}>Cancelar</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/agendar')}>
        <Ionicons name="add" size={28} color={colors.bg} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  filtrosScroll: { maxHeight: 56, paddingTop: 10 },
  filtrosRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  filtroBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filtroBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filtroBtnText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  filtroBtnTextActive: { color: colors.bg },

  lista: { padding: 16, gap: 12, paddingBottom: 24 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  servicoNome: { fontSize: 17, fontWeight: 'bold', color: colors.white },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { color: colors.textSoft, fontSize: 13 },

  btnCancelar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF444440',
    backgroundColor: '#EF444415',
  },
  btnCancelarText: { color: colors.danger, fontSize: 13, fontWeight: '600' },

  vazio: { alignItems: 'center', marginTop: 60, gap: 12 },
  vazioText: { color: colors.textMuted, fontSize: 15 },
  btnNovo: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  btnNovoText: { color: colors.bg, fontWeight: 'bold' },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
});
