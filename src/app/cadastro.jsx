// src/app/cadastro.jsx
import { colors } from '@/theme/colors';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAgenda } from '@/hooks/useAgenda';
import { showAlert } from '@/utils/alert';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Cadastro() {
  const router = useRouter();
  const { cadastrar } = useAuth();
  const { vincularBarbeiroATodosServicos } = useAgenda();

  const [tipo, setTipo] = useState('cliente'); // "cliente" | "barbeiro"
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCadastro = () => {
    if (loading) return;
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      showAlert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      showAlert('Erro', 'Informe um e-mail válido.');
      return;
    }
    if (senha.length < 6) {
      showAlert('Erro', 'Senha mínimo 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      showAlert('Erro', 'As senhas não coincidem.');
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(() => {
      const result = cadastrar({ nome, email, senha, tipo });
      if (!result.ok) {
        setLoading(false);
        showAlert('Erro', result.erro);
        return;
      }
      // Barbeiro novo passa a oferecer todos os serviços (senão apareceria sem nenhum).
      if (result.tipo === 'barbeiro') vincularBarbeiroATodosServicos(result.usuario.id);
      // O redirecionamento é feito pelo <Stack.Protected> do _layout.
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Ionicons name="cut" size={36} color={colors.bg} />
          </View>
          <Text style={styles.logoText}>BarberPro</Text>
          <Text style={styles.logoSub}>Crie sua conta</Text>
        </View>

        {/* Seletor de tipo */}
        <View style={styles.tipoContainer}>
          <Text style={styles.tipoTitle}>Você é:</Text>
          <View style={styles.tipoRow}>
            <TouchableOpacity
              style={[styles.tipoBtn, tipo === 'cliente' && styles.tipoBtnActive]}
              onPress={() => setTipo('cliente')}
            >
              <Ionicons
                name="person"
                size={22}
                color={tipo === 'cliente' ? colors.bg : colors.textMuted}
              />
              <Text style={[styles.tipoBtnText, tipo === 'cliente' && styles.tipoBtnTextActive]}>
                Cliente
              </Text>
              <Text style={[styles.tipoDesc, tipo === 'cliente' && styles.tipoDescActive]}>
                Agende serviços
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tipoBtn, tipo === 'barbeiro' && styles.tipoBtnActive]}
              onPress={() => setTipo('barbeiro')}
            >
              <Ionicons name="cut" size={22} color={tipo === 'barbeiro' ? colors.bg : colors.textMuted} />
              <Text style={[styles.tipoBtnText, tipo === 'barbeiro' && styles.tipoBtnTextActive]}>
                Barbeiro
              </Text>
              <Text style={[styles.tipoDesc, tipo === 'barbeiro' && styles.tipoDescActive]}>
                Gerencie sua agenda
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="words"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor={colors.textFaint}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.textFaint}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Repita sua senha"
            placeholderTextColor={colors.textFaint}
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <TouchableOpacity style={styles.btnCadastro} onPress={handleCadastro} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.btnCadastroText}>
                Criar conta como {tipo === 'cliente' ? 'Cliente' : 'Barbeiro'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.linkText}>
              Já tem conta? <Text style={styles.linkDestaque}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: 24, paddingBottom: 40 },

  logoArea: { alignItems: 'center', marginBottom: 24, marginTop: 20 },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 8,
  },
  logoText: { fontSize: 28, fontWeight: 'bold', color: colors.primary, letterSpacing: 3 },
  logoSub: { color: colors.textMuted, fontSize: 13, marginTop: 4 },

  tipoContainer: { marginBottom: 20 },
  tipoTitle: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  tipoRow: { flexDirection: 'row', gap: 12 },
  tipoBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 4,
  },
  tipoBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tipoBtnText: { color: colors.textMuted, fontWeight: 'bold', fontSize: 15 },
  tipoBtnTextActive: { color: colors.bg },
  tipoDesc: { color: colors.textFaint, fontSize: 11 },
  tipoDescActive: { color: colors.border },

  form: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
  },
  label: { color: colors.textSoft, fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: colors.bg,
    color: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnCadastro: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
    elevation: 6,
  },
  btnCadastroText: { color: colors.bg, fontWeight: 'bold', fontSize: 15 },
  linkText: { color: colors.textMuted, textAlign: 'center', marginTop: 18, fontSize: 14 },
  linkDestaque: { color: colors.primary, fontWeight: 'bold' },
});
