import { useResume } from '@/context/resume';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { Button } from '../ui/button';
import { ArrowBigRight, Brain, Loader2Icon, Plus, X } from 'lucide-react';
import { Input } from '../ui/input';

export default function StepThree() {
  const {
    experienceList,
    handleExperienceQuillChange,
    handleExperienceChange,
    handleExperienceSubmit,
    addExperience,
    removeExperience,
    handleExperienceGenerateWithAI,
    experienceLoading,
  } = useResume();
  return (
    <div className="w-full p-5 shadow-lg border-t-4 rounded-lg overflow-x-auto">
      <h2 className="text-2xl font-bold mb-5">Experiences</h2>
      {experienceList?.length > 0 &&
        experienceList.map((experience, index) => (
          <div key={index} className="mb-10">
            <Input
              name="position"
              type="text"
              placeholder="Job title eg. Software Engineer"
              onChange={(e) => handleExperienceChange(e, index)}
              value={experience.position || ''}
              className="mb-3"
            />
            <Input
              name="company"
              type="text"
              placeholder="Company name eg. Google"
              onChange={(e) => handleExperienceChange(e, index)}
              value={experience.company || ''}
              className="mb-3"
            />
            <Input
              name="address"
              type="text"
              placeholder="Company address eg. 123 Main Street"
              onChange={(e) => handleExperienceChange(e, index)}
              value={experience.address || ''}
              className="mb-3"
            />
            <Input
              name="city"
              type="text"
              placeholder="Comapany location eg. Johannesburg"
              onChange={(e) => handleExperienceChange(e, index)}
              value={experience.city || ''}
              className="mb-3"
            />
            <Input
              name="startDate"
              type="text"
              placeholder="Job start date eg. January, 2020"
              onChange={(e) => handleExperienceChange(e, index)}
              value={experience.startDate || ''}
              className="mb-3"
            />
            <Input
              name="endDate"
              type="text"
              placeholder="Job end date eg. December, 2021"
              onChange={(e) => handleExperienceChange(e, index)}
              value={experience.endDate || ''}
              className="mb-3"
            />
            <ReactQuill
              theme="snow"
              value={experience.jobSummary || ''}
              onChange={(value) => handleExperienceQuillChange(value, index)}
              placeholder="Duties and responsibilities"
              className="mb-3 mt-12"
            />
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => handleExperienceGenerateWithAI(index)}
              >
                {experienceLoading[index] ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <Brain size={18} className="mr-2" />
                )}
                Generate with AI
              </Button>
            </div>
          </div>
        ))}
      <div className="flex justify-between-mt-3 md:flex-row">
        <Button varient="outline" onClick={addExperience} className="w-1/3">
          <Plus size={18} className="mr-2" />
          Add
        </Button>

        {experienceList.length > 1 && (
          <Button
            variant="destructive"
            onClick={removeExperience}
            className="ml-3 w-1/3"
          >
            <X size={18} className="mr-2" />
            Remove
          </Button>
        )}

        <Button
          varient="outline"
          onClick={handleExperienceSubmit}
          className="w-1/3 bg-emerald-500 text-white ml-2"
        >
          Next
          <ArrowBigRight size={18} className="mr-2" />
        </Button>
      </div>
    </div>
  );
}
