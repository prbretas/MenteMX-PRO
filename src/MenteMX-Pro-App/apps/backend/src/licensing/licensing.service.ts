/**
 * Serviço de License Keys — MenteMX Pro
 * Gera, ativa e valida keys no formato MXPRO-XXXX-XXXX-XXXX
 */

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem I, O, 0, 1 (evitar confusão)

/**
 * Gera um segmento de 4 caracteres alfanuméricos.
 */
function generateSegment(): string {
  let segment = '';
  for (let i = 0; i < 4; i++) {
    segment += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return segment;
}

/**
 * Gera uma License Key no formato MXPRO-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(): string {
  return `MXPRO-${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}

/**
 * Valida o formato de uma License Key.
 */
export function isValidKeyFormat(code: string): boolean {
  return /^MXPRO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code);
}
