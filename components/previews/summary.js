import parse from "html-react-parser";

export default function Summary({ resume }) {
  return (
    <div className="mt-2">
      <h2 className="font-bold mb-2" style={{ color: resume?.themeColor }}>
        Professional Summary
      </h2>
      {resume.summary && (
        <div className="text-xs font-normal">
          {parse(resume.summary)}
        </div>
      )}
    </div>
  );
}

