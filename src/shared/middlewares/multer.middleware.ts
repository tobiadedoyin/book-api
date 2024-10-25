import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (_req: Request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.svg'];

    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Only image files with .jpg, .jpeg, .png, or .svg extensions are allowed!'
        ) as unknown as null,
        false
      );
    }
  },
}).single('cover_image');

export default async function ImageUploadMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .send({ error: err?.message || 'An unknown error occurred' });
    } else if (err) {
      // Handle other errors
      return res.status(400).send({ error: err.message });
    }
    return next();
  });
}
