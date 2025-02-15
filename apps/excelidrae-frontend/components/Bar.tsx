import { ReactNode } from "react";

interface BarProps {
    children: ReactNode;
}

export function Bar( { children } : BarProps) {
    return <span className="inline-flex items-center justify-between gap-5 p-2 bg-green-400 rounded fixed top-3 left-96">{children}</span>
}