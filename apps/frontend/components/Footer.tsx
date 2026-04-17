import Link from "next/link";

const NAV_LINKS = [
  { label: "About", href: "#" },
  { label: "Features", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Privacy", href: "#" },
];

const SOCIALS = [
  { name: "GitHub", href: "#" },
  { name: "Twitter", href: "#" },
  { name: "LinkedIn", href: "#" },
];

const Logo = () => (
  <span className="text-xl font-extrabold tracking-wide text-white">
    Draw
    <span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
      Note
    </span>
  </span>
);

const NavLinks = () => (
  <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-400">
    {NAV_LINKS.map(({ label, href }) => (
      <Link
        key={label}
        href={href}
        className="transition hover:text-white hover:underline underline-offset-4 decoration-white/20"
      >
        {label}
      </Link>
    ))}
  </nav>
);

const SocialLinks = () => (
  <div className="flex gap-3">
    {SOCIALS.map(({ name, href }) => (
      <a
        key={name}
        href={href}
        aria-label={name}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-gray-400 transition hover:text-white hover:-translate-y-0.5"
      >
        {name[0]}
      </a>
    ))}
  </div>
);

const Footer = () => (
  <footer className="relative border-t border-white/5 bg-black/40 backdrop-blur-xl">
    {/* Gradient hairline */}
    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        <div className="text-center md:text-left">
          <Logo />
          <p className="mt-2 max-w-xs text-sm text-gray-400">
            A real-time collaborative whiteboard for teams, creators, and fast-moving ideas.
          </p>
        </div>
        <NavLinks />
      </div>

      <div className="my-8 h-px w-full bg-white/10" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} DrawNote. All rights reserved.
        </p>
        <SocialLinks />
      </div>
    </div>
  </footer>
);

export default Footer;