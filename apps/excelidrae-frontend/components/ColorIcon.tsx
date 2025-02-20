interface ColorIconProps {
    color: string;
    activate: boolean;
    onClick?: () => void;
}

export default function ColorIcon({ color, activate, onClick }: ColorIconProps) {
    return (
        <div 
            onClick={onClick} 
            className={`w-6 h-6 rounded-md cursor-pointer transition-all bg-${color}
                        ${activate ? "outline-2 outline-white shadow-md scale-105 ring-2 ring-offset-1 ring-white/40" 
                                   : "outline outline-gray-300 shadow-sm"}`}
        >
        </div>
    );
}
