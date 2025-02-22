"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { Button2 } from "./Button2";
import { IoPersonCircleOutline } from "react-icons/io5";
import UserDetails from "./UserDetails";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileIconClick, setProfileIconClick] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  async function getUser() { //The the user's name and email and store it in state which will be passed into the UserDetails card
    const token = localStorage.getItem("token");
    const response = await axios.get(`${HTTP_BACKEND}/getUser`, {
      headers: {
        Authorization: token,
      }
    });

    setUserEmail(response.data.user.email);
    setUserName(response.data.user.name);
  }

  useEffect(() => {
    getUser()
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
          <div
  onClick={() => setProfileIconClick((c) => !c)}
  className={`cursor-pointer rounded-full transition ${
    profileIconClick ? "bg-white/10" : "hover:bg-white/5"
  }`}
>
  <motion.div
    whileTap={{ scale: 0.97, opacity: 0.85 }} // Subtle press effect
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    className="rounded-full p-1" // Small padding for better clickability
  >
    <IoPersonCircleOutline
  className={`size-11 text-white/90 transition rounded-full ${
    profileIconClick
      ? "bg-gradient-to-r from: bg-orange-500 via-red-500 to-blue-500 "
      : "hover:bg-gradient-to-r hover:from-orange-500 hover:via-red-500 hover:to-blue-500"
  }`}
/>
  </motion.div>
</div>


          {/* Dropdown */}
          {profileIconClick && (
              <UserDetails email={userEmail} name={userName} />
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
