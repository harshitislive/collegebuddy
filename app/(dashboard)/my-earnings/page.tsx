"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Payout = {
  id: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "REJECTED";
  createdAt: string;
};

type Earnings = {
  daily: number;
  weekly: number;
  monthly: number;
  referral: number;
  gigs: number;
  payouts: Payout[];
};

export default function MyEarningsPage() {
  const [data, setData] = useState<Earnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "SUCCESS">("ALL");

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch("/api/my-earnings");
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        setData(json);
      } catch (err: any) {
        toast.error(err.message || "Failed to load earnings");
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-pink-50 p-6 md:p-10">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 flex justify-center items-center gap-2">
          💰 My Earnings
        </h1>
        <p className="text-slate-600 mt-1">
          Track your earnings from referrals, gigs, and courses
        </p>
      </div>

      {loading ? (
        <p className="text-slate-600 text-center">Loading earnings...</p>
      ) : !data ? (
        <p className="text-slate-500 text-center">No data available.</p>
      ) : (
        <>
          {/* Earnings Grid */}
          <div className="grid gap-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card title="Daily Earnings" value={data.daily} color="from-green-400 to-emerald-500" icon="🏆" />
              <Card title="Weekly Earnings" value={data.weekly} color="from-blue-400 to-indigo-500" icon="📅" />
              <Card title="Monthly Earnings" value={data.monthly} color="from-pink-400 to-rose-500" icon="📖" />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card title="Referral Earnings" value={data.referral} color="from-purple-400 to-indigo-500" icon="👥" />
              <Card title="Gig Earnings" value={data.gigs} color="from-orange-400 to-yellow-500" icon="👜" />
            </div>
          </div>

          {/* Payment History */}
          <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
              📑 Payment History
            </h2>

            {/* Tabs */}
            <div className="flex gap-3 mb-4">
              {(["ALL", "PENDING", "SUCCESS"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === status
                      ? status === "ALL"
                        ? "bg-blue-600 text-white"
                        : status === "PENDING"
                        ? "bg-yellow-500 text-white"
                        : "bg-green-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-3">
              {data.payouts.filter((p) => filter === "ALL" || p.status === filter).length === 0 ? (
                <p className="text-slate-500 text-sm">No payouts in this category.</p>
              ) : (
                data.payouts
                  .filter((p) => filter === "ALL" || p.status === filter)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-slate-50 hover:bg-slate-100 transition"
                    >
                      <div>
                        <p className="font-semibold">₹{p.amount}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : p.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function Card({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: number;
  color: string;
  icon: string;
}) {
  return (
    <div
      className={`rounded-xl shadow-md p-6 text-white bg-gradient-to-r ${color} hover:shadow-xl transition`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">₹{value.toFixed(0)}</p>
    </div>
  );
}
