import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, fonts } from '../src/constants/theme';

interface RadarDimension {
  label: string;
  value: number; // 0-10
  icon: string;
}

export default function AnalyticsScreen() {
  // TODO: buscar dados reais da API
  const mxScore = 0;
  const radarData: RadarDimension[] = [
    { label: 'Performance', value: 0, icon: '⚡' },
    { label: 'Consistência', value: 0, icon: '🎯' },
    { label: 'Mental', value: 0, icon: '🧠' },
    { label: 'Físico', value: 0, icon: '💪' },
    { label: 'Setup', value: 0, icon: '🔧' },
  ];

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />

      {/* MX Score Card */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>MX SCORE</Text>
        <Text style={styles.scoreValue}>{mxScore}</Text>
        <Text style={styles.scoreMax}>/ 1000</Text>
        <View style={styles.scoreBar}>
          <View style={[styles.scoreBarFill, { width: `${(mxScore / 1000) * 100}%` }]} />
        </View>
        <Text style={styles.scoreHint}>
          {mxScore === 0 ? 'Registre sessões para calcular' : 'Baseado nas últimas 30 sessões'}
        </Text>
      </View>

      {/* Radar Visual (barras horizontais como alternativa ao gráfico SVG) */}
      <View style={styles.radarCard}>
        <Text style={styles.sectionTitle}>Visão 360°</Text>
        {radarData.map((dim) => (
          <View key={dim.label} style={styles.radarRow}>
            <Text style={styles.radarIcon}>{dim.icon}</Text>
            <View style={styles.radarInfo}>
              <View style={styles.radarLabelRow}>
                <Text style={styles.radarLabel}>{dim.label}</Text>
                <Text style={styles.radarValue}>{dim.value.toFixed(1)}</Text>
              </View>
              <View style={styles.radarBar}>
                <View style={[styles.radarBarFill, { width: `${(dim.value / 10) * 100}%` }]} />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Histórico de Consistência */}
      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Últimas Sessões</Text>
        <Text style={styles.emptyText}>Nenhuma sessão registrada ainda</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  scoreLabel: {
    fontSize: fonts.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  scoreMax: {
    fontSize: fonts.body,
    color: colors.textMuted,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  scoreHint: {
    fontSize: fonts.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  radarCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  radarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  radarIcon: {
    fontSize: 20,
    width: 32,
  },
  radarInfo: {
    flex: 1,
  },
  radarLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  radarLabel: {
    fontSize: fonts.caption,
    color: colors.textSecondary,
  },
  radarValue: {
    fontSize: fonts.caption,
    color: colors.text,
    fontWeight: '600',
  },
  radarBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  radarBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  emptyText: {
    fontSize: fonts.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
