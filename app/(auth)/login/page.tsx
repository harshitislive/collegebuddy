"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
      if (result?.ok) {
        console.log(result);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErr((error as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      {/* Card container */}
      <div className="w-full max-w-lg relative z-10">
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* background decoration */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 opacity-60 blur-3xl transform rotate-12"></div>
            <div className="absolute -bottom-16 -right-20 w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-100 via-lime-100 to-rose-100 opacity-50 blur-2xl transform -rotate-6"></div>
          </div>

          <div className="p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              {/* LOGO IMAGE */}
              <Image
                width={64}
                height={64}
                src="/logo.png" // <-- place your updated logo here (public/logo.png)
                alt="College Buddy"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">College Buddy</h1>
                <p className="text-sm text-slate-500">Welcome Back, Login your account</p>
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

                {/* toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.73 1 12c.49-1.16 1.2-2.24 2.12-3.2" />
                      <path d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </label>

              <div className="flex items-center justify-between">
                <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>

                <a href="/help" className="text-sm text-blue-600 hover:underline">
                  Need help?
                </a>
              </div>

              {/* Smooth loading button */}
              <button
                type="submit"
                disabled={loading}
                className={
                  `relative w-full rounded-lg px-4 py-3 font-semibold text-white transition-all duration-300 ` +
                  (loading
                    ? "bg-gradient-to-r from-blue-400 to-indigo-500 opacity-90 cursor-wait"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700")
                }
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.2" strokeWidth="4"></circle>
                      <path d="M22 12a10 10 0 0 0-10-10" stroke="white" strokeWidth="4" strokeLinecap="round"></path>
                    </svg>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <span>Login</span>
                )}
              </button>

              <p className="text-sm text-center text-slate-500">
                No account?{" "}
                <a className="text-blue-600 hover:underline" href="/register">
                  Register
                </a>
              </p>
            </form>

            <p className="mt-6 text-xs text-slate-400 text-center">
              By signing in you agree to our terms and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
