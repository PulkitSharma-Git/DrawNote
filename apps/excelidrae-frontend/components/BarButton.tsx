import { ReactNode } from "react";

interface BarButtonProps {
    icon?: ReactNode;
    children?: ReactNode;
    activate?: boolean;
    onClick?: () => void;
}

export function BarButton({ icon, children, activate, onClick }: BarButtonProps) {
    const baseStyle = "flex items-center justify-center w-12 h-12 rounded-xl transition-all shadow-md";
    const activatedStyle = "bg-gradient-to-br from-orange-500 via-red-500 to-blue-500 text-white shadow-lg scale-105";
    const defaultStyle = "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white";

    return (
        <button onClick={onClick} className={`${baseStyle} ${activate ? activatedStyle : defaultStyle}`}>
            {icon}
            {children}
        </button>
    );
}
