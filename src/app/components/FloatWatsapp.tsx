"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

const FloatWhatsapp = () => {
  const whatsappNumber = "9310682414";
  const defaultMessage = "Hello, I have a question about...";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    defaultMessage
  )}`;

  return (
    <motion.div
      className="fixed bottom-24 right-4 z-50"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Link href={whatsappUrl} target="_blank">
        <motion.p
          className="bg-[#25D366] cursor-pointer hover:bg-[#128C7E] text-white rounded-full p-4 shadow-lg flex items-center justify-center"
          aria-label="Chat on WhatsApp"
          whileHover={{
            scale: 1.1,
            rotate: [0, -10, 10, -5, 5, 0],
            transition: { duration: 0.5 },
          }}
          animate={{
            y: [0, -10, 0],
            transition: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            },
          }}
        >
          <FaWhatsapp className="w-6 h-6" />
        </motion.p>
      </Link>
    </motion.div>
  );
};

export default FloatWhatsapp;
