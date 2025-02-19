import Link from "next/link";
import { Button } from "@/components/Button";
import { Button2 } from "@/components/Button2";

export default function MainSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-8 pt-28">
      {/* Tagline */}
      <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 drop-shadow-lg">
        Brainstorm. Collaborate. Create.
      </h1>

      {/* Subtext */}
      <p className="text-lg sm:text-xl text-gray-300 mt-4 max-w-2xl">
        A real-time collaborative whiteboard to visualize your ideas with others seamlessly.
      </p>

      {/* Call-to-Action Buttons */}
      <div className="mt-8 flex gap-6">
        <Link href="/signup">
          <Button>Get Started</Button>
        </Link>
        <Link href="/signin">
          <Button2>Sign In</Button2>
        </Link>
      </div>
    </div>
  );
}
