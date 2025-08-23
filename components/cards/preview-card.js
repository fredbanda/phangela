import { useResume } from '@/context/resume';
import PersonalDetails from '../previews/personal-details';
import Summary from '../previews/summary';
import ExperiencePreview from '../previews/experience-preview';
import EducationPreview from '../previews/education-preview';
import SkillsPreview from '../previews/skills-preview';

export default function PreviewCard() {
    const {resume} = useResume();
  return (
    <div
      className="shadow-lg max-h-screen w-full rounded-xl p-5 border-t-[20px] overflow-y-auto"
      style={{ borderColor: resume?.themeColor }}
    >
      <PersonalDetails resume={resume} />
      <Summary resume={resume} />
      <ExperiencePreview resume={resume} />
      <EducationPreview resume={resume} />
      <SkillsPreview resume={resume} />
    </div>
  );
}
