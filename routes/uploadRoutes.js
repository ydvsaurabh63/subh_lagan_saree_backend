import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload single image to Cloudinary
 * @access  Public / Protected
 */
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please provide an image file to upload.' });
    }

    const folder = req.body.folder || 'subh_lagan_sarees';
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload up to 5 images to Cloudinary
 * @access  Public / Protected
 */
router.post('/multiple', upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide image files to upload.' });
    }

    const folder = req.body.folder || 'subh_lagan_sarees/products';
    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer, folder));
    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      images: results.map((r) => ({
        url: r.secure_url,
        public_id: r.public_id,
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;

