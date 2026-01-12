import { Router } from 'express';
import { PlantaController } from '../controllers/planta.controller';
import { ModeracaoController } from '../controllers/moderacao.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../config/multer';
import { PerfilUsuario } from '@prisma/client';

const router = Router();
const plantaController = new PlantaController();
const moderacaoController = new ModeracaoController();

router.get('/', plantaController.buscarPlantas.bind(plantaController));
router.get('/proximas', plantaController.buscarPlantasProximas.bind(plantaController));
router.get('/:id', plantaController.obterPlantaPorId.bind(plantaController));

// PROTECTED ROUTE
router.post(
  '/', 
  authenticate, 
  upload.array('images', 5),
  (req: any, res: any, next: any) => {
    next();
  },
  plantaController.cadastrarPlanta.bind(plantaController)
);

router.put('/:id', authenticate, plantaController.atualizarPlanta.bind(plantaController));
router.delete('/:id', authenticate, plantaController.deletarPlanta.bind(plantaController));
router.post('/:id/avaliar', authenticate, plantaController.avaliarPlanta.bind(plantaController));

// PROTECTED ROUTE
router.get(
  '/pendentes/listar',
  authenticate,
  authorize(PerfilUsuario.MODERADOR, PerfilUsuario.ADMIN),
  moderacaoController.listarPendentes.bind(moderacaoController)
);

router.put(
  '/pendentes/:registroId/aprovar',
  authenticate,
  authorize(PerfilUsuario.MODERADOR, PerfilUsuario.ADMIN),
  moderacaoController.aprovarRegistro.bind(moderacaoController)
);

router.put(
  '/pendentes/:registroId/rejeitar',
  authenticate,
  authorize(PerfilUsuario.MODERADOR, PerfilUsuario.ADMIN),
  moderacaoController.rejeitarRegistro.bind(moderacaoController)
);

router.put(
  '/pendentes/:registroId/analise',
  authenticate,
  authorize(PerfilUsuario.MODERADOR, PerfilUsuario.ADMIN),
  moderacaoController.colocarEmAnalise.bind(moderacaoController)
);

export default router;