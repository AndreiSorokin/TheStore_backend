import { Request, Response } from 'express';
import { uploadImageToCloudinary } from '../services/uploads';

export const uploadImage = async (req: Request, res: Response) => {
   if (!req.file) {
      return res.status(400).send('No file uploaded.');
   }
   try {
      const fileName = req.file.originalname;
      const fileBuffer = req.file.buffer;
      const imageUrl = await uploadImageToCloudinary(fileBuffer, fileName);
      res.json({ imageUrl });
   } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).send('Failed to upload image');
   }
};