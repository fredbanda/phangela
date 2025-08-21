'use client';

import {
  getResumeFromDB,
  getUserResumesFromDB,
  saveResumeToDB,
  updateExperienceOnDB,
  updateResumeFromDB,
  updateEducationOnDB,
} from '@/actions/resume';
import { useEffect, useRef, useState } from 'react';
import { createContext, useContext } from 'react';
import toast from 'react-hot-toast';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { generateSummary } from '@/actions/gemini';

const ResumeContext = createContext();

const experienceField = {
  position: '',
  company: '',
  address: '',
  city: '',
  startDate: '',
  endDate: '',
  jobSummary: '',
};

const educationField = {
  institution: '',
  qualification: '',
  address: '',
  city: '',
  startDate: '',
  endDate: '',
  educationSummary: '',
};

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
  education: [educationField],
  skills: [],
};

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(initialState);
  const [step, setStep] = useState(1);
  const [resumes, setResumes] = useState([]);
  const pathname = usePathname();

  // Experience
  const [experienceList, setExperienceList] = useState([experienceField]);
  const [experienceLoading, setExperienceLoading] = useState({});

  // Education section
  const [educationList, setEducationList] = useState([educationField]);
  const [educationLoading, setEducationLoading] = useState(false)

  const router = useRouter();
  const calledRef = useRef(false);
  const { _id } = useParams();

  useEffect(() => {
    if (pathname?.includes('/resume/create')) {
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
      setStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.log(error);
      toast.error('❌ Failed to update resume.');
    }
  };

  //Experience section
  const updateExperience = async (experienceList) => {
    console.log('The experience list is', experienceList);
    try {
      const data = await updateExperienceOnDB({
        ...resume,
        experience: experienceList,
      });
      setResume(data);
      toast.success('💃🏿 Experience updated successfully');
      setStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.log(error);
      toast.error('❌ Failed to update experience.');
    }
  };

  useEffect(() => {
    if (resume.experience) {
      setExperienceList(resume.experience);
    }
  }, [resume]);

  const handleExperienceChange = (e, index) => {
    const newEntries = [...experienceList];
    const { name, value } = e.target;

    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };

  const handleExperienceQuillChange = (value, index) => {
    const newEntries = [...experienceList];
    newEntries[index].jobSummary = value;
    setExperienceList(newEntries);
  };

  const handleExperienceSubmit = () => {
    updateExperience(experienceList);
  };

  const addExperience = () => {
    const newExperience = { ...experienceField };
    setExperienceList([...experienceList, newExperience]);
    // database update
    setResume((prevState) => ({
      ...prevState,
      experience: [...experienceList, newExperience],
    }));  
  };

  const removeExperience = () => {
    if (experienceList.length === 1) return;
    const newEntries = experienceList.slice(0, experienceList.length - 1);
    setExperienceList(newEntries);

    // database update
    updateExperience(newEntries);
  };

  const handleExperienceGenerateWithAI = async (index) => {
    setExperienceLoading((prevState) => ({ ...prevState, [index]: true }));

    const selectedExperience = experienceList[index];
    if (!selectedExperience || !selectedExperience.position) {
      toast.error(
        'Please fill all the details about your work experience and qualifcations then generate'
      );
      setExperienceLoading((prevState) => ({ ...prevState, [index]: false }));
      return;
    }

    const jobTitle = selectedExperience.position;
    const dutiesSummary = selectedExperience.jobSummary || '';

    try {
      const response = await generateSummary(`
Write resume-ready bullet points for the job title "${jobTitle}".
- Use strong action verbs in past tense (e.g., "Developed", "Led", "Implemented").
- Keep each point concise (1–2 lines max).
- Focus on measurable achievements and responsibilities.
- Return ONLY plain text bullet points with no code blocks, no headings, no introductions.
- Format as an unordered list using <ul><li>...</li></ul> in HTML.
- Do not include "Duties and Responsibilities" as a heading.
Existing details to incorporate if relevant: ${dutiesSummary}
`);

      const updatedExperienceList = experienceList.slice();
      updatedExperienceList[index] = {
        ...selectedExperience,
        jobSummary: response,
      };
      setResume((prevState) => ({
        ...prevState,
        experience: updatedExperienceList,
      }));
    } catch (error) {
      console.log(error);
      toast.error('❌ Failed to generate summary.');
    } finally {
      setExperienceLoading((prevState) => ({ ...prevState, [index]: false }));
    }
  };

  // Experience Section
  useEffect(() => {
    if(resume.education){
      setEducationList(resume.education)
    }
  }, [resume]);

  const updateEducation = async (educationList) => {
    try {
      setEducationLoading(true);
      const data = await updateEducationOnDB({
        ...resume,
        education: educationList,
      });
      setResume(data);
      toast.success('💃🏿 Education updated successfully');
      setStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.log(error);
      toast.error('❌ Failed to update education.');
    } finally {
      setEducationLoading(false);
    }

  };

  const handleEducationChange = (e, index) => {
    const newEntries = [...educationList];
    const {name, value} = e.target;
    newEntries[index][name] = value;
    setEducationList(newEntries)
  };

  const handleEducationSubmit = () => {
    updateEducation(educationList)
    //setStep(5)
  };

const addEducation = () => {
  const newEducation = {...educationField}
  setEducationList([...educationList, newEducation]);

  setResume((prevState) => ({
    ...prevState,
    education: [...educationList, newEducation],
  }));  
};

const removeEducation = () => {
  if(educationList.length === 1) return;
  const newEntries = experienceList.slice(0, experienceList.length -1);
  setEducationList(newEntries);
  // database update
  updateEducation(newEntries);
}



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
        removeExperience,
        handleExperienceGenerateWithAI,
        experienceLoading,
        addExperience,
        educationList,
        handleEducationChange,
        handleEducationSubmit,
        removeEducation,
        addEducation,
        educationLoading,
        setEducationLoading,
        updateEducation,

      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);
