import { Router } from 'express';
import { registerSchema, loginSchema } from './auth.schema.js';
import { registerPilot, loginPilot } from './auth.service.js';
import { authMiddleware, type AuthenticatedRequest } from './auth.middleware.js';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/index.js';

const router = Router();

/**
 * POST /auth/register
 * Cadastro de novo piloto
 */
router.post('/register', async (req, res) => {
  try {
    const input = registerSchema.parse(req.body);
    const result = await registerPilot(input);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    if (error.message === 'Email já cadastrado') {
      res.status(409).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /auth/login
 * Autenticação de piloto
 */
router.post('/login', async (req, res) => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginPilot(input);
    res.json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    if (error.message === 'Credenciais inválidas') {
      res.status(401).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /pilots/:id
 * Perfil do piloto (autenticado)
 */
router.get('/pilots/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    // Piloto só pode ver seu próprio perfil
    if (req.pilotId !== id) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    const [found] = await db
      .select({
        id: schema.pilot.id,
        name: schema.pilot.name,
        email: schema.pilot.email,
        currentStreak: schema.pilot.currentStreak,
        recordStreak: schema.pilot.recordStreak,
        lastSessionDate: schema.pilot.lastSessionDate,
        createdAt: schema.pilot.createdAt,
      })
      .from(schema.pilot)
      .where(eq(schema.pilot.id, id))
      .limit(1);

    if (!found) {
      res.status(404).json({ error: 'Piloto não encontrado' });
      return;
    }

    res.json(found);
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * PUT /pilots/:id
 * Atualizar perfil do piloto (autenticado)
 */
router.put('/pilots/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    if (req.pilotId !== id) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.length < 2) {
      res.status(400).json({ error: 'Nome deve ter pelo menos 2 caracteres' });
      return;
    }

    const [updated] = await db
      .update(schema.pilot)
      .set({ name, updatedAt: new Date() })
      .where(eq(schema.pilot.id, id))
      .returning({ id: schema.pilot.id, name: schema.pilot.name, email: schema.pilot.email });

    if (!updated) {
      res.status(404).json({ error: 'Piloto não encontrado' });
      return;
    }

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
