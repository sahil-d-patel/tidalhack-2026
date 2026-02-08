import { Router } from 'express';
import * as scoutController from '../controllers/scoutController.js';
import * as hoverController from '../controllers/hoverController.js';
import * as masteryController from '../controllers/masteryController.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// AI endpoints
router.get('/concepts', scoutController.getConcepts);
router.post('/scout', scoutController.expandNode);
router.get('/tree/:topic', scoutController.getTree);
router.post('/hover', hoverController.getFunFact);
router.post('/mastery', masteryController.getMasteryQuiz);

export default router;

