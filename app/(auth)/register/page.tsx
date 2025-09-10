"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [referralId, setReferralId] = useState("");

  useEffect(() => {
    const ref = searchParams?.get("ref");
    if (ref) setReferralId(ref);
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phoneNo, referralId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Account created!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(error.message || "Something went wrong");
      setErr(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Toaster position="top-right" />

      <div className="w-full max-w-lg relative z-10">
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 opacity-60 blur-3xl transform rotate-12"></div>
            <div className="absolute -bottom-16 -right-20 w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-100 via-lime-100 to-rose-100 opacity-50 blur-2xl transform -rotate-6"></div>
          </div>

          <div className="p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <img src="/logo.png" alt="College Buddy" className="w-16 h-16 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
                <p className="text-sm text-slate-500">Join College Buddy today</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {err && <p className="text-red-600 text-sm">{err}</p>}

              <input
                required
                className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                required
                type="email"
                className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-slate-200 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <input
                type="tel"
                className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Phone number"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />

              <input
                className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Referral code"
                value={referralId}
                onChange={(e) => setReferralId(e.target.value)}
              />

              <button
                type="submit"
                disabled={!name || !email || !password || loading}
                className={`relative w-full rounded-lg px-4 py-3 font-semibold text-white transition-all duration-300 ${
                  loading
                    ? "bg-gradient-to-r from-blue-400 to-indigo-500 opacity-90 cursor-wait"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="text-sm text-center text-slate-500">
                Already have an account?{" "}
                <a className="text-blue-600 hover:underline" href="/login">
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
