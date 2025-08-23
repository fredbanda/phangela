"use client";

import EducationPreview from "./previews/education-preview";
import ExperiencePreview from "./previews/experience-preview";
import PersonalDetails from "./previews/personal-details";
import SkillsPreview from "./previews/skills-preview";
import Summary from "./previews/summary";



export default function ResumeTemplate({ resume }) {
  return (
    <div
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black p-8"
      style={{ borderTop: `10px solid ${resume?.themeColor}` }}
    >
      <PersonalDetails resume={resume} />
      <Summary resume={resume} />
      <ExperiencePreview resume={resume} />
      <EducationPreview resume={resume} />
      <SkillsPreview resume={resume} />
    </div>
  );
}
