"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Mail, Lock } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error(result.error || "Invalid email or password");
      } else {
        toast.success("Signed in successfully");
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex w-full justify-center items-center py-8 pb-24 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 min-h-screen relative overflow-hidden pt-[60px]">
      {/* Gradient orbs */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-primary-400 via-secondary-400 to-primary-700 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-secondary-500 to-primary-400 rounded-full blur-3xl opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex w-full flex-col items-center px-4 sm:px-6 lg:px-8"
      >
        <motion.div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
          {/* Inner glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-primary-400 via-secondary-400 to-primary-500 rounded-full blur-3xl opacity-30" />

          <div className="flex flex-col items-center gap-4 relative">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent drop-shadow-lg">
              Sign In
            </h2>
            <p className="text-gray-300 text-center">Welcome back, traveler!</p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4"
            >
              <Input
                label="Email"
                icon={<Mail className="h-5 w-5 text-primary-400" />}
                {...register("email")}
                error={errors.email && { message: errors.email.message }}
                placeholder="example@gmail.com"
              />

              <Input
                label="Password"
                type="password"
                icon={<Lock className="h-5 w-5 text-primary-400" />}
                {...register("password")}
                error={errors.password && { message: errors.password.message }}
                placeholder="••••••••"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/auth/forgot-password")}
                  className="text-sm text-primary-300 hover:text-secondary-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-400 to-secondary-400 hover:opacity-90 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="w-full flex items-center space-x-4">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-gray-300 text-sm">OR</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Google sign-in */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center space-x-2 bg-white/10 border border-white/20 text-white py-4 rounded-xl transition-all hover:bg-white/20"
            >
              <FaGoogle className="text-xl" />
              <span>Sign in with Google</span>
            </motion.button>

            {/* Redirect to Sign Up */}
            <p className="text-gray-300 text-center">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => router.push("/auth/signup")}
                className="text-primary-300 hover:text-secondary-300 transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
