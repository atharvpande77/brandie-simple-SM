import prisma from '../config/prismaClient.js';

export const createPost = async (req, res, next) => {
  try {
    const post = await prisma.post.create({
      data: {
        content: req.body.content,
        mediaUrl: req.body.mediaUrl,
        authorId: req.userId // From auth middleware
      },
      select: {
        id: true,
        content: true,
        mediaUrl: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        content: true,
        mediaUrl: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({"msg": "Post not found"})
    }

    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    // Verify post belongs to user
    const post = await prisma.post.findUnique({
      where: { id: req.params.id }
    });

    if (!post) {
    //   throw new AppError('Post not found', 404);
      return res.status(404).json({"msg": "Post not found"})
    }

    if (post.authorId !== req.userId) {
    //   throw new AppError('Not authorized to delete this post', 403);
      return res.status(403).json({"msg": "Not authorized to delete this post"})
    }

    await prisma.post.delete({
      where: { id: req.params.id }
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const getTimelinePosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        author: {
          followers: {
            some: {
              followerId: req.userId
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.json(posts);
  } catch (err) {
    next(err);
  }
};