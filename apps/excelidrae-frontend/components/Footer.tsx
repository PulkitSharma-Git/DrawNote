import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative flex flex-col items-center justify-center w-full p-8 mt-16 bg-black/50 backdrop-blur-lg border-t border-gray-700">
      {/* Brand Logo */}
      <div className="text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
        Draw<span className="text-orange-500">Note</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-6 mt-4 text-gray-300 text-sm sm:text-base">
        <Link href="/about" className="hover:text-orange-400 transition">
          About
        </Link>
        <Link href="/features" className="hover:text-orange-400 transition">
          Features
        </Link>
        <Link href="/contact" className="hover:text-orange-400 transition">
          Contact
        </Link>
        <Link href="/privacy" className="hover:text-orange-400 transition">
          Privacy Policy
        </Link>
      </nav>

      {/* Social Media Icons */}
      <div className="flex gap-4 mt-6">
        <a href="#" className="text-gray-300 hover:text-blue-400 transition">
          🌐
        </a>
        <a href="#" className="text-gray-300 hover:text-blue-400 transition">
          📘
        </a>
        <a href="#" className="text-gray-300 hover:text-blue-400 transition">
          🐦
        </a>
      </div>

      {/* Copyright */}
      <p className="mt-6 text-xs text-gray-400">
        © {new Date().getFullYear()} DrawNote. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
