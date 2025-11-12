import express from "express";
import { auth } from "../middleware/auth.js";
import { uploadPostMedia } from "../middleware/upload.js";

import { 
  createPost, 
  getAllPosts, 
  getMyPosts, 
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  getPostById,
  getComments
} from "../controllers/postController.js";

const router = express.Router();

// Post media upload fields configuration
const postUpload = uploadPostMedia.fields([
  { name: 'image', maxCount: 10 },
  { name: 'video', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]);

router.get("/", getAllPosts);                       // Get all published posts (public)
router.post("/", auth, postUpload, createPost);      // Create post (handles media uploads)
router.get("/my", auth, getMyPosts);                // Get logged-in user's posts
router.get("/:id", getPostById);                    // Get single post by ID
router.delete("/:id", auth, deletePost);            // Delete post

// Like/Unlike routes
router.post("/:id/like", auth, likePost);           // Like a post
router.delete("/:id/like", auth, unlikePost);       // Unlike a post

// Comment routes
router.get("/:id/comments", getComments);           // Get comments for a post
router.post("/:id/comments", auth, addComment);     // Add comment
router.delete("/:id/comments/:commentId", auth, deleteComment); // Delete comment

export default router;
