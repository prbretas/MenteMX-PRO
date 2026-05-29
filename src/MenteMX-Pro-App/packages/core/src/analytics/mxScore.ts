/**
 * Cálculo do MX Score — MenteMX Pro
 *
 * score_bruto = (melhor_tempo_fator × 0.40)
 *             + (consistência_média  × 0.30)
 *             + (frequência_fator    × 0.20)
 *             + (evolução_fator      × 0.10)
 *
 * MX_Score = clamp(round(score_bruto × 1000), 0, 1000)
 *
 * Retorna 0 para lista vazia de sessões.
 */

export interface SessionData {
  bestLapMs: number;
  consistencyIndex: number | null;
  avgLapMs: number;
  date: string; // ISO 8601
}

export interface MXScoreResult {
  score: number;
  bestTimeFactor: number;
  consistencyFactor: number;
  frequencyFactor: number;
  evolutionFactor: number;
}

/**
 * Calcula o MX Score a partir das sessões dos últimos 30 dias.
 * @param sessions - Sessões com métricas calculadas
 * @param historicalBestMs - Melhor tempo histórico do piloto (opcional)
 * @returns MXScoreResult com score em [0, 1000]
 */
export function calculateMXScore(
  sessions: SessionData[],
  historicalBestMs?: number
): MXScoreResult {
  if (sessions.length === 0) {
    return {
      score: 0,
      bestTimeFactor: 0,
      consistencyFactor: 0,
      frequencyFactor: 0,
      evolutionFactor: 0,
    };
  }

  // 1. Best Time Factor (40%)
  const currentBest = Math.min(...sessions.map(s => s.bestLapMs));
  const refBest = historicalBestMs || currentBest;
  const bestTimeFactor = refBest > 0 ? Math.max(0, 1 - (currentBest / refBest - 1)) : 0;

  // 2. Consistency Factor (30%)
  const consistencies = sessions
    .map(s => s.consistencyIndex)
    .filter((c): c is number => c !== null);
  const consistencyFactor = consistencies.length > 0
    ? consistencies.reduce((sum, c) => sum + c, 0) / consistencies.length / 100
    : 0;

  // 3. Frequency Factor (20%) — 12 sessões/mês = máximo
  const frequencyFactor = Math.min(sessions.length / 12, 1);

  // 4. Evolution Factor (10%) — tendência dos tempos médios
  let evolutionFactor = 0.5; // neutro por padrão
  if (sessions.length >= 2) {
    const sorted = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sorted[0].avgLapMs;
    const last = sorted[sorted.length - 1].avgLapMs;
    // Melhora = tempo diminuiu
    if (first > 0) {
      evolutionFactor = Math.max(0, Math.min(1, 1 - (last / first - 1) * 5));
    }
  }

  // Score bruto e clamp
  const raw = (bestTimeFactor * 0.40)
            + (consistencyFactor * 0.30)
            + (frequencyFactor * 0.20)
            + (evolutionFactor * 0.10);

  const score = Math.max(0, Math.min(1000, Math.round(raw * 1000)));

  return {
    score,
    bestTimeFactor: Math.round(bestTimeFactor * 1000) / 1000,
    consistencyFactor: Math.round(consistencyFactor * 1000) / 1000,
    frequencyFactor: Math.round(frequencyFactor * 1000) / 1000,
    evolutionFactor: Math.round(evolutionFactor * 1000) / 1000,
  };
}
