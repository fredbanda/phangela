import HeroBanner from "@/components/homepage/hero";
import HowItWorks from "@/components/homepage/steps";

export default function Home() {

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 ">
    <HeroBanner />
      <HowItWorks />
    </div>
  );
}
