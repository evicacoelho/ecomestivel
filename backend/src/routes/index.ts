import { Router } from 'express';
import authRoutes from './auth.route';
import plantaRoutes from './planta.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/plantas', plantaRoutes);

router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'É de Comer? API',
    version: '1.0.0'
  });
});

export default router;