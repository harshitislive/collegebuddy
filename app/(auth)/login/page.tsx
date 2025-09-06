"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if(session) {
      if(session.user.role === "SUPERADMIN") {
        router.push("/super-admin");
      } else if(session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [router, session])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) throw new Error(result.error)
      if (result?.ok) {
        console.log(result);
      }
    } catch (error) {
      console.error("Login error:", error)
      setErr(error as string);
    }
  }

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
