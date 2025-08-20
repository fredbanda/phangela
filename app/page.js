import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center h-screen py-2">
      <h2>Free CV Resume</h2>
      <Link href="/resume/create">
      <Button variant="default">Start Creating </Button>
      </Link>
    </div>
  );
}
