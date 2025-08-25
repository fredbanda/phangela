'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useResume } from '@/context/resume';
import { useUser, SignInButton } from '@clerk/nextjs';
import dynamic from 'next/dynamic';

// ✅ Dynamically import HexColorPicker to avoid SSR issues
const HexColorPicker = dynamic(
  () => import('react-colorful').then((mod) => mod.HexColorPicker),
  { ssr: false }
);

// ✅ Import required CSS
import 'react-colorful/dist/index.css';

export default function StepOne() {
  const { resume, setResume, updatedResume, setStep } = useResume();
  const { isSignedIn } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    updatedResume();
    setStep((prevStep) => prevStep + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume((prevState) => {
      const updatedResume = { ...prevState, [name]: value };
      localStorage.setItem('resume', JSON.stringify(updatedResume));
      return updatedResume;
    });
  };

  return (
    <div className="w-full p-5 shadow-lg border-t-4 rounded-lg ">
      <h2
        className="text-2xl font-bold mb-5"
        style={{ color: resume?.themeColor }}
      >
        Personal Information
      </h2>

      <Input
        name="name"
        value={resume.name || ''}
        onChange={handleChange}
        placeholder="Your name e.g. Sibusiso Mkhize"
        className="mb-3"
        type="text"
        required
      />

      <Input
        name="job"
        value={resume.job || ''}
        onChange={handleChange}
        placeholder="Your job title e.g. Software Engineer"
        className="mb-3"
        type="text"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
        <Input
          name="email"
          value={resume.email || ''}
          onChange={handleChange}
          placeholder="Your email e.g. sibusiso@gmail.com"
          className="mb-3"
          type="email"
          required
        />
        <Input
          name="phone"
          value={resume.phone || ''}
          onChange={handleChange}
          placeholder="Your phone number e.g. 073 456 7890"
          className="mb-3"
          type="tel"
          required
        />
      </div>

      <Input
        name="address"
        value={resume.address || ''}
        onChange={handleChange}
        placeholder="Your address e.g. 123 Main St"
        className="mb-3"
        type="text"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
        <Input
          name="location"
          value={resume.location || ''}
          onChange={handleChange}
          placeholder="Your location e.g. Soweto"
          className="mb-3"
          type="text"
          required
        />
        <Input
          name="city"
          value={resume.city || ''}
          onChange={handleChange}
          placeholder="Your city e.g. Johannesburg"
          className="mb-3"
          type="text"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
        <Input
          name="github"
          value={resume.github || ''}
          onChange={handleChange}
          placeholder="Your github link optional"
          className="mb-3"
          type="text"
          autoFocus
          required
        />
        <Input
          name="linkedin"
          value={resume.linkedin || ''}
          onChange={handleChange}
          placeholder="Your linkedin link optional"
          className="mb-3"
          type="text"
          autoFocus
          required
        />
      </div>

      {/* ✅ Give the picker some space */}
      <div className="my-4 h-48">
        <HexColorPicker
          color={resume.themeColor || '#333'}
          onChange={(themeColor) => setResume({ ...resume, themeColor })}
        />
        <p className='text-sm text-gray-600 text-bold'>Pick a theme color for your resume. Be advised that black and white is highly recommeded.</p>
      </div>

      <div className="flex justify-end">
        {!isSignedIn ? (
          <SignInButton>
            <Button>Sign In to save</Button>
          </SignInButton>
        ) : (
          <Button onClick={handleSubmit}>Save</Button>
        )}
      </div>
    </div>
  );
}
