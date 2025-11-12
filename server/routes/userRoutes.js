import express from "express";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import auth from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";
import { uploadAvatar } from "../middleware/upload.js";

const router = express.Router();

// Search users
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { place: { $regex: q, $options: "i" } }
      ]
    })
    .select("name username email avatarUrl place bio")
    .limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get own profile
router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user });
});

// Get another user's profile
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// Update profile + avatar
router.put("/me", auth, uploadAvatar.single("avatar"), async (req, res) => {
  const updates = req.body;
  if (req.file) updates.avatarUrl = `/uploads/avatars/${req.file.filename}`;
  if (req.body.removeAvatar === "true") updates.avatarUrl = "";

  const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json(updated);
});

// Follow
router.post("/:id/follow", auth, async (req, res) => {
  if (req.user._id.equals(req.params.id))
    return res.status(400).json({ error: "Cannot follow yourself" });

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: req.params.id }});
  const targetUser = await User.findByIdAndUpdate(req.params.id, { $addToSet: { followers: req.user._id }}, { new: true });

  // Create notification for the followed user
  await Notification.create({
    recipient: req.params.id,
    sender: req.user._id,
    type: 'follow'
  });

  res.json({ 
    success: true,
    followersCount: targetUser.followers.length,
    followingCount: targetUser.following.length,
    isFollowing: true
  });
});

// Unfollow
router.post("/:id/unfollow", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id }});
  const targetUser = await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id }}, { new: true });
  
  // Optionally delete the follow notification
  await Notification.deleteOne({
    recipient: req.params.id,
    sender: req.user._id,
    type: 'follow'
  });
  
  res.json({ 
    success: true,
    followersCount: targetUser.followers.length,
    followingCount: targetUser.following.length,
    isFollowing: false
  });
});

// Followers list
router.get("/:id/followers", async (req, res) => {
  const user = await User.findById(req.params.id).populate("followers", "name username avatarUrl place");
  res.json(user.followers);
});

// Following list
router.get("/:id/following", async (req, res) => {
  const user = await User.findById(req.params.id).populate("following", "name username avatarUrl place");
  res.json(user.following);
});

export default router;
