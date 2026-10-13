// src/app/_layout.jsx
// Requer expo-router >= 5 (Expo SDK 53) por causa do <Stack.Protected>.
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import { AgendaProvider } from '@/context/AgendaContext';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import { colors } from '@/theme/colors';

function Rotas() {
  const { usuario } = useAuth();
  const logado = !!usuario;
  const ehCliente = usuario?.tipo === 'cliente';
  const ehBarbeiro = usuario?.tipo === 'barbeiro';

  return (
    <View style={styles.wrapper}>
      <StatusBar style="light" />
      {logado && <Header />}

      {/*
        Stack.Protected faz o controle de acesso por perfil:
        - visitante só vê login/cadastro
        - cliente não acessa /barbeiro/* (e vice-versa)
        - ao logar/deslogar o redirecionamento é automático (sem router.replace manual)
      */}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Protected guard={!logado}>
          <Stack.Screen name="login" />
          <Stack.Screen name="cadastro" />
        </Stack.Protected>

        <Stack.Protected guard={ehCliente}>
          <Stack.Screen name="index" />
          <Stack.Screen name="agendamentos" />
          <Stack.Screen name="agendar" />
          <Stack.Screen name="perfil" />
        </Stack.Protected>

        <Stack.Protected guard={ehBarbeiro}>
          <Stack.Screen name="barbeiro/dashboard" />
          <Stack.Screen name="barbeiro/agenda" />
          <Stack.Screen name="barbeiro/gerenciar" />
        </Stack.Protected>
      </Stack>

      {logado && <Navbar />}
    </View>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <AgendaProvider>
        <Rotas />
      </AgendaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.bg },
});
