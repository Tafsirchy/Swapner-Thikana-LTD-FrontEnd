import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
    ['Price', ...properties.map(p => `৳${p.price?.toLocaleString('en-BD')}`)],
    ['Listing Type', ...properties.map(p => p.listingType === 'sale' ? 'For Sale' : 'For Rent')],
    ['Property Type', ...properties.map(p => p.propertyType)],
    ['Bedrooms', ...properties.map(p => p.bedrooms)],
    ['Bathrooms', ... properties.map(p => p.bathrooms)],
    ['Area (sqft)', ...properties.map(p => p.size?.toLocaleString('en-BD'))],
    ['Location', ...properties.map(p => `${p.location?.area}, ${p.location?.city}`)],
    ['Address', ...properties.map(p => p.location?.address)],
    ['Featured', ...properties.map(p => p.featured ? 'Yes' : 'No')],
  ];
  
  doc.autoTable({
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
      cellPadding: 3
    },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [245, 245, 245] }
    }
  });
  
  // Add amenities section
  const allAmenities = [...new Set(properties.flatMap(p => p.amenities || []))];
  
  if (allAmenities.length > 0) {
    const amenitiesData = allAmenities.map(amenity => [
      amenity,
      ...properties.map(p => p.amenities?.includes(amenity) ? '✓' : '✗')
    ]);
    
    doc.autoTable({
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
 * Export property details as PDF brochure
 * @param {Object} property - Property object
 */
export const exportPropertyPDF = (property) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header with golden background
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255);
  doc.text('STLTD Properties', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('Property Brochure', pageWidth / 2, 28, { align: 'center' });
  
  // Property Title
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text(property.title, 15, 55);
  
  // Price
  doc.setFontSize(20);
  doc.setTextColor(212, 175, 55);
  doc.text(`৳${property.price?.toLocaleString('en-BD')}`, 15, 65);
  
  // Location
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`${property.location?.area}, ${property.location?.city}`, 15, 73);
  
  // Property Details Table
  const detailsData = [
    ['Property Type', property.propertyType],
    ['Listing Type', property.listingType === 'sale' ? 'For Sale' : 'For Rent'],
    ['Bedrooms', property.bedrooms],
    ['Bathrooms', property.bathrooms],
    ['Area', `${property.size?.toLocaleString('en-BD')} sqft`],
    ['Address', property.location?.address],
    ['Status', property.status || 'Available'],
  ];
  
  doc.autoTable({
    startY: 82,
    body: detailsData,
    theme: 'plain',
    styles: {
      fontSize: 11,
      cellPadding: 3
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Description
  if (property.description) {
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Description', 15, doc.lastAutoTable.finalY + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    const splitDescription = doc.splitTextToSize(property.description, pageWidth - 30);
    doc.text(splitDescription, 15, doc.lastAutoTable.finalY + 23);
  }
  
  // Amenities
  if (property.amenities && property.amenities.length > 0) {
    const amenitiesY = doc.lastAutoTable.finalY + (property.description ? 45 : 25);
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Amenities', 15, amenitiesY);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    
    property.amenities.forEach((amenity, index) => {
      doc.text(`• ${amenity}`, 15, amenitiesY + 8 + (index * 6));
    });
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    `Generated on ${new Date().toLocaleDateString('en-BD')} | STLTD Properties`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );
  
  // Save
  const filename = `${property.slug || 'property'}-brochure.pdf`;
  doc.save(filename);
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
