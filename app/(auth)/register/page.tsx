"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

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

  // email verification modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  useEffect(() => {
    const ref = searchParams?.get("ref");
    if (ref) setReferralId(ref);
  }, [searchParams]);

  // handle registration
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!/^\d{10}$/.test(phoneNo)) {
      toast.error("Phone number should be 10 digits");
      return;
    }

    if (!emailVerified) {
      toast.error("Please verify your email before registering.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        name,
        email,
        phoneNo,
        password,
        referralId,
        redirect: false,
      });

      if (result?.error) throw new Error(result.error);

      if (result?.ok) {
        router.push("/all-courses");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error as string || "Something went wrong");
      setErr(error as string || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // send OTP to email
  const onVerifyEmail = async () => {
    if (!email) return toast.error("Enter email first");

    try {
      setVerifyingEmail(true);
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Verification code sent to email!");
      setShowEmailModal(true);
    } catch (error) {
      toast.error(error as string || "Failed to send OTP");
    } finally {
      setVerifyingEmail(false);
    }
  };

  // verify OTP
  const onSubmitEmailCode = async () => {
    if (emailCode.length !== 4) {
      toast.error("Enter 4-digit code");
      return;
    }

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: emailCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Email verified!");
      setEmailVerified(true);
      setShowEmailModal(false);
    } catch (error) {
      toast.error(error as string || "Invalid OTP");
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
              <Image 
                width={64} 
                height={64}
                src="/logo.png" 
                alt="College Buddy" 
                className="w-16 h-16 object-contain" 
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
                <p className="text-sm text-slate-500">Join College Buddy today</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {err && <p className="text-red-600 text-sm">{err}</p>}

              {/* Name */}
              <input
                required
                className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Phone */}
              <input
                required
                type="tel"
                className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Phone number"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />

              {/* Email + Verify button */}
              <div className="flex gap-2">
                <input
                  required
                  type="email"
                  disabled={emailVerified}
                  className={`flex-1 border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition ${
                    emailVerified ? "bg-green-50 border-green-400" : ""
                  }`}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  onClick={onVerifyEmail}
                  disabled={emailVerified || verifyingEmail}
                  className={`px-4 py-2 rounded-lg text-white transition flex items-center justify-center ${
                    emailVerified
                      ? "bg-green-500 cursor-default"
                      : verifyingEmail
                      ? "bg-blue-400 cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {emailVerified
                    ? "Verified"
                    : verifyingEmail
                    ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                    )
                    : "Verify"}
                </button>
              </div>

              {/* Password */}
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

              {/* Referral */}
              <input
                className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Referral code (Optional)"
                value={referralId}
                onChange={(e) => setReferralId(e.target.value)}
              />

              {/* Register Button */}
              <button
                type="submit"
                disabled={!name || !email || !password || !emailVerified || loading}
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

      {/* Email Verify Modal */}
{showEmailModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
      <h2 className="text-xl font-bold">Verify Email</h2>
      <p className="text-sm text-gray-600">Enter the 4-digit code sent to {email}</p>
      <input
        type="text"
        maxLength={4}
        className="w-full border rounded-lg p-3 text-center tracking-widest text-lg"
        placeholder="* * * *"
        value={emailCode}
        onChange={(e) => setEmailCode(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={onSubmitEmailCode}
          className="flex-1 bg-blue-600 text-white rounded-lg p-2"
        >
          Verify
        </button>
        <button
          onClick={onVerifyEmail}
          className="flex-1 border rounded-lg p-2 text-blue-600"
        >
          Resend
        </button>
        <button
          onClick={() => setShowEmailModal(false)}
          className="flex-1 border rounded-lg p-2"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </main>
  );
}
