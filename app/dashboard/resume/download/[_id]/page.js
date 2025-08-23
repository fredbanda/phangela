"use client";

import { Button } from '@/components/ui/button';
import DownloadIcon from "../../../../../assets/downloadicon.png";
import PrintIcon from "../../../../../assets/printericon.png";
import ShareIcon from "../../../../../assets/shareicon.png";
import Image from 'next/image';
import { useResume } from '@/context/resume';
import { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import PreviewCard from '@/components/cards/preview-card';

export default function DownloadResumePage({ params }) {
  const { resumes } = useResume();
  const [currentResume, setCurrentResume] = useState(null);
  const [scale, setScale] = useState(() => {
    if (typeof window !== 'undefined') {
      const windowWidth = window.innerWidth;
      const padding = 32; // Approximate px-4 * 2 (assuming 1rem = 16px)
      const availableWidth = windowWidth - padding;
      const a4WidthMm = 210;
      const mmToPx = 3.779527559; // CSS mm to px conversion at 96dpi
      const a4WidthPx = a4WidthMm * mmToPx;
      if (availableWidth < a4WidthPx) {
        return availableWidth / a4WidthPx;
      }
    }
    return 1;
  });
  const resumeRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (resumes && params?._id) {
      const resume = resumes.find((resume) => resume._id === params._id);
      setCurrentResume(resume);
    }
  }, [resumes, params._id]);

  useEffect(() => {
    const updateScale = () => {
      if (typeof window !== 'undefined') {
        const windowWidth = window.innerWidth;
        const padding = 32;
        const availableWidth = windowWidth - padding;
        const a4WidthMm = 210;
        const mmToPx = 3.779527559;
        const a4WidthPx = a4WidthMm * mmToPx;
        if (availableWidth < a4WidthPx) {
          setScale(availableWidth / a4WidthPx);
        } else {
          setScale(1);
        }
      }
    };

    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (resumeRef.current && wrapperRef.current && currentResume) {
      const actualHeight = resumeRef.current.scrollHeight;
      wrapperRef.current.style.height = `${actualHeight * scale}px`;
    }
  }, [currentResume, scale]);

  const createSafeFilename = (name) => {
    if (!name) return `resume-${params._id}`;
    const safeName = name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    return `${safeName}_resume`;
  };

  const downloadPDF = async () => {
    if (!resumeRef.current || !currentResume) return;

    const element = resumeRef.current;
    const userName = currentResume?.personalInfo?.name || 'resume';
    const filename = createSafeFilename(userName);

    // Calculate actual height in mm for custom page size
    const heightMm = (element.scrollHeight / element.offsetWidth) * 210;

    const opt = {
      margin: 0,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 1.5, useCORS: true },
      jsPDF: { unit: 'mm', format: [210, heightMm], orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], before: '.page-break-before' }
    };

    try {
      console.log('Generating PDF...');
      await html2pdf().set(opt).from(element).save();
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };
  
  const printResume = () => {
    if (typeof window !== 'undefined' && currentResume && resumeRef.current) {
      const printWindow = window.open('', '_blank');
      const resumeContent = resumeRef.current.innerHTML;
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Resume</title>
            <style>
              /* Add your print-specific styles here */
              @page { size: A4; margin: 0; }
              body { margin: 0; font-family: sans-serif; }
              .print-container { padding: 15mm; box-sizing: border-box; width: 210mm; background: white; }
              .job-entry, .education-entry { page-break-inside: avoid; }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${resumeContent}
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
  };

  const shareResume = () => {
    if (navigator.share && currentResume) {
      const userName = currentResume?.personalInfo?.name || 'Professional';
      navigator.share({
        title: `${userName}'s Resume`,
        text: `Check out ${userName}'s professional resume`,
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing:', error);
        // Fallback to copying URL
        copyToClipboard();
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Resume link copied to clipboard!');
    }).catch(() => {
      // Final fallback
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Resume link copied to clipboard!');
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 bg-gray-100">
      {/* Global styles for PDF generation and printing */}
      <style jsx global>{`
        .job-entry,
        .education-entry,
        .summary-section,
        .skills-section {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .page-break-before {
          page-break-before: always !important;
          break-before: page !important;
        }
      `}</style>
      
      <div className="max-w-4xl text-center w-full">
        <h2 className="font-bold text-lg sm:text-xl mb-4 px-2">
          🎉 Congratulations on finishing your CV or résumé!
        </h2>
        <p className="text-gray-600 mb-6 sm:mb-10 text-sm sm:text-base px-2">
          Now, choose what you'd like to do with your ATS-ready CV or résumé. 
          You can download it as a PDF, print it out, or share it with your contacts.
        </p>

        {/* Responsive resume container */}
        <div 
          ref={resumeRef}
          className="resume-pdf-container shadow-lg mx-auto bg-white overflow-hidden"
          style={{
            // Desktop: A4 dimensions
            // Mobile: Full width with proper scaling
            width: 'min(100%, 210mm)',
            minHeight: 'auto',
            boxSizing: 'border-box',
            padding: 'clamp(10px, 3vw, 15mm)' // Responsive padding
          }}
        >
          {currentResume ? (
            <PreviewCard resume={currentResume} />
          ) : (
            <div className="flex justify-center items-center h-32 sm:h-64">
              <p className="text-sm sm:text-base">Loading resume...</p>
            </div>
          )}
        </div>

        {/* Mobile-friendly action buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-10 mt-6 sm:mt-8 px-4">
          {/* Download Button */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 relative">
              <Image 
                src={DownloadIcon} 
                alt="download icon" 
                fill
                className="object-contain"
              />
            </div>
            <Button 
              onClick={downloadPDF} 
              className="w-full sm:w-32 text-sm" 
              disabled={!currentResume}
            >
              Download
            </Button>
          </div>

          {/* Print Button - Fixed to call printResume */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 relative">
              <Image 
                src={PrintIcon} 
                alt="print icon" 
                fill
                className="object-contain"
              />
            </div>
            <Button 
              onClick={printResume} 
              className="w-full sm:w-32 text-sm" 
              disabled={!currentResume}
            >
              Print
            </Button>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 relative">
              <Image 
                src={ShareIcon} 
                alt="share icon" 
                fill
                className="object-contain"
              />
            </div>
            <Button 
              onClick={shareResume} 
              className="w-full sm:w-32 text-sm" 
              disabled={!currentResume}
            >
              Share
            </Button>
          </div>
        </div>

        <div className="my-10 sm:my-20" />
      </div>
    </div>
  );
}