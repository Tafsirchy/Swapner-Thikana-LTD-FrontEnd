import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Check, Building2, MapPin, Home, DollarSign, PenTool, Layout, Calendar, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectFilters = ({ filters, onChange, onClear }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDesktopSection, setActiveDesktopSection] = useState(null);
  const desktopMenuRef = useRef(null);

  // Close desktop dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target)) {
        setActiveDesktopSection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const amenityOptions = [
    'Lift', 'Parking', 'Rooftop Community Area', 'BBQ Facility', 'Hall Room', 
    'Stair', 'Gas Line', 'Generator Backup'
  ];

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    onChange({ ...filters, amenities: newAmenities });
  };

  // --- Filter Sections Generators ---

  const renderLocationInputs = () => (
    <div className="space-y-3 p-1">
      <input
        type="text"
        placeholder="Area / Sector (e.g. Sector 15)"
        value={filters.area || ''}
        onChange={(e) => handleInputChange('area', e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
      />
      <input
        type="text"
        placeholder="Road No"
        value={filters.road || ''}
        onChange={(e) => handleInputChange('road', e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
      />
      <select
        value={filters.city || ''}
        onChange={(e) => handleInputChange('city', e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
      >
        <option value="">Any City</option>
        <option value="Dhaka">Dhaka</option>
        <option value="Chittagong">Chittagong</option>
        <option value="Sylhet">Sylhet</option>
        <option value="Rajshahi">Rajshahi</option>
      </select>
    </div>
  );

  const renderProjectInfoInputs = () => (
    <div className="space-y-3 p-1">
      <div className="flex flex-col gap-2">
        {['ongoing', 'ready', 'upcoming'].map(status => (
          <label key={status} className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.status === status ? 'bg-brand-gold border-brand-gold' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
              {filters.status === status && <Check size={12} className="text-royal-deep" />}
            </div>
            <input 
              type="radio" 
              name="status"
              checked={filters.status === status}
              onChange={() => handleInputChange('status', filters.status === status ? '' : status)}
              className="hidden"
            />
            <span className="text-sm text-zinc-400 capitalize">{status}</span>
          </label>
        ))}
      </div>
      <input
          type="number"
          placeholder="Target Year (e.g. 2027)"
          value={filters.completionYear || ''}
          onChange={(e) => handleInputChange('completionYear', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
        />
    </div>
  );

  const renderApartmentInputs = () => (
    <div className="space-y-4 p-1">
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">Size Range (SFT)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minSize || ''}
            onChange={(e) => handleInputChange('minSize', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxSize || ''}
            onChange={(e) => handleInputChange('maxSize', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Min Beds</label>
          <select
            value={filters.beds || ''}
            onChange={(e) => handleInputChange('beds', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
          >
            <option value="">Any</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Min Baths</label>
          <select
            value={filters.baths || ''}
            onChange={(e) => handleInputChange('baths', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
          >
            <option value="">Any</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>
      </div>
      
      <label className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.availableOnly ? 'bg-brand-gold border-brand-gold' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
            {filters.availableOnly && <Check size={12} className="text-royal-deep" />}
          </div>
          <input 
            type="checkbox" 
            checked={!!filters.availableOnly}
            onChange={(e) => handleInputChange('availableOnly', e.target.checked)}
            className="hidden"
          />
          <span className="text-sm text-zinc-400">Available Flats Only</span>
      </label>
    </div>
  );

  const renderPriceInputs = () => (
    <div className="space-y-3 p-1">
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">Price per SFT</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
          />
        </div>
      </div>
      
      <label className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.parking ? 'bg-brand-gold border-brand-gold' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
            {filters.parking && <Check size={12} className="text-royal-deep" />}
          </div>
          <input 
            type="checkbox" 
            checked={!!filters.parking}
            onChange={(e) => handleInputChange('parking', e.target.checked)}
            className="hidden"
          />
          <span className="text-sm text-zinc-400">Parking Included</span>
      </label>
    </div>
  );

  const renderAmenityInputs = () => (
    <div className="grid grid-cols-1 gap-2 p-1">
      {amenityOptions.map(amenity => (
          <label key={amenity} className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.amenities?.includes(amenity) ? 'bg-brand-gold border-brand-gold' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
              {filters.amenities?.includes(amenity) && <Check size={12} className="text-royal-deep" />}
            </div>
            <input 
              type="checkbox" 
              checked={filters.amenities?.includes(amenity) || false}
              onChange={() => handleAmenityToggle(amenity)}
              className="hidden"
            />
            <span className="text-sm text-zinc-400">{amenity}</span>
          </label>
      ))}
    </div>
  );

  const renderBuildingInputs = () => (
    <div className="space-y-3 p-1">
      <input
        type="number"
        placeholder="Min Total Floors"
        value={filters.minFloors || ''}
        onChange={(e) => handleInputChange('minFloors', e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
      />
      
      <select
        value={filters.facing || ''}
        onChange={(e) => handleInputChange('facing', e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
      >
        <option value="">Any Facing</option>
        <option value="South">South</option>
        <option value="East">East</option>
        <option value="West">West</option>
        <option value="North">North</option>
      </select>
    </div>
  );

  const renderAvailabilityInputs = () => (
    <div className="space-y-3 p-1">
      <select
        value={filters.handoverTime || ''}
        onChange={(e) => handleInputChange('handoverTime', e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
      >
        <option value="">Any Handover Time</option>
        <option value="1">Within 1 year</option>
        <option value="2">1-2 years</option>
        <option value="3">After 2027</option>
      </select>
    </div>
  );

  const sections = [
    { key: 'location', title: 'Location', Icon: MapPin, content: renderLocationInputs },
    { key: 'projectInfo', title: 'Status', Icon: Building2, content: renderProjectInfoInputs },
    { key: 'apartment', title: 'Apartment', Icon: Home, content: renderApartmentInputs },
    { key: 'price', title: 'Price', Icon: DollarSign, content: renderPriceInputs },
    { key: 'amenities', title: 'Amenities', Icon: PenTool, content: renderAmenityInputs },
    { key: 'building', title: 'Building', Icon: Layout, content: renderBuildingInputs },
    { key: 'availability', title: 'Availability', Icon: Calendar, content: renderAvailabilityInputs },
  ];

  // Mobile Accordion (similar to previous sidebar)
  const MobileSidebar = () => {
    const [expanded, setExpanded] = useState({});
    
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
        <motion.div
           initial={{ x: '100%' }}
           animate={{ x: 0 }}
           exit={{ x: '100%' }}
           className="fixed top-0 right-0 bottom-0 w-80 bg-zinc-900 border-l border-white/10 p-6 overflow-y-auto"
        >
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-100">Filters</h3>
              <button onClick={() => setIsMobileOpen(false)}><X className="text-zinc-400" /></button>
           </div>
           
           <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <span className="text-zinc-400 text-sm">Refine Search</span>
              <button onClick={onClear} className="text-xs text-red-400 underline">Clear All</button>
           </div>

           <div className="space-y-4">
             {sections.map(({ key, title, Icon, content }) => (
               <div key={key} className="border-b border-white/5 pb-2">
                 <button 
                   onClick={() => setExpanded(p => ({ ...p, [key]: !p[key] }))}
                   className="flex items-center justify-between w-full py-2 text-zinc-300 font-medium"
                 >
                   <div className="flex items-center gap-2">
                     <Icon size={16} className="text-brand-gold" /> {title}
                   </div>
                   {expanded[key] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                 </button>
                 <AnimatePresence>
                   {expanded[key] && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden"
                     >
                       {content()}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             ))}
           </div>
        </motion.div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Trigger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-brand-gold text-royal-deep p-4 rounded-full shadow-lg shadow-brand-gold/20 flex items-center gap-2 font-bold"
      >
        <Filter size={20} /> Filters
      </button>

      <AnimatePresence>
        {isMobileOpen && <MobileSidebar />}
      </AnimatePresence>

      {/* Desktop Horizontal Bar */}
      <div className="hidden lg:block w-full mb-8 relative z-30" ref={desktopMenuRef}>
        <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-none p-2 flex flex-wrap gap-2 items-center shadow-lg">
           <div className="px-4 py-2 border-r border-white/10 text-zinc-400 font-bold text-sm tracking-wider flex items-center gap-2">
              <Filter size={16} /> FILTERS
           </div>
           
           {sections.map(({ key, title, Icon, content }) => (
             <div key={key} className="relative">
               <button
                 onClick={() => setActiveDesktopSection(activeDesktopSection === key ? null : key)}
                 className={`
                    flex items-center gap-2 px-4 py-2 rounded-none text-sm font-medium transition-all
                    ${activeDesktopSection === key || (filters[key] || filters['min' + key]) ? 'bg-white/10 text-brand-gold' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}
                 `}
               >
                 <Icon size={16} />
                 {title}
                 <ChevronDown size={14} className={`transition-transformDuration-300 ${activeDesktopSection === key ? 'rotate-180' : ''}`} />
               </button>

               {/* Dropdown Content */}
               <AnimatePresence>
                 {activeDesktopSection === key && (
                   <motion.div
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     transition={{ duration: 0.15 }}
                     className="absolute top-full left-0 mt-3 w-72 bg-zinc-900 border border-white/10 p-5 rounded-none shadow-xl shadow-black/50 overflow-y-auto max-h-[60vh] z-50"
                   >
                      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                        <h4 className="font-bold text-zinc-100 text-sm flex items-center gap-2"><Icon size={14} className="text-brand-gold"/> {title}</h4>
                      </div>
                      {content()}
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           ))}

           <div className="ml-auto border-l border-white/10 pl-2">
             <button 
                onClick={onClear}
                className="px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-none transition-colors"
             >
                Reset
             </button>
           </div>
        </div>
        
        {/* Active Filters Display Chips (Optional) */}
        {/* We can add chips here later if needed to show what is selected without opening dropdowns */}
      </div>
    </>
  );
};

export default ProjectFilters;
