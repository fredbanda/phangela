"use client";

import { useResume } from '@/context/resume';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateSummary } from '@/actions/gemini';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

export default function StepTwo() {
  const { resume, setResume, updateResume, setStep } = useResume();

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateResume();
    // Move to the next step after saving
  };

  const handleGenerateWithAI = async () => {
    setLoading(true);
    if (!resume) {
      toast.error(
        'Please fill all the details about your work experience and qualifcations then generate'
      );

      setLoading(false);
      return;
    }
    const response = await generateSummary(`
Generate a professional resume summary of 35 to 75 words for a person with the following details: ${JSON.stringify(
      resume
    )}. 
Begin with a strong statement highlighting the candidate's role, expertise, or unique value (e.g., "Full Stack Web Developer with...," "Experienced Software Engineer specializing in...," or "Versatile developer skilled in..." Keep it changing so as to make sure every summary is unique please). 
Keep the tone professional, concise, and impactful.
`);

    setResume({ ...resume, summary: response });
    setLoading(false);
  };

  return (
    <div className="w-full shadow-lg border-t-4 rounded-lg mb-4">
      <div className="flex justify-between my-2 mt-4 mr-2">
        <h2
          className="text-2xl font-bold mb-5"
          style={{ color: resume?.themeColor }}
        >
          Professional Summary
        </h2>
        <Button
          variant="destructive"
          onClick={handleGenerateWithAI}
          disabled={loading}
          className="mb-4"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Brain size={18} className="mr-2" />
          )}
          Generate with AI
        </Button>
      </div>

      <div className="w-full m-[-8px]">
        <ReactQuill
          theme="snow"
          onChange={(e) => setResume({ ...resume, summary: e })}
          value={resume.summary}
          className='mt-8'
        />
      </div>
      <div className="flex justify-end mb-4 mt-4 mr-2">
        <Button onClick={handleSubmit} className="w-1/4">
          Next
        </Button>
      </div>
    </div>
  );
}
