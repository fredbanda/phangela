"use client";

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Coffee from "../../../../../assets/coffee-cup.png";
import useResumeData from '@/components/download/resume-data-hook';
import ResumePreview from '@/components/download/resume-preview';
import ResumeActions from '@/components/download/resume-actions';

console.log('DownloadResumePage: Component loaded');

export default function DownloadResumePage({ params }) {
  console.log('DownloadResumePage: Rendering with params:', params);
  
  const { currentResume, loading } = useResumeData(params);
  const resumeRef = useRef(null);

  console.log('DownloadResumePage: Hook results - loading:', loading, 'currentResume:', !!currentResume);
  
  if (currentResume) {
    console.log('DownloadResumePage: Current resume data:', {
      id: currentResume._id,
      name: currentResume.name || currentResume.personalInfo?.name,
      hasExperience: (currentResume.experience || []).length > 0,
      hasEducation: (currentResume.education || []).length > 0,
      hasSkills: (currentResume.skills || []).length > 0
    });
  }

  if (loading) {
    console.log('DownloadResumePage: Still loading...');
    return (
      <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 bg-gray-100">
        <div className="text-center">
          <p className="text-lg">Loading your resume...</p>
        </div>
      </div>
    );
  }

  if (!currentResume) {
    console.log('DownloadResumePage: No resume found after loading completed');
    return (
      <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 bg-gray-100">
        <div className="text-center">
          <p className="text-lg">Resume not found</p>
          <p className="text-sm text-gray-600">ID: {params?._id}</p>
        </div>
      </div>
    );
  }

  console.log('DownloadResumePage: Rendering main content');

  return (
    <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 bg-gray-100">
      <div className="max-w-4xl text-center w-full">
        <h2 className="font-bold text-lg sm:text-xl mb-4 px-2">
          🎉 Congratulations on finishing your ATS-Ready CV!
        </h2>
        <p className="text-gray-600 mb-6 sm:mb-10 text-sm sm:text-base px-2">
          Your resume is now optimized for ATS systems with searchable text and proper formatting.
          Download as PDF, print, or share with your network.
        </p>

        <p className="text-gray-600 mb-6 sm:mb-10 text-sm sm:text-base px-2 font-bold">
          As a free app you can support us to keep the hosting to help more unemployed South Africans.
          <br />
          <Link href="https://www.buymeacoffee.com/phangela" target="_blank">
            <Image
              src={Coffee}
              alt="Buy Me A Coffee"
              width={60}
              height={20}
              className="mx-auto mt-3" 
            />
          </Link>
        </p>

        {/* Resume Preview Component */}
        <ResumePreview currentResume={currentResume} resumeRef={resumeRef} />

        {/* Action buttons Component */}
        <ResumeActions 
          currentResume={currentResume} 
          params={params} 
          resumeRef={resumeRef} 
        />

        <div className="my-10 sm:my-20" />
      </div>
    </div>
  );
}