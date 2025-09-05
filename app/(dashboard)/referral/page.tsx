"use client"

import { useState } from "react"
import { Trophy, Users, Wallet, Copy, CheckCircle } from "lucide-react"

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = "COLLEGEBUDDY123"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl shadow-lg p-10 text-center">
        <h1 className="text-2xl font-extrabold">💎 Referral & Earnings</h1>
        <p className="mt-3 text-lg opacity-90">
          Invite your friends, complete gigs, and earn rewards daily!
        </p>

        {/* Referral Code */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="bg-white text-gray-800 px-6 py-3 rounded-xl font-mono font-bold shadow-md">
            {referralCode}
          </div>
          <button
            onClick={copyToClipboard}
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-semibold shadow hover:bg-yellow-300"
          >
            {copied ? (
              <span className="flex items-center gap-2"><CheckCircle size={18}/> Copied</span>
            ) : (
              <span className="flex items-center gap-2"><Copy size={18}/> Copy</span>
            )}
          </button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <Trophy size={40} />
          <h2 className="text-xl font-bold mt-2">Daily Earnings</h2>
          <p className="text-2xl font-extrabold mt-1">₹ 1,200</p>
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

        <div className="space-y-6">
          {/* Referral Earnings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Referral Earnings</h3>
            <div className="space-y-3">
              <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
                <span className="font-medium">Rahul Sharma</span>
                <span className="font-bold text-green-600">+ ₹500</span>
              </div>
              <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
                <span className="font-medium">Sneha Patel</span>
                <span className="font-bold text-green-600">+ ₹500</span>
              </div>
              <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
                <span className="font-medium">Aman Verma</span>
                <span className="font-bold text-green-600">+ ₹500</span>
              </div>
            </div>
          </div>

          {/* Paid Gigs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Paid Gigs (College Buddy)</h3>
            <div className="space-y-3">
              <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
                <span className="font-medium">Social Media Internship</span>
                <span className="font-bold text-blue-600">+ ₹2,000</span>
              </div>
              <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
                <span className="font-medium">Content Writing Task</span>
                <span className="font-bold text-blue-600">+ ₹1,500</span>
              </div>
              <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
                <span className="font-medium">Campus Ambassador</span>
                <span className="font-bold text-blue-600">+ ₹3,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
