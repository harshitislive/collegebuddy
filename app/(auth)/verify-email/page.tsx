// app/verify/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [message, setMessage] = useState("Verifying...")

  useEffect(() => {
    if (token) {
      fetch(`/api/verify?token=${token}`).then(async (res) => {
        const data = await res.json()
        setMessage(data.message || data.error)
      })
    }
  }, [token])

  return <div className="p-6 text-center">{message}</div>
}
