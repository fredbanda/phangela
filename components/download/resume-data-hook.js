"use client";

import { useState, useEffect } from 'react';
import { useResume } from '@/context/resume';

console.log('useResumeData: Hook module loaded');

const useResumeData = (params) => {
  console.log('useResumeData: Hook called with params:', params);
  
  const { resumes } = useResume();
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('useResumeData: Initial state - resumes count:', resumes?.length || 0, 'loading:', loading);

  useEffect(() => {
    console.log('useResumeData: useEffect triggered');
    console.log('useResumeData: resumes:', !!resumes, 'params._id:', params?._id);
    
    if (resumes && params?._id) {
      console.log('useResumeData: Searching for resume with ID:', params._id);
      console.log('useResumeData: Available resume IDs:', resumes.map(r => r._id));
      
      const resume = resumes.find((resume) => resume._id === params._id);
      console.log('useResumeData: Found resume:', !!resume);
      
      if (resume) {
        console.log('useResumeData: Resume found! Structure keys:', Object.keys(resume));
        console.log('useResumeData: Resume data structure:');
        console.log('- Name:', resume.name || resume.personalInfo?.name || 'NOT FOUND');
        console.log('- Email:', resume.email || resume.personalInfo?.email || 'NOT FOUND');
        console.log('- Experience count:', (resume.experience || []).length);
        console.log('- Education count:', (resume.education || []).length);
        console.log('- Skills count:', (resume.skills || []).length);
        console.log('- Full resume object:', resume);
      } else {
        console.log('useResumeData: No matching resume found for ID:', params._id);
      }
      
      setCurrentResume(resume);
      setLoading(false);
      console.log('useResumeData: State updated - currentResume:', !!resume, 'loading: false');
    } else if (resumes) {
      console.log('useResumeData: Resumes loaded but no matching ID or invalid params');
      console.log('useResumeData: Resumes available:', resumes.length);
      console.log('useResumeData: Params ID:', params?._id);
      setLoading(false);
      console.log('useResumeData: Loading set to false (no matching resume)');
    } else if (resumes === null || resumes === undefined) {
      console.log('useResumeData: Resumes still loading from context...');
    }
  }, [resumes, params._id]);

  console.log('useResumeData: Returning - currentResume:', !!currentResume, 'loading:', loading);
  return { currentResume, loading };
};

export default useResumeData;