'use client';

import React, { useState, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

import { api } from '@/lib/api';
import imageCompression from 'browser-image-compression';

const ImgBBUpload = ({ onUpload, defaultImage, label = "Upload Image", required = false }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultImage || '');
  const [progress, setProgress] = useState(0);

  // Update preview if defaultImage changes (e.g. when loading data in edit mode)
  useEffect(() => {
    if (defaultImage && defaultImage !== preview) {
      setPreview(defaultImage);
    }
  }, [defaultImage, preview]);

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

      // 1. Compression (The Performance Boost)
      const toastId = toast.loading('Starting image optimization...');
      
      const options = {
        maxSizeMB: 1,         // Compress to max 1MB
        maxWidthOrHeight: 1920, // Max 1920px
        useWebWorker: true,
        onProgress: (p) => {
          const progress = Math.round(p);
          setProgress(Math.round(progress / 2)); // First 50% for compression
          toast.loading(`Optimizing image... ${progress}%`, { id: toastId });
        }
      };

      const compressedFile = await imageCompression(file, options);
      
      // 2. Upload
      toast.loading('Uploading quality image...', { id: toastId });
      const formData = new FormData();
      formData.append('image', compressedFile);

      const response = await api.uploads.upload(formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const uploadPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(50 + Math.round(uploadPercent / 2)); // Final 50% for network transfer
          toast.loading(`Uploading quality image... ${uploadPercent}%`, { id: toastId });
        }
      });

      // Backend returns { success: true, message: '...', data: { url: '...' } }
      // api interceptor returns response.data
      
      if (response && response.success) {
        // response.data from backend contains { url: ... }
        // Wait, my backend returns: { success: true, message: ..., data: { url: ... } }
        // api.js interceptor returns `response.data`.
        // So `response` here IS `response.data` from axios (which is the backend JSON body).
        
        const url = response.data.url;
        setPreview(url);
        onUpload(url);
        toast.success('Professional upload complete', { id: toastId });
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

  const handleRemove = () => {
    setPreview('');
    onUpload('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest font-sans italic">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative group">
        {preview ? (
          <div className="relative w-full h-64 bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 group-hover:border-brand-gold/50 transition-all">
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
               <button
                 type="button"
                 onClick={handleRemove}
                 className="p-3 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white border border-red-500/20 transition-all"
               >
                 <X size={20} />
               </button>
            </div>
            
            {/* Success Indicator */}
            <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Uploaded
            </div>
          </div>
        ) : (
          <label className="relative w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-brand-gold/50 hover:bg-white/5 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-zinc-400 group-hover:text-brand-gold transition-colors">
              {uploading ? (
                <>
                  <Loader2 size={40} className="animate-spin mb-4" />
                  <p className="text-sm font-bold text-brand-gold">{progress}% Uploading...</p>
                </>
              ) : (
                <>
                  <Upload size={40} className="mb-4" />
                  <p className="mb-2 text-sm font-bold"><span className="underline">Click to upload</span> or drag and drop</p>
                  <p className="text-xs opacity-60">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImgBBUpload;
