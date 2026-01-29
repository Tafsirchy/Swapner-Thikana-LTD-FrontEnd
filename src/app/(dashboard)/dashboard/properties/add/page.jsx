'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, DollarSign, Image as ImageIcon, 
  CheckCircle, ArrowRight, ArrowLeft, Upload, X, PlusCircle 
} from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

const AddPropertyPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    listingType: 'sale',
    propertyType: 'apartment',
    price: '',
    location: {
      address: '',
      city: 'Dhaka',
      area: '',
      latitude: '',
      longitude: ''
    },
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [],
    features: []
  });

  const steps = [
    { title: 'Basic Info', icon: Building2 },
    { title: 'Location', icon: MapPin },
    { title: 'Details', icon: DollarSign },
    { title: 'Images', icon: ImageIcon },
  ];

  // Validation function
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          toast.error('Property title is required');
          return false;
        }
        if (!formData.description.trim()) {
          toast.error('Property description is required');
          return false;
        }
        return true;
      case 2:
        if (!formData.location.address.trim()) {
          toast.error('Address is required');
          return false;
        }
        if (!formData.location.area.trim()) {
          toast.error('Area/Neighborhood is required');
          return false;
        }
        return true;
      case 3:
        if (!formData.price || formData.price <= 0) {
          toast.error('Valid price is required');
          return false;
        }
        if (!formData.area || formData.area <= 0) {
          toast.error('Valid area is required');
          return false;
        }
        if (!formData.bedrooms || formData.bedrooms <= 0) {
          toast.error('Number of bedrooms is required');
          return false;
        }
        if (!formData.bathrooms || formData.bathrooms <= 0) {
          toast.error('Number of bathrooms is required');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsLoading(true);
    const toastId = toast.loading('Starting image optimization...');
    
    const uploadedUrls = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        toast.loading(`Optimizing image ${i + 1}/${files.length}...`, { id: toastId });
        
        // 1. Compression
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        });

        // 2. Upload
        toast.loading(`Uploading image ${i + 1}/${files.length}...`, { id: toastId });
        const formData = new FormData();
        formData.append('image', compressedFile);
        
        const response = await axios.post(
          'https://api.imgbb.com/1/upload',
          formData,
          { params: { key: '615ab9305e7a47395335aa3d18655815' } }
        );
        
        if (response.data.success) {
          uploadedUrls.push(response.data.data.url);
        }
      }
      
      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} images processed successfully`, { id: toastId });
    } catch (error) {
      console.error('Image processing failed:', error);
      toast.error('Some images failed to upload', { id: toastId });
    } finally {
      setIsLoading(false);
      e.target.value = ''; // Reset
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        images: images // Send the array of URLs
      };

      const result = await api.properties.create(propertyData);
      
      if (!result.success && !result.data?.property?._id) {
         // Some APIs return success:true or the object directly. 
         // Assuming api.js interceptor returns response.data directly (which is the body).
         // If body is { success: true, data: { ... } }
         // Let's rely on api success or catch block.
      }

      toast.success('Property created successfully!');
      router.push('/dashboard/properties');
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Failed to create property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <PlusCircle size={32} className="text-brand-gold" />
          Add New Property
        </h1>
        <div className="text-sm text-zinc-400">
           Step <span className="text-brand-gold font-bold">{currentStep}</span> of {steps.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between relative bg-white/5 p-1 rounded-2xl">
        <div className="absolute left-0 h-full bg-brand-gold/10 w-full rounded-2xl z-0 transition-all duration-500" 
             style={{ width: `${(currentStep - 1) / (steps.length - 1) * 100}%` }}></div>
        {steps.map((step, i) => (
           <div 
              key={i} 
              className={`flex-1 flex items-center justify-center gap-2 py-3 relative z-10 transition-all ${
                 currentStep === i + 1 
                    ? 'text-brand-gold font-bold' 
                    : currentStep > i + 1
                    ? 'text-emerald-500' // Completed
                    : 'text-zinc-500'
              }`}
           >
              {currentStep > i + 1 ? <CheckCircle size={18} /> : <step.icon size={18} />}
              <span className="hidden md:inline">{step.title}</span>
           </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white/5 border border-white/5 rounded-3xl p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div 
               key="step1" 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
            >
               <h2 className="text-xl font-bold text-zinc-100 mb-6">Basic Information</h2>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Property Title</label>
                     <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Ex. Luxury Apartment in Gulshan"
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Description</label>
                     <textarea 
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Detailed description of the property..."
                        rows={5}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50 resize-none"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Listing Type</label>
                        <select 
                           value={formData.listingType}
                           onChange={(e) => handleInputChange('listingType', e.target.value)}
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50"
                        >
                           <option value="sale">For Sale</option>
                           <option value="rent">For Rent</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Property Type</label>
                        <select 
                           value={formData.propertyType}
                           onChange={(e) => handleInputChange('propertyType', e.target.value)}
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50"
                        >
                           <option value="apartment">Apartment</option>
                           <option value="villa">Luxury Villa</option>
                           <option value="duplex">Duplex</option>
                           <option value="office">Office Space</option>
                        </select>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div 
               key="step2" 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
            >
               <h2 className="text-xl font-bold text-zinc-100 mb-6">Location Details</h2>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Full Address</label>
                     <input 
                        type="text" 
                        value={formData.location.address}
                        onChange={(e) => handleLocationChange('address', e.target.value)}
                        placeholder="Ex. House 12, Road 4, Block B"
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">City</label>
                        <select 
                           value={formData.location.city}
                           onChange={(e) => handleLocationChange('city', e.target.value)}
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50"
                        >
                           <option value="Dhaka">Dhaka</option>
                           <option value="Chattogram">Chattogram</option>
                           <option value="Sylhet">Sylhet</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Area / Neighborhood</label>
                        <input 
                           type="text" 
                           value={formData.location.area}
                           onChange={(e) => handleLocationChange('area', e.target.value)}
                           placeholder="Ex. Gulshan 2"
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50"
                        />
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div 
               key="step3" 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
            >
               <h2 className="text-xl font-bold text-zinc-100 mb-6">Property Details</h2>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Price (BDT)</label>
                     <input 
                        type="number" 
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="Ex. 25000000"
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50 font-mono"
                     />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Area (Sq Ft)</label>
                        <input 
                           type="number" 
                           value={formData.area}
                           onChange={(e) => handleInputChange('area', e.target.value)}
                           placeholder="Ex. 2500"
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Bedrooms</label>
                        <input 
                           type="number" 
                           value={formData.bedrooms}
                           onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Bathrooms</label>
                        <input 
                           type="number" 
                           value={formData.bathrooms}
                           onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50"
                        />
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div 
               key="step4" 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
            >
               <h2 className="text-xl font-bold text-zinc-100 mb-6">Upload Images</h2>
               
               <div className="border-2 border-dashed border-white/10 rounded-3xl p-8 text-center hover:border-brand-gold/50 transition-colors bg-white/5 cursor-pointer relative">
                  <input 
                     type="file" 
                     multiple 
                     accept="image/*"
                     onChange={handleImageUpload}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-3 pointer-events-none">
                     <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                        <Upload size={32} />
                     </div>
                     <p className="text-zinc-300 font-bold">Click to upload or drag images here</p>
                     <p className="text-zinc-500 text-sm">JPG, PNG or WEBP (Max 5MB each)</p>
                  </div>
               </div>

               {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                     {images.map((img, i) => (
                        <div key={i} className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden group">
                           <Image src={img} alt="" fill className="object-cover" />
                           <button 
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all"
                           >
                              <X size={16} />
                           </button>
                        </div>
                     ))}
                  </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
         <button 
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
         >
            <ArrowLeft size={18} /> Back
         </button>

         {currentStep < 4 ? (
            <button 
               onClick={() => {
                 if (validateStep(currentStep)) {
                   setCurrentStep(prev => prev + 1);
                 }
               }}
               className="flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/20"
            >
               Next Step <ArrowRight size={18} />
            </button>
         ) : (
            <button 
               onClick={handleSubmit}
               disabled={isLoading}
               className="flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
               {isLoading ? 'Creating Property...' : 'Submit Property'}
            </button>
         )}
      </div>
    </div>
  );
};

export default AddPropertyPage;
