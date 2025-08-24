export default function PersonalDetails({ resume }) {
  return (
    <>
      <h2
        className="font-bold text-xl text-center"
        style={{ color: resume?.themeColor }}
      >
        {resume?.name}
      </h2>
      <h2 className="text-center text-sm font-bold">{resume.job}</h2>
      <h2 className="text-center text-sm font-medium break-words">
        {[resume.address, resume.location, resume.city].filter(Boolean).join(", ")}
      </h2>

      {/* Email + Phone */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-center sm:text-left">
        <h2 className="font-normal text-xs break-words">{resume.email}</h2>
        <h2 className="font-normal text-xs break-words">{resume.phone}</h2>
      </div>

      {/* Github + LinkedIn */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-center sm:text-left">
        <h2 className="font-normal text-xs break-words">{resume.github}</h2>
        <h2 className="font-normal text-xs break-words">{resume.linkedin}</h2>
      </div>

      <hr
        className="border-t-[1px] my-2"
        style={{ borderColor: resume?.themeColor }}
      />
    </>
  );
}
