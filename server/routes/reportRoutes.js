import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Apply auth and admin check to all routes
router.use(auth);
router.use(isAdmin);

// Get report statistics
router.get('/stats', (req, res) => {
  // Mock data for now - can be implemented later
  res.json({
    statusStats: [],
    recentReports: 0
  });
});

export default router;
