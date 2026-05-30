/**
 * Configuração da API — MenteMX Pro Mobile
 */

// Em desenvolvimento, usar IP da máquina local (não localhost)
// Expo Go no celular não resolve localhost do PC
export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.100:3000' // Altere para o IP do seu PC
  : 'https://api.mentemxpro.com';
