// src/app/barbeiro/dashboard.jsx  —  Dashboard do Barbeiro
import { colors } from '@/theme/colors';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useAgenda } from '@/hooks/useAgenda';
import { parseISODate } from '@/utils/date';

function MiniGrafico({ dados }) {
  const max = Math.max(...dados.map((d) => d.atendimentos), 1);
  return (
    <View style={graficoStyles.container}>
      <Text style={graficoStyles.titulo}>Atendimentos — últimas 4 semanas</Text>
      <View style={graficoStyles.barras}>
        {dados.map((d, i) => (
          <View key={i} style={graficoStyles.coluna}>
            <Text style={graficoStyles.valor}>{d.atendimentos}</Text>
            <View style={graficoStyles.barraWrapper}>
              <View
                style={[graficoStyles.barra, { height: max > 0 ? (d.atendimentos / max) * 80 : 4 }]}
              />
            </View>
            <Text style={graficoStyles.semana}>{d.semana}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const graficoStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
  },
  titulo: { color: colors.textMuted, fontSize: 12, marginBottom: 12 },
  barras: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  coluna: { alignItems: 'center', flex: 1, gap: 4 },
  valor: { color: colors.primary, fontSize: 12, fontWeight: 'bold' },
  barraWrapper: { justifyContent: 'flex-end', height: 80 },
  barra: { width: 28, backgroundColor: colors.primary, borderRadius: 6, minHeight: 4 },
  semana: { color: colors.textMuted, fontSize: 11 },
});

export default function Dashboard() {
  const router = useRouter();
  const { usuario, logout, getUsuario } = useAuth();
  const { dashboardBarbeiro, agendamentosBarbeiro, getServico, precoDoAgendamento } = useAgenda();

  if (!usuario) return null;

  const stats = dashboardBarbeiro(usuario.id);

  // Próximos agendamentos pendentes
  const proximos = agendamentosBarbeiro(usuario.id)
    .filter((a) => a.status === 'pendente')
    .sort((a, b) => parseISODate(a.data, a.horario) - parseISODate(b.data, b.horario))
    .slice(0, 3);

  // Ao deslogar, o <Stack.Protected> do _layout leva para o login.
  const handleLogout = () => logout();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Dashboard</Text>
          <Text style={styles.subtitulo}>Olá, {usuario.nome.split(' ')[0]} ✂️</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="calendar"
          label={'Atendimentos\nno mês'}
          value={stats.totalMes}
          cor={colors.info}
        />
        <StatCard
          icon="today"
          label={'Atendimentos\nna semana'}
          value={stats.totalSemana}
          cor={colors.purple}
        />
        <StatCard
          icon="people"
          label={'Clientes\natendidos'}
          value={stats.clientesUnicos}
          cor={colors.success}
        />
        <StatCard
          icon="cash"
          label={'Lucro\nsemanal'}
          value={`R$ ${stats.lucroSemana}`}
          cor={colors.primary}
        />
        <StatCard
          icon="wallet"
          label={'Lucro\nmensal'}
          value={`R$ ${stats.lucroMes}`}
          cor={colors.primary}
          wide
        />
      </View>

      {/* Dia mais movimentado */}
      <View style={styles.diaCard}>
        <Ionicons name="flame" size={20} color={colors.orange} />
        <View style={{ flex: 1 }}>
          <Text style={styles.diaLabel}>Dia mais movimentado</Text>
          <Text style={styles.diaValue}>
            {stats.diaMaisMovimentado
              ? new Date(stats.diaMaisMovimentado + 'T12:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                })
              : '—'}
          </Text>
        </View>
      </View>

      {/* Gráfico */}
      <MiniGrafico dados={stats.grafico} />

      {/* Próximos atendimentos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próximos atendimentos</Text>
        <TouchableOpacity onPress={() => router.push('/barbeiro/agenda')}>
          <Text style={styles.verTodos}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      {proximos.length === 0 && <Text style={styles.vazio}>Nenhum agendamento pendente.</Text>}
      {proximos.map((ag) => {
        const cliente = getUsuario(ag.clienteId);
        const servico = getServico(ag.servicoId);
        const dataFmt = new Date(ag.data + 'T12:00:00').toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        });
        return (
          <View key={ag.id} style={styles.proximoCard}>
            <View style={styles.proximoHora}>
              <Text style={styles.proximoHoraText}>{ag.horario}</Text>
              <Text style={styles.proximoDataText}>{dataFmt}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.proximoCliente}>{cliente?.nome}</Text>
              <Text style={styles.proximoServico}>{servico?.nome}</Text>
            </View>
            <Text style={styles.proximoPreco}>R$ {precoDoAgendamento(ag)}</Text>
          </View>
        );
      })}

      {/* Botões de acesso rápido */}
      <View style={styles.acaoRow}>
        <TouchableOpacity style={styles.acaoBtn} onPress={() => router.push('/barbeiro/agenda')}>
          <Ionicons name="calendar" size={22} color={colors.primary} />
          <Text style={styles.acaoBtnText}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acaoBtn} onPress={() => router.push('/barbeiro/gerenciar')}>
          <Ionicons name="settings" size={22} color={colors.primary} />
          <Text style={styles.acaoBtnText}>Gerenciar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, label, value, cor, wide }) {
  return (
    <View style={[styles.statCard, wide && styles.statCardWide]}>
      <View style={[styles.statIcone, { backgroundColor: cor + '20' }]}>
        <Ionicons name={icon} size={20} color={cor} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, paddingBottom: 24 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: { fontSize: 26, fontWeight: 'bold', color: colors.white },
  subtitulo: { color: colors.textMuted, fontSize: 14, marginTop: 2 },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF444415',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  statCard: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  statCardWide: { flexBasis: '100%' },
  statIcone: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: { color: colors.white, fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: colors.textMuted, fontSize: 11 },

  diaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9731615',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F9731630',
    marginBottom: 12,
  },
  diaLabel: { color: colors.textMuted, fontSize: 12 },
  diaValue: { color: colors.white, fontWeight: '600', fontSize: 14 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: colors.white },
  verTodos: { color: colors.primary, fontSize: 13 },
  vazio: { color: colors.textMuted, textAlign: 'center', marginTop: 10 },

  proximoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  proximoHora: { alignItems: 'center', minWidth: 50 },
  proximoHoraText: { color: colors.primary, fontWeight: 'bold', fontSize: 15 },
  proximoDataText: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  proximoCliente: { color: colors.white, fontWeight: '600', fontSize: 14 },
  proximoServico: { color: colors.textMuted, fontSize: 12 },
  proximoPreco: { color: colors.success, fontWeight: 'bold' },

  acaoRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  acaoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  acaoBtnText: { color: colors.white, fontWeight: '600', fontSize: 14 },
});
