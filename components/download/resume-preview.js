"use client";

import { useState, useEffect } from 'react';
import PrintPreviewCard from '@/components/cards/print-preview-card';

console.log('ResumePreview: Component loaded');

const ResumePreview = ({ currentResume, resumeRef }) => {
  console.log('ResumePreview: Rendering with currentResume:', !!currentResume);
  
  const [scale, setScale] = useState(() => {
    if (typeof window !== 'undefined') {
      const windowWidth = window.innerWidth;
      const padding = 32;
      const availableWidth = windowWidth - padding;
      const a4WidthMm = 210;
      const mmToPx = 3.779527559;
      const a4WidthPx = a4WidthMm * mmToPx;
      if (availableWidth < a4WidthPx) {
        return availableWidth / a4WidthPx;
      }
    }
    return 1;
  });

  useEffect(() => {
    console.log('ResumePreview: Setting up resize listener');
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

  return (
    <div 
      ref={resumeRef}
      className="resume-pdf-container shadow-lg mx-auto bg-white overflow-hidden mb-10 text-black"
      style={{
        width: 'min(100%, 210mm)',
        minHeight: 'auto',
        boxSizing: 'border-box',
        padding: 'clamp(10px, 3vw, 15mm)',
      }}
    >
      {currentResume ? (
        <>
          {console.log('ResumePreview: Rendering PrintPreviewCard with resume')}
          <PrintPreviewCard resume={currentResume} />
        </>
      ) : (
        <>
          {console.log('ResumePreview: No resume, showing loading message')}
          <div className="flex justify-center items-center h-32 sm:h-64">
            <p className="text-sm sm:text-base">Loading resume...</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumePreview;