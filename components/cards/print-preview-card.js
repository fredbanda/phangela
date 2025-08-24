import { useResume } from '@/context/resume';
import PersonalDetails from '../previews/personal-details';
import Summary from '../previews/summary';
import ExperiencePreview from '../previews/experience-preview';
import EducationPreview from '../previews/education-preview';
import SkillsPreview from '../previews/skills-preview';

export default function PrintPreviewCard() {
  const { resume } = useResume();
  if (!resume) {
    return (
      <div className="w-full flex items-center justify-center rounded-xl border border-dashed border-gray-300 text-gray-500 h-screen ">
        ⚠️ No resume loaded. Please create or select a resume to preview.
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @media print {
          .preview-card {
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-top: none !important;
            page-break-inside: auto;
          }

          .preview-card-content {
            padding: 0;
          }
        }

        @media screen {
          .preview-card {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        }
      `}</style>

      <div
        className="preview-card w-full rounded-xl border-t-[20px] transition-all duration-200 max-h-screen overflow-y-auto mt-auto"
        style={{
          borderColor: resume?.themeColor || '#fafcff',
          height: 'auto',
          maxHeight: 'none',
          overflow: 'visible',
        }}
      >
        <div className="preview-card-content p-3 sm:p-5 space-y-4 sm:space-y-6 ">
          <div className="personal-section">
            <PersonalDetails resume={resume} />
          </div>

          {resume?.summary && (
            <div className="summary-section page-break-inside-avoid">
              <Summary resume={resume} />
            </div>
          )}

          {resume?.experience?.length > 0 && (
            <div className="experience-section">
              <ExperiencePreview resume={resume} />
            </div>
          )}

          {resume?.education?.length > 0 && (
            <div className="education-section page-break-inside-avoid">
              <EducationPreview resume={resume} />
            </div>
          )}

          {resume?.skills?.length > 0 && (
            <div className="skills-section page-break-inside-avoid">
              <SkillsPreview resume={resume} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
