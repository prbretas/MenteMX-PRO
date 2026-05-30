import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, fonts } from '../src/constants/theme';
import { Button } from '../src/components/Button';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Piloto! 🏁</Text>
        <Text style={styles.subtitle}>Pronto para treinar?</Text>
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>MX Score</Text>
        <Text style={styles.scoreValue}>---</Text>
        <Text style={styles.scoreHint}>Registre sessões para calcular</Text>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.streakLabel}>🔥 Streak</Text>
        <Text style={styles.streakValue}>0 dias</Text>
      </View>

      <View style={styles.actions}>
        <Button title="Iniciar Sessão" onPress={() => {}} />
        <Button title="Meus Setups" onPress={() => {}} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: spacing.xxl,
  },
  greeting: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: fonts.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: fonts.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: spacing.sm,
  },
  scoreHint: {
    fontSize: fonts.caption,
    color: colors.textMuted,
  },
  streakCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: fonts.body,
    color: colors.text,
  },
  streakValue: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.warning,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
});
