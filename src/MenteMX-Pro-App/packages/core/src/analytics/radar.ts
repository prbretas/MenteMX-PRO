/**
 * Cálculo das Dimensões do Gráfico de Radar — MenteMX Pro
 *
 * 5 dimensões, todas em [0, 10]:
 * - Performance: MX_Score / 1000 × 10
 * - Consistência: média das últimas 5 sessões / 10
 * - Mental: média dos inputs manuais (1-10)
 * - Físico: média dos inputs manuais (1-10)
 * - Setup: fórmula composta (registros + delta tempo)
 */

export interface RadarData {
  performance: number;
  consistency: number;
  mental: number;
  physical: number;
  setup: number;
}

export interface RadarInput {
  mxScore: number; // [0, 1000]
  consistencyScores: number[]; // últimas sessões [0, 100]
  mentalScores: number[]; // inputs manuais [1, 10]
  physicalScores: number[]; // inputs manuais [1, 10]
  setupRegistros30d: number; // quantidade de setups nos últimos 30 dias
  maxSetupEsperado?: number; // default 6
}

/**
 * Calcula as 5 dimensões do Radar.
 * Todas as dimensões retornam valor em [0, 10].
 */
export function calculateRadarDimensions(input: RadarInput): RadarData {
  const maxSetup = input.maxSetupEsperado || 6;

  // Performance: MX_Score / 1000 × 10
  const performance = clamp((input.mxScore / 1000) * 10, 0, 10);

  // Consistência: média / 10
  const consistency = input.consistencyScores.length > 0
    ? clamp(average(input.consistencyScores) / 10, 0, 10)
    : 0;

  // Mental: média dos inputs (já em [1, 10])
  const mental = input.mentalScores.length > 0
    ? clamp(average(input.mentalScores), 0, 10)
    : 0;

  // Físico: média dos inputs (já em [1, 10])
  const physical = input.physicalScores.length > 0
    ? clamp(average(input.physicalScores), 0, 10)
    : 0;

  // Setup: baseado na frequência de registros
  const setup = clamp((input.setupRegistros30d / maxSetup) * 10, 0, 10);

  return {
    performance: round1(performance),
    consistency: round1(consistency),
    mental: round1(mental),
    physical: round1(physical),
    setup: round1(setup),
  };
}

/**
 * Valida input de Mental/Físico (deve ser [1, 10]).
 */
export function validateMentalPhysicalInput(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function average(arr: number[]): number {
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
