import { jsPDF } from 'jspdf';

export const generateProfilePDF = (userData) => {
  // Create new document with better default font
  const doc = new jsPDF();
  doc.setFont("helvetica");
  
  // Define colors
  const primaryColor = [41, 128, 185]; // Blue
  const secondaryColor = [52, 73, 94]; // Dark blue-gray
  const textColor = [44, 62, 80]; // Dark slate
  const lightGray = [189, 195, 199]; // Light gray
  
  // Add logo/header area
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('User Profile Report', 20, 25);
  
  // Add subtle graphic element
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);
  
  // Profile summary box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, 55, 180, 40, 3, 3, 'F');
  
  // Personal Information Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...secondaryColor);
  doc.text('Personal Information', 20, 65);
  
  // User details with better formatting
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  
  // Create a function for two-column text
  const addLabelValuePair = (label, value, y) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${label} ${String(value)}`, 10, y);
};

  
  addLabelValuePair('Name:', userData.name, 75);
  addLabelValuePair('Username:', userData.username, 85);
  
  // Account Details Section with styled box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, 105, 180, 40, 3, 3, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...secondaryColor);
  doc.text('Account Details', 20, 115);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  
  addLabelValuePair('Email:', userData.email, 125);
  addLabelValuePair('Account Type:', userData.provider, 135);
  addLabelValuePair('Account ID:', userData.id, 145);
  
  // Add activity summary box if available
  if (userData.lastLogin) {
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, 155, 180, 30, 3, 3, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('Activity', 20, 165);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    addLabelValuePair('Last Login:', userData.lastLogin, 175);
  }
  
  // Add footer with subtle color background
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 260, 210, 35, 'F');
  
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(15, 260, 195, 260);
  
  // Footer text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 15, 270);
  doc.text('SocialApp - User Profile Report', 15, 280);
  
  // Add page number
  doc.setFont("helvetica", "italic");
  doc.text('Page 1', 185, 280);
  
  // Save the PDF with better naming
  const cleanUsername = userData.username.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const timestamp = new Date().toISOString().split('T')[0];
  doc.save(`${cleanUsername}-profile-${timestamp}.pdf`);
};