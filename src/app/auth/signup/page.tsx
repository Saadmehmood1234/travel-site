"use client";

import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
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
    <section className="flex w-full mt-12 max-md:mt-20 justify-center items-center min-h-screen bg-primary-600 px-4 py-8 md:py-16 relative overflow-hidden">
      <div className="flex flex-col items-center gap-4 relative bg-white text-black px-6 py-8 md:px-9 md:py-10 rounded-xl w-full max-w-md">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-600 drop-shadow-lg">
          Create Account
        </h2>
        <p className="text-gray-600 text-center text-sm md:text-base">
          Join us and start your journey!
        </p>

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
            className="pl-10 w-full h-[40px] rounded border-gray-300 border-2"
          />

          <Input
            label="Email"
            icon={<Mail className="h-5 w-5 text-primary-400" />}
            {...register("email")}
            error={errors.email && { message: errors.email.message }}
            placeholder="example@gmail.com"
            className="pl-10 w-full h-[40px] rounded border-gray-300 border-2"
          />

          <Input
            label="Phone Number"
            icon={<Phone className="h-5 w-5 text-primary-400" />}
            {...register("phone")}
            error={errors.phone && { message: errors.phone.message }}
            placeholder="9876543210"
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

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 hover:opacity-90 text-white font-semibold py-3 md:py-4 rounded"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </motion.div>
        </form>
        <div className="w-full flex items-center space-x-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-600 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600border border-gray-300 text-white py-3 md:py-4 rounded"
        >
          <FaGoogle className="text-xl" />
          <span>Sign up with Google</span>
        </motion.button>
        <p className="text-gray-500 text-center text-sm md:text-base">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/signin")}
            className="text-primary-500 transition-colors"
          >
            Sign In
          </button>
        </p>
      </div>
    </section>
  );
}