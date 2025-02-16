import Link from "next/link";
import { Button } from "@/components/Button";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <Link href="/signup">
    <Button>Sign Up</Button>
    </Link>

    <Link href="/signin"> 
    <Button>Sign In</Button>
    </Link>
    </div>
  );
}
