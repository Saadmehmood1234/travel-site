"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "./Button";
import { useState, Suspense } from "react";
import { resendVerificationEmail } from "@/app/actions/resendVerification";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleResend = async () => {
    setIsResending(true);
    try {
      const email = searchParams.get("email");
      if (!email) throw new Error("Email not found");

      const result = await resendVerificationEmail(email);
      setResendStatus(result);
    } catch (error) {
      setResendStatus({
        success: false,
        message: "Failed to resend verification email",
      });
    } finally {
      setIsResending(false);
    }
  };

  const errorMessages: Record<string, { title: string; description: string }> =
    {
      "email-not-verified": {
        title: "Email Not Verified",
        description: "Please verify your email address to continue",
      },
      "invalid-credentials": {
        title: "Invalid Credentials",
        description: "The email or password you entered is incorrect",
      },
      "user-not-found": {
        title: "Account Not Found",
        description: "No account exists with this email address",
      },
      "duplicate-phone": {
        title: "Phone Number Already Used",
        description:
          "An account with this phone number already exists. Please use a different phone number or sign in.",
      },
      "oauth-account-not-linked": {
        title: "Account Not Linked",
        description:
          "Please sign in with the original method you used to register",
      },
      default: {
        title: "Authentication Error",
        description: "Something went wrong during authentication",
      },
    };

  const currentError =
    errorMessages[error || "default"] || errorMessages.default;
  const email = searchParams.get("email");

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-140px)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-destructive"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">{currentError.title}</h1>
          <p className="text-muted-foreground">{currentError.description}</p>

          {error === "email-not-verified" && email && (
            <div className="w-full space-y-4 pt-4">
              <button
                onClick={handleResend}
                disabled={isResending}
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full",
                })}
              >
                {isResending ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Resend Verification Email"
                )}
              </button>
              {resendStatus && (
                <p
                  className={`text-sm ${
                    resendStatus.success ? "text-green-600" : "text-destructive"
                  }`}
                >
                  {resendStatus.message}
                </p>
              )}
            </div>
          )}

          <Link
            href="/auth/signin"
            className={buttonVariants({ variant: "link", size: "sm" })}
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}