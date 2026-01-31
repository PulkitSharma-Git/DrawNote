import React from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface UserDetailsProps {
  email: string;
  name: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ email, name }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} // start above
      animate={{ opacity: 1, y: 0 }}   // slide down into place
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="absolute right-0 mt-4 w-80 p-4 rounded-lg shadow-lg bg-white/10 backdrop-blur-md border border-white/20"
    >
      {/* Profile Info */}
      <div className="flex items-center gap-4">
        <IoPersonCircleOutline className="text-white" size={55} />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">{name}</h2>
          <p className="text-sm text-gray-300">{email}</p>
        </div>
      </div>

      {/* Logout Button with Gradient */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        onClick={handleLogout}
        className="w-full mt-4 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 hover:opacity-90 shadow-md transition"
      >
        Logout
      </motion.button>
    </motion.div>
  );
};

export default UserDetails;
