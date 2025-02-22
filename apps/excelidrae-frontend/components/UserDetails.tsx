import React from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { motion } from "framer-motion";

interface UserDetailsProps {
  email: string;
  name: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ email, name }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="absolute right-0 mt-4 w-80 p-3 rounded-lg shadow-lg bg-white/10 backdrop-blur-md border border-orange-500/50"
    >
      {/* Profile Info Container */}
      <div className="flex items-center gap-4">
        {/* Profile Icon */}
        <IoPersonCircleOutline className="text-orange-500 drop-shadow-md" size={55} />

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-lg font-extrabold text-white">{name}</h2>
          <p className="text-sm text-gray-300">{email}</p>
        </div>
      </div>

      {/* Logout Button */}
      <motion.button
        whileHover={{ backgroundColor: "rgba(255, 87, 51, 0.8)" }} // Softer hover color
        whileTap={{ scale: 0.97 }} // Tap effect
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-md"
      >
        Logout
      </motion.button>
    </motion.div>
  );
};

export default UserDetails;
