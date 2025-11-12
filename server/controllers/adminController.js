import User from '../models/User.js';
import Post from '../models/Post.js';

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ 
      data: users, 
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts (admin only)
export const getAllPostsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name username email avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Rename author to user for frontend compatibility
    const postsWithUser = posts.map(post => ({
      ...post,
      user: post.author
    }));

    res.json({ 
      data: postsWithUser, 
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Suspend/unsuspend user
export const suspendUser = async (req, res) => {
  try {
    const { suspended } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { suspended },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Optionally delete user's posts
    await Post.deleteMany({ author: req.params.id });

    res.json({ message: 'User and their posts deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hide/unhide post
export const hidePost = async (req, res) => {
  try {
    const { hidden } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { hidden },
      { new: true }
    ).populate('author', 'name username email avatarUrl');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Rename author to user for frontend
    const postWithUser = {
      ...post.toObject(),
      user: post.author
    };

    res.json(postWithUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete post (admin)
export const deletePostAdmin = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get dashboard stats
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const activeUsers = await User.countDocuments({ suspended: false });
    const hiddenPosts = await Post.countDocuments({ hidden: true });

    res.json({
      totalUsers,
      totalPosts,
      activeUsers,
      hiddenPosts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
