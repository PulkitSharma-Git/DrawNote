"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { Button2 } from "./Button2";
import { IoPersonCircleOutline } from "react-icons/io5";
import UserDetails from "./UserDetails";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileIconClick, setProfileIconClick] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-between px-8 h-20 bg-orange-400/30 backdrop-blur-md border border-orange-900/50 shadow-lg z-50">
      {/* Logo */}
      <div className="text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
        Draw<span className="text-orange-500">Note</span>
      </div>

      {/* Empty space for centering */}
      <div></div>

      {/* Buttons */}
      {isLoggedIn ? (
        <div className="relative">
          {/* Profile Icon */}
          <div onClick={() => setProfileIconClick((c) => !c)}>
            <IoPersonCircleOutline className="size-14 cursor-pointer" />
          </div>

          {/* Dropdown */}
          {profileIconClick && (
              
              <UserDetails />
          )}
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/signup">
            <Button2>Sign Up</Button2>
          </Link>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
