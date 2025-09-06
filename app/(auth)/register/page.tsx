"use client";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referal, setReferal] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        name: name,
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) throw new Error(result.error)

      if (result?.ok) {
        router.push("/enrollment");
      }

    } catch (error) {
      console.error("Register error:", error);
      setErr(error as string);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-bold">Create account</h1>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <input className="w-full border rounded p-2" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Referal code" value={referal} onChange={e=>setName(e.target.value)} />
        
        <button className="w-full bg-blue-600 text-white rounded p-2">Register</button>
        <p className="text-sm text-center">Have an account? <a className="text-blue-600" href="/login">Login</a></p>
      </form>
    </main>
  );
}
