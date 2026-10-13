// src/app/perfil.jsx  —  Perfil do Cliente
import { colors } from '@/theme/colors';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAgenda } from '@/hooks/useAgenda';
import { parseISODate } from '@/utils/date';

export default function Perfil() {
  const { usuario, logout, getUsuario } = useAuth();
  const { agendamentosCliente, getServico, precoDoAgendamento } = useAgenda();

  if (!usuario) return null;

  const historico = agendamentosCliente(usuario.id)
    .filter((a) => a.status === 'concluido')
    .sort((a, b) => parseISODate(b.data, b.horario) - parseISODate(a.data, a.horario));

  const totalGasto = historico.reduce((acc, a) => acc + precoDoAgendamento(a), 0);

  // Ao deslogar, o <Stack.Protected> do _layout leva para o login.
  const handleLogout = () => logout();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Avatar + info */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={44} color={colors.primary} />
        </View>
        <Text style={styles.nome}>{usuario.nome}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
        <View style={styles.tipoBadge}>
          <Ionicons name="person-circle" size={14} color={colors.bg} />
          <Text style={styles.tipoText}>Cliente</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{historico.length}</Text>
          <Text style={styles.statLabel}>Serviços</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>R$ {totalGasto}</Text>
          <Text style={styles.statLabel}>Total gasto</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{new Set(historico.map((a) => a.barbeiroId)).size}</Text>
          <Text style={styles.statLabel}>Barbeiros</Text>
        </View>
      </View>

      {/* Histórico */}
      <Text style={styles.sectionTitle}>Histórico de serviços</Text>
      {historico.length === 0 && <Text style={styles.vazio}>Nenhum serviço concluído ainda.</Text>}
      {historico.map((ag) => {
        const barbeiro = getUsuario(ag.barbeiroId);
        const servico = getServico(ag.servicoId);
        const dataFmt = new Date(ag.data + 'T12:00:00').toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return (
          <View key={ag.id} style={styles.historicoItem}>
            <View style={styles.historicoIcone}>
              <Ionicons name="cut" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historicoServico}>{servico?.nome}</Text>
              <Text style={styles.historicoInfo}>
                {barbeiro?.nome} · {dataFmt}
              </Text>
            </View>
            <Text style={styles.historicoPreco}>R$ {precoDoAgendamento(ag)}</Text>
          </View>
        );
      })}

      {/* Botão sair */}
      <TouchableOpacity style={styles.btnSair} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.btnSairText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 24 },

  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  nome: { fontSize: 22, fontWeight: 'bold', color: colors.white },
  email: { color: colors.textMuted, fontSize: 14, marginTop: 4 },
  tipoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  tipoText: { color: colors.bg, fontWeight: 'bold', fontSize: 12 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statNum: { color: colors.primary, fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: colors.textMuted, fontSize: 12 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.white, marginBottom: 12 },
  vazio: { color: colors.textMuted, textAlign: 'center', marginTop: 20 },

  historicoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  historicoIcone: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historicoServico: { color: colors.white, fontWeight: '600', fontSize: 14 },
  historicoInfo: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  historicoPreco: { color: colors.primary, fontWeight: 'bold' },

  btnSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF444440',
    backgroundColor: '#EF444415',
  },
  btnSairText: { color: colors.danger, fontWeight: 'bold', fontSize: 15 },
});
