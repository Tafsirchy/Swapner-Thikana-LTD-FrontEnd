'use client';

import React, { useState } from 'react';
import { Download, Loader2, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure this is installed or use manual table logic if not

const DownloadBrochure = ({ project }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    // 1. Check for official file existence
    if (project.brochureUrl || project.pdfUrl) {
       window.open(project.brochureUrl || project.pdfUrl, '_blank');
       return;
    }

    // 2. Fallback: Generate PDF
    try {
      setLoading(true);
      toast('Generating brochure...', { icon: '📄' });

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = 20;

      // --- Header ---
      doc.setFontSize(22);
      doc.setTextColor(212, 175, 55); // Brand Gold
      doc.text('SHWAPNER THIKANA', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Premium Real Estate & Developments', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;
      
      doc.setDrawColor(212, 175, 55);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 20;

      // --- Project Title ---
      doc.setFontSize(24);
      doc.setTextColor(0);
      doc.text(project.title || 'Project Details', margin, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(project.address || project.location?.address || 'Dhaka, Bangladesh', margin, yPos);
      yPos += 15;

      // --- Featured Image (Attempt Base64 fetch or skip) ---
      // Note: fetching images client-side can fail due to CORS. 
      // We will attempt it but fail gracefully.
      try {
         const mainImage = project.images?.[0];
         if (mainImage) {
            // Simplified fetch for demo, robust implementation would need a proxy or CORS-friendly host
            // For now, we'll draw a placeholder rectangle if we can't fetch real-time
            // doc.addImage(imgData, 'JPEG', margin, yPos, pageWidth - (margin*2), 80);
            // yPos += 90;
         }
      } catch (err) {
         console.log('Image fetch failed, skipping image in PDF');
      }

      // --- Details Table ---
      yPos += 5;
      const details = [
         ['Type', project.propertyType || 'Residential'],
         ['Status', project.status || 'Ongoing'],
         ['Land Size', project.landSize || 'N/A'],
         ['Total Units', project.totalUnits || 'N/A'],
         ['Price', project.pricePerSqFt ? `${project.pricePerSqFt} BDT / sft` : 'Contact for Price']
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['Feature', 'Description']],
        body: details,
        theme: 'grid',
        headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
      });
      
      yPos = doc.lastAutoTable.finalY + 20;

      // --- Description ---
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Overview', margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(80);
      const splitDesc = doc.splitTextToSize(project.description || 'No description available.', pageWidth - (margin * 2));
      doc.text(splitDesc, margin, yPos);

      // --- Footer ---
      const footerY = doc.internal.pageSize.getHeight() - 20;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Generated on ${new Date().toLocaleDateString()} | www.shwapnerthikana.com`, pageWidth / 2, footerY, { align: 'center' });

      // Save
      doc.save(`${project.slug || 'project'}-brochure.pdf`);
      toast.success('Brochure downloaded!');

    } catch (e) {
      console.error('PDF Generation Error:', e);
      toast.error('Could not generate PDF.');
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
        bg-white/5 border border-white/10 
        hover:border-brand-gold/50 hover:bg-white/10 
        transition-all duration-300
        flex items-center gap-2
        ${loading ? 'cursor-wait opacity-70' : 'cursor-pointer'}
      `}
    >
      <div className="absolute inset-0 bg-brand-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      
      <span className="relative z-10 flex items-center gap-2 text-zinc-300 group-hover:text-brand-gold font-medium text-sm tracking-wider uppercase">
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
