// routes/index.ts
import { Router } from 'express';
import { signUp } from '../controllers/userController';

const router = Router();

// Definindo a rota POST /signup
router.post('/signup', signUp);

export default router;