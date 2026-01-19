import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default

// Ensure upload directories exist
const dirs = [
  path.join(uploadDir, 'artworks'),
  path.join(uploadDir, 'thumbnails'),
  path.join(uploadDir, 'profiles'),
  path.join(uploadDir, 'blog')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    let folder = 'artworks';

    if (req.path.includes('profile')) {
      folder = 'profiles';
    } else if (req.path.includes('blog')) {
      folder = 'blog';
    }

    cb(null, path.join(uploadDir, folder));
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize
  }
});

export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 10);
