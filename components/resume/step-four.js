//previously step-four.js

import { useResume } from '@/context/resume';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ArrowBigRight, Plus, X } from 'lucide-react';
import { Textarea } from '../ui/textarea';

export default function StepFour({ resume }) {
  const {
    educationList,
    handleEducationChange,
    handleEducationSubmit,
    addEducation,
    removeEducation,
  } = useResume();

  return (
    <div className="w-full p-5 shadow-lg border-t-4 rounded-lg overflow-y-auto mb-40">
      <h2
        className="text-2xl font-bold mb-5"
        style={{ color: resume?.themeColor }}
      >
        Education
      </h2>
      {educationList?.length > 0 &&
        educationList?.map((education, index) => (
          <div key={index} className="mb-10">
            <Input
              name="institution"
              type="text"
              placeholder="Your school/college or university name"
              value={education.institution || ''}
              onChange={(e) => handleEducationChange(e, index)}
              className="mb-3"
            />
            <Input
              name="qualification"
              type="text"
              placeholder="Your certificate or degree"
              value={education.qualification || ''}
              onChange={(e) => handleEducationChange(e, index)}
              className="mb-3"
            />
            <Input
              name="address"
              type="text"
              placeholder="location like soweto college of medicine"
              value={education.address || ''}
              onChange={(e) => handleEducationChange(e, index)}
              className="mb-3"
            />
            <Input
              name="city"
              type="text"
              placeholder="City Like Cape town"
              value={education.city || ''}
              onChange={(e) => handleEducationChange(e, index)}
              className="mb-3"
            />
            <Input
              name="startDate"
              type="month"
              placeholder="Job end date"
              onChange={(e) => handleEducationChange(e, index)}
              value={
                education.startDate ? education.startDate.slice(0, 7) : ''
              } // YYYY-MM
              className="mb-3"
            />
            <Input
              name="endDate"
              type="month"
              placeholder="Job end date"
              onChange={(e) => handleEducationChange(e, index)}
              value={education.endDate ? education.endDate.slice(0, 7) : ''} // YYYY-MM
              className="mb-3"
            />
            <Textarea
              name="educationSummary"
              type="text"
              value={education.educationSummary || ''}
              onChange={(e) => handleEducationChange(e, index)}
              placeholder="add any remarks about your education optional"
              className="mb-3 mt-12"
            />
          </div>
        ))}
      <div className="flex justify-between-mt-3 md:flex-row">
        <Button varient="outline" onClick={addEducation} className="w-1/3">
          <Plus size={18} className="mr-2" />
          Add
        </Button>

        {educationList.length > 1 && (
          <Button
            variant="destructive"
            onClick={removeEducation}
            className="ml-3 w-1/3"
          >
            <X size={18} className="mr-2" />
            Remove
          </Button>
        )}

        <Button
          varient="outline"
          onClick={handleEducationSubmit}
          className="w-1/3 bg-emerald-500 text-white ml-2"
        >
          Next
          <ArrowBigRight size={18} className="mr-2" />
        </Button>
      </div>
    </div>
  );
}
