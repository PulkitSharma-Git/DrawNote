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
  const [profileOpen, setProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  async function getUser() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await axios.get(`${HTTP_BACKEND}/getUser`, {
      headers: { Authorization: token },
    });

    setUserEmail(response.data.user.email);
    setUserName(response.data.user.name);
  }

  useEffect(() => {
    getUser();
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 z-50 w-full"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Glass background */}
        <div className="absolute inset-0 -z-10 bg-black/40 backdrop-blur-xl border-b border-white/10" />

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide text-white"
        >
          Draw<span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">Note</span>
        </Link>

        {/* Right side */}
        {isLoggedIn ? (
          <div className="relative">
            <motion.button
              onClick={() => setProfileOpen((v) => !v)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-full p-[2px]"
            >
              {/* Glow */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/40 via-red-500/40 to-blue-500/40 blur-md opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Icon container */}
              <span className="relative flex items-center justify-center rounded-full bg-neutral-900 p-1 border border-white/10">
                <IoPersonCircleOutline className="size-11 text-white/90" />
              </span>
            </motion.button>

            {/* Dropdown */}
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute right-0 mt-4"
              >
                <UserDetails email={userEmail} name={userName} />
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button2>Sign In</Button2>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
