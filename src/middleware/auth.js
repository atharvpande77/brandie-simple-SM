import { verifyAccessToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    try {
        const decoded = verifyAccessToken(token);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid access token' });
    }
};