'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, DollarSign, Image as ImageIcon, 
  CheckCircle, ArrowRight, ArrowLeft, Save, Loader2, Star 
} from 'lucide-react';
// import SmartImage from '@/components/shared/SmartImage'; // Unused
import SmartImage from '@/components/shared/SmartImage';

import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import AddressAutocomplete from '@/components/shared/AddressAutocomplete';
import LuxurySelect from '@/components/shared/LuxurySelect';
import MultiImgBBUpload from '@/components/shared/MultiImgBBUpload';
import dynamic from 'next/dynamic';

const InteractiveMapPicker = dynamic(() => import('@/components/map/InteractiveMapPicker'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-zinc-800 animate-pulse rounded-xl" />
});

const EditPropertyPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [images, setImages] = useState([]);
  const [initialImages, setInitialImages] = useState([]);

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
    features: [],
    featured: false,
    brochureUrl: ''
  });

  const steps = [
    { title: 'Basic Info', icon: Building2 },
    { title: 'Location', icon: MapPin },
    { title: 'Details', icon: DollarSign },
    { title: 'Amenities', icon: CheckCircle },
    { title: 'Images', icon: ImageIcon },
  ];

  const AMENITIES_LIST = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 
    'Garden', 'Balcony', 'Elevator', 'Power Backup', 
    'Wi-Fi', 'Fire Safety', 'CCTV', 'Community Hall'
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
            // Mapping from coordinates object if available, otherwise from location
            latitude: property.coordinates?.lat || property.location?.latitude || '',
            longitude: property.coordinates?.lng || property.location?.longitude || ''
          },
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          area: property.area || '',
          amenities: property.amenities || [],
          features: property.features || [],
          featured: property.featured || false,
          brochureUrl: property.brochureUrl || ''
        });

        if (property.images) {
           setImages(property.images);
           setInitialImages(property.images);
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

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const currentAmenities = prev.amenities || [];
      const newAmenities = currentAmenities.includes(amenity)
        ? currentAmenities.filter(a => a !== amenity)
        : [...currentAmenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
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

      const response = await api.properties.update(id, propertyData);
      
      // Note: Image upload logic would go here if backend supports separate endpoint
      if (response.success) {
        setIsSubmitted(true);
        toast.success('Property updated successfully');
        router.push('/dashboard/admin/properties');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      const serverMessage = error.response?.data?.message;
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors && Array.isArray(validationErrors)) {
        toast.error(validationErrors[0]);
      } else {
        toast.error(serverMessage || error.message || 'Failed to update property');
      }
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
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <Save className="text-brand-gold w-6 h-6 sm:w-8 sm:h-8" />
          Edit Property
        </h1>
        <div className="text-sm text-zinc-400 shrink-0">
           Step <span className="text-brand-gold font-bold">{currentStep}</span> <span className="hidden sm:inline">of {steps.length}</span>
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

      <div className="bg-white/5 border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 min-h-[400px]">
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
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-base"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Description</label>
                     <textarea 
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={5}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50 resize-none text-base"
                     />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Listing Type</label>
                        <LuxurySelect
                           value={formData.listingType}
                           onChange={(val) => handleInputChange('listingType', val)}
                           options={[
                              { label: 'For Sale', value: 'sale' },
                              { label: 'For Rent', value: 'rent' }
                           ]}
                           className="rounded-xl !bg-zinc-900 !border-white/10 text-base"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Property Type</label>
                        <LuxurySelect
                           value={formData.propertyType}
                           onChange={(val) => handleInputChange('propertyType', val)}
                           options={[
                              { label: 'Apartment', value: 'apartment' },
                              { label: 'Luxury Villa', value: 'villa' },
                              { label: 'Duplex', value: 'duplex' },
                              { label: 'Penthouse', value: 'penthouse' },
                              { label: 'Commercial Space', value: 'commercial' },
                              { label: 'Office', value: 'office' },
                              { label: 'Shop', value: 'shop' },
                              { label: 'Warehouse', value: 'warehouse' },
                              { label: 'Land', value: 'land' },
                              { label: 'House', value: 'house' }
                           ]}
                           className="rounded-xl !bg-zinc-900 !border-white/10 text-base"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Status</label>
                        <LuxurySelect
                           value={formData.status}
                           onChange={(val) => handleInputChange('status', val)}
                           options={[
                              { label: 'Pending Review', value: 'pending' },
                              { label: 'Published', value: 'published' },
                              { label: 'Rejected', value: 'rejected' },
                              { label: 'Sold Out', value: 'sold' }
                           ]}
                           className="rounded-xl !bg-zinc-900 !border-white/10 text-base"
                        />
                     </div>
                      <div className="md:col-span-3 flex items-center gap-4 pt-4 border-t border-white/5 mt-4">
                         <button
                            type="button"
                            onClick={() => handleInputChange('featured', !formData.featured)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                               formData.featured 
                                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' 
                                  : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                            }`}
                         >
                            <Star size={18} fill={formData.featured ? 'currentColor' : 'none'} />
                            <span className="font-bold uppercase text-xs tracking-wider">
                               {formData.featured ? 'Featured Property' : 'Promote to Featured'}
                            </span>
                         </button>
                         <p className="text-xs text-zinc-500 italic">
                            Featured properties are prominently displayed on the homepage showcase.
                         </p>
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
                     <AddressAutocomplete 
                        value={formData.location.address}
                        onChange={(val) => handleLocationChange('address', val)}
                        onSelect={(data) => {
                           handleLocationChange('address', data.address);
                           if (data.city) handleLocationChange('city', data.city);
                           if (data.area) handleLocationChange('area', data.area);
                           if (data.lat) handleLocationChange('latitude', data.lat);
                           if (data.lon) handleLocationChange('longitude', data.lon);
                        }}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-base"
                     />
                     {/* Interactive Map Picker */}
                     <div className="mt-4 mb-6">
                        <InteractiveMapPicker 
                           latitude={formData.location.latitude}
                           longitude={formData.location.longitude}
                           onLocationChange={(lat, lng) => {
                              handleLocationChange('latitude', lat);
                              handleLocationChange('longitude', lng);
                           }}
                        />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">City</label>
                        <LuxurySelect
                           value={formData.location.city}
                           onChange={(val) => handleLocationChange('city', val)}
                           options={[
                              { label: 'Dhaka', value: 'Dhaka' },
                              { label: 'Chattogram', value: 'Chattogram' },
                              { label: 'Sylhet', value: 'Sylhet' }
                           ]}
                           className="rounded-xl !bg-zinc-900 !border-white/10 text-base"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Area / Neighborhood</label>
                        <input 
                           type="text" 
                           value={formData.location.area}
                           onChange={(e) => handleLocationChange('area', e.target.value)}
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-base"
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Area (Sq Ft)</label>
                        <input 
                           type="number" 
                           value={formData.area}
                           onChange={(e) => handleInputChange('area', e.target.value)}
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-base"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Bedrooms</label>
                        <input 
                           type="number" 
                           value={formData.bedrooms}
                           onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-base"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Bathrooms</label>
                        <input 
                           type="number" 
                           value={formData.bathrooms}
                           onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                           className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-base"
                        />
                     </div>
                  </div>
                   </div>
                   
                   <div>
                     <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Brochure PDF URL</label>
                     <input 
                        type="url" 
                        value={formData.brochureUrl}
                        onChange={(e) => handleInputChange('brochureUrl', e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-base"
                     />
                   </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div 
               key="step4" 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
            >
               <h2 className="text-xl font-bold text-zinc-100 mb-6">Amenities & Features</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {AMENITIES_LIST.map((amenity) => (
                    <label
                      key={amenity}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        formData.amenities.includes(amenity)
                          ? 'bg-brand-gold/10 border-brand-gold text-brand-gold'
                          : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="hidden"
                      />
                      {formData.amenities.includes(amenity) ? (
                        <CheckCircle size={20} className="fill-brand-gold/20" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-zinc-600" />
                      )}
                      <span className="font-medium">{amenity}</span>
                    </label>
                  ))}
               </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div 
               key="step5" 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
            >
               <h2 className="text-xl font-bold text-zinc-100 mb-6">Property Images</h2>
               
               <MultiImgBBUpload
                  onImagesChange={setImages}
                  defaultImages={initialImages}
                  isSaved={isSubmitted}
                  label="Property Gallery"
                  maxFiles={10}
               />
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

         {currentStep < 5 ? (
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
