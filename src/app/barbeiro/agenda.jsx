// src/app/barbeiro/agenda.jsx  —  Agenda do Barbeiro
import { colors } from '@/theme/colors';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAgenda } from '@/hooks/useAgenda';
import ConfirmModal from '@/components/ui/ConfirmModal';
import StatusBadge from '@/components/ui/StatusBadge';
import { STATUS_CONFIG } from '@/constants/status';
import { formatarData, gerarProximosDias } from '@/utils/date';

const ACOES = {
  concluir: {
    titulo: 'Concluir atendimento',
    mensagem: 'Deseja marcar este atendimento como concluído?',
    labelConfirmar: 'Sim, concluir',
    cor: colors.success,
  },
  cancelar: {
    titulo: 'Cancelar atendimento',
    mensagem: 'Tem certeza que deseja cancelar este agendamento?',
    labelConfirmar: 'Sim, cancelar',
    cor: colors.danger,
  },
};

export default function Agenda() {
  const { usuario, getUsuario } = useAuth();
  const { agendamentosBarbeiro, concluirAgendamento, cancelarAgendamento, getServico, precoDoAgendamento } =
    useAgenda();

  const dias = useMemo(() => gerarProximosDias(7), []);
  const [dataSelecionada, setDataSelecionada] = useState(dias[0].iso);
  const [acaoPendente, setAcaoPendente] = useState(null); // { tipo: 'concluir' | 'cancelar', id }

  const todos = useMemo(() => agendamentosBarbeiro(usuario?.id), [agendamentosBarbeiro, usuario?.id]);
  const doDia = useMemo(
    () => todos.filter((a) => a.data === dataSelecionada).sort((a, b) => a.horario.localeCompare(b.horario)),
    [todos, dataSelecionada],
  );
  const diasComPendentes = useMemo(
    () => new Set(todos.filter((a) => a.status === 'pendente').map((a) => a.data)),
    [todos],
  );

  if (!usuario) return null;

  const acao = acaoPendente ? ACOES[acaoPendente.tipo] : null;
  const confirmarAcao = () => {
    if (!acaoPendente) return;
    const executar = acaoPendente.tipo === 'concluir' ? concluirAgendamento : cancelarAgendamento;
    executar(acaoPendente.id);
    setAcaoPendente(null);
  };

  return (
    <View style={styles.container}>
      <ConfirmModal
        visivel={!!acao}
        titulo={acao?.titulo}
        mensagem={acao?.mensagem}
        labelCancelar="Voltar"
        labelConfirmar={acao?.labelConfirmar}
        corConfirmar={acao?.cor}
        onConfirmar={confirmarAcao}
        onCancelar={() => setAcaoPendente(null)}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diasScroll}>
        <View style={styles.diasRow}>
          {dias.map((d) => {
            const ativo = dataSelecionada === d.iso;
            return (
              <TouchableOpacity
                key={d.iso}
                style={[styles.diaBtn, ativo && styles.diaBtnActive]}
                onPress={() => setDataSelecionada(d.iso)}
              >
                <Text style={[styles.diaDia, ativo && styles.diaDiaActive]}>{d.dia}</Text>
                <Text style={[styles.diaNum, ativo && styles.diaNumActive]}>{d.num}</Text>
                {diasComPendentes.has(d.iso) && <View style={styles.dotIndicador} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.resumoDia}>
        <Text style={styles.resumoData}>
          {formatarData(dataSelecionada, { weekday: 'long', day: '2-digit', month: 'long' })}
        </Text>
        <View style={styles.resumoBadge}>
          <Text style={styles.resumoBadgeText}>
            {doDia.filter((a) => a.status !== 'cancelado').length} atendimentos
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.lista}>
        {doDia.length === 0 && (
          <View style={styles.vazio}>
            <Ionicons name="calendar-outline" size={48} color={colors.border} />
            <Text style={styles.vazioText}>Nenhum agendamento neste dia</Text>
          </View>
        )}

        {doDia.map((ag) => {
          const cliente = getUsuario(ag.clienteId);
          const servico = getServico(ag.servicoId);
          const cfg = STATUS_CONFIG[ag.status];

          return (
            <View key={ag.id} style={styles.card}>
              <View style={styles.timeline}>
                <Text style={styles.timelineHora}>{ag.horario}</Text>
                <View style={[styles.timelineDot, { backgroundColor: cfg.cor }]} />
                <View style={styles.timelineLine} />
              </View>

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.clienteNome}>{cliente?.nome}</Text>
                  <StatusBadge status={ag.status} compact />
                </View>

                <Text style={styles.servicoNome}>{servico?.nome}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.duracao}>⏱ {servico?.duracao} min</Text>
                  <Text style={styles.preco}>R$ {precoDoAgendamento(ag)}</Text>
                </View>

                {ag.status === 'pendente' && (
                  <View style={styles.acoes}>
                    <TouchableOpacity
                      style={[styles.acaoBtn, styles.acaoConcluir]}
                      onPress={() => setAcaoPendente({ tipo: 'concluir', id: ag.id })}
                    >
                      <Ionicons name="checkmark" size={14} color={colors.white} />
                      <Text style={styles.acaoBtnText}>Concluir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.acaoBtn, styles.acaoCancelar]}
                      onPress={() => setAcaoPendente({ tipo: 'cancelar', id: ag.id })}
                    >
                      <Ionicons name="close" size={14} color={colors.white} />
                      <Text style={styles.acaoBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  diasScroll: { maxHeight: 80, paddingTop: 10 },
  diasRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  diaBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: 52,
  },
  diaBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  diaDia: { color: colors.textMuted, fontSize: 11, textTransform: 'capitalize' },
  diaDiaActive: { color: colors.bg },
  diaNum: { color: colors.white, fontWeight: 'bold', fontSize: 18 },
  diaNumActive: { color: colors.bg },
  dotIndicador: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 3 },

  resumoDia: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resumoData: { color: colors.white, fontWeight: '600', fontSize: 14, textTransform: 'capitalize' },
  resumoBadge: {
    backgroundColor: '#F5C51820',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  resumoBadgeText: { color: colors.primary, fontSize: 12, fontWeight: '600' },

  lista: { padding: 16, paddingBottom: 24, gap: 4 },

  vazio: { alignItems: 'center', marginTop: 60, gap: 12 },
  vazioText: { color: colors.textMuted, fontSize: 15 },

  card: { flexDirection: 'row', gap: 12, marginBottom: 16 },

  timeline: { alignItems: 'center', width: 44 },
  timelineHora: { color: colors.primary, fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  timelineDot: { width: 12, height: 12, borderRadius: 6 },
  timelineLine: { flex: 1, width: 2, backgroundColor: colors.surface, marginTop: 4 },

  cardContent: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clienteNome: { color: colors.white, fontWeight: 'bold', fontSize: 15 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  statusText: { fontSize: 11, fontWeight: '600' },
  servicoNome: { color: colors.textSoft, fontSize: 13, marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  duracao: { color: colors.textMuted, fontSize: 12 },
  preco: { color: colors.success, fontWeight: 'bold', fontSize: 14 },

  acoes: { flexDirection: 'row', gap: 8, marginTop: 10 },
  acaoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acaoConcluir: { backgroundColor: colors.success },
  acaoCancelar: { backgroundColor: '#EF444460' },
  acaoBtnText: { color: colors.white, fontWeight: '600', fontSize: 13 },
});
