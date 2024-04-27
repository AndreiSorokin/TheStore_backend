import { Request, Response, NextFunction } from 'express';
import { uploadImageToCloudinary } from '../services/uploads';
import { InternalServerError } from '../errors/ApiError';

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
   if (!req.file) {
      return res.status(400).send('No file uploaded.');
   }
   try {
      const fileName = req.file.originalname;
      const fileBuffer = req.file.buffer;
      const imageUrl = await uploadImageToCloudinary(fileBuffer, fileName);
      res.json({ imageUrl });
   } catch (error) {
      next(new InternalServerError());
   }
};