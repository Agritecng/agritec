"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useLogisticsAuthStore } from "@/lib/store/logistics-auth-store";
import { toast } from "sonner";

const LogisticsDemoCredentials = [
  {
    fullName: "Naija Freight Operations",
    email: "ops@naijafreight.ng",
    password: "naijafreight123",
  },
  {
    fullName: "NorthField Dispatch Admin",
    email: "dispatch@northfield.ng",
    password: "northfield123",
  },
];

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useLogisticsAuthStore((state) => state.token);
  const user = useLogisticsAuthStore((state) => state.user);
  const isReady = useLogisticsAuthStore((state) => state.isReady);
  const bootstrap = useLogisticsAuthStore((state) => state.bootstrap);
  const signIn = useLogisticsAuthStore((state) => state.signIn);
  const isLoading = useLogisticsAuthStore((state) => state.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!isReady || !token || user?.role !== "LOGISTICS") return;
    router.replace(searchParams.get("next") || "/dashboard");
  }, [isReady, router, searchParams, token, user]);

  if (!isReady) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      toast.error("Enter your email and password.");
      return;
    }

    try {
      await signIn(email, password);
      router.push(searchParams.get("next") || "/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="AgriTec"
          width={150}
          height={50}
          className="h-12 w-auto"
        />
      </div>

      <Card className="space-y-6 p-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your logistics operations dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="flex items-center justify-between text-sm">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-xs font-semibold text-foreground mb-2">
            Demo Credentials:
          </p>
          <div className="space-y-2">
            {LogisticsDemoCredentials.map((seller) => (
              <div key={seller.email} className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">{seller.fullName}</p>
                <p>{seller.email}</p>
                <p>Password: {seller.password}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function SignInFallback() {
  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="AgriTec"
          width={150}
          height={50}
          className="h-12 w-auto"
        />
      </div>
      <Card className="p-8 text-center text-sm text-muted-foreground">
        Loading sign in...
      </Card>
    </div>
  );
}
