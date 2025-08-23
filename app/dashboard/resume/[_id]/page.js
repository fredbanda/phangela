import { getResumeFromDB } from "@/actions/resume";
import PersonalDetails from "@/components/previews/personal-details";
import Summary from "@/components/previews/summary";
import ExperiencePreview from "@/components/previews/experience-preview";
import EducationPreview from "@/components/previews/education-preview";
import SkillsPreview from "@/components/previews/skills-preview";

export default async function ResumePrintPreviewPage({params}) {
    const resume = await getResumeFromDB(params._id);
    console.log(resume);
  return (
    <div className="my-20">
        <PersonalDetails resume={resume} />
        <Summary resume={resume} />
        <ExperiencePreview resume={resume} />
        <EducationPreview resume={resume} />
        <SkillsPreview resume={resume} />
    </div>
  )
}