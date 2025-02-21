import React from "react";

interface RoomProps {
    roomname: string;
    roomId: string;
    onClick: () => void
}

export default function Room({ roomname, roomId, onClick }: RoomProps) {
    return (
        <div onClick={onClick} className="relative rounded-xl border border-white/20 overflow-hidden transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] 
                        bg-white/10 backdrop-blur-md p-5 flex flex-col items-center text-white font-semibold 
                        before:absolute before:inset-0 before:bg-gradient-to-r before:from-orange-500 before:via-red-500 before:to-blue-500 before:animate-slideGradient 
                        before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
            
            <h2 className="text-xl z-10">{roomname}</h2>
            <p className="text-sm opacity-60">{`Room ID: ${roomId}`}</p>

        </div>
    );
}
