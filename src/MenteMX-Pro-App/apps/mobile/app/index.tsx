import { Redirect } from 'expo-router';

/**
 * Tela raiz — redireciona para login.
 * Quando implementar persistência de token, verificar se já está logado
 * e redirecionar para /home.
 */
export default function Index() {
  // TODO: verificar token no AsyncStorage
  // Se logado: return <Redirect href="/home" />;
  return <Redirect href="/login" />;
}
