'use client';

import PreviewCard from '@/components/cards/preview-card';
import ResumeCreateNav from '@/components/headers/resume-create-nav';
import StepFive from '@/components/resume/step-five';
import StepFour from '@/components/resume/step-four';
import StepOne from '@/components/resume/step-one-create';
import StepThree from '@/components/resume/step-three';
import StepTwo from '@/components/resume/step-two';
import { useResume } from '@/context/resume';

export default function ResumeEditPage() {
  const { step } = useResume();
  return (
<div className="flex flex-col lg:flex-row h-screen overflow-y-auto">
  {/* Right Preview */}
  <div className="flex flex-col lg:w-1/2 p-4 lg:order-last lg:flex lg:justify-center lg:items-center">
    <PreviewCard />
  </div>

  {/* Left Form */}
  <div className="flex flex-col lg:w-1/2 p-4 lg:order-first lg:flex lg:justify-center lg:items-start">
    <ResumeCreateNav />
    {step === 1 && <StepOne />}
    {step === 2 && <StepTwo />}
    {step === 3 && <StepThree />}
    {step === 4 && <StepFour />}
    {step === 5 && <StepFive />}
  </div>
</div>
  );
}
