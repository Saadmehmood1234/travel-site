"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <motion.button
      onClick={handleSignOut}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-2 py-2 rounded-sm font-semibold text-white
                 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 
                 hover:opacity-90 transition-all
                 backdrop-blur-md border border-white/20 text-sm"
    >
      <LogOut size={16} className="text-white text-sm" />
      Sign Out
    </motion.button>
  );
}
