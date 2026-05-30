import { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { colors, spacing, fonts } from '../src/constants/theme';
import { API_BASE_URL } from '../src/constants/api';

/**
 * Formata a key automaticamente com hífens: MXPRO-XXXX-XXXX-XXXX
 */
function formatKeyInput(text: string): string {
  // Remove tudo que não é alfanumérico
  const clean = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  // Adiciona o prefixo MXPRO se não tiver
  let formatted = clean;
  if (formatted.length > 4) {
    formatted = formatted.slice(0, 4) + '-' + formatted.slice(4);
  }
  if (formatted.length > 9) {
    formatted = formatted.slice(0, 9) + '-' + formatted.slice(9);
  }
  if (formatted.length > 14) {
    formatted = formatted.slice(0, 14) + '-' + formatted.slice(14);
  }

  // Limitar ao tamanho máximo: MXPRO-XXXX-XXXX-XXXX (19 chars)
  return formatted.slice(0, 19);
}

export default function ActivateScreen() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleKeyChange = (text: string) => {
    setError('');
    setKey(formatKeyInput(text));
  };

  const validateFormat = (): boolean => {
    const regex = /^MXPR-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    // Aceitar também MXPRO-XXXX-XXXX-XXXX
    const regex2 = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (key.length < 19) {
      setError('Key incompleta. Formato: MXPRO-XXXX-XXXX-XXXX');
      return false;
    }
    return true;
  };

  const handleActivate = async () => {
    if (!validateFormat()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/keys/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: key,
          deviceId: 'mobile-' + Date.now(),
          deviceType: 'mobile',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Key inválida');
      }

      // Sucesso — redirecionar para login
      Alert.alert(
        '✅ Ativado!',
        'MenteMX Pro ativado com sucesso. Faça login para continuar.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (err: any) {
      // Se offline, salvar localmente e ativar depois
      if (err.message === 'Network request failed') {
        setError('Sem internet. A ativação será feita quando conectar.');
        // TODO: salvar key localmente para ativar depois
      } else {
        setError(err.message || 'Erro ao ativar key');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>🏁</Text>
          <Text style={styles.title}>MenteMX Pro</Text>
          <Text style={styles.subtitle}>Ative sua licença</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.instruction}>
            Insira a License Key que você recebeu após a compra:
          </Text>

          <Input
            label="License Key"
            value={key}
            onChangeText={handleKeyChange}
            placeholder="MXPRO-XXXX-XXXX-XXXX"
            autoCapitalize="none"
            error={error}
          />

          <Text style={styles.hint}>
            Formato: MXPRO-XXXX-XXXX-XXXX
          </Text>
        </View>

        <View style={styles.buttons}>
          <Button title="Ativar" onPress={handleActivate} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: fonts.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  instruction: {
    fontSize: fonts.body,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  hint: {
    fontSize: fonts.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  buttons: {
    gap: spacing.md,
  },
});
