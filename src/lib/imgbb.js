import imageCompression from 'browser-image-compression';
import logger from '../utils/logger';
import { api } from '@/lib/api';

// ImgBB Upload Utility for Client-Side (Proxied via Backend)

export const uploadToImgBB = async (file, signal) => {
  try {
    // Compression Options
    const options = {
      maxSizeMB: 0.8,         // Reduced to 0.8MB for faster uploads
      maxWidthOrHeight: 1920, // Standard 1080p width
      useWebWorker: true,
      initialQuality: 0.8,
      fileType: 'image/webp'  // Convert to WebP for better compression
    };

    let fileToUpload = file;

    // Only compress if it's an image and larger than a reasonable threshold (e.g., 200KB)
    if (file.type.startsWith('image/') && file.size > 200 * 1024) {
      try {
        fileToUpload = await imageCompression(file, options);
        console.log(`[Compression] Reduced size from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
      } catch (compressionError) {
        console.error('Compression failed, uploading original file:', compressionError);
        fileToUpload = file;
      }
    }

    const formData = new FormData();
    formData.append('image', fileToUpload);
    // Key is now handled by backend

    const response = await api.uploads.uploadPublic(formData, { signal });

    if (response && response.success) {
      const urlData = response.data.url;
      // Handle both object (from backend middleware) and string cases
      // Backend imgbbMiddleware returns { url, delete_url, id } for non-optimized uploads
      return (typeof urlData === 'string') ? urlData : (urlData.url || urlData.original);
    } else {
      console.error('[Frontend ImgBB] Upload response unsuccessful:', response);
      throw new Error(response?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('[Frontend ImgBB] Catch error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    logger.error('ImgBB upload failed', error);
    throw error;
  }
};
