'use client';

import {
  getResumeFromDB,
  getUserResumesFromDB,
  saveResumeToDB,
  updateExperienceOnDB,
  updateResumeFromDB,
  updateEducationOnDB,
  updateSkillsOnDB,
  deleteResumeFromDB,
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

const portfolioField = {
  title: '',
  description: '',
  url: '',
};

const skillsField = {
  name: '',
  level: '',
};

const initialState = {
  name: '',
  job: '',
  email: '',
  phone: '',
  address: '',
  location: '',
  city: '',
  linkedin: '',
  github: '',
  themeColor: '',
  experience: [experienceField],
  education: [educationField],
  skills: [skillsField],
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
  const [educationLoading, setEducationLoading] = useState(false);

  // Skills section
  const [skillsList, setSkillsList] = useState([skillsField]);
  const [skillsLoading, setSkillsLoading] = useState(false);

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
      setStep((prevStep) => prevStep + 1);
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
    if (resume?.experience) {
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
    if (resume?.education) {
      setEducationList(resume.education);
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
      //setStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.log(error);
      toast.error('❌ Failed to update education.');
    } finally {
      setEducationLoading(false);
    }
  };

  const handleEducationChange = (e, index) => {
    const newEntries = [...educationList];
    const { name, value } = e.target;
    newEntries[index][name] = value;
    setEducationList(newEntries);
  };

  const handleEducationSubmit = () => {
    updateEducation(educationList);
    setStep((prevStep) => prevStep + 1);
  };

  const addEducation = () => {
    const newEducation = { ...educationField };
    setEducationList([...educationList, newEducation]);

    setResume((prevState) => ({
      ...prevState,
      education: [...educationList, newEducation],
    }));
  };

  const removeEducation = () => {
    if (educationList.length === 1) return;
    const newEntries = experienceList.slice(0, experienceList.length - 1);
    setEducationList(newEntries);
    // database update
    updateEducation(newEntries);
  };

  // Skills section
  useEffect(() => {
    if (resume?.skills) {
      setSkillsList(resume.skills);
    }
  }, [resume]);

  const updateSkills = async (skillsList) => {
    setSkillsLoading(true);
    const invalidSkills = skillsList.filter(
      (skill) => !skill.name || !skill.level
    );
    if (invalidSkills.length > 0) {
      toast.error('Please fill all the details about your skills');
      setSkillsLoading(false);
      return;
    }

    try {
      const data = await updateSkillsOnDB({
        ...resume,
        skills: skillsList,
      });
      setResume(data);
      toast.success('💃🏿 Skills updated successfully');
      setSkillsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error('❌ Failed to update skills.');
    }
  };

  const handleSkillsChange = (e, index) => {
    const newEntries = [...skillsList];
    const { name, value } = e.target;
    newEntries[index][name] = value;
    setSkillsList(newEntries);
  };

  const handleSkillsSubmit = () => {
    updateSkills(skillsList);
    router.push(`/dashboard/resume/download/${resume._id}`);
  };

  const addSkill = () => {
    const newSkill = { ...skillsField };
    setSkillsList([...skillsList, newSkill]);

    setResume((prevState) => ({
      ...prevState,
      skills: [...skillsList, newSkill],
    }));
  };

  const removeSkill = () => {
    if (skillsList.length === 1) return;
    const newEntries = skillsList.slice(0, skillsList.length - 1);
    setSkillsList(newEntries);
    // database update
    updateSkills(newEntries);
  };

  const deleteResume = async (_id) => {
    try {
      const data = await deleteResumeFromDB(_id);
      setResume(resumes.filter((resume) => resume._id !== data._id));
      toast.success('💃🏿 Resume deleted successfully');
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error('❌ Failed to delete resume.');
    }
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
        skillsList,
        handleSkillsChange,
        handleSkillsSubmit,
        addSkill,
        removeSkill,
        skillsLoading,
        setSkillsLoading,
        updateSkills,
        deleteResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);
