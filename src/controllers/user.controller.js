import prisma from '../config/prismaClient.js'
import bcryptjs, { hash } from 'bcryptjs';

const DB = []

export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          select: { id: true, content: true, mediaUrl: true, createdAt: true }
        },
        followers: {
          select: {
            follower: {
              select: { id: true, username: true }
            }
          }
        },
        following: {
          select: {
            following: {
              select: { id: true, username: true }
            }
          }
        },
        _count: {
          select: { followers: true, following: true }
        }
      }
    });

    if (!profile) {
      throw new AppError('User not found', 404);
    }

    const response = {
      ...profile,
      posts: profile.posts,
      followersCount: profile._count.followers,
      followingCount: profile._count.following,
      followers: profile.followers.map(f => f.follower),
      following: profile.following.map(f => f.following)
    };

    // Remove unwanted fields
    delete response._count;
    delete response.password; // Explicit removal even if not selected

    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async(req, res, next) => {
    try {
        const userId = req.params.id
        const currentUserId = req.userId
    
        const profile = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            _count: {
              select: {
                followers: true,
                following: true
              }
            }
          }
        });
    
        if(!profile){
            return res.status(404).json({"msg": "User not found"})
        }
    
        const isFollowing = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUserId,
              followingId: userId
            }
          }
        });
    
        const response = {
          ...profile,
          followersCount: profile._count.followers,
          followingCount: profile._count.following,
          isFollowing: !!isFollowing
        };
    
        if (isFollowing) {
          response.posts = await prisma.post.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              content: true,
              mediaUrl: true,
              createdAt: true
            }
          });
        }
        
        res.json(response)
    } catch (error) {
        console.log(error);
        
        next(err)
    }
}

export const createUser = async(req, res, next) => {
    try {
        const { email, username, password } = req.body
        const hashedPassword = await bcryptjs.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        })
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        if(error.code === 'P2002') {
            error.status = 409
        }
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
   try {
       const { currentPassword, newPassword } = req.body;
       
       const user = await prisma.user.findUnique({ where: { id: req.userId } });
       if (!await bcryptjs.compare(currentPassword, user.password)) {
           return res.status(400).json({ error: 'Current password is incorrect' });
       }
       
       const hashedNewPassword = await bcryptjs.hash(newPassword, 12);
       
       await prisma.user.update({
           where: { id: req.userId },
           data: { password: hashedNewPassword }
       });
       
       res.json({ message: 'Password updated successfully' });
   } catch (error) {
       console.log(error);
       next(error);
   }
};