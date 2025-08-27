"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "@/app/actions/reset.action";
const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});
export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      const response = await sendPasswordResetEmail(formData);
      if (!response.success) {
        throw new Error(response.error || "Something went wrong");
      }
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex w-full justify-center items-center py-8 pb-24 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 min-h-screen relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-primary-400 via-secondary-400 to-primary-700 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-secondary-500 to-primary-400 rounded-full blur-3xl opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex w-full flex-col items-center px-4 sm:px-6 lg:px-8"
      >
        <motion.div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
          {/* Inner glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-primary-400 via-secondary-400 to-primary-500 rounded-full blur-3xl opacity-30" />

          <div className="flex flex-col items-center gap-4 relative">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent drop-shadow-lg">
              Forgot Password
            </h2>
            <p className="text-lg text-gray-200 text-center">
              {success
                ? "Check your email inbox for a reset link"
                : "Enter your email to reset your password"}
            </p>

            {success ? (
              <div className="w-full text-center">
                <p className="text-gray-300 mb-4">
                  We've sent a password reset link to your email. If you don’t
                  see it, check your spam folder.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => router.push("/auth/signin")}
                    className="w-full bg-gradient-to-r from-primary-400 to-secondary-400 hover:opacity-90 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
                  >
                    Back to Sign In
                  </Button>
                </motion.div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-4"
              >
                <Input
                  label=""
                  icon={<Mail className="h-5 w-5 text-primary-400" />}
                  {...register("email")}
                  error={
                    errors.email ? { message: errors.email.message } : undefined
                  }
                  placeholder="Enter your email"
                />
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-400 to-secondary-400 hover:opacity-90 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </motion.div>
              </form>
            )}

            <p className="text-gray-300 text-center">
              Remember your password?{" "}
              <Link
                href="/auth/signin"
                className="text-primary-300 hover:text-secondary-300 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
