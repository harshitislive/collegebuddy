"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams()
  const token = params.get("token")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      if (res.ok) {
        setMessage("✅ Password has been reset successfully. You can login now.")
        setPassword("")

        router.push("/login");
      } else {
        setMessage(data.error || "❌ Failed to reset password.")
      }
    } catch {
      setMessage("❌ Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="w-full max-w-md">
        <div className="relative bg-white shadow-xl rounded-2xl overflow-hidden p-8 md:p-10">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-200 rounded-full opacity-30 blur-3xl"></div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h1>
          <p className="text-slate-500 text-sm mb-6">
            Enter your new password below to regain access to your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg px-4 py-3 font-semibold text-white transition-all duration-300 ${
                loading
                  ? "bg-gradient-to-r from-blue-400 to-indigo-500 opacity-90 cursor-wait"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-slate-600">{message}</p>
          )}
        </div>
      </div>
    </main>
  )
}
