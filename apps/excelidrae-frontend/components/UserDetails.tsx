import React from "react";
import { IoPersonCircleOutline } from "react-icons/io5";

interface UserDetailsProps {
  email: string;
  name: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ email, name }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl shadow-xl border border-orange-500/50 backdrop-blur-md bg-white/10 w-80 absolute absolute right-0 mt-4 p-3 rounded-lg shadow-lg">
      {/* Profile Icon */}
      <IoPersonCircleOutline className="text-orange-500 drop-shadow-md" size={55 as number} />

      {/* User Info */}
      <div className="flex-1">
        <h2 className="text-lg font-extrabold text-white">{name}</h2>
        <p className="text-sm text-gray-300">{email}</p>
      </div>

      {/* Logout Button */}
      <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-md hover:scale-105 transition">
        Logout
      </button>
    </div>
  );
};

export default UserDetails;
