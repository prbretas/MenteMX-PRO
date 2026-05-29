/**
 * Inicialização do banco de dados PostgreSQL com Drizzle ORM.
 * Usado no backend para persistência server-side.
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, { schema });

export { schema };
export type Database = typeof db;

/**
 * Testa a conexão com o banco de dados.
 * Retorna true se conectou com sucesso.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão com PostgreSQL:', error);
    return false;
  }
}

/**
 * Encerra o pool de conexões.
 */
export async function closePool(): Promise<void> {
  await pool.end();
}
