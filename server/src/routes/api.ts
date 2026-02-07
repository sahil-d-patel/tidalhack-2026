import { Router } from 'express';
import * as scoutController from '../controllers/scoutController.js';
import * as hoverController from '../controllers/hoverController.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// AI endpoints
router.post('/scout', scoutController.expandNode);
router.post('/hover', hoverController.getFunFact);

export default router;
