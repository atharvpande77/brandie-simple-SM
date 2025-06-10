import bcryptjs from 'bcryptjs';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import prisma from '../config/prismaClient.js';

export const login = async (req, res, next) => {
   try {
       const { email, username, password } = req.body;
       
       const whereClause = username ? { username } : { email };
       const user = await prisma.user.findUnique({ where: whereClause });
       
       if (!user || !await bcryptjs.compare(password, user.password)) {
           return res.status(401).json({ error: 'Invalid credentials' });
       }
       
       const { accessToken, refreshToken } = generateTokens(user.id);
       res.json({ accessToken, refreshToken });
   } catch (error) {
       console.log(error);
       next(error);
   }
};

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const decoded = verifyRefreshToken(refreshToken);
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);
        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};