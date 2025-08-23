import { getResumeFromDB } from "@/actions/resume";
import EducationPreview from "@/components/previews/education-preview";
import ExperiencePreview from "@/components/previews/experience-preview";
import PersonalDetails from "@/components/previews/personal-details";
import SkillsPreview from "@/components/previews/skills-preview";
import Summary from "@/components/previews/summary";



export default async function ResumePage({params}) {
    const resume = await getResumeFromDB(params._id);
  return (
    <div className="m-20">
        <PersonalDetails resume={resume} />
        <EducationPreview resume={resume} />
        <ExperiencePreview resume={resume} />
        <SkillsPreview resume={resume} />
        <Summary resume={resume} />
    </div>
  )
}