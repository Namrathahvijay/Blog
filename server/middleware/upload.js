import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Avatar storage
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/avatars";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Post media storage
const postMediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = "uploads/posts";
    
    if (file.fieldname === "image") {
      dir = "uploads/posts/images";
    } else if (file.fieldname === "video") {
      dir = "uploads/posts/videos";
    } else if (file.fieldname === "document") {
      dir = "uploads/posts/documents";
    }
    
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// File filter for post media
const postMediaFilter = (req, file, cb) => {
  const allowedImages = /jpeg|jpg|png|gif|webp/;
  const allowedVideos = /mp4|webm|ogg|mov/;
  const allowedDocs = /pdf|doc|docx|txt/;
  
  const extname = path.extname(file.originalname).toLowerCase().substring(1);
  
  if (file.fieldname === "image" && allowedImages.test(extname)) {
    cb(null, true);
  } else if (file.fieldname === "video" && allowedVideos.test(extname)) {
    cb(null, true);
  } else if (file.fieldname === "document" && allowedDocs.test(extname)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}: ${extname}`));
  }
};

export const uploadAvatar = multer({ storage: avatarStorage });

export const uploadPostMedia = multer({
  storage: postMediaStorage,
  fileFilter: postMediaFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});
