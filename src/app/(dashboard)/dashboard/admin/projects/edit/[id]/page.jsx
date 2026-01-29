'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Building2, Save, X, Plus, Trash2, MapPin, Type, Calendar, Info, Loader2, Edit2, Upload } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import ImgBBUpload from '@/components/shared/ImgBBUpload';
import imageCompression from 'browser-image-compression';
import AddressAutocomplete from '@/components/shared/AddressAutocomplete';

const EditProjectPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'residential',
    status: 'upcoming',
    location: {
      city: 'Dhaka',
      address: ''
    },
    handoverDate: '', // Handover Date
    
    // Key Specs
    landSize: '',
    floorConfiguration: '', // G+9
    totalUnits: '',
    unitsPerFloor: '',
    
    // Apartment Details
    flatSize: '', // A: 1950, B: 1750
    bedroomCount: '',
    bathroomCount: '',
    balconyCount: '',
    
    // Amenities & Facilities
    parking: '',
    lift: '',
    stair: '',
    commonFacilities: '',
    features: [''],

    // Sales
    pricePerSqFt: '',
    availableFlats: '',

    // Images
    thumbnail: '',
    images: []
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await api.projects.getById(id);
        const project = response.data.project;
        
        // Format date for input field
        // Format date if needed, but we use text handoverDate now
        
        setFormData({
          title: project.title || '',
          description: project.description || '',
          type: project.type || 'residential',
          status: project.status || 'upcoming',
          location: {
            city: project.location?.city || 'Dhaka',
            address: project.location?.address || ''
          },
          handoverDate: project.handoverDate || '',
          
          landSize: project.landSize || '',
          floorConfiguration: project.floorConfiguration || '',
          totalUnits: project.totalUnits || '',
          unitsPerFloor: project.unitsPerFloor || '',
          
          flatSize: project.flatSize || '',
          bedroomCount: project.bedroomCount || '',
          bathroomCount: project.bathroomCount || '',
          balconyCount: project.balconyCount || '',
          
          parking: project.parking || '',
          lift: project.lift || '',
          stair: project.stair || '',
          commonFacilities: project.commonFacilities || '',
          
          pricePerSqFt: project.pricePerSqFt || '',
          availableFlats: project.availableFlats || '',

          thumbnail: project.thumbnail || '',
          images: project.images || [],

          features: project.features?.length > 0 ? project.features : ['']
        });
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ''] });
  const removeFeature = (index) => setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Clean up data before sending
      const payload = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== '') // Remove empty features
      };

      await api.projects.update(id, payload);
      toast.success('Project updated successfully');
      router.push('/dashboard/admin/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update project';
      const validationErrors = error.response?.data?.data; // Expecting array of strings from validators
      
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
         // Show the first validation error or a generic one
         toast.error(validationErrors[0]);
         // Log all for debug
         console.warn('Validation errors:', validationErrors);
      } else {
         toast.error(errorMsg);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="text-brand-gold animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
             <Edit2 className="text-brand-gold" size={32} />
             Edit Project
          </h1>
          <p className="text-zinc-400 mt-1">Update the details of your real estate project.</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-white/5 rounded-full text-zinc-400 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
           <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-4">
              <Info size={20} className="text-brand-gold" />
              General Information
           </h3>
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Project Title</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  minLength={20}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Project Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  >
                    <option value="residential" className="bg-zinc-900 text-zinc-100">Residential</option>
                    <option value="commercial" className="bg-zinc-900 text-zinc-100">Commercial</option>
                    <option value="mixed" className="bg-zinc-900 text-zinc-100">Mixed Use</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Current Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  >
                    <option value="upcoming" className="bg-zinc-900 text-zinc-100">Upcoming</option>
                    <option value="ongoing" className="bg-zinc-900 text-zinc-100">Ongoing</option>
                    <option value="completed" className="bg-zinc-900 text-zinc-100">Completed</option>
                  </select>
                </div>
              </div>
           </div>
        </div>

        {/* Location & Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-6">
                <MapPin size={20} className="text-brand-gold" />
                Location
              </h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Search Address</label>
                    <AddressAutocomplete 
                       value={formData.location.address}
                       onChange={(val) => setFormData(prev => ({ ...prev, location: { ...prev.location, address: val } }))}
                       onSelect={(data) => {
                          setFormData(prev => ({
                             ...prev,
                             location: {
                                ...prev.location,
                                address: data.address,
                                city: data.city || prev.location.city
                             }
                          }));
                       }}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">City</label>
                    <input
                      required
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                    />
                 </div>
              </div>
           </div>

           <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-6">
                <Calendar size={20} className="text-brand-gold" />
                Timeline
              </h3>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Handover Date (Project Ending)</label>
                <input
                  type="text"
                  name="handoverDate"
                  value={formData.handoverDate}
                  onChange={handleChange}
                  placeholder="e.g. December 2027"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                />
                <p className="text-xs text-zinc-500 mt-2">Can be a specific date or text like &apos;Late 2026&apos;</p>
              </div>
           </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-6">
             <Building2 size={20} className="text-brand-gold" />
             Technical Specifications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Land Size</label>
                <input
                  type="text"
                  name="landSize"
                  value={formData.landSize}
                  onChange={handleChange}
                  placeholder="e.g. 6 Katha"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-zinc-100 outline-none focus:border-brand-gold/50 text-sm"
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Floor Config</label>
                <input
                  type="text"
                  name="floorConfiguration"
                  value={formData.floorConfiguration}
                  onChange={handleChange}
                  placeholder="e.g. G+9"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-zinc-100 outline-none focus:border-brand-gold/50 text-sm"
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Total Units</label>
                <input
                  type="text"
                  name="totalUnits"
                  value={formData.totalUnits}
                  onChange={handleChange}
                  placeholder="e.g. 18 Nos."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-zinc-100 outline-none focus:border-brand-gold/50 text-sm"
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Units / Floor</label>
                <input
                  type="text"
                  name="unitsPerFloor"
                  value={formData.unitsPerFloor}
                  onChange={handleChange}
                  placeholder="e.g. 2 Units Flat"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-zinc-100 outline-none focus:border-brand-gold/50 text-sm"
                />
             </div>
          </div>
        </div>

        {/* Apartment Details */}
         <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-6">
             <Building2 size={20} className="text-brand-gold" />
             Apartment Details
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Unit Sizes (Description)</label>
                  <input
                    type="text"
                    name="flatSize"
                    value={formData.flatSize}
                    onChange={handleChange}
                    placeholder="e.g. A Unit: 1950 Sft, B Unit: 1750 Sft"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-zinc-100 outline-none focus:border-brand-gold/50 text-sm"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Room Counts</label>
                   <div className="grid grid-cols-3 gap-3">
                       <input type="text" name="bedroomCount" value={formData.bedroomCount} onChange={handleChange} placeholder="Bed (3/4)" className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs" />
                       <input type="text" name="bathroomCount" value={formData.bathroomCount} onChange={handleChange} placeholder="Bath (3/4)" className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs" />
                       <input type="text" name="balconyCount" value={formData.balconyCount} onChange={handleChange} placeholder="Balcony (2/3)" className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs" />
                   </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div><label className="text-xs text-zinc-500 block mb-1">Parking</label><input type="text" name="parking" value={formData.parking} onChange={handleChange} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="e.g. 1 per Flat"/></div>
               <div><label className="text-xs text-zinc-500 block mb-1">Lift</label><input type="text" name="lift" value={formData.lift} onChange={handleChange} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="e.g. 1 Lift"/></div>
               <div><label className="text-xs text-zinc-500 block mb-1">Stair</label><input type="text" name="stair" value={formData.stair} onChange={handleChange} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="e.g. Yes"/></div>
            </div>

            <div>
               <label className="block text-sm font-medium text-zinc-400 mb-2">Common Facilities</label>
               <input
                 type="text"
                 name="commonFacilities"
                 value={formData.commonFacilities}
                 onChange={handleChange}
                 placeholder="e.g. Rooftop Community Area, Hall Room, BBQ"
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-zinc-100 outline-none focus:border-brand-gold/50 text-sm"
               />
            </div>
          </div>
        </div>

        {/* Pricing & Sales */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-6">
             <Info size={20} className="text-brand-gold" />
             Sales Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Rate (Price per SFT)</label>
                <input
                  type="text"
                  name="pricePerSqFt"
                  value={formData.pricePerSqFt}
                  onChange={handleChange}
                  placeholder="e.g. 9500 Taka SFT"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Available Flats</label>
                <input
                  type="text"
                  name="availableFlats"
                  value={formData.availableFlats}
                  onChange={handleChange}
                  placeholder="e.g. 3A, 3B(2nd Floor)..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                />
             </div>
          </div>
        </div>

        {/* Image Portfolio */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-8">
           <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Upload size={20} className="text-brand-gold" />
              Project Portfolio (Images)
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                 <ImgBBUpload 
                    label="Main Thumbnail" 
                    defaultImage={formData.thumbnail}
                    onUpload={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))}
                    required
                 />
                 <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-tight">Used in project cards and primary headers.</p>
              </div>

              <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest font-sans italic mb-3">
                    Gallery Images
                 </label>
                 <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((img, index) => (
                       <div key={index} className="relative group rounded-xl overflow-hidden aspect-video bg-zinc-900 border border-white/5">
                          <Image src={img} alt="" fill className="object-cover" />
                          <button 
                             type="button"
                             onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                             className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <X size={14} />
                          </button>
                       </div>
                    ))}
                  <div className={`relative aspect-video rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center hover:border-brand-gold/30 hover:bg-white/5 transition-all text-zinc-600 hover:text-brand-gold ${galleryUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                       <input 
                          type="file" 
                          multiple
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          disabled={galleryUploading}
                          onChange={async (e) => {
                             const files = Array.from(e.target.files);
                             if(files.length === 0) return;
                             
                             try {
                                setGalleryUploading(true);
                                const toastId = toast.loading('Starting optimization...');
                                
                                for (let i = 0; i < files.length; i++) {
                                   const file = files[i];
                                   toast.loading(`Optimizing image ${i + 1}/${files.length}...`, { id: toastId });
                                   
                                   // 1. Compression
                                   const compressedFile = await imageCompression(file, {
                                      maxSizeMB: 1,
                                      maxWidthOrHeight: 1920,
                                      useWebWorker: true
                                   });
   
                                   toast.loading(`Uploading image ${i + 1}/${files.length}...`, { id: toastId });
                                   const fData = new FormData();
                                   fData.append('image', compressedFile);
                                   
                                   const res = await axios.post('https://api.imgbb.com/1/upload', fData, {
                                      params: { key: '615ab9305e7a47395335aa3d18655815' }
                                   });
                                   if(res.data.success) {
                                      setFormData(prev => ({ ...prev, images: [...prev.images, res.data.data.url] }));
                                   } else {
                                      toast.error(`Failed to upload image ${i+1}`);
                                   }
                                }
                                toast.success('Gallery updated successfully', { id: toastId });
                             } catch (err) {
                                console.error('Gallery upload error:', err);
                                toast.error('Gallery upload failed');
                             } finally {
                                setGalleryUploading(false);
                                e.target.value = ''; // Reset input
                             }
                          }}
                       />
                       <div className="flex flex-col items-center gap-1">
                          {galleryUploading ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                          <span className="text-[10px] uppercase font-bold tracking-widest">{galleryUploading ? 'Processing...' : 'Add Images'}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Type size={20} className="text-brand-gold" />
                Key Features
              </h3>
              <button 
                type="button"
                onClick={addFeature}
                className="text-xs font-bold text-brand-gold hover:text-brand-gold-light transition-colors uppercase tracking-widest"
              >
                + Add Feature
              </button>
           </div>
           <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                   <input
                     type="text"
                     value={feature}
                     onChange={(e) => handleFeatureChange(index, e.target.value)}
                     className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all"
                   />
                   <button 
                     type="button"
                     onClick={() => removeFeature(index)}
                     className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              ))}
           </div>
        </div>

        <div className="flex gap-4 pt-4">
           <button
             type="button"
             onClick={() => router.back()}
             className="flex-1 px-8 py-4 bg-white/5 text-zinc-300 font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5"
           >
             Cancel
           </button>
           <button
             type="submit"
             disabled={saving}
             className="flex-2 px-12 py-4 bg-brand-gold text-royal-deep font-bold rounded-2xl hover:bg-brand-gold-light transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
           >
             <Save size={20} />
             {saving ? 'Saving Changes...' : 'Save Project'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectPage;
