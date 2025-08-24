export default function HowItWorks() {
  return (
<div className="container mx-auto p-6 mb-20">
      <h2 className="text-4xl font-bold text-center mb-12 transition-transform duration-500 transform hover:scale-105">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="service-card  rounded-lg shadow-lg p-6 text-center">
          <div className="text-5xl mb-4 transition-transform duration-300 transform hover:scale-110">
            📝
          </div>
          <h3 className="text-2xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-500">
            Add Your Details
          </h3>
          <p className="">Add your details to create you CV / Resume.</p>
        </div>
        <div className="service-card  rounded-lg shadow-lg p-6 text-center">
          <div className="text-5xl mb-4 transition-transform duration-300 transform hover:scale-110">
            📖
          </div>
          <h3 className="text-2xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-500">
            Proof Read
          </h3>
          <p className="">Proof read your CV / Resume to ensure it's error free.</p>
        </div>
        <div className="service-card  rounded-lg shadow-lg p-6 text-center">
          <div className="text-5xl mb-4 transition-transform duration-300 transform hover:scale-110">
            ⬇️
          </div>
          <h3 className="text-2xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-500">
            Download PDF
          </h3>
          <p className="">Download your CV / Resume in PDF format and ATS check it.</p>
        </div>
        <div className="service-card  rounded-lg shadow-lg p-6 text-center">
          <div className="text-5xl mb-4 transition-transform duration-300 transform hover:scale-110">
            📧
          </div>
          <h3 className="text-2xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-500">
            Share Your CV
          </h3>
          <p className="">Share your CV / Resume with your network and employers.</p>
        </div>
      </div>
    </div>
  );
}
