// src/app/barbeiro/gerenciar.jsx  —  Gerenciar serviços e horários do Barbeiro
// Agora persiste no AgendaContext: o que o barbeiro altera vale para o app inteiro.
import { colors } from '@/theme/colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAgenda } from '@/hooks/useAgenda';
import { HORARIOS_BASE } from '@/data/mockData';
import { showAlert } from '@/utils/alert';

export default function Gerenciar() {
  const { usuario } = useAuth();
  const { servicos, horariosDoBarbeiro, atualizarPreco, alternarServicoDoBarbeiro, salvarHorarios } =
    useAgenda();

  const [aba, setAba] = useState('servicos'); // "servicos" | "horarios"
  const [horariosAtivos, setHorariosAtivos] = useState(() => new Set(horariosDoBarbeiro(usuario?.id)));
  const [editando, setEditando] = useState(null); // id do serviço em edição
  const [novoPreco, setNovoPreco] = useState('');

  if (!usuario) return null;

  const salvarPreco = (id) => {
    const p = parseFloat(novoPreco.replace(',', '.'));
    if (Number.isNaN(p) || p <= 0) {
      showAlert('Erro', 'Preço inválido.');
      return;
    }
    atualizarPreco(id, p);
    setEditando(null);
    showAlert('✅ Salvo', 'Preço atualizado com sucesso!');
  };

  const toggleHorario = (h) =>
    setHorariosAtivos((prev) => {
      const next = new Set(prev);
      if (next.has(h)) next.delete(h);
      else next.add(h);
      return next;
    });

  const handleSalvarHorarios = () => {
    salvarHorarios(usuario.id, [...horariosAtivos]);
    showAlert('✅ Salvo', 'Horários atualizados!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.abas}>
        <TouchableOpacity
          style={[styles.aba, aba === 'servicos' && styles.abaActive]}
          onPress={() => setAba('servicos')}
        >
          <Ionicons name="cut" size={16} color={aba === 'servicos' ? colors.bg : colors.textMuted} />
          <Text style={[styles.abaText, aba === 'servicos' && styles.abaTextActive]}>Serviços</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.aba, aba === 'horarios' && styles.abaActive]}
          onPress={() => setAba('horarios')}
        >
          <Ionicons name="time" size={16} color={aba === 'horarios' ? colors.bg : colors.textMuted} />
          <Text style={[styles.abaText, aba === 'horarios' && styles.abaTextActive]}>Horários</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.lista}>
        {aba === 'servicos' && (
          <>
            <Text style={styles.hint}>
              Ative os serviços que você realiza. O preço é compartilhado entre os barbeiros.
            </Text>
            {servicos.map((s) => {
              const ativo = s.barbeiros.includes(usuario.id);
              return (
                <View key={s.id} style={[styles.card, !ativo && styles.cardInativo]}>
                  <View style={styles.cardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.servicoNome, !ativo && styles.textoInativo]}>{s.nome}</Text>
                      <Text style={styles.servicoInfo}>⏱ {s.duracao} min</Text>
                    </View>
                    <Switch
                      value={ativo}
                      onValueChange={() => alternarServicoDoBarbeiro(s.id, usuario.id)}
                      trackColor={{ false: colors.border, true: '#F5C51880' }}
                      thumbColor={ativo ? colors.primary : colors.textMuted}
                    />
                  </View>

                  {editando === s.id ? (
                    <View style={styles.editRow}>
                      <TextInput
                        style={styles.precoInput}
                        value={novoPreco}
                        onChangeText={setNovoPreco}
                        keyboardType="numeric"
                        placeholder="Novo preço"
                        placeholderTextColor={colors.textFaint}
                        autoFocus
                      />
                      <TouchableOpacity style={styles.btnSalvar} onPress={() => salvarPreco(s.id)}>
                        <Text style={styles.btnSalvarText}>Salvar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setEditando(null)} style={styles.btnCancelar}>
                        <Ionicons name="close" size={18} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.precoRow}>
                      <Text style={styles.preco}>R$ {s.preco}</Text>
                      <TouchableOpacity
                        style={styles.btnEditar}
                        onPress={() => {
                          setEditando(s.id);
                          setNovoPreco(String(s.preco));
                        }}
                        disabled={!ativo}
                      >
                        <Ionicons name="pencil" size={14} color={ativo ? colors.primary : colors.border} />
                        <Text style={[styles.btnEditarText, !ativo && { color: colors.border }]}>
                          Editar preço
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        {aba === 'horarios' && (
          <>
            <Text style={styles.hint}>
              Selecione os horários em que você está disponível para atendimento.
            </Text>
            <View style={styles.horariosGrid}>
              {HORARIOS_BASE.map((h) => {
                const ativo = horariosAtivos.has(h);
                return (
                  <TouchableOpacity
                    key={h}
                    style={[styles.horarioBtn, ativo && styles.horarioBtnActive]}
                    onPress={() => toggleHorario(h)}
                  >
                    <Ionicons
                      name={ativo ? 'checkmark-circle' : 'ellipse-outline'}
                      size={14}
                      color={ativo ? colors.bg : colors.textMuted}
                    />
                    <Text style={[styles.horarioBtnText, ativo && styles.horarioBtnTextActive]}>{h}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.btnSalvarHorarios} onPress={handleSalvarHorarios}>
              <Text style={styles.btnSalvarHorariosText}>Salvar horários</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  abas: {
    flexDirection: 'row',
    margin: 16,
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 4,
  },
  aba: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  abaActive: { backgroundColor: colors.primary },
  abaText: { color: colors.textMuted, fontWeight: '600', fontSize: 14 },
  abaTextActive: { color: colors.bg },

  lista: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
  hint: { color: colors.textMuted, fontSize: 13, marginBottom: 4 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  cardInativo: { opacity: 0.5 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  servicoNome: { color: colors.white, fontWeight: '600', fontSize: 15 },
  servicoInfo: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  textoInativo: { color: colors.textFaint },

  precoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  preco: { color: colors.primary, fontSize: 18, fontWeight: 'bold' },
  btnEditar: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  btnEditarText: { color: colors.primary, fontSize: 13 },

  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  precoInput: {
    flex: 1,
    backgroundColor: colors.bg,
    color: colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnSalvar: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  btnSalvarText: { color: colors.bg, fontWeight: 'bold', fontSize: 13 },
  btnCancelar: { padding: 4 },

  horariosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  horarioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  horarioBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  horarioBtnText: { color: colors.textMuted, fontWeight: '600' },
  horarioBtnTextActive: { color: colors.bg },

  btnSalvarHorarios: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  btnSalvarHorariosText: { color: colors.bg, fontWeight: 'bold', fontSize: 15 },
});
