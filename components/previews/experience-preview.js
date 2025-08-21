import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function ExperiencePreview({ resume }) {
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
          <h2 className="text-sm font-bold mt-[-4px]">{experience?.position}</h2>
          <h3 className="text-sm">{experience?.company}</h3>
          <p className="text-sm">
            {[experience.address, experience.city].filter(Boolean).join(', ')}
          </p>
          <p className="text-xs text-gray-500">
            {[experience.startDate, experience.endDate]
              .filter(Boolean)
              .join(' - ')}
          </p>
        <p className='text-sm font-bold'>Duties and Responsibilities</p>
          {experience.jobSummary && (
            <ReactQuill
              readOnly={false}
              value={experience.jobSummary || ''}
              theme="bubble"
              className="text-sm font-normal mt-[-10px]"
            />
          )}
        </div>
      ))}
    </div>
  );
}
