"use client";

import PersonalDetails from '../previews/personal-details';
import Summary from '../previews/summary';
import ExperiencePreview from '../previews/experience-preview';
import EducationPreview from '../previews/education-preview';
import SkillsPreview from '../previews/skills-preview';
import { Button } from '../ui/button';
import { Download, Trash, UserPen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useResume } from '@/context/resume';

export default function ResumeCard({ resume }) {
  const {deleteResume} = useResume();
  const router = useRouter();
  return (
    <div
      className="relative shadow-lg w-full rounded-xl p-5 border-t-[20px] max-h-screen overflow-auto"
      style={{ borderColor: resume?.themeColor }}
    >
      <div className="line-clamp-3">
        <PersonalDetails resume={resume} />
      </div>
      <div className="line-clamp-2">
        <Summary resume={resume} />
      </div>
      <div className="line-clamp-3">
        <ExperiencePreview resume={resume} />
      </div>
      <div className="line-clamp-3">
        <EducationPreview resume={resume} />
      </div>
      <div className="line-clamp-2">
        <SkillsPreview resume={resume} />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
        <div className="flex space-x-4">
          <Button 
          onClick={() => router.push(`/dashboard/resume/edit/${resume._id}`)}
          className="bg-emerald-600 text-white hover:bg-emerald-800 ">
            {' '}
            <UserPen />
            Edit
          </Button>
          <Button 
          onClick={() => router.push(`/dashboard/resume/download/${resume._id}`)}
          className="bg-blue-600 text-white hover:bg-blue-800">
            <Download />
            Download
          </Button>
          <Button
          onClick={() => deleteResume(resume._id)} 
            variant="destructive"
            className="bg-red-600 text-white hover:bg-red-800"
          >
            <Trash />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
