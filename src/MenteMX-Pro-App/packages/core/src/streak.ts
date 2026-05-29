/**
 * Streak de Treino — MenteMX Pro
 *
 * Calcula sequência de dias consecutivos com sessão registrada.
 * Marcos em 7, 30 e 100 dias.
 */

export interface StreakResult {
  currentStreak: number;
  recordStreak: number;
  milestone: number | null; // 7, 30 ou 100 se atingido
}

/**
 * Calcula o streak atual a partir de um array de booleans
 * representando dias com/sem sessão (mais recente primeiro).
 */
export function calculateStreak(daysWithSession: boolean[]): number {
  let streak = 0;
  for (const hasSession of daysWithSession) {
    if (hasSession) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Incrementa o streak: sessão registrada em dia sem sessão prévia.
 */
export function incrementStreak(currentStreak: number): number {
  return currentStreak + 1;
}

/**
 * Processa fim de dia sem sessão: reset do streak.
 * Retorna milestone se o streak atual é 7, 30 ou 100.
 */
export function processEndOfDay(
  currentStreak: number,
  recordStreak: number,
  hadSessionToday: boolean
): StreakResult {
  if (hadSessionToday) {
    const newStreak = currentStreak; // já foi incrementado
    const newRecord = Math.max(recordStreak, newStreak);
    const milestone = [7, 30, 100].includes(newStreak) ? newStreak : null;
    return { currentStreak: newStreak, recordStreak: newRecord, milestone };
  }

  // Sem sessão: registrar marco se aplicável, depois resetar
  const milestone = [7, 30, 100].includes(currentStreak) ? currentStreak : null;
  const newRecord = Math.max(recordStreak, currentStreak);
  return { currentStreak: 0, recordStreak: newRecord, milestone };
}

/**
 * Invariante: record >= current em qualquer momento.
 */
export function getRecord(currentStreak: number, recordStreak: number): number {
  return Math.max(currentStreak, recordStreak);
}
