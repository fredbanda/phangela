export default function PersonalDetails({resume}) {
  return (
    <>
        <h2 className="font-bold text-xl text-center " style={{ color: resume?.themeColor }}>
            {resume?.name}
        </h2>
        <h2 className="text-center text-sm font-bold">{resume.job}</h2>
        <h2 className="text-center text-sm font-medium">
          {[resume.address, resume.location, resume.city].filter(Boolean).join(', ')}

        </h2>

        <div className="flex justify-between">
            <h2 className="fornt-normal text-xs">{resume.email}</h2>
            <h2 className="fornt-normal text-xs">{resume.phone}</h2>
        </div>
        <hr className="border-t-[1px] my-2" style={{ borderColor: resume?.themeColor }} />
    </>
  )
}