import { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Vibration } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../src/components/Button';
import { colors, spacing, fonts } from '../src/constants/theme';
import { formatLapTime } from '@mentemx/core';

interface Lap {
  number: number;
  timeMs: number;
  recordedAt: Date;
}

export default function SessionScreen() {
  const [laps, setLaps] = useState<Lap[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [lastLapTime, setLastLapTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const lapStartRef = useRef<number>(Date.now());

  const bestLap = laps.length > 0 ? Math.min(...laps.map(l => l.timeMs)) : null;

  const handleRecordLap = () => {
    const now = Date.now();
    const lapTimeMs = now - lapStartRef.current;

    // Alerta para voltas < 10 segundos
    if (lapTimeMs < 10000) {
      Alert.alert(
        '⚠️ Volta muito rápida',
        `${(lapTimeMs / 1000).toFixed(1)}s — Confirmar registro?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Registrar', onPress: () => addLap(lapTimeMs, now) },
        ]
      );
      return;
    }

    addLap(lapTimeMs, now);
  };

  const addLap = (lapTimeMs: number, now: number) => {
    const newLap: Lap = {
      number: laps.length + 1,
      timeMs: lapTimeMs,
      recordedAt: new Date(now),
    };

    setLaps(prev => [newLap, ...prev]);
    setLastLapTime(lapTimeMs);
    lapStartRef.current = now;
    Vibration.vibrate(50); // feedback tátil
  };

  const handleEndSession = () => {
    setIsActive(false);

    const lapTimes = laps.map(l => l.timeMs);
    const lapCount = lapTimes.length;
    const best = lapCount > 0 ? Math.min(...lapTimes) : null;
    const avg = lapCount > 0 ? lapTimes.reduce((a, b) => a + b, 0) / lapCount : null;

    Alert.alert(
      '🏁 Sessão Encerrada',
      `Voltas: ${lapCount}\n` +
      `Melhor: ${best ? formatLapTime(best) : '--'}\n` +
      `Média: ${avg ? formatLapTime(Math.round(avg)) : '--'}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const getDelta = (lapTimeMs: number): string | null => {
    if (!bestLap || lapTimeMs === bestLap) return null;
    const delta = lapTimeMs - bestLap;
    return `+${(delta / 1000).toFixed(1)}s`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header com info da sessão */}
      <View style={styles.header}>
        <Text style={styles.lapCount}>{laps.length} voltas</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Última</Text>
            <Text style={styles.statValue}>
              {lastLapTime ? formatLapTime(lastLapTime) : '--:--.-'}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Melhor</Text>
            <Text style={[styles.statValue, styles.bestTime]}>
              {bestLap ? formatLapTime(bestLap) : '--:--.-'}
            </Text>
          </View>
        </View>
      </View>

      {/* Lista de voltas */}
      <FlatList
        data={laps}
        keyExtractor={(item) => item.number.toString()}
        style={styles.list}
        renderItem={({ item }) => {
          const delta = getDelta(item.timeMs);
          const isBest = item.timeMs === bestLap;
          return (
            <View style={[styles.lapRow, isBest && styles.lapRowBest]}>
              <Text style={styles.lapNumber}>V{item.number}</Text>
              <Text style={[styles.lapTime, isBest && styles.lapTimeBest]}>
                {formatLapTime(item.timeMs)}
              </Text>
              {delta && <Text style={styles.lapDelta}>{delta}</Text>}
              {isBest && <Text style={styles.bestBadge}>🏆</Text>}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Toque no botão para registrar voltas</Text>
          </View>
        }
      />

      {/* Botões de ação (Modo Luva) */}
      {isActive && (
        <View style={styles.actions}>
          <Button title="🏁 REGISTRAR VOLTA" onPress={handleRecordLap} />
          <Button title="Encerrar Sessão" onPress={handleEndSession} variant="secondary" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lapCount: {
    fontSize: fonts.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  stat: {},
  statLabel: {
    fontSize: fonts.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  bestTime: {
    color: colors.success,
  },
  list: {
    flex: 1,
    padding: spacing.md,
  },
  lapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lapRowBest: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  lapNumber: {
    width: 40,
    fontSize: fonts.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  lapTime: {
    flex: 1,
    fontSize: fonts.subtitle,
    color: colors.text,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  lapTimeBest: {
    color: colors.success,
  },
  lapDelta: {
    fontSize: fonts.caption,
    color: colors.error,
    marginRight: spacing.sm,
  },
  bestBadge: {
    fontSize: 16,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fonts.body,
    color: colors.textMuted,
  },
  actions: {
    padding: spacing.xl,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
