'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Loader2, Pencil } from 'lucide-react';
import SmartImage from '@/components/shared/SmartImage';

import { toast } from 'react-hot-toast';

import { api } from '@/lib/api';
import imageCompression from 'browser-image-compression';

const ImgBBUpload = ({ onUpload, defaultImage, label = "Upload Image", required = false, isSaved = false }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultImage || '');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const sessionUploadedRef = useRef(null); // Tracks ID uploaded in this session for cleanup

  // Update preview if defaultImage changes (e.g. when loading data in edit mode)
  useEffect(() => {
    if (defaultImage && defaultImage !== preview) {
      setPreview(defaultImage);
    }
  }, [defaultImage, preview]);

  // Cleanup on Unmount (Orphan Prevention)
  useEffect(() => {
    return () => {
      // If we uploaded something in this session and it wasn't 'saved' to DB
      if (sessionUploadedRef.current && !isSaved) {
        console.log('[ImgBBUpload] Cleaning up unsaved session image:', sessionUploadedRef.current);
        api.uploads.delete(sessionUploadedRef.current).catch(err => {
          console.error('[ImgBBUpload] Orphan cleanup failed on unmount:', err);
        });
      }
    };
  }, [isSaved]); // Re-run if isSaved changes to true (which will prevent deletion)

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      // 0. Cleanup Old Image if exists (The Storage Fix)
      if (preview && typeof preview === 'object' && preview.id) {
         console.log('[ImgBBUpload] Cleaning up replaced image:', preview.id);
         api.uploads.delete(preview.id).catch(err => console.error('Cleanup failed:', err));
      } else if (defaultImage && typeof defaultImage === 'object' && defaultImage.id) {
         // If we are replacing the initial image
         api.uploads.delete(defaultImage.id).catch(err => console.error('Initial cleanup failed:', err));
      }

      // 1. Compression (The Performance Boost)
      const toastId = toast.loading('Starting image optimization...');
      
      const options = {
        maxSizeMB: 1,           // Increased to 1MB for better quality/speed balance
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
        onProgress: (p) => {
          const progress = Math.round(p);
          setProgress(Math.round(progress / 2)); 
          toast.loading(`Optimizing image... ${progress}%`, { id: toastId });
        }
      };

      const compressedFile = await imageCompression(file, options);
      
      // 2. Upload via Backend Proxy (Secure)
      toast.loading('Securing upload...', { id: toastId });
      
      const formData = new FormData();
      // Explicitly pass filename to ensure Multer detects it as a file, not just a blob
      formData.append('image', compressedFile, compressedFile.name || `image-${Date.now()}.webp`);
      
      // Use the backend proxy instead of exposing the API key
      const response = await api.uploads.uploadPublic(formData);

      if (response && response.success) {
        const url = response.data.url;
        // Handle object structure from backend if present
        const previewUrl = (typeof url === 'string') ? url : (url.url || url.original);
        const imageId = (typeof url === 'object' && url.id) ? url.id : null;
        
        sessionUploadedRef.current = imageId; // Track for unmount cleanup
        setPreview(previewUrl);
        onUpload(url); // Pass full object or URL depending on what backend returned
        toast.success('Upload complete', { id: toastId });
      } else {
        throw new Error(response?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
      e.target.value = ''; // Allow re-uploading same file
    }
  };

  const handleRemove = async () => {
    // Cleanup from cloud
    const target = preview || defaultImage;
    if (target && typeof target === 'object' && target.id) {
       try {
          toast.loading('Removing from cloud...');
          await api.uploads.delete(target.id);
          toast.success('Removed from storage');
       } catch (err) {
          console.error('Failed to delete from cloud:', err);
       }
    }

    setPreview('');
    onUpload('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest font-sans italic">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative group">
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {preview ? (
          <div className="relative w-full h-64 bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 group-hover:border-brand-gold/50 transition-all shadow-2xl">
            <SmartImage 
              src={preview} 
              alt="Preview" 
              fill 
              className="object-cover"
              unoptimized
            />
            
            {/* Overlay with Controls - High Z-Index to prevent underlap */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px] z-20">
               <button
                 type="button"
                 onClick={triggerFileInput}
                 disabled={uploading}
                 className="p-3.5 bg-brand-gold/10 text-brand-gold rounded-full hover:bg-brand-gold hover:text-royal-deep border border-brand-gold/20 transition-all transform hover:scale-110 active:scale-95 shadow-lg"
                 title="Replace Image"
               >
                 {uploading ? <Loader2 size={20} className="animate-spin" /> : <Pencil size={20} />}
               </button>
               
               <button
                 type="button"
                 onClick={handleRemove}
                 className="p-3.5 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white border border-red-500/20 transition-all transform hover:scale-110 active:scale-95 shadow-lg"
                 title="Delete Image"
               >
                 <X size={20} />
               </button>
            </div>
            
            {/* Success Indicator */}
            <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-lg border border-emerald-400/30 z-20">
              SAVED
            </div>
          </div>
        ) : (
          <div 
            onClick={triggerFileInput}
            className={`relative w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-brand-gold/50 hover:bg-white/5 transition-all group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-zinc-400 group-hover:text-brand-gold transition-colors text-center px-4">
              {uploading ? (
                <>
                  <Loader2 size={40} className="animate-spin mb-4 text-brand-gold" />
                  <p className="text-sm font-bold text-brand-gold">{progress}% Uploading...</p>
                </>
              ) : (
                <>
                  <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:bg-brand-gold/10 transition-colors">
                    <Upload size={32} />
                  </div>
                  <p className="mb-2 text-sm font-bold"><span className="underline">Click to upload</span> or drag and drop</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-40">JPG, PNG, WebP (MAX. 5MB)</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImgBBUpload;
