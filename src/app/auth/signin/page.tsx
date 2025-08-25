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
    <section className="flex w-full mt-12 max-md:mt-20 justify-center items-center min-h-screen bg-primary-600 px-4 py-8 md:py-16 relative overflow-hidden">
      <div className="flex flex-col items-center gap-4 relative bg-white text-black px-6 py-8 md:px-9 md:py-10 rounded-xl w-full max-w-md">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-600 drop-shadow-lg">
          Sign In
        </h2>
        <p className="text-gray-600 text-center text-sm md:text-base">
          Welcome back, traveler!
        </p>

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
            className="pl-10 w-full h-[40px] rounded border-gray-300 border-2"
          />

          <Input
            label="Password"
            type="password"
            icon={<Lock className="h-5 w-5 text-primary-400" />}
            {...register("password")}
            error={errors.password && { message: errors.password.message }}
            placeholder="••••••••"
            className="pl-10 w-full h-[40px] rounded border-gray-300 border-2"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push("/auth/forgot-password")}
              className="text-sm text-primary-600 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600  hover:opacity-90 text-white font-semibold py-3 md:py-4 rounded"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </motion.div>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center space-x-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-600 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google sign-in */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600  border border-gray-300 text-white py-3 md:py-4 rounded"
        >
          <FaGoogle className="text-xl" />
          <span>Sign in with Google</span>
        </motion.button>

        {/* Redirect to Sign Up */}
        <p className="text-gray-500 text-center text-sm md:text-base">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/auth/signup")}
            className="text-primary-500 transition-colors"
          >
            Sign Up
          </button>
        </p>
      </div>
    </section>
  );
}