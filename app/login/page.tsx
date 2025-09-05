"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  const next = useSearchParams().get("next"); // optional redirect from middleware

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🔎 Login API response:", data);

      if (res.ok) {
        // If middleware asked for a specific page → honor it
        if (next) {
          console.log("➡️ Redirecting to:", next);
          router.replace(next);
          return;
        }

        // Otherwise decide based on role
        if (data.role === "SUPERADMIN") {
          console.log("➡️ Redirecting to /super-admin");
          router.replace("/super-admin");
        } else if (data.role === "ADMIN") {
          console.log("➡️ Redirecting to /admin");
          router.replace("/admin");
        } else {
          console.log("➡️ Redirecting to /dashboard");
          router.replace("/dashboard");
        }
      } else {
        setErr(data.error || "Login failed");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setErr("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        {err && <p className="text-red-600 text-sm">{err}</p>}

        <input
          className="w-full border rounded p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full border rounded p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-sm text-center">
          No account?{" "}
          <a className="text-blue-600 hover:underline" href="/register">
            Register
          </a>
        </p>
      </form>
    </main>
  );
}
