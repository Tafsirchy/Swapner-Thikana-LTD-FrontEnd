import imageCompression from 'browser-image-compression';
import logger from './logger';

// ImgBB Upload Utility for Client-Side
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '3b910fac635158436c2ae4e967564ef2'; // Fallback to current valid key

export const uploadToImgBB = async (file, signal) => {
  try {
    // Compression Options
    const options = {
      maxSizeMB: 2,           // Max size 2MB
      maxWidthOrHeight: 2560, // Max dimension 2560px
      useWebWorker: true,
      initialQuality: 0.8
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
    formData.append('key', IMGBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
      signal
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error) {
    logger.error('ImgBB upload failed', error);
    throw error;
  }
};
