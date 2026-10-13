// src/app/agendar.jsx  —  Fluxo de agendamento do Cliente
import { colors } from '@/theme/colors';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAgenda } from '@/hooks/useAgenda';
import { gerarProximosDias } from '@/utils/date';
import { showAlert } from '@/utils/alert';

const STEP = { BARBEIRO: 0, SERVICO: 1, DATA: 2, HORARIO: 3, CONFIRMAR: 4 };
const TOTAL_STEPS = Object.keys(STEP).length;

// expo-router pode entregar o param como string | string[]
const primeiro = (v) => (Array.isArray(v) ? v[0] : v);

function SucessoModal({ visivel, servico, barbeiro, data, horario, onVoltar }) {
  return (
    <Modal transparent animationType="fade" visible={visivel}>
      <View style={mStyles.overlay}>
        <View style={mStyles.box}>
          <View style={mStyles.iconeCircle}>
            <Ionicons name="checkmark" size={32} color={colors.bg} />
          </View>
          <Text style={mStyles.titulo}>Agendado com sucesso!</Text>
          <View style={mStyles.info}>
            <Text style={mStyles.infoItem}>✂️ {servico?.nome}</Text>
            <Text style={mStyles.infoItem}>👤 {barbeiro?.nome}</Text>
            <Text style={mStyles.infoItem}>
              📅 {data?.label} às {horario}
            </Text>
            <Text style={mStyles.infoPreco}>R$ {servico?.preco}</Text>
          </View>
          <TouchableOpacity style={mStyles.btn} onPress={onVoltar}>
            <Text style={mStyles.btnText}>Ver meus agendamentos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


const mStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 360,
    gap: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: { color: colors.white, fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  info: { width: '100%', backgroundColor: colors.bg, borderRadius: 12, padding: 14, gap: 8 },
  infoItem: { color: colors.textSoft, fontSize: 14 },
  infoPreco: { color: colors.primary, fontWeight: 'bold', fontSize: 16, marginTop: 4 },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  btnText: { color: colors.bg, fontWeight: 'bold', fontSize: 15 },
});

export default function Agendar() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { usuario, barbeiros } = useAuth();
  const { getServico, servicosDoBarbeiro, horariosDisponiveis, criarAgendamento } = useAgenda();

  const [barbeiro, setBarbeiro] = useState(
    () => barbeiros.find((b) => b.id === primeiro(params.barbeiroId)) ?? null,
  );
  const [servico, setServico] = useState(() => {
    const s = getServico(primeiro(params.servicoId)) ?? null;
    // ignora serviço da rota se o barbeiro da rota não o realiza
    return s && (!barbeiro || s.barbeiros.includes(barbeiro.id)) ? s : null;
  });
  // Pula etapas já resolvidas pela navegação (home → barbeiro / serviço)
  const [step, setStep] = useState(() => {
    if (barbeiro && servico) return STEP.DATA;
    return barbeiro ? STEP.SERVICO : STEP.BARBEIRO;
  });
  const [data, setData] = useState(null);
  const [horario, setHorario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []); // evita setState após desmontar

  const dias = useMemo(() => gerarProximosDias(14), []);

  // Veio de um card de serviço: só lista barbeiros que realizam esse serviço
  const filtrarPorServico = !!servico && servico.id === primeiro(params.servicoId);
  const listaBarbeiros = filtrarPorServico
    ? barbeiros.filter((b) => servico.barbeiros.includes(b.id))
    : barbeiros;
  const listaServicos = barbeiro ? servicosDoBarbeiro(barbeiro.id) : [];

  const horarios = useMemo(
    () => (barbeiro && data ? horariosDisponiveis(barbeiro.id, data.iso) : []),
    [barbeiro, data, horariosDisponiveis],
  );

  // Ao mudar uma escolha, tudo que depende dela é descartado (antes ficava "sujo").
  const escolherBarbeiro = (b) => {
    const manterServico = servico?.barbeiros.includes(b.id);
    setBarbeiro(b);
    if (!manterServico) setServico(null);
    setData(null);
    setHorario(null);
    setStep(manterServico ? STEP.DATA : STEP.SERVICO);
  };
  const escolherServico = (s) => {
    setServico(s);
    setStep(STEP.DATA);
  };
  const escolherData = (d) => {
    setData(d);
    setHorario(null);
    setStep(STEP.HORARIO);
  };
  const escolherHorario = (h) => {
    setHorario(h);
    setStep(STEP.CONFIRMAR);
  };

  const confirmar = () => {
    if (loading) return;
    setLoading(true);
    timerRef.current = setTimeout(() => {
      const result = criarAgendamento({
        clienteId: usuario.id,
        barbeiroId: barbeiro.id,
        servicoId: servico.id,
        data: data.iso,
        horario,
      });
      setLoading(false);
      if (result.ok) {
        setSucesso(true);
      } else {
        showAlert('Não foi possível agendar', result.erro);
        setStep(STEP.HORARIO);
      }
    }, 600);
  };

  if (!usuario) return null;

  const renderStep = () => {
    switch (step) {
      case STEP.BARBEIRO:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Escolha o barbeiro</Text>
            {listaBarbeiros.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={[styles.listItem, barbeiro?.id === b.id && styles.listItemActive]}
                onPress={() => escolherBarbeiro(b)}
              >
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listItemTitle}>{b.nome}</Text>
                  <Text style={styles.listItemSub}>{b.especialidade}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        );

      case STEP.SERVICO:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Escolha o serviço</Text>
            {listaServicos.length === 0 && (
              <Text style={styles.vazio}>Este barbeiro não tem serviços ativos no momento.</Text>
            )}
            {listaServicos.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.listItem, servico?.id === s.id && styles.listItemActive]}
                onPress={() => escolherServico(s)}
              >
                <View style={styles.avatarCircle}>
                  <Ionicons name="cut" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listItemTitle}>{s.nome}</Text>
                  <Text style={styles.listItemSub}>⏱ {s.duracao} min</Text>
                </View>
                <Text style={styles.preco}>R$ {s.preco}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case STEP.DATA:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Escolha a data</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.diasRow}>
                {dias.map((d) => (
                  <TouchableOpacity
                    key={d.iso}
                    style={[styles.diaBtn, data?.iso === d.iso && styles.diaBtnActive]}
                    onPress={() => escolherData(d)}
                  >
                    <Text style={[styles.diaBtnText, data?.iso === d.iso && styles.diaBtnTextActive]}>
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      case STEP.HORARIO:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Horários disponíveis</Text>
            {horarios.length === 0 ? (
              <Text style={styles.vazio}>Nenhum horário disponível neste dia.</Text>
            ) : (
              <View style={styles.horariosGrid}>
                {horarios.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[styles.horarioBtn, horario === h && styles.horarioBtnActive]}
                    onPress={() => escolherHorario(h)}
                  >
                    <Text style={[styles.horarioBtnText, horario === h && styles.horarioBtnTextActive]}>
                      {h}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );

      case STEP.CONFIRMAR:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Confirmar agendamento</Text>
            <View style={styles.resumoCard}>
              <ResumoItem icon="cut" label="Serviço" value={servico?.nome} />
              <ResumoItem icon="person" label="Barbeiro" value={barbeiro?.nome} />
              <ResumoItem icon="calendar" label="Data" value={data?.label} />
              <ResumoItem icon="time" label="Horário" value={horario} />
              <View style={styles.resumoDivider} />
              <ResumoItem icon="cash" label="Total" value={`R$ ${servico?.preco}`} destaque />
            </View>
            <TouchableOpacity style={styles.btnConfirmar} onPress={confirmar} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.bg} />
              ) : (
                <Text style={styles.btnConfirmarText}>Confirmar Agendamento</Text>
              )}
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <SucessoModal
        visivel={sucesso}
        servico={servico}
        barbeiro={barbeiro}
        data={data}
        horario={horario}
        onVoltar={() => {
          setSucesso(false);
          router.replace('/agendamentos');
        }}
      />

      <View style={styles.header}>
        {step > STEP.BARBEIRO && (
          <TouchableOpacity onPress={() => setStep((s) => s - 1)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Novo Agendamento</Text>
      </View>

      <View style={styles.progressBar}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <View key={i} style={[styles.progressStep, i <= step && styles.progressStepActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>{renderStep()}</ScrollView>
    </View>
  );
}

function ResumoItem({ icon, label, value, destaque }) {
  return (
    <View style={styles.resumoItem}>
      <Ionicons name={icon} size={16} color={destaque ? colors.primary : colors.textMuted} />
      <Text style={styles.resumoLabel}>{label}:</Text>
      <Text style={[styles.resumoValue, destaque && styles.resumoValueDestaque]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.white },

  progressBar: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, marginBottom: 8 },
  progressStep: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.surface },
  progressStepActive: { backgroundColor: colors.primary },

  content: { padding: 16, paddingBottom: 24 },
  stepContainer: { gap: 12 },
  stepTitle: { fontSize: 18, fontWeight: 'bold', color: colors.white, marginBottom: 8 },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  listItemActive: { borderColor: colors.primary },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemTitle: { color: colors.white, fontWeight: '600', fontSize: 15 },
  listItemSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  preco: { color: colors.primary, fontWeight: 'bold', fontSize: 16 },

  diasRow: { flexDirection: 'row', gap: 10, paddingVertical: 4 },
  diaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  diaBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  diaBtnText: { color: colors.textSoft, fontSize: 13, fontWeight: '600' },
  diaBtnTextActive: { color: colors.bg },

  horariosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  horarioBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  horarioBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  horarioBtnText: { color: colors.textSoft, fontWeight: '600' },
  horarioBtnTextActive: { color: colors.bg },

  vazio: { color: colors.textMuted, textAlign: 'center', marginTop: 20 },

  resumoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  resumoItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resumoLabel: { color: colors.textMuted, fontSize: 14, width: 70 },
  resumoValue: { color: colors.white, fontSize: 14, fontWeight: '600', flex: 1 },
  resumoValueDestaque: { color: colors.primary, fontSize: 16 },
  resumoDivider: { height: 1, backgroundColor: colors.border },

  btnConfirmar: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 6,
  },
  btnConfirmarText: { color: colors.bg, fontWeight: 'bold', fontSize: 16 },
});
