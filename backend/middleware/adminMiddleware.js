import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin rights required'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying admin status'
    });
  }
};

export const validateAdminCreation = (req, res, next) => {
  const adminSecretKey = req.headers['x-admin-key'];
  
  if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Invalid admin creation key'
    });
  }
  
  next();
};
