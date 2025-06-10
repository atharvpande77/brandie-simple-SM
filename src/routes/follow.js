import express from 'express'
import { authenticate } from '../middleware/auth.js';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} from '../controllers/follow.controller.js';

const router = express.Router()
router.use(authenticate)

router.post('/:userId', followUser);
router.delete('/:userId', unfollowUser);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);

export default router