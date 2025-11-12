import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["text", "image", "video", "document", "article"], 
      default: "text" 
    },
    images: [String], // Array of image URLs
    video: String, // Video URL
    videoStart: Number, // Video start time in seconds
    videoEnd: Number, // Video end time in seconds
    document: String, // Document URL
    articleContent: String, // Rich text content for articles
    tags: [String],
    categories: [String],
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "published"
    },
    scheduledAt: { type: Date, default: null },
    hidden: { type: Boolean, default: false }, // Admin can hide posts
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

// Virtual field for mediaUrl to maintain compatibility
PostSchema.virtual('mediaUrl').get(function() {
  if (this.type === 'image' && this.images && this.images.length > 0) {
    return this.images.length === 1 ? this.images[0] : this.images;
  }
  if (this.type === 'video' && this.video) {
    return this.video;
  }
  if (this.type === 'document' && this.document) {
    return this.document;
  }
  return null;
});

// Ensure virtuals are included in JSON
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

export default mongoose.model("Post", PostSchema);
