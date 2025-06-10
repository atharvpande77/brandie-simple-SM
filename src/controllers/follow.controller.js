import prisma from '../config/prismaClient.js';

export const followUser = async (req, res, next) => {
  try {
    if (req.userId === req.params.userId) {
    //   throw new AppError('Cannot follow yourself', 400);
      return res.status(400).json({"msg": "Cannot follow yourself!"})
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: req.userId,
        followingId: req.params.userId
      },
      include: {
        following: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.status(201).json(follow);
  } catch (err) {
    if (err.code === 'P2002') {
      err.message = 'Already following this user';
      return res.status(409).json({"msg": "already following this user!"})
    }
    console.log(err)
    
    next(err);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId: req.params.userId
        }
      }
    });
    res.status(204).end();
  } catch (err) {
    if (err.code === 'P2025') {
      err.message = 'Not currently following this user';
    }
    next(err);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: req.params.userId },
      select: {
        id: true,
        createdAt: true,
        follower: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    res.json(followers);
  } catch (err) {
    next(err);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: req.params.userId },
      select: {
        id: true,
        createdAt: true,
        following: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    res.json(following);
  } catch (err) {
    next(err);
  }
};