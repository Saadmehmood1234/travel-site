"use client";

import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { User, Mail, Lock, Phone } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { signup } from "../../actions/signup.actions";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Phone must be a valid 10-digit number"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const res = await signup(values);

    if (!res.success) {
      toast.error(res.message || "Error in SignUp");
      setLoading(false);
      return;
    }
    toast.success(res.message || "SignUp Successfully");
    reset();
    setLoading(false);
    router.push("/verifyemail");
  };

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
        <motion.div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
          {/* Inner glow effect */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-primary-400 via-secondary-400 to-primary-500 rounded-full blur-3xl opacity-30" />

          <div className="flex flex-col items-center gap-4 relative">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent drop-shadow-lg">
              Create Account
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4"
            >
              <Input
                label="Full Name"
                icon={<User className="h-5 w-5 text-primary-400" />}
                {...register("name")}
                error={errors.name && { message: errors.name.message }}
                placeholder="John Doe"
              />

              <Input
                label="Email"
                icon={<Mail className="h-5 w-5 text-primary-400" />}
                {...register("email")}
                error={errors.email && { message: errors.email.message }}
                placeholder="example@gmail.com"
              />

              <Input
                label="Phone Number"
                icon={<Phone className="h-5 w-5 text-primary-400" />}
                {...register("phone")}
                error={errors.phone && { message: errors.phone.message }}
                placeholder="9876543210"
              />

              <Input
                label="Password"
                type="password"
                icon={<Lock className="h-5 w-5 text-primary-400" />}
                {...register("password")}
                error={errors.password && { message: errors.password.message }}
                placeholder="••••••••"
              />

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-400 to-secondary-400 hover:opacity-90 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="w-full flex items-center space-x-4">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-gray-300 text-sm">OR</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Google sign-up */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center space-x-2 bg-white/10 border border-white/20 text-white py-4 rounded-xl transition-all hover:bg-white/20"
            >
              <FaGoogle className="text-xl" />
              <span>Sign up with Google</span>
            </motion.button>

            {/* Redirect to Sign In */}
            <p className="text-gray-300 text-center">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/auth/signin")}
                className="text-primary-300 hover:text-secondary-300 transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
