"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Copy, IndianRupee, Phone, MessageCircle } from "lucide-react";

type Stats = {
  referralCode: string;
  weekly: number;
  monthly: number;
  total: number;
  successCount: number;
  pendingCount: number;
  rejectedCount: number;
};

type Referral = {
  id: string;
  type: "GUEST" | "PENDING" | "SUCCESS" | "REJECTED";
  name?: string | null;
  email?: string | null;
  phoneNo?: string | null;
  courseCode?: string | null;
  amount?: number | null;
  createdAt: string;
};

export default function ReferralPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [tab, setTab] = useState<
    "ALL" | "SUCCESS" | "PENDING" | "REJECTED"
  >("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referrals")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setReferrals(data.referrals);
      })
      .catch(() => toast.error("Failed to load referrals"))
      .finally(() => setLoading(false));
  }, []);

  const filteredReferrals =
    tab === "ALL" ? referrals : referrals.filter((r) => r.type === tab);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-pink-50 p-6">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">
              🎉 Referral Program
            </h1>
            <p className="text-sm text-blue-100">
              Earn by inviting friends & sharing courses
            </p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p className="text-lg">
              <span className="font-bold">Per Account:</span> ₹50
            </p>
            <p className="text-lg">
              <span className="font-bold">Per Course Referral:</span> 10%
            </p>
          </div>
        </div>

        {/* Referral Code */}
        {stats && (
          <div className="bg-white shadow rounded-xl p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Your Referral Link
              </h2>
              <p className="text-blue-600 font-bold">
                {`${window.location.origin}/register?ref=${stats.referralCode}`}
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/register?ref=${stats.referralCode}`
                );
                toast.success("Referral link copied!");
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            <div className="bg-white shadow rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500">Weekly Earnings</p>
              <p className="text-xl font-bold text-blue-600">
                ₹{stats.weekly}
              </p>
            </div>
            <div className="bg-white shadow rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500">Monthly Earnings</p>
              <p className="text-xl font-bold text-indigo-600">
                ₹{stats.monthly}
              </p>
            </div>
            <div className="bg-white shadow rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-xl font-bold text-green-600">
                ₹{stats.total}
              </p>
            </div>
            <div className="bg-white shadow rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500">Success Count</p>
              <p className="text-xl font-bold text-green-600">
                {stats.successCount}
              </p>
            </div>
            <div className="bg-white shadow rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500">Pending Count</p>
              <p className="text-xl font-bold text-yellow-600">
                {stats.pendingCount}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3">
          {[
            { key: "ALL", color: "bg-blue-600" },
            { key: "SUCCESS", color: "bg-green-600" },
            { key: "PENDING", color: "bg-orange-500" },
            { key: "REJECTED", color: "bg-red-600" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`px-4 py-2 rounded-lg font-medium text-white ${
                tab === t.key ? t.color : "bg-gray-400"
              }`}
            >
              {t.key}
            </button>
          ))}
        </div>

        {/* Referrals Table */}
        <div className="bg-white shadow rounded-xl p-6">
          {loading ? (
            <p>Loading...</p>
          ) : filteredReferrals.length === 0 ? (
            <p className="text-gray-500">No referrals found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Course</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{r.name || r.email || "Guest"}</td>
                      <td className="py-2">{r.type}</td>
                      <td className="py-2">{r.courseCode || "-"}</td>
                      <td className="py-2 text-center">
                        {r.type === "SUCCESS" && r.amount ? (
                          <span className="text-green-600 font-bold flex items-center justify-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {r.amount}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-2 flex justify-center gap-2">
                        {(r.type === "GUEST" || r.type === "PENDING") &&
                          r.phoneNo && (
                            <>
                              <a
                                href={`tel:${r.phoneNo}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Phone className="w-5 h-5" />
                              </a>
                              <a
                                href={`https://wa.me/${r.phoneNo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800"
                              >
                                <MessageCircle className="w-5 h-5" />
                              </a>
                            </>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
