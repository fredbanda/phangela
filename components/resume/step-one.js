import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useResume } from '@/context/resume';
import { useUser, SignInButton } from '@clerk/nextjs';

export default function StepOne() {
  // context
  const { resume, setResume, updatedResume, setStep } = useResume();
  const { isSignedIn } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    updatedResume();
    setStep(2); // Move to the next step after saving
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
    <div className="w-full p-5 shadow-lg border-t-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-5">Personal Information</h2>
      <Input
        name="name"
        value={resume.name || ''}
        onChange={handleChange}
        placeholder="Your name e.g. Sibusiso Mkhize"
        className="mb-3"
        type="text"
        autoFocus
        required
      />
      <Input
        name="job"
        value={resume.job || ''}
        onChange={handleChange}
        placeholder="Your job title e.g. Software Engineer"
        className="mb-3"
        type="text"
        autoFocus
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
          autoFocus
          required
        />
        <Input
          name="phone"
          value={resume.phone || ''}
          onChange={handleChange}
          placeholder="Your phone number e.g. 073 456 7890"
          className="mb-3"
          type="tel"
          autoFocus
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
        autoFocus
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
          autoFocus
          required
        />
        <Input
          name="city"
          value={resume.city || ''}
          onChange={handleChange}
          placeholder="Your city e.g. Johannesburg"
          className="mb-3"
          type="text"
          autoFocus
          required
        />
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
