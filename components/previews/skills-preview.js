import { Progress } from "../ui/progress"

export default function SkillsPreview({ resume, print = false }) {
  const themeColor = resume?.themeColor || "#333"

  // optional: map numeric level to labels
  const labels = ["Beginner", "Intermediate", "Advanced", "Expert"]

  return (
    <div className="my-6">
      <h2 className="font-bold text-sm mb-2">Skills</h2>
      <hr style={{ borderColor: themeColor }} />

      <div className="grid grid-cols-2 gap-3 my-4">
        {resume?.skills?.map((skill, index) => {
          const level = skill?.level || 0
          const percent = level * 25 // assuming scale 1–5

          return (
            <div key={index} className="flex flex-col">
              {/* Visible for humans */}
              <div className="flex items-center">
                <h2 className="text-sm font-bold">{skill?.name}</h2>
                <Progress
                  value={percent}
                  className="w-32 h-2 ml-2 bg-gray-200"
                />
              </div>

              {/* ATS-friendly text */}
              <p className="text-xs text-gray-600">
                {skill?.name} – {labels[level - 1] || "Beginner"}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
