// src/app/login.jsx
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
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { showAlert } from '@/utils/alert';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []); // limpa o timer ao desmontar

  const handleLogin = () => {
    if (loading) return;
    if (!email.trim() || !senha) {
      showAlert('Atenção', 'Preencha todos os campos.');
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(() => {
      const result = login(email, senha);
      if (!result.ok) {
        setLoading(false);
        showAlert('Erro', result.erro);
      }
      // Sucesso: o <Stack.Protected> do _layout redireciona sozinho conforme o perfil.
    }, 500);
  };

  // Preenche credenciais de demo
  const demo = (tipo) => {
    if (tipo === 'cliente') {
      setEmail('lucas@email.com');
      setSenha('123456');
    }
    if (tipo === 'barbeiro') {
      setEmail('roberto@email.com');
      setSenha('123456');
    }
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
            <Ionicons name="cut" size={40} color={colors.bg} />
          </View>
          <Text style={styles.logoText}>BarberPro</Text>
          <Text style={styles.logoSub}>Seu estilo, nossa arte</Text>
        </View>

        {/* Demo buttons */}
        <View style={styles.demoRow}>
          <Text style={styles.demoLabel}>Entrar como:</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity style={styles.demoBtn} onPress={() => demo('cliente')}>
              <Ionicons name="person" size={14} color={colors.primary} />
              <Text style={styles.demoBtnText}>Cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoBtn} onPress={() => demo('barbeiro')}>
              <Ionicons name="cut" size={14} color={colors.primary} />
              <Text style={styles.demoBtnText}>Barbeiro</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
            placeholder="••••••••"
            placeholderTextColor={colors.textFaint}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity style={styles.btnLogin} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.btnLoginText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/cadastro')}>
            <Text style={styles.linkText}>
              Não tem conta? <Text style={styles.linkDestaque}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 40 },

  logoArea: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  logoText: { fontSize: 32, fontWeight: 'bold', color: colors.primary, letterSpacing: 3 },
  logoSub: { color: colors.textMuted, fontSize: 13, marginTop: 4 },

  demoRow: { marginBottom: 20 },
  demoLabel: { color: colors.textMuted, fontSize: 12, marginBottom: 8, textAlign: 'center' },
  demoButtons: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  demoBtnText: { color: colors.primary, fontSize: 13, fontWeight: '600' },

  form: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
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
  btnLogin: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  btnLoginText: { color: colors.bg, fontWeight: 'bold', fontSize: 16 },
  linkText: { color: colors.textMuted, textAlign: 'center', marginTop: 18, fontSize: 14 },
  linkDestaque: { color: colors.primary, fontWeight: 'bold' },
});
