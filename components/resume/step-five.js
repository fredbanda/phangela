import { Input } from '../ui/input';
import { useResume } from '@/context/resume';
import { Button } from '../ui/button';
import { ArrowBigRight, Plus, X } from 'lucide-react';

export default function StepFive() {
  const {
    skillsList,
    handleSkillsChange,
    handleSkillsSubmit,
    addSkill,
    removeSkill,
  } = useResume();

  const skillLevels = [
    { label: 'Beginner', value: 1 },
    { label: 'Intermediate', value: 2 },
    { label: 'Advanced', value: 3 },
    { label: 'Expert', value: 4 },
  ];
  return (
    <div className="w-full p-4 sm:p-5 shadow-lg border-t-4 rounded-lg h-screen overflow-y-auto mb-40">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">Skills</h2>

      {skillsList.length > 0 &&
        skillsList?.map((skill, index) => (
          <div key={index} className="mb-8 sm:mb-10">
            <Input
              name="name"
              type="text"
              placeholder="Skill Name like JavaScript, Pastry, etc."
              value={skill.name || ''}
              onChange={(e) => handleSkillsChange(e, index)}
              className="mb-3 w-full"
            />

            <div className="flex flex-wrap gap-2">
              {skillLevels.map((level) => (
                <Button
                  key={level.value}
                  variant={skill.level === level.value ? 'solid' : 'outline'}
                  onClick={() =>
                    handleSkillsChange(
                      { target: { name: 'level', value: level.value } },
                      index
                    )
                  }
                  className={`text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-md ${
                    skill.level === level.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-black border'
                  } hover:bg-blue-500 hover:text-white`}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>
        ))}

      <div className="flex justify-between-mt-3 md:flex-row">
        <Button varient="outline" onClick={addSkill} className="w-1/3">
          <Plus size={18} className="mr-2" />
          Add
        </Button>

        {skillsList?.length > 1 && (
          <Button
            variant="destructive"
            onClick={removeSkill}
            className="ml-3 w-1/3"
          >
            <X size={18} className="mr-2" />
            Remove
          </Button>
        )}

        <Button
          varient="outline"
          onClick={handleSkillsSubmit}
          className="w-1/3 bg-emerald-500 text-white ml-2"
        >
          Next
          <ArrowBigRight size={18} className="mr-2" />
        </Button>
      </div>
    </div>
  );
}
