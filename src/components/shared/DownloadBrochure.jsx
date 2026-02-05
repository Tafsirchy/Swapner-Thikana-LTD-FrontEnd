'use client';

import React, { useState } from 'react';
import { Download, Loader2, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure this is installed or use manual table logic if not

const DownloadBrochure = ({ project }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    // 1. Priority: Check for official custom brochure URL
    const providedUrl = project?.brochureUrl || project?.pdfUrl;
    if (providedUrl) {
      window.open(providedUrl, '_blank');
      toast.success('Opening official brochure...');
      return;
    }

    // 2. Fallback: Generate professional PDF brochure
    try {
      setLoading(true);
      toast('Generating professional brochure...', { icon: '📄' });

      // Import dynamic to avoid client-side bloat if possible, 
      // but since this is a utility, we'll just import it.
      const { exportProjectPDF, exportPropertyPDF } = await import('@/utils/exportUtils');

      // Check if it's a project or a property
      // Properties usually have bedrooms/bathrooms, Projects have totalUnits/handoverDate
      if (project.totalUnits || project.handoverDate || project.type === 'upcoming') {
        await exportProjectPDF(project);
      } else {
        await exportPropertyPDF(project);
      }
      
      toast.success('Brochure generated!');
    } catch (e) {
      console.error('PDF Generation Error:', e);
      toast.error('Could not generate brochure at this time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload} 
      disabled={loading}
      className={`
        relative group overflow-hidden
        px-6 py-3 rounded-full 
        bg-zinc-950/80 backdrop-blur-md border border-white/20 
        hover:border-brand-gold/50 hover:bg-zinc-900 
        transition-all duration-300
        flex items-center gap-2
        ${loading ? 'cursor-wait opacity-70' : 'cursor-pointer'}
      `}
    >
      <div className="absolute inset-0 bg-brand-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      
      <span className="relative z-10 flex items-center gap-2 text-zinc-50 group-hover:text-brand-gold font-bold text-xs tracking-[0.15em] uppercase">
        {loading ? (
           <Loader2 size={16} className="animate-spin" />
        ) : (
           <FileText size={16} />
        )}
        {loading ? 'Generating...' : 'Brochure'}
      </span>
    </button>
  );
};

export default DownloadBrochure;
