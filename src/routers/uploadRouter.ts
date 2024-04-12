import express from 'express';
import { uploadImage } from '../controllers/uploads';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), uploadImage);

export default router;