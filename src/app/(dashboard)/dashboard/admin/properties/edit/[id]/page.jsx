'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, DollarSign, Image as ImageIcon, 
  CheckCircle, ArrowRight, ArrowLeft, Upload, X, Save, Loader2 
} from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

const EditPropertyPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    listingType: 'sale',
    propertyType: 'apartment',
    status: 'pending',
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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await api.properties.getById(id);
        const property = response.data.property;
        
        setFormData({
          title: property.title || '',
          description: property.description || '',
          listingType: property.listingType || 'sale',
          propertyType: property.propertyType || 'apartment',
          status: property.status || 'pending',
          price: property.price || '',
          location: {
            address: property.location?.address || '',
            city: property.location?.city || 'Dhaka',
            area: property.location?.area || '',
            latitude: property.location?.latitude || '',
            longitude: property.location?.longitude || ''
          },
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          area: property.area || '',
          amenities: property.amenities || [],
          features: property.features || []
        });

        if (property.images) {
           setImages(property.images);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          toast.error('Property title is required');
          return false;
        }
        return true;
      case 2:
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

    setSaving(true);
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
      setSaving(false);
      e.target.value = ''; // Reset
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        images: images // Send array of URLs
      };

      await api.properties.update(id, propertyData);
      
      // Note: Image upload logic would go here if backend supports separate endpoint
      
      toast.success('Property updated successfully!');
      router.push('/dashboard/admin/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="text-brand-gold animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Loading property details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <Save size={32} className="text-brand-gold" />
          Edit Property
        </h1>
        <div className="text-sm text-zinc-400">
           Step <span className="text-brand-gold font-bold">{currentStep}</span> of {steps.length}
        </div>
      </div>

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
                    ? 'text-emerald-500'
                    : 'text-zinc-500'
              }`}
           >
              {currentStep > i + 1 ? <CheckCircle size={18} /> : <step.icon size={18} />}
              <span className="hidden md:inline">{step.title}</span>
           </div>
        ))}
      </div>

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
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Description</label>
                     <textarea 
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={5}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50 resize-none"
                     />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Status</label>
                        <select 
                           value={formData.status}
                           onChange={(e) => handleInputChange('status', e.target.value)}
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50"
                        >
                           <option value="pending">Pending Review</option>
                           <option value="published">Published</option>
                           <option value="rejected">Rejected</option>
                           <option value="sold">Sold Out</option>
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
               <h2 className="text-xl font-bold text-zinc-100 mb-6">Property Images</h2>
               
               <div className="border-2 border-dashed border-white/10 rounded-3xl p-8 text-center hover:border-brand-gold/50 transition-colors bg-white/5 cursor-pointer relative">
                  <input 
                     type="file" multiple accept="image/*" onChange={handleImageUpload}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-3 pointer-events-none">
                     <Upload size={32} className="text-zinc-400" />
                     <p className="text-zinc-300 font-bold">Add more images</p>
                  </div>
               </div>

               {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                     {images.map((img, i) => (
                        <div key={i} className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden group border border-white/5">
                           <Image src={img} alt="" fill className="object-cover" />
                           <button 
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
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

      <div className="flex items-center justify-between">
         <button 
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/10 text-zinc-400"
         >
            <ArrowLeft size={18} /> Back
         </button>

         {currentStep < 4 ? (
            <button 
               onClick={() => validateStep(currentStep) && setCurrentStep(prev => prev + 1)}
               className="flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all"
            >
               Next Step <ArrowRight size={18} />
            </button>
         ) : (
            <button 
               onClick={handleSubmit} disabled={saving}
               className="flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all disabled:opacity-70"
            >
               {saving ? 'Saving...' : 'Save Changes'}
            </button>
         )}
      </div>
    </div>
  );
};

export default EditPropertyPage;
