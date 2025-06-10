import express from 'express';
import { getUserById, getMyProfile, updateUser, createUser } from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, updatePasswordSchema } from '../schemas.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authenticate, getMyProfile)

router.get('/:id', authenticate, getUserById)

router.post('/', validate(createUserSchema), createUser)

router.patch('/', authenticate, validate(updatePasswordSchema), updateUser);

export default router;
