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
    console.log('ResumeActions: Print - currentResume:', !!currentResume);
    console.log('ResumeActions: Print - resumeRef.current:', !!resumeRef?.current);
    
    if (typeof window !== 'undefined' && currentResume && resumeRef.current) {
      const printWindow = window.open('', '_blank');
      const resumeContent = resumeRef.current.innerHTML;
      
      // Get all stylesheets from the current page
      const stylesheets = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            // Handle CORS issues with external stylesheets
            console.warn('Could not access stylesheet:', styleSheet.href);
            return '';
          }
        })
        .join('\n');

      // Get computed styles for common elements to ensure they're preserved
      const getComputedStylesForElement = (selector) => {
        const element = resumeRef.current.querySelector(selector);
        if (element) {
          const computedStyle = window.getComputedStyle(element);
          return {
            fontFamily: computedStyle.fontFamily,
            fontSize: computedStyle.fontSize,
            fontWeight: computedStyle.fontWeight,
            color: computedStyle.color,
            lineHeight: computedStyle.lineHeight,
            marginTop: computedStyle.marginTop,
            marginBottom: computedStyle.marginBottom,
            paddingTop: computedStyle.paddingTop,
            paddingBottom: computedStyle.paddingBottom,
          };
        }
        return {};
      };

      // Extract key styles for common resume elements
      const titleStyle = getComputedStylesForElement('h1, .name, .resume-name');
      const sectionTitleStyle = getComputedStylesForElement('h2, .section-title');
      const jobTitleStyle = getComputedStylesForElement('.job-title, .position-title');
      const companyStyle = getComputedStylesForElement('.company, .company-name');
      const bulletStyle = getComputedStylesForElement('.bullet-point, ul li');

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Resume - ${currentResume.name || 'Resume'}</title>
            <meta charset="utf-8">
            <style>
              @page { 
                size: A4; 
                margin: 15mm; 
              }
              
              * {
                box-sizing: border-box;
              }
              
              body { 
                margin: 0; 
                padding: 0;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                font-size: 10px; 
                line-height: 1.2; 
                color: #333;
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .print-container { 
                background: white; 
                width: 100%;
                max-width: none;
                padding: 0;
                margin: 0;
              }
              
              /* Prevent awkward breaks */
              .job-entry, .education-entry, .section { 
                page-break-inside: avoid; 
                margin: 0 0 4px 0;
                padding: 0;
              }
              
              h1, h2, h3, .section-title { 
                page-break-after: avoid; 
                margin: 0;
                padding: 0;
              }
              
              /* Resume-specific styles - BLACK AND WHITE ONLY */
              h1, .name, .resume-name {
                font-size: 20px !important;
                font-weight: 700 !important;
                margin: 0 !important;
                padding: 0 !important;
                color: black !important;
                text-decoration: none !important;
              }
              
              h2, .section-title {
                font-size: 13px !important;
                font-weight: 600 !important;
                margin: 8px 0 3px 0 !important;
                padding: 0 0 1px 0 !important;
                color: black !important;
                border-bottom: 1px solid black !important;
                text-decoration: none !important;
              }
              
              .job-title, .position-title {
                font-size: 11px !important;
                font-weight: 600 !important;
                color: black !important;
                margin: 4px 0 1px 0 !important;
                padding: 0 !important;
                text-decoration: none !important;
              }
              
              .company, .company-name {
                font-size: 10px !important;
                font-weight: 500 !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
                text-decoration: none !important;
              }
              
              .date-location, .date-range {
                font-size: 9px !important;
                color: black !important;
                margin: 0 0 2px 0 !important;
                padding: 0 !important;
                text-decoration: none !important;
              }
              
              .bullet-point, .description {
                font-size: 9px !important;
                line-height: 1.2 !important;
                color: black !important;
                margin: 1px 0 !important;
                padding: 0 !important;
                text-decoration: none !important;
              }
              
              .bullet-point {
                margin-left: 8px !important;
                text-indent: -8px !important;
              }
              
              /* Contact info */
              .contact-info, .contact-info * {
                font-size: 9px !important;
                color: black !important;
                margin: 0 0 4px 0 !important;
                padding: 0 !important;
                text-decoration: none !important;
                line-height: 1.2 !important;
              }
              
              /* Skills and other sections */
              .skills-list, .skill-item {
                font-size: 9px !important;
                color: black !important;
                text-decoration: none !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              
              /* Dividers */
              .divider, hr {
                border: none !important;
                border-bottom: 1px solid black !important;
                margin: 2px 0 !important;
                padding: 0 !important;
              }
              
              /* Remove ALL colors and underlines */
              * {
                color: black !important;
                text-decoration: none !important;
              }
              
              a, a:visited, a:hover, a:active {
                color: black !important;
                text-decoration: none !important;
              }
              
              /* Ensure proper spacing - MINIMAL GAPS */
              p {
                margin: 0 !important;
                padding: 0 !important;
              }
              
              div {
                margin: 0 !important;
                padding: 0 !important;
              }
              
              /* Remove any default spacing from common elements */
              ul, ol {
                margin: 0 !important;
                padding: 0 !important;
              }
              
              li {
                margin: 0 !important;
                padding: 0 !important;
              }
              
              /* Hide any unwanted elements */
              button, .no-print, .print-button {
                display: none !important;
              }
              
              /* Custom styles from your app */
              ${stylesheets}
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
      
      // Wait for content and styles to load before printing
      setTimeout(() => {
        printWindow.print();
        // Don't auto-close to let user see the preview
        // printWindow.close();
      }, 1500);
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
                  className="w-full sm:w-32 text-sm bg-black text-white"
                  disabled={loading}
                >
                  {loading ? 'Generating...' : error ? 'Error - Try Again' : 'Download PDF'}
                </Button>
              );
            }}
          </PDFDownloadLink>
        ) : (
          <Button className="w-full sm:w-32 text-sm bg-black text-white" disabled>
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
          className="w-full sm:w-32 text-sm bg-orange-500 text-white" 
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
          className="w-full sm:w-32 text-sm bg-red-600 text-white" 
          disabled={!currentResume}
        >
          Share
        </Button>
      </div>
    </div>
  );
};

export default ResumeActions