// Navbar adaptativa, orientada a dados: muda os itens conforme o tipo do usuário.
import { View, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavButton from './NavButton';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme/colors';

const ITENS_CLIENTE = [
  { path: '/', icon: 'home', title: 'Home' },
  { path: '/agendamentos', icon: 'calendar', title: 'Meus Agend.' },
  { path: '/agendar', icon: 'cut', title: 'Agendar' },
  { path: '/perfil', icon: 'person', title: 'Perfil' },
];

const ITENS_BARBEIRO = [
  { path: '/barbeiro/dashboard', icon: 'grid', title: 'Dashboard' },
  { path: '/barbeiro/agenda', icon: 'calendar', title: 'Agenda' },
  { path: '/barbeiro/gerenciar', icon: 'settings', title: 'Gerenciar' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();

  if (!usuario) return null;

  const itens = usuario.tipo === 'barbeiro' ? ITENS_BARBEIRO : ITENS_CLIENTE;
  const ir = (path) => {
    if (pathname !== path) router.replace(path);
  };

  // Navbar agora é um item normal do fluxo (não mais absolute): o conteúdo
  // não fica escondido atrás dela e respeita a barra de gestos do aparelho.
  return (
    <View style={[styles.navbar, { paddingBottom: insets.bottom + 8 }]}>
      {itens.map((item) => (
        <NavButton
          key={item.path}
          icon={item.icon}
          title={item.title}
          isActive={pathname === item.path}
          onPress={() => ir(item.path)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
