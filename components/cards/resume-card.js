import Link from 'next/link';
import PersonalDetails from '../previews/personal-details';
import Summary from '../previews/summary';

export default function ResumeCard({ resume }) {
  return (
    <Link href={`/dashboard/resume/edit/${resume._id}`} className="group">
    <div
      className="shadow-lg w-full rounded-xl p-5 border-t-[20px] max-h-screen overflow-auto"
      style={{ borderColor: resume?.themeColor }}
    >
      <PersonalDetails resume={resume} />
      <Summary resume={resume} />
    </div>
    </Link>
  );
}
