import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const createPost = async (req, res) => {
  try {
    console.log('\n=== CREATE POST REQUEST ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('User:', req.user ? req.user._id : 'No user');
    
    const {
      title,
      body,
      type = "text",
      tags,
      categories,
      status = "published",
      scheduledAt,
      videoStart,
      videoEnd,
      articleContent
    } = req.body;

    // Validate required fields
    if (!title || !body) {
      console.log('Validation failed: Missing title or body');
      return res.status(400).json({ error: "Title and body are required" });
    }

    if (!req.user || !req.user._id) {
      console.log('Error: No authenticated user');
      return res.status(401).json({ error: "Authentication required" });
    }

    // Normalize tags and categories
    const normalizeTags = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(Boolean).map(v => String(v).trim());
      return String(val).split(",").map(v => v.trim()).filter(Boolean);
    };

    const postData = {
      author: req.user._id,
      title,
      body,
      type,
      tags: normalizeTags(tags),
      categories: normalizeTags(categories),
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    };

    // Handle file uploads based on type
    if (req.files) {
      console.log('Processing uploaded files:', Object.keys(req.files));
      
      if (type === "image" && req.files.image) {
        postData.images = req.files.image.map(file => `/uploads/posts/images/${file.filename}`);
        console.log('Images added:', postData.images);
      } else if (type === "video" && req.files.video && req.files.video[0]) {
        postData.video = `/uploads/posts/videos/${req.files.video[0].filename}`;
        if (videoStart) postData.videoStart = Number(videoStart);
        if (videoEnd) postData.videoEnd = Number(videoEnd);
        console.log('Video added:', postData.video);
      } else if (type === "document" && req.files.document && req.files.document[0]) {
        postData.document = `/uploads/posts/documents/${req.files.document[0].filename}`;
        console.log('Document added:', postData.document);
      }
    }

    // Handle article content
    if (type === "article" && articleContent) {
      postData.articleContent = articleContent;
      console.log('Article content added');
    }

    console.log('Creating post with data:', postData);
    const post = await Post.create(postData);
    console.log('Post created successfully:', post._id);

    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    console.error('Create post error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const filter = { status: "published", hidden: false }; // Don't show hidden posts

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate("author", "name username email avatarUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ data: posts, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { author: req.user._id };

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate("author", "name username email avatarUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ data: posts, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author');
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if already liked
    const alreadyLiked = post.likes.includes(req.user._id);
    
    if (alreadyLiked) {
      return res.status(400).json({ error: "Post already liked" });
    }

    post.likes.push(req.user._id);
    await post.save();

    // Create notification for post author (don't notify yourself)
    if (String(post.author._id) !== String(req.user._id)) {
      await Notification.create({
        recipient: post.author._id,
        sender: req.user._id,
        type: 'like',
        post: post._id
      });
    }

    res.json({ message: "Post liked", likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if not liked
    const likeIndex = post.likes.indexOf(req.user._id);
    
    if (likeIndex === -1) {
      return res.status(400).json({ error: "Post not liked yet" });
    }

    post.likes.splice(likeIndex, 1);
    await post.save();

    res.json({ message: "Post unliked", likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id).populate('author');
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = {
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    // Create notification for post author (don't notify yourself)
    if (String(post.author._id) !== String(req.user._id)) {
      await Notification.create({
        recipient: post.author._id,
        sender: req.user._id,
        type: 'comment',
        post: post._id,
        comment: text.trim().substring(0, 100) // Store first 100 chars
      });
    }

    // Populate user info for the response
    const populatedPost = await Post.findById(post._id)
      .populate('comments.user', 'name username email avatarUrl');

    const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json({ 
      message: "Comment added", 
      comment: addedComment,
      commentsCount: post.comments.length 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Only comment owner or post owner can delete
    if (!comment.user.equals(req.user._id) && !post.author.equals(req.user._id)) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    comment.remove();
    await post.save();

    res.json({ message: "Comment deleted", commentsCount: post.comments.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single post with full details
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name username email avatarUrl bio')
      .populate('comments.user', 'name username email avatarUrl');
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('comments.user', 'name username email avatarUrl');
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ comments: post.comments, total: post.comments.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
