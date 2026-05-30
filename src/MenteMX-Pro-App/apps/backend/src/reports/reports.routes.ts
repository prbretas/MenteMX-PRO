import { Router } from 'express';
import { generateReportSchema, type ReportData } from './reports.schema.js';
import { authMiddleware, type AuthenticatedRequest } from '../auth/auth.middleware.js';

const router = Router();

/**
 * POST /pilots/:id/reports
 * Gera relatório PDF com dados do período selecionado.
 * Para o MVP, retorna os dados estruturados (PDF generation com PDFKit será integrado depois).
 */
router.post('/pilots/:id/reports', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    if (req.pilotId !== id) { res.status(403).json({ error: 'Acesso negado' }); return; }

    const input = generateReportSchema.parse(req.body);

    // Calcular datas do período
    const endDate = new Date();
    let startDate: Date;

    switch (input.period) {
      case '7d':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        if (!input.startDate || !input.endDate) {
          res.status(400).json({ error: 'startDate e endDate são obrigatórios para período custom' });
          return;
        }
        startDate = new Date(input.startDate);
        break;
    }

    // Para o MVP, retornamos a estrutura do relatório
    // Em produção, aqui geraria o PDF com PDFKit
    const reportData: ReportData = {
      pilotName: 'Piloto', // seria buscado do DB
      period: `${startDate!.toISOString().split('T')[0]} a ${endDate.toISOString().split('T')[0]}`,
      mxScore: 0,
      radar: { performance: 0, consistency: 0, mental: 0, physical: 0, setup: 0 },
      sessions: [],
      bestTimeMs: null,
      generatedAt: new Date().toISOString(),
    };

    // Se não há sessões no período
    if (reportData.sessions.length === 0) {
      res.json({
        ...reportData,
        message: 'Nenhuma sessão encontrada no período selecionado',
      });
      return;
    }

    res.json(reportData);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
