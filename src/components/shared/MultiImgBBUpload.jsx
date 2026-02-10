'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Loader2, Plus, Image as ImageIcon } from 'lucide-react';
import SmartImage from './SmartImage';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import imageCompression from 'browser-image-compression';

const MultiImgBBUpload = ({ 
  onImagesChange, 
  defaultImages = [], 
  label = "Upload Images", 
  required = false, 
  isSaved = false,
  maxFiles = 10 
}) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState({}); // Map of filename -> percent
  const fileInputRef = useRef(null);
  const sessionUploadedRef = useRef(new Set()); // Track IDs uploaded in this session

  // Initialize with default images
  useEffect(() => {
    if (defaultImages && defaultImages.length > 0) {
      // Ensure we don't overwrite if we already have local state that might be newer
      // But usually defaultImages comes from parent on mount or fetch.
      // We'll trust the parent, but we need to unify format.
      setImages(defaultImages);
    }
  }, [defaultImages]);

  // Pass images back to parent whenever they change
  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

  // Cleanup on Unmount
  useEffect(() => {
    return () => {
      // If we uploaded something in this session and it wasn't 'saved' (submitted)
      if (sessionUploadedRef.current.size > 0 && !isSaved) {
        console.log('[MultiImgBBUpload] Cleaning up unsaved session images:', sessionUploadedRef.current.size);
        sessionUploadedRef.current.forEach(id => {
          api.uploads.delete(id).catch(err => {
            console.error('[MultiImgBBUpload] Cleanup failed:', err);
          });
        });
      }
    };
  }, [isSaved]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    const toastId = toast.loading('Processing images...');

    try {
      // Process files sequentially or with limited concurrency to avoid browser lag
      const newImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        // 1. Compression
        try {
            setProgress(prev => ({ ...prev, [file.name]: 10 }));
            
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: 'image/webp'
            });

            setProgress(prev => ({ ...prev, [file.name]: 50 }));

            // 2. Upload to Public Endpoint (Fast)
            const formData = new FormData();
            formData.append('image', compressedFile, compressedFile.name || `image-${Date.now()}.webp`);

            const response = await api.uploads.uploadPublic(formData);

            if (response && response.success) {
                const urlData = response.data.url;
                const imageObj = typeof urlData === 'object' ? urlData : { 
                    url: urlData, 
                    id: response.data.metadata?.delete?.id || null 
                };

                // Track ID for cleanup
                if (imageObj.id || (typeof urlData === 'object' && urlData.id)) {
                    sessionUploadedRef.current.add(imageObj.id || urlData.id);
                }

                newImages.push(imageObj);
                setProgress(prev => ({ ...prev, [file.name]: 100 }));
            }
        } catch (err) {
            console.error(`Failed to upload ${file.name}:`, err);
            toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (newImages.length > 0) {
        setImages(prev => [...prev, ...newImages]);
        toast.success(`Successfully uploaded ${newImages.length} images`, { id: toastId });
      } else {
        toast.dismiss(toastId);
      }

    } catch (error) {
      console.error('Batch upload error:', error);
      toast.error('Upload failed', { id: toastId });
    } finally {
      setUploading(false);
      setProgress({});
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (index) => {
    const target = images[index];
    const imageId = (typeof target === 'object' && target.id) ? target.id : null;

    // Optimistically remove from UI
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    // If it has an ID, try to delete from server
    if (imageId) {
        try {
            await api.uploads.delete(imageId);
            sessionUploadedRef.current.delete(imageId);
            toast.success('Image deleted from cloud');
        } catch (err) {
            console.error('Failed to delete image:', err);
            // Don't add it back to UI, just log error
        }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest font-sans italic">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-xs text-zinc-500">
            {images.length} / {maxFiles} images
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Upload Trigger Card */}
        {images.length < maxFiles && (
            <div 
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`aspect-square relative rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                <div className="p-3 bg-white/5 rounded-full mb-2 group-hover:bg-brand-gold/20 group-hover:text-brand-gold transition-colors">
                    {uploading ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                </div>
                <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200">Add Images</span>
            </div>
        )}

        {/* Image List */}
        {images.map((img, i) => {
            const src = typeof img === 'string' ? img : (img.url || img.original);
            return (
                <div key={i} className="aspect-square relative rounded-xl overflow-hidden bg-zinc-900 border border-white/10 group">
                    <SmartImage 
                        src={src} 
                        alt={`Upload ${i}`}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleRemove(i)}
                            className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-transform hover:scale-110"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Badge for stored image type if useful */}
                    {/* <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-[10px] text-white rounded">
                        {typeof img === 'string' ? 'URL' : 'OBJ'}
                    </div> */}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default MultiImgBBUpload;
