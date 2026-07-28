// RoomSkeleton.tsx
export default function RoomSkeleton() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md overflow-hidden opacity-70">
      {/* Solid gradient fill matching the hover state of Room card */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-blue-500/20 animate-pulse" />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-50" />

      <div className="relative z-10 p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title placeholder */}
            <div className="h-5 w-2/3 bg-white/10 rounded-md animate-pulse" />
          </div>
          {/* Arrow placeholder */}
          <div className="shrink-0 h-8 w-8 rounded-lg bg-white/5 animate-pulse" />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/5" />

        {/* Footer — Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Room ID placeholder */}
          <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
          
          {/* Buttons placeholder */}
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-4 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-12 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
