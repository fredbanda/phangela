import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function ExperiencePreview({ resume }) {

// Format the month and year for the start and end dates
  function formatMonthYear(dateString) {
    if (!dateString) return '';

    // Handle YYYY-MM (month input gives this format)
    let normalized = dateString;
    if (/^\d{4}-\d{2}$/.test(dateString)) {
      normalized = dateString + '-01'; // add first day
    }

    const date = new Date(normalized);
    if (isNaN(date)) return ''; // safety check

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  return (
    <div className="my-6 ">
      <h2
        className=" font-bold text-sm mb-2"
        style={{ color: resume.themeColor }}
      >
        Work Experience
      </h2>
      <hr style={{ borderColor: resume.themeColor }} />
      {resume.experience.map((experience, index) => (
        <div key={index} className="my-5">
          <h2 className="text-sm font-bold mt-[-4px]">
            {experience?.position}
          </h2>
          <h3 className="text-sm">{experience?.company}</h3>
          <p className="text-sm">
            {[experience.address, experience.city].filter(Boolean).join(', ')}
          </p>

          <p>
            {experience.startDate && formatMonthYear(experience.startDate)}
            {' - '}
            {experience.endDate
              ? formatMonthYear(experience.endDate)
              : 'Present'}
          </p>

          <p className="text-sm font-bold">Duties and Responsibilities</p>
          {experience.jobSummary && (
            <ReactQuill
              readOnly={true} // make it read-only
              value={experience.jobSummary || ''}
              theme="bubble"
              modules={{ toolbar: false }} // remove toolbar
              className="text-sm font-normal mt-[-10px]"
            />
          )}
        </div>
      ))}
    </div>
  );
}
