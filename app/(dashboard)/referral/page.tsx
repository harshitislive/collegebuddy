"use client"

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trophy, Users, Wallet, Copy, CheckCircle, Share2 } from "lucide-react"

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const [referralUrl, setReferralUrl] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"ALL" | "SUCCESS" | "PENDING">("ALL")

  // Fetch referrals
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const res = await fetch("/api/referrals")
        const data = await res.json()
        const sorted = data.referrals.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setReferrals(sorted);
        setReferralCode(data.referralCode);

        // Build full referral URL
        const origin = window.location.origin; // get current domain
        setReferralUrl(`${origin}/register?ref=${data.referralCode}`);
      } catch (err) {
        console.error("Error fetching referrals:", err)
      }
    }
    fetchReferrals()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferral = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Join this platform!",
          text: "Sign up using my referral link and earn rewards!",
          url: referralUrl,
        })
        .catch(err => console.error("Error sharing:", err))
    } else {
      copyToClipboard(referralUrl)
      alert("Referral URL copied to clipboard!")
    }
  }

  const filteredReferrals = referrals.filter(r => {
    if (activeTab === "ALL") return true
    if (activeTab === "SUCCESS") return r.status === "SUCCESS"
    if (activeTab === "PENDING") return r.status !== "SUCCESS"
    return true
  })

  const totalCommission = filteredReferrals
    .filter(r => r.status === "SUCCESS")
    .reduce((sum, r) => sum + r.commission, 0)

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl shadow-lg p-10 text-center space-y-4">
        <h1 className="text-2xl font-extrabold">💎 Referral & Earnings</h1>
        <p className="mt-1 text-lg opacity-90">Invite your friends and earn rewards!</p>

        {/* Referral URL */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="bg-white text-gray-800 px-6 py-3 rounded-xl font-mono font-bold shadow-md truncate max-w-xs">
            {referralCode}
          </div>
          <button
            onClick={() => copyToClipboard(referralUrl)}
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-semibold shadow hover:bg-yellow-300 flex items-center gap-2"
          >
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
            {copied ? "Copied" : "Copy URL"}
          </button>
          <button
            onClick={shareReferral}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-400 flex items-center gap-2"
          >
            <Share2 size={18} /> Share
          </button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <Trophy size={40} />
          <h2 className="text-xl font-bold mt-2">Daily Earnings</h2>
          <p className="text-2xl font-extrabold mt-1">₹ {totalCommission}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <Users size={40} />
          <h2 className="text-xl font-bold mt-2">Weekly Earnings</h2>
          <p className="text-2xl font-extrabold mt-1">₹ 8,500</p>
        </div>
        <div className="bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <Wallet size={40} />
          <h2 className="text-xl font-bold mt-2">Monthly Earnings</h2>
          <p className="text-2xl font-extrabold mt-1">₹ 32,000</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Earnings Breakdown</h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-xl font-semibold ${activeTab === "ALL" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("ALL")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-xl font-semibold ${activeTab === "SUCCESS" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("SUCCESS")}
          >
            Successful
          </button>
          <button
            className={`px-4 py-2 rounded-xl font-semibold ${activeTab === "PENDING" ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("PENDING")}
          >
            Pending
          </button>
        </div>

        <div className="space-y-3">
          {filteredReferrals.length === 0 ? (
            <p className="text-gray-500">No referrals in this category.</p>
          ) : (
            filteredReferrals.map((r, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                <div>
                  <span className="font-medium">{r.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    ({formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })})
                  </span>
                </div>
                <span className={`font-bold ${r.status === "SUCCESS" ? "text-green-600" : "text-yellow-600"}`}>
                  {r.status === "SUCCESS" ? `+ ₹${r.commission}` : `Pending ₹${r.commission}`}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
