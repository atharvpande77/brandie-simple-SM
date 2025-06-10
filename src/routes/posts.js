import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPostSchema } from '../schemas.js'
import { createPost, getPost, deletePost, getUserPosts, getTimelinePosts } from '../controllers/post.controller.js';

const router = express.Router();
router.use(authenticate)

router.post('/', validate(createPostSchema), createPost)
router.get('/:id', getPost)
router.delete('/:id', deletePost);

// User posts and feed
router.get('/user/me', getUserPosts);
router.get('/my/timeline', getTimelinePosts);

export default router