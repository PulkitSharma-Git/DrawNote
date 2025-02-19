import { ReactNode } from "react";

interface BarProps {
    children: ReactNode;
}

export function Bar({ children }: BarProps) {
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-2xl text-white backdrop-blur-lg border border-white/20 
            bg-gradient-to-r from-orange-500 via-red-500 to-blue-500 shadow-[0_0_12px_rgba(255,115,0,0.6),0_0_20px_rgba(255,50,50,0.5),0_0_30px_rgba(0,128,255,0.4)]">
            {children}
        </div>
    );
}
