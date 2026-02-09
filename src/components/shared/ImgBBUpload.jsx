'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Loader2, Pencil } from 'lucide-react';
import Image from 'next/image';
import SmartImage from './SmartImage';
import { toast } from 'react-hot-toast';

import { api } from '@/lib/api';
import imageCompression from 'browser-image-compression';

const ImgBBUpload = ({ onUpload, defaultImage, label = "Upload Image", required = false }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultImage || '');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

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
        maxSizeMB: 0.5,         // Compress to max 500KB
        maxWidthOrHeight: 1920, // Max 1920px
        useWebWorker: true,
        onProgress: (p) => {
          const progress = Math.round(p);
          setProgress(Math.round(progress / 2)); // First 50% for compression
          toast.loading(`Optimizing image... ${progress}%`, { id: toastId });
        }
      };

      const compressedFile = await imageCompression(file, options);
      
      // 2. Direct Client-Side Upload (Zero Server Load)
      toast.loading('Uploading directly to cloud...', { id: toastId });
      
      const formData = new FormData();
      formData.append('image', compressedFile);
      
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error('Missing NEXT_PUBLIC_IMGBB_API_KEY');
      }

      // Direct upload to ImgBB API
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data && data.success) {
        const url = data.data.url;
        setPreview(url);
        onUpload(url);
        toast.success('Professional upload complete', { id: toastId });
      } else {
        throw new Error(data?.message || 'Upload failed');
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
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
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
            <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-lg border border-emerald-400/30">
              SAVED
            </div>
          </div>
        ) : (
          <div 
            onClick={triggerFileInput}
            className={`relative w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-brand-gold/50 hover:bg-white/5 transition-all group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
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
