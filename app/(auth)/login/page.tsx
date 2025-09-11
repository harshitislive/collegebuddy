"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (session) {
      if (session.user.role === "SUPERADMIN") {
        router.push("/super-admin");
      } else if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [router, session]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) throw new Error(result.error);
    } catch (error) {
      console.error("Login error:", error);
      setErr((error as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email before resetting password.");
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        toast.success("Password reset link sent to your email.");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to send reset link.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg relative z-10">
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <Image
                width={64}
                height={64}
                src="/logo.png"
                alt="College Buddy"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">College Buddy</h1>
                <p className="text-sm text-slate-500">
                  Welcome Back, Login your account
                </p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {err && <p className="text-red-600 text-sm">{err}</p>}

              <label className="block text-sm text-slate-700">
                <input
                  className="mt-1 w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="block text-sm text-slate-700 relative">
                <input
                  className="mt-1 w-full border border-slate-200 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </label>

              <div className="flex items-center justify-between">
                {/* 🔥 Forgot password now uses handler */}
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>

                <a href="/help" className="text-sm text-blue-600 hover:underline">
                  Need help?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`relative w-full rounded-lg px-4 py-3 font-semibold text-white transition-all duration-300 ${
                  loading
                    ? "bg-gradient-to-r from-blue-400 to-indigo-500 opacity-90 cursor-wait"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
