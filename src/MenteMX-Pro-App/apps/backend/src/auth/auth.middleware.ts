import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth.service.js';

export interface AuthenticatedRequest extends Request {
  pilotId?: string;
}

/**
 * Middleware de autenticação JWT.
 * Extrai o token do header Authorization (Bearer <token>)
 * e adiciona pilotId ao request.
 */
export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const { pilotId } = verifyToken(token);
    req.pilotId = pilotId;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
