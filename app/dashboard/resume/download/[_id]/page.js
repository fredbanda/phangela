"use client";

import { Button } from '@/components/ui/button';
import DownloadIcon from "../../../../../assets/downloadicon.png";
import PrintIcon from "../../../../../assets/printericon.png";
import ShareIcon from "../../../../../assets/shareicon.png";
import Image from 'next/image';
import { useResume } from '@/context/resume';
import { useState, useEffect, useRef } from 'react';
import ResumeCard from '@/components/cards/resume-card';
import html2pdf from 'html2pdf.js';
import toast from 'react-hot-toast';

export default function DownloadResumePage({ params }) {
  const { resumes } = useResume();
  const [currentResume, setCurrentResume] = useState(null);
  const resumeRef = useRef(null); // Reference to the ResumeCard component
  

  useEffect(() => {
    if (resumes && params?._id) {
      const resume = resumes.find((resume) => resume._id === params._id);
      setCurrentResume(resume);
    }
  }, [resumes, params._id]);

  const downloadPDF = () => {
    if (!resumeRef.current) return;

    const element = resumeRef.current;
    const opt = {
      margin: 0.5,
      filename: `resume-${params._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  };


  const printResume = () => {
    if (typeof window !== 'undefined' && currentResume && resumeRef.current) {
      // Create a new window
      const printWindow = window.open('', '_blank');
      
      // Get the HTML content of the ResumeCard
      const resumeContent = resumeRef.current.outerHTML;
      
      // Write the resume content to the new window with basic styling
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Resume</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif;
              }
              @media print {
                @page { margin: 0.5in; }
              }
            </style>
          </head>
          <body>
            ${resumeContent}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close(); // Close the window after printing
        }, 300); // Small delay to ensure rendering
      };
    }
  };



  const shareResume = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: "My Resume",
        text: 'Check out my resume!',
        url: window.location.href,
      }).catch((err) => console.error('Share failed:', err));
    } else {
      alert('Web Share API is not supported in this browser.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 mx-auto overflow-auto">
      <div className="max-w-lg text-center">
        <h2 className="font-bold text-xl mb-4">
          🎉 Congratulations on finishing your CV or résumé!
        </h2>
        <p className="text-gray-600 mb-10">
          Now, choose what you&apos;d like to do with your ATS-ready CV or résumé. 
          You can download it as a PDF, print it out, or share it with your contacts.
        </p>

        <div ref={resumeRef}>
          {currentResume ? <ResumeCard resume={currentResume} /> : null}
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-10 mt-8">
          <div className="flex flex-col items-center">
            <Image src={DownloadIcon} alt="download icon" width={50} height={50} />
            <Button onClick={downloadPDF} className="mt-2 w-32">Download</Button>
          </div>
          <div className="flex flex-col items-center">
            <Image src={PrintIcon} alt="print icon" width={50} height={50} />
            <Button onClick={printResume} className="mt-2 w-32">Print</Button>
          </div>
          <div className="flex flex-col items-center">
            <Image src={ShareIcon} alt="share icon" width={50} height={50} />
            <Button onClick={shareResume} className="mt-2 w-32">Share</Button>
          </div>
        </div>

        <div className="my-20" />
      </div>
    </div>
  );
}