import { Alert, Platform } from 'react-native';

// Alert.alert não faz nada no React Native Web — este wrapper funciona nas duas plataformas.
export function showAlert(titulo, mensagem) {
  if (Platform.OS === 'web') {
    window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
    return;
  }
  Alert.alert(titulo, mensagem);
}
