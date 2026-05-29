/**
 * Formatação de tempo de volta no padrão MM:SS.d
 * Usado em mobile e desktop para exibir tempos de forma consistente.
 */

/**
 * Converte milissegundos para o formato MM:SS.d (minutos:segundos.décimos)
 * @param ms - Tempo em milissegundos (deve ser >= 0)
 * @returns String formatada no padrão MM:SS.d
 */
export function formatLapTime(ms: number): string {
  if (ms < 0) {
    throw new Error('Tempo não pode ser negativo');
  }

  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((ms % 1000) / 100);

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return `${mm}:${ss}.${tenths}`;
}

/**
 * Converte string no formato MM:SS.d para milissegundos
 * @param formatted - String no formato MM:SS.d
 * @returns Tempo em milissegundos
 */
export function parseLapTime(formatted: string): number {
  const match = formatted.match(/^(\d{2}):(\d{2})\.(\d)$/);
  if (!match) {
    throw new Error(`Formato inválido: "${formatted}". Esperado: MM:SS.d`);
  }

  const [, mm, ss, d] = match;
  const minutes = parseInt(mm, 10);
  const seconds = parseInt(ss, 10);
  const tenths = parseInt(d, 10);

  if (seconds >= 60) {
    throw new Error(`Segundos inválidos: ${seconds}. Deve ser 0-59`);
  }

  return (minutes * 60 + seconds) * 1000 + tenths * 100;
}
