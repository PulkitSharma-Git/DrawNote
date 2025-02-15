import { ReactNode } from "react";

interface BarButtonProps {
    icon?: ReactNode;
    children?: ReactNode;
    activate?: boolean;
    onClick?: () => void;
}
export function BarButton( { icon, children, activate, onClick }: BarButtonProps ) {
    const activatedStyling = "flex rounded items-center justify-center w-10 h-10 bg-blue-800 text-white transition-all hover:bg-red-500 shadow-lg"
    const styling = "flex rounded items-center justify-center w-10 h-10 bg-red-800 text-white transition-all hover:bg-red-500 shadow-lg"
    let currentStyle = "";
    
    if(activate) {
        currentStyle = styling;
    }else {
        currentStyle = activatedStyling;
    }

    return <button onClick={onClick} className={currentStyle}>
        {icon}
        {children}
    </button>
}