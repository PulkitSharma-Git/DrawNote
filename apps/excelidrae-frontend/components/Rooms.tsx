import React from "react";

interface RoomsProps {
    children: React.ReactNode;
}

export default function Rooms({ children }: RoomsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {children}
        </div>
    );
}
