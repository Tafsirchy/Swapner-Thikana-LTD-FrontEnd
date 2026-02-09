import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export property comparison as PDF
 * @param {Array} properties - Array of properties to compare
 */
export const exportComparisonPDF = (properties) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(212, 175, 55); // Gold
  doc.text('Property Comparison', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });
  
  // Property Titles
  doc.setFontSize(12);
  doc.setTextColor(0);
  let yPos = 40;
  
  properties.forEach((property, index) => {
    doc.text(`Property ${index + 1}: ${property.title}`, 15, yPos);
    yPos += 6;
  });
  
  yPos += 5;
  
  // Comparison table
  const tableData = [
    ['Feature', ...properties.map((_, i) => `Property ${i + 1}`)],
    ['Price', ...properties.map(p => `BDT ${p.price?.toLocaleString('en-BD')}`)],
    ['Listing Type', ...properties.map(p => p.listingType === 'sale' ? 'For Sale' : 'For Rent')],
    ['Property Type', ...properties.map(p => p.propertyType)],
    ['Bedrooms', ...properties.map(p => p.bedrooms)],
    ['Bathrooms', ... properties.map(p => p.bathrooms)],
    ['Area (sqft)', ...properties.map(p => p.size?.toLocaleString('en-BD'))],
    ['Location', ...properties.map(p => `${p.location?.area}, ${p.location?.city}`)],
    ['Address', ...properties.map(p => p.location?.address)],
    ['Featured', ...properties.map(p => p.featured ? 'Yes' : 'No')],
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: 'grid',
    headStyles: {
      fillColor: [212, 175, 55],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [245, 245, 245], cellWidth: 40 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 'auto' }
    }
  });
  
  // Add amenities section
  const allAmenities = [...new Set(properties.flatMap(p => p.amenities || []))];
  
  if (allAmenities.length > 0) {
    const amenitiesData = allAmenities.map(amenity => [
      amenity,
      ...properties.map(p => p.amenities?.includes(amenity) ? '✓' : '✗')
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Amenities', ...properties.map((_, i) => `Property ${i + 1}`)]],
      body: amenitiesData,
      theme: 'grid',
      headStyles: {
        fillColor: [212, 175, 55],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        halign: 'center'
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [245, 245, 245], halign: 'left' }
      }
    });
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `STLTD Properties - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`property-comparison-${new Date().getTime()}.pdf`);
};

/**
 * Helper to add a branded header to PDFs
 */
const addPDFHeader = (doc, title) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Luxury Dark Header with Gold border
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setDrawColor(212, 175, 55); // Gold
  doc.setLineWidth(1.5);
  doc.line(0, 45, pageWidth, 45);
  
  // Logo/Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(212, 175, 55);
  doc.text('SHWAPNER THIKANA', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.text('PREMIUM REAL ESTATE SOLUTIONS', pageWidth / 2, 28, { align: 'center' });
  
  // Page Title
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), pageWidth / 2, 38, { align: 'center' });
};

/**
 * Helper to add a branded footer
 */
const addPDFFooter = (doc) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.5);
  doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);
  
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text('House 12, Road 5, Dhanmondi, Dhaka, Bangladesh | +880 1234 567890 | info@shwapnerthikana.com', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString('en-BD')} | Page ${doc.internal.getNumberOfPages()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
};

/**
 * Export project details as professional PDF brochure
 */
export const exportProjectPDF = (project) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  addPDFHeader(doc, 'Project Brochure');
  
  // Title Section
  let yPos = 65;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text(project.title, margin, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100);
  const addressText = `${project.location?.address}, ${project.location?.city}`;
  const splitAddress = doc.splitTextToSize(addressText, pageWidth - (margin * 2));
  doc.text(splitAddress, margin, yPos);
  yPos += (splitAddress.length - 1) * 5;
  
  // Features Grid Style Header
  yPos += 15;
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 25, 'F');
  
  const colWidth = (pageWidth - (margin * 2)) / 3;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('STATUS', margin + 10, yPos + 8);
  doc.text('TYPE', margin + colWidth + 10, yPos + 8);
  doc.text('HANDOVER', margin + (colWidth * 2) + 10, yPos + 8);
  
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(project.status?.toUpperCase() || 'ONGOING', margin + 10, yPos + 18);
  doc.text(project.type?.toUpperCase() || 'RESIDENTIAL', margin + colWidth + 10, yPos + 18);
  doc.text(project.handoverDate?.toUpperCase() || 'TBA', margin + (colWidth * 2) + 10, yPos + 18);
  
  // Detailed Specs Table
  yPos += 40;
  doc.setFontSize(14);
  doc.setTextColor(212, 175, 55);
  doc.text('TECHNICAL SPECIFICATIONS', margin, yPos);
  
  const specs = [
    ['Land Size', project.landSize || 'N/A'],
    ['Building Height', project.floorConfiguration || 'N/A'],
    ['Total Units', project.totalUnits || 'N/A'],
    ['Units Per Floor', project.unitsPerFloor || 'N/A'],
    ['Apartment Sizes', project.flatSize || 'N/A'],
    ['Available Units', project.availableFlats || 'Contact for info'],
    ['Parking', project.parking || 'Yes'],
    ['Price Range', project.pricePerSqFt ? `BDT ${project.pricePerSqFt} per SFT` : 'Contact for Price']
  ];
  
  autoTable(doc, {
    startY: yPos + 5,
    body: specs,
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 5, overflow: 'linebreak' },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { cellWidth: 'auto' } },
    margin: { left: margin, right: margin }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Description/Overview
  if (project.description) {
    autoTable(doc, {
      startY: yPos,
      head: [['OVERVIEW']],
      body: [[project.description]],
      theme: 'plain',
      headStyles: { 
        fontSize: 14, 
        textColor: [212, 175, 55], 
        fontStyle: 'bold',
        cellPadding: { bottom: 5 } 
      },
      styles: { 
        fontSize: 10, 
        textColor: [60, 60, 60], 
        cellPadding: 0,
        overflow: 'linebreak'
      },
      margin: { left: margin, right: margin }
    });
    yPos = doc.lastAutoTable.finalY + 15;
  }
  
  // Features List
  if (project.features && project.features.length > 0) {
    if (yPos > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage();
      yPos = 30;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55);
    doc.text('KEY FEATURES', margin, yPos);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    project.features.forEach((feature, i) => {
      doc.text(`• ${feature}`, margin + 5, yPos + 10 + (i * 6));
    });
  }
  
  addPDFFooter(doc);
  doc.save(`${project.slug || 'project'}-brochure.pdf`);
};

/**
 * Export property details as professional PDF brochure
 */
export const exportPropertyPDF = (property) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  addPDFHeader(doc, 'Property Brochure');
  
  // Title Section
  let yPos = 65;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text(property.title, margin, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100);
  const addressText = `${property.location?.address}, ${property.location?.area}, ${property.location?.city}`;
  const splitAddress = doc.splitTextToSize(addressText, pageWidth - (margin * 2));
  doc.text(splitAddress, margin, yPos);
  yPos += (splitAddress.length - 1) * 5;
  
  // Price Tag
  yPos += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(212, 175, 55);
  const priceText = `BDT ${property.price?.toLocaleString('en-BD')}`;
  doc.text(priceText, margin, yPos);
  
  if (property.listingType === 'rent') {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(150);
    const priceWidth = doc.getTextWidth(priceText);
    doc.text(' / MONTH', margin + priceWidth + 5, yPos - 1);
  }
  
  // Essential Specs Grid
  yPos += 15;
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 25, 'F');
  
  const colWidth = (pageWidth - (margin * 2)) / 4;
  const labels = ['BEDS', 'BATHS', 'AREA (sqft)', 'TYPE'];
  const values = [property.bedrooms || 'N/A', property.bathrooms || 'N/A', property.size || property.area || 'N/A', property.propertyType?.toUpperCase() || 'N/A'];
  
  labels.forEach((label, i) => {
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(label, margin + (colWidth * i) + 10, yPos + 8);
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(String(values[i]), margin + (colWidth * i) + 10, yPos + 18);
  });
  
  // Details Table
  yPos += 45;
  doc.setFontSize(14);
  doc.setTextColor(212, 175, 55);
  doc.text('PROPERTY DETAILS', margin, yPos);
  
  const details = [
    ['Listing Type', property.listingType === 'sale' ? 'FOR SALE' : 'FOR RENT'],
    ['Property Type', property.propertyType || 'Residential'],
    ['Address', property.location?.address || 'N/A'],
    ['Area', property.location?.area || 'N/A'],
    ['Status', property.status || 'AVAILABLE'],
    ['Featured', property.featured ? 'YES' : 'NO']
  ];
  
  autoTable(doc, {
    startY: yPos + 5,
    body: details,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 4, overflow: 'linebreak' },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { cellWidth: 'auto' } },
    margin: { left: margin, right: margin }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Description
  if (property.description) {
    autoTable(doc, {
      startY: yPos,
      head: [['ABOUT THIS PROPERTY']],
      body: [[property.description]],
      theme: 'plain',
      headStyles: { 
        fontSize: 14, 
        textColor: [212, 175, 55], 
        fontStyle: 'bold',
        cellPadding: { bottom: 5 } 
      },
      styles: { 
        fontSize: 10, 
        textColor: [60, 60, 60], 
        cellPadding: 0,
        overflow: 'linebreak'
      },
      margin: { left: margin, right: margin }
    });
    yPos = doc.lastAutoTable.finalY + 15;
  }
  
  // Amenities
  if (property.amenities && property.amenities.length > 0) {
    if (yPos > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage();
      yPos = 30;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55);
    doc.text('AMENITIES', margin, yPos);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    property.amenities.forEach((amenity, i) => {
      doc.text(`• ${amenity}`, margin + 5, yPos + 10 + (i * 6));
    });
  }
  
  addPDFFooter(doc);
  doc.save(`${property.slug || 'property'}-brochure.pdf`);
};

/**
 * Export properties list as CSV
 * @param {Array} properties - Array of properties
 */
export const exportPropertiesCSV = (properties) => {
  const headers = ['Title', 'Price', 'Type', 'Listing', 'Bedrooms', 'Bathrooms', 'Area (sqft)', 'Location', 'Address'];
  
  const rows = properties.map(p => [
    p.title,
    p.price,
    p.propertyType,
    p.listingType === 'sale' ? 'For Sale' : 'For Rent',
    p.bedrooms,
    p.bathrooms,
    p.size,
    `${p.location?.area}, ${p.location?.city}`,
    p.location?.address
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `properties-${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export leads as CSV
 * @param {Array} leads - Array of leads
 */
export const exportLeadsCSV = (leads) => {
  const headers = ['Name', 'Email', 'Phone', 'Message', 'Status', 'Property', 'Date'];
  
  const rows = leads.map(l => [
    l.name,
    l.email,
    l.phone,
    l.message?.replace(/\n/g, ' '),
    l.status,
    l.property?.title || 'General Inquiry',
    new Date(l.createdAt).toLocaleDateString()
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `leads-${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export users as CSV
 * @param {Array} users - Array of users
 */
export const exportUsersCSV = (users) => {
  const headers = ['Name', 'Email', 'Role', 'Status', 'Joined Date'];
  
  const rows = users.map(u => [
    u.name,
    u.email,
    u.role,
    u.isActive ? 'Active' : 'Inactive',
    new Date(u.createdAt).toLocaleDateString()
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `users-${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
