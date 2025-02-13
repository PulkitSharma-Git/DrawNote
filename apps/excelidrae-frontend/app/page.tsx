import Link from "next/link";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <Link href="/signup">
    <button className="bg-blue-950">SignUp</button>
    </Link>

    <Link href="/signin"> 
    <button className="bg-blue-500">SignIn</button>
    </Link>
    </div>
  );
}
