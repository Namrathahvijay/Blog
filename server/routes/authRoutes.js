import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "User already exists" });

    const user = await User.create({ 
      firstName, 
      lastName, 
      name: `${firstName} ${lastName}`,
      email, 
      password, 
      dateOfBirth 
    });
    
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { 
        id: user._id, 
        _id: user._id,
        firstName, 
        lastName,
        name: `${firstName} ${lastName}`,
        email, 
        dateOfBirth,
        avatarUrl: user.avatarUrl
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Signup
router.post("/admin-signup", async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    // Verify admin code
    const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || "ADMIN2024SECRET";
    if (adminCode !== ADMIN_SECRET_CODE) {
      return res.status(403).json({ error: "Invalid admin authorization code" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create admin user
    const user = await User.create({ 
      name,
      email, 
      password,
      role: 'admin'
    });
    
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { 
        id: user._id, 
        _id: user._id,
        name,
        email,
        role: 'admin',
        avatarUrl: user.avatarUrl
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    console.log('\n=== LOGIN REQUEST ===');
    console.log('Body:', req.body);
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ error: "Email/username and password required" });
    }

    console.log('Searching for user:', emailOrUsername);
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log('User found:', user.email);
    const passwordMatch = await user.matchPassword(password);
    console.log('Password match:', passwordMatch);

    if (passwordMatch) {
      const token = generateToken(user._id);
      console.log('Login successful, token generated');
      res.json({
        token,
        user: { 
          id: user._id, 
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name || `${user.firstName} ${user.lastName}`,
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          role: user.role || 'user'
        },
      });
    } else {
      console.log('Password mismatch');
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    res.json({ 
      user: {
        id: req.user._id,
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        name: req.user.name || `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        username: req.user.username,
        avatarUrl: req.user.avatarUrl,
        bio: req.user.bio
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate token for account switching
router.post("/accounts/validate-token", async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ valid: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.json({ valid: false, error: "User not found" });
    }
    
    res.json({ valid: true, user: {
      id: user._id,
      _id: user._id,
      name: user.name || `${user.firstName} ${user.lastName}`,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl
    }});
  } catch (err) {
    res.json({ valid: false, error: err.message });
  }
});

// Change password
router.put("/password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!await bcrypt.compare(currentPassword, req.user.password))
    return res.status(400).json({ error: "Incorrect current password" });

  req.user.password = await bcrypt.hash(newPassword, 10);
  await req.user.save();
  res.json({ success: true });
});

// Delete account
router.delete("/account", auth, async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.json({ success: true });
});

export default router;
