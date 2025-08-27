"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../components/Button";
import { Mail } from "lucide-react";

export default function VerifyEmail() {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const resendVerificationEmail = async () => {
    setIsResending(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setMessage("Verification email resent! Check your Gmail inbox.");
      } else {
        const err = await response.json();
        setError(err.error || "Failed to resend verification email");
      }
    } catch {
      setError("Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="flex w-full justify-center items-center py-8 pb-24 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 min-h-screen relative overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-primary-400 via-secondary-400 to-primary-700 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-secondary-500 to-primary-400 rounded-full blur-3xl opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex w-full flex-col items-center px-4 sm:px-6 lg:px-8"
      >
        <motion.div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-primary-400 via-secondary-400 to-primary-500 rounded-full blur-3xl opacity-30" />

          <div className="flex flex-col items-center gap-4 relative">
            <Mail className="h-12 w-12 text-primary-400" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent drop-shadow-lg">
              Verify Your Email
            </h2>

            <p className="text-gray-300 text-center">
              We've sent a verification link to your email address. Please check
              your Gmail inbox and click the link to complete your registration.
            </p>

            {message && (
              <p className="text-green-400 text-center font-medium">{message}</p>
            )}
            {error && (
              <p className="text-red-500 text-center font-medium">{error}</p>
            )}

            <motion.div
              className="w-full flex flex-col gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={resendVerificationEmail}
                disabled={isResending}
                className="w-full bg-gradient-to-r from-primary-400 to-secondary-400 hover:opacity-90 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </Button>

              <Button
                onClick={() => signIn()}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-all"
              >
                Already Verified? Sign In
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
