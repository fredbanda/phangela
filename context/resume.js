'use client';

import {
  getResumeFromDB,
  getUserResumesFromDB,
  saveResumeToDB,
  updateResumeFromDB,
} from '@/actions/resume';
import { useEffect, useRef, useState } from 'react';
import { createContext, useContext } from 'react';
import toast from 'react-hot-toast';
import { useParams, usePathname, useRouter } from 'next/navigation';

const ResumeContext = createContext();

const experienceField = {
  title: '',
  company: '',
  location: '',
  city: '',
  startDate: '',
  endDate: '',
  summary: '',
}


const initialState = {
  name: '',
  job: '',
  email: '',
  phone: '',
  address: '',
  location: '',
  city: '',
  themeColor: '',
  experience: [experienceField],
  education: [],
  skills: [],
};

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(initialState);
  const [step, setStep] = useState(1);
  const [resumes, setResumes] = useState([]);
  const pathname = usePathname()

  // Experience
  const [experienceList, setExperienceList] = useState([experienceField])
  const [experienceLoading, setExperienceLoading] = useState(false)
  
  const router = useRouter();
  const calledRef = useRef(false);
  const { _id } = useParams();

  useEffect(() => {
    if(pathname?.includes("/resume/create")){
      setResume(initialState);
      setStep(1);
    }
  }, [pathname]);

  useEffect(() => {
    const savedResume = localStorage.getItem('resume');
    if (savedResume) {
      setResume(JSON.parse(savedResume));
    }
  }, []);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    getUserResumes();
  }, []);

  useEffect(() => {
    if (_id) {
      getResume();
    }
  }, [_id]);

  const saveResume = async () => {
    try {
      const data = await saveResumeToDB(resume);
      setResume(data);
      localStorage.removeItem('resume');
      toast.success('🥂 Resume saved successfully');
      router.push(`/dashboard/resume/edit/${data._id}`);
      setStep(2);
    } catch (error) {
      console.log(error);
      toast.error('❌ Failed to save resume.');
    }
  };

  const getUserResumes = async () => {
    try {
      const data = await getUserResumesFromDB();
      setResumes(data);
    } catch (error) {
      console.log(error);
      toast.error('❌ Failed to fetch resumes.');
    }
  };

  const getResume = async () => {
    try {
      const data = await getResumeFromDB(_id);
      setResume(data);
    } catch (error) {
      console.log(error);
      toast.error('❌ Failed to fetch resume.');
    }
  };

  const updateResume = async () => {
    try {
      const data = await updateResumeFromDB(resume);
      localStorage.removeItem('resume');
      setResume(data);
      toast.success('💃🏿 Resume updated successfully');
      setStep(prevStep => prevStep + 1);
    } catch (error) {
      console.log(error);
      toast.error('❌ Failed to update resume.');
    }
  };

  //Experience section

  useEffect(() => {
    if(resume.experience){
      setExperienceList(resume.experience)
    }
  }, [resume]);

  const handleExperienceChange = (e, index) => {

  };

  const handleExperienceQuillChange = (value, index) => {

  }

  const handleExperienceSubmit = () => {

  }

  const handleExperienceDelete = (index) => {

  }

  const handleExperienceGenerateWithAI = async (index) => {

  };

  return (
    <ResumeContext.Provider
      value={{
        resume,
        setResume,
        step,
        setStep,
        saveResume,
        resumes,
        setResumes,
        getUserResumes,
        updateResume,
        getResume,
        experienceList,
        handleExperienceChange,
        handleExperienceQuillChange,
        handleExperienceSubmit,
        handleExperienceDelete,
        handleExperienceGenerateWithAI,
        experienceLoading,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);
