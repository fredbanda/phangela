import renderHTML from "react-render-html";

export default function Summary({ resume }) {
  return (
    <div className="mt-2">
      <h2 className="font-bold mb-2" style={{ color: resume?.themeColor }}>Professional Summary</h2>
      {resume.summary && (
        <div className="text-xs font-normal">
          {renderHTML(resume.summary)}
        </div>
      )}
    </div>
  );
}
