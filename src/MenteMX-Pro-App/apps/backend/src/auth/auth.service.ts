import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/index.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mentemx-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

export interface AuthResult {
  token: string;
  pilot: {
    id: string;
    name: string;
    email: string;
  };
}

export async function registerPilot(input: RegisterInput): Promise<AuthResult> {
  // Verificar email duplicado
  const existing = await db
    .select({ id: schema.pilot.id })
    .from(schema.pilot)
    .where(eq(schema.pilot.email, input.email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error('Email já cadastrado');
  }

  // Hash da senha
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  // Inserir piloto
  const now = new Date();
  const [newPilot] = await db
    .insert(schema.pilot)
    .values({
      name: input.name,
      email: input.email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    })
    .returning({ id: schema.pilot.id, name: schema.pilot.name, email: schema.pilot.email });

  // Gerar JWT
  const token = jwt.sign({ pilotId: newPilot.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { token, pilot: newPilot };
}

export async function loginPilot(input: LoginInput): Promise<AuthResult> {
  // Buscar piloto por email
  const [found] = await db
    .select()
    .from(schema.pilot)
    .where(eq(schema.pilot.email, input.email))
    .limit(1);

  if (!found) {
    throw new Error('Credenciais inválidas');
  }

  // Verificar senha
  const valid = await bcrypt.compare(input.password, found.passwordHash);
  if (!valid) {
    throw new Error('Credenciais inválidas');
  }

  // Gerar JWT
  const token = jwt.sign({ pilotId: found.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    pilot: { id: found.id, name: found.name, email: found.email },
  };
}

export function verifyToken(token: string): { pilotId: string } {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { pilotId: string };
    return payload;
  } catch {
    throw new Error('Token inválido ou expirado');
  }
}
