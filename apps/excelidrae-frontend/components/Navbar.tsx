"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Button2 } from "./Button2";
import { IoPersonCircleOutline } from "react-icons/io5";
import UserDetails from "./UserDetails";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setIsLoggedIn(true);
    axios
      .get(`${HTTP_BACKEND}/getUser`, { headers: { Authorization: token } })
      .then(({ data }) => {
        setUserEmail(data.user.email);
        setUserName(data.user.name);
      });
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 z-50 w-full bg-black/40 backdrop-blur-xl border-b border-white/10"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold tracking-wide text-white">
          Draw<span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">Note</span>
        </Link>

        {/* Right side */}
        {isLoggedIn ? (
          <div className="relative">
            <motion.button
              onClick={() => setProfileOpen((v) => !v)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center rounded-full border border-white/10 bg-neutral-900 p-1"
            >
              <IoPersonCircleOutline className="size-9 text-white/80" />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3"
                >
                  <UserDetails email={userEmail} name={userName} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/signin"><Button2>Sign In</Button2></Link>
            <Link href="/signup"><Button>Get Started</Button></Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;