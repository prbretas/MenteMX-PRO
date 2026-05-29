/**
 * Inicialização do banco de dados SQLite local com Drizzle ORM.
 * Usado no app mobile para persistência offline-first.
 */

import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const DB_NAME = 'mentemx_pro.db';

// Abre o banco SQLite nativo
const expoDb = openDatabaseSync(DB_NAME);

// Cria a instância Drizzle com schema tipado
export const db = drizzle(expoDb, { schema });

export { schema };
export type Database = typeof db;
