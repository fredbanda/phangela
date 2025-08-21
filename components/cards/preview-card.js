import { useResume } from '@/context/resume';
import PersonalDetails from '../previews/personal-details';
import Summary from '../previews/summary';
import ExperiencePreview from '../previews/experience-preview';

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
    </div>
  );
}
