import { Redirect } from 'expo-router';

/**
 * Tela raiz — fluxo de redirecionamento:
 * 1. Se não ativou key → /activate
 * 2. Se ativou mas não logou → /login
 * 3. Se logado → /home
 *
 * TODO: verificar AsyncStorage para estado de ativação/login
 */
export default function Index() {
  // TODO: verificar se key já foi ativada no AsyncStorage
  // const isActivated = await AsyncStorage.getItem('license_key');
  // if (!isActivated) return <Redirect href="/activate" />;

  // TODO: verificar se tem token salvo
  // const token = await AsyncStorage.getItem('auth_token');
  // if (token) return <Redirect href="/home" />;

  // Por padrão, vai para ativação
  return <Redirect href="/activate" />;
}
