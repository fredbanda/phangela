"use client";

import { Button } from '@/components/ui/button';
import DownloadIcon from "../../assets/downloadicon.png";
import PrintIcon from "../../assets/printericon.png";
import ShareIcon from "../../assets/shareicon.png";
import EditIcon from "../../assets/editicon.png";
import Image from 'next/image';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useRouter } from 'next/navigation';
import ResumePDFDocument from './resume-document';

console.log('ResumeActions: Component loaded');

const ResumeActions = ({ currentResume, params, resumeRef }) => {
  console.log('ResumeActions: Rendering with currentResume:', !!currentResume, 'params:', params);
  
  const router = useRouter();

  const createSafeFilename = (resume) => {
    console.log('ResumeActions: Creating safe filename for resume:', !!resume);
    if (!resume) return `resume-${params._id}`;
    
    // Try multiple possible name locations
    const name = resume.personalInfo?.name || resume.name || resume.fullName;
    console.log('ResumeActions: Extracted name for filename:', name);
    
    if (!name) return `resume-${params._id}`;
    
    const safeName = name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    console.log('ResumeActions: Safe filename:', `${safeName}_resume`);
    return `${safeName}_resume`;
  };

  // Resume Print function
const printResume = () => {
  console.log('ResumeActions: Print function called');

  if (typeof window !== 'undefined' && currentResume && resumeRef.current) {
    const printWindow = window.open('', '_blank');
    const resumeContent = resumeRef.current.innerHTML;

    // Enhanced style extraction for print
    const existingStyles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .filter(rule => {
              const cssText = rule.cssText.toLowerCase();
              // Keep layout-related rules, exclude problematic ones
              return (
                cssText.includes('display:') ||
                cssText.includes('flex') ||
                cssText.includes('grid') ||
                cssText.includes('position:') ||
                cssText.includes('width:') ||
                cssText.includes('height:') ||
                cssText.includes('margin:') ||
                cssText.includes('padding:') ||
                cssText.includes('overflow:') ||
                cssText.includes('page-break')
              ) && !cssText.includes('color:');
            })
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Resume - ${currentResume.name || 'Resume'}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="/styles/print-resume.css">
          <style>
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: white !important;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            .print-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              box-sizing: border-box;
              overflow: visible;
            }
            /* Preserve original layout styles */
            ${existingStyles}
            /* Print-specific overrides */
            @media print {
              .print-container {
                width: 100%;
                max-width: 100%;
              }
              .header, .resume-header, .personal-info, .contact-info {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                text-align: center !important; /* Center text content */
                margin: 0 auto !important; /* Center block elements */
                width: 100%; /* Ensure full width for centering */
              }
              /* Ensure child elements respect centering */
              .header *, .resume-header *, .personal-info *, .contact-info * {
                text-align: center !important;
              }
              /* Prevent content from being cut off */
              * {
                overflow: visible !important;
                page-break-inside: avoid;
              }
              /* Force page breaks for large sections */
              h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
                page-break-inside: avoid;
              }
              /* Ensure images and tables don’t overflow */
              img, table {
                max-width: 100%;
                height: auto;
              }
            }
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

    // Wait for external stylesheet to load before printing
    const stylesheet = printWindow.document.querySelector('link[href="/styles/print-resume.css"]');
    if (stylesheet) {
      stylesheet.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
      stylesheet.onerror = () => {
        console.error('Failed to load print stylesheet');
        printWindow.focus();
        printWindow.print();
      };
    } else {
      // Fallback if no stylesheet is loaded
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    }
  }
};

  // Resume share function
  const shareResume = () => {
    if (navigator.share && currentResume) {
      const userName = currentResume?.personalInfo?.name || currentResume?.name || 'Professional';
      navigator.share({
        title: `${userName}'s Resume`,
        text: `Check out ${userName}'s professional resume`,
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing:', error);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Resume link copied to clipboard!');
    }).catch(() => {
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
    <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-10 mt-6 sm:mt-8 px-4 mb-44">
      {/* Edit Button */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 relative">
          <Image 
            src={EditIcon} 
            alt="edit icon" 
            fill
            className="object-contain"
          />
        </div>
        <Button 
          onClick={() => router.push(`/dashboard/resume/edit/${params._id}`)}
          className="w-full sm:w-32 text-sm bg-emerald-700 hover:bg-emerald-400 text-white" 
          disabled={!currentResume}
          
        >
          Edit
        </Button>
      </div>

      {/* Download Button - Now uses React-PDF */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 relative">
          <Image 
            src={DownloadIcon} 
            alt="download icon" 
            fill
            className="object-contain"
          />
        </div>
        {currentResume ? (
          <PDFDownloadLink
            document={<ResumePDFDocument resume={currentResume} />}
            fileName={`${createSafeFilename(currentResume)}.pdf`}
            className="w-full sm:w-32"
          >
            {({ blob, url, loading, error }) => {
              if (error) {
                console.error('PDF generation error:', error);
              }
              return (
                <Button 
                  className="w-full sm:w-32 text-sm bg-black text-white hover:bg-black"
                  disabled={loading}
                >
                  {loading ? 'Generating...' : error ? 'Error - Try Again' : 'Download PDF'}
                </Button>
              );
            }}
          </PDFDownloadLink>
        ) : (
          <Button className="w-full sm:w-32 text-sm bg-black text-white hover:bg-gray-600" disabled>
            Download PDF
          </Button>
        )}
      </div>

      {/* Print Button */}
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
          className="w-full sm:w-32 text-sm bg-orange-500 text-white hover:bg-orange-600" 
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
          className="w-full sm:w-32 text-sm bg-red-600 text-white  hover:bg-red-800" 
          disabled={!currentResume}
        >
          Share
        </Button>
      </div>
    </div>
  );
};

export default ResumeActions