/**
 * Cálculo do Índice de Consistência — MenteMX Pro
 *
 * Baseado no Coeficiente de Variação (CV) normalizado:
 * consistência = max(0, 100 × (1 - CV × k))
 *
 * Onde:
 * - CV = σ / μ (desvio padrão / média)
 * - k = 10 (fator de calibração para Motocross)
 * - Requer mínimo de 3 voltas
 * - Retorna null para < 3 voltas (nunca lança exceção)
 * - Retorna 100 quando σ = 0 (invariante de igualdade)
 */

const K_FACTOR = 10;
const MIN_LAPS = 3;

/**
 * Calcula o índice de consistência a partir dos tempos de volta.
 * @param lapTimes - Array de tempos em milissegundos
 * @returns Valor em [0, 100] ou null se < 3 voltas
 */
export function calculateConsistency(lapTimes: number[]): number | null {
  if (lapTimes.length < MIN_LAPS) {
    return null;
  }

  const n = lapTimes.length;
  const mean = lapTimes.reduce((sum, t) => sum + t, 0) / n;

  // Evitar divisão por zero
  if (mean === 0) {
    return 100;
  }

  // Desvio padrão amostral
  const variance = lapTimes.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);

  // Coeficiente de Variação
  const cv = stdDev / mean;

  // Normalizar para [0, 100]
  const consistency = Math.max(0, 100 * (1 - cv * K_FACTOR));

  return Math.round(consistency * 10) / 10; // 1 casa decimal
}
