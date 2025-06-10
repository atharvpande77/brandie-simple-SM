import express from 'express';
import { login, refresh } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../schemas.js';

const router = express.Router();

router.post('/', validate(loginSchema), login);
router.post('/refresh', refresh);

export default router;