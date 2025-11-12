import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getAllUsers,
  getAllPostsAdmin,
  updateUserRole,
  suspendUser,
  deleteUser,
  hidePost,
  deletePostAdmin,
  getStats
} from '../controllers/adminController.js';

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

// Stats
router.get('/stats', getStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);

// Post management
router.get('/posts', getAllPostsAdmin);
router.put('/posts/:id/hidden', hidePost);
router.delete('/posts/:id', deletePostAdmin);

export default router;
