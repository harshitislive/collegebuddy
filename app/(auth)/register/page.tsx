"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [err, setErr] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referralId, setReferralId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const ref = searchParams?.get("ref");
    if (ref) setReferralId(ref);
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = (await signIn("credentials", {
        name,
        email,
        password,
        referralId,
        redirect: false,
      })) as { error?: string; ok: boolean };

      if (result.error) throw new Error(result.error);

      if (result.ok) router.push("/enrollment");
    } catch (error) {
      console.error("Register error:", error);
      setErr(error as string || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h1 className="text-2xl font-bold">Create account</h1>
        {err && <p className="text-red-600 text-sm">{err}</p>}

        <input
          className="w-full border rounded p-2"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border rounded p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="w-full border rounded p-2"
          placeholder="Referral code"
          value={referralId}
          onChange={(e) => setReferralId(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white rounded p-2 disabled:opacity-50"
          disabled={!name || !email || !password}
        >
          Register
        </button>

        <p className="text-sm text-center">
          Have an account?{" "}
          <a className="text-blue-600" href="/login">
            Login
          </a>
        </p>
      </form>
    </main>
  );
}
