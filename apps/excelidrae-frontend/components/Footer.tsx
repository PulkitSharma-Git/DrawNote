"use client"
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-xl">

      {/* Top gradient glow */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="text-2xl font-extrabold tracking-wide text-white">
              Draw
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
                Note
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-gray-400">
              A real-time collaborative whiteboard for teams, creators, and
              fast-moving ideas.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-300">
            {[
              { label: "About", href: "/about" },
              { label: "Features", href: "/features" },
              { label: "Contact", href: "/contact" },
              { label: "Privacy", href: "/privacy" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative transition hover:text-white"
              >
                <span className="hover:underline underline-offset-4 decoration-white/20">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-white/10" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} DrawNote. All rights reserved.
          </p>

          {/* Socials */}
          <div className="flex gap-4">
            {["GitHub", "Twitter", "LinkedIn"].map((name) => (
              <motion.a
                key={name}
                href="#"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="
                  flex h-9 w-9 items-center justify-center rounded-full
                  border border-white/10 bg-white/5
                  text-gray-300
                  transition hover:text-white
                "
              >
                {name[0]}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
