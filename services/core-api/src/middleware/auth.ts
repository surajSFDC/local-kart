import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { logger } from '../config/logger.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'AUTHENTICATION_ERROR', 
          message: 'Access token required' 
        } 
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET not configured');
      return res.status(500).json({ 
        success: false, 
        error: { 
          code: 'INTERNAL_SERVER_ERROR', 
          message: 'Server configuration error' 
        } 
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Verify user still exists and is active
    const user = await User.findById(decoded.userId).select('_id email role isActive');
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'AUTHENTICATION_ERROR', 
          message: 'Invalid or inactive user' 
        } 
      });
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(403).json({ 
      success: false, 
      error: { 
        code: 'AUTHENTICATION_ERROR', 
        message: 'Invalid token' 
      } 
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'AUTHENTICATION_ERROR', 
          message: 'Authentication required' 
        } 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'AUTHORIZATION_ERROR', 
          message: 'Insufficient permissions' 
        } 
      });
    }

    next();
  };
};