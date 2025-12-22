import { ReactNode } from "react";

export function SignInCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative w-[420px]">
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-orange-500/10 to-red-500/20 blur-2xl" />

      {/* Card */}
      <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 shadow-2xl shadow-black/40 transition-all duration-300 hover:-translate-y-[2px] hover:border-white/30">
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-3xl font-semibold text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-white/60">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
