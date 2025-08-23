export default function EducationPreview({ resume }) {
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
    <div className="my-6">
      <h2
        className="font-bold text-sm mb-2"
        style={{ color: resume.themeColor }}
      >
        Education
      </h2>

      <hr style={{ borderColor: resume.themeColor }} className="w-full" />

      {resume.education.map((education, index) => (
        <div key={index} className="my-3">
          <h3 className="font-bold text-base">{education.qualification}</h3>
          <p className="text-sm font-bold">{education.institution}</p>
          <p className="text-sm">
            {[education.address, education.city].join(', ')}
          </p>
          <p>
            {education.startDate && formatMonthYear(education.startDate)}
            {' - '}
            {education.endDate
              ? formatMonthYear(education.endDate)
              : 'Present'}
          </p>
          <p className="text-sm italic font-bold">
            {education.educationSummary}
          </p>
        </div>
      ))}
    </div>
  );
}
