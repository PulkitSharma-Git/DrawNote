import { ReactNode } from "react";

interface PallateProps {
    children: ReactNode;
}

export default function Pallate({ children }: PallateProps) {
    return (
        <div className="fixed left-0 top-1/2 flex items-center justify-center gap-2 p-3 rounded-2xl 
                        backdrop-blur-md bg-white/20 border border-white/30 shadow-xl">
            {children}
        </div>
    );
}
