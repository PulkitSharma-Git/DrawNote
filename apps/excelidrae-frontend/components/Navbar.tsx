import Link from 'next/link';
import React from 'react';
import { Button } from './Button';

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-between px-8 h-20 bg-orange-400/30 backdrop-blur-md border border-orange-900/50 shadow-lg z-50">
      {/* Logo */}
      <div className="text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
        Draw<span className="text-orange-500">Note</span>
      </div>

      {/* Empty space for centering */}
      <div></div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>

        <Link href="/signin">
          <Button>Sign In</Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
