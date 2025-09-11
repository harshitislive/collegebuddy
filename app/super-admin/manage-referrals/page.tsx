"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Phone, MessageCircle, CheckCircle, XCircle, Info } from "lucide-react";

type Referral = {
  id: string;
  type: "GUEST" | "PENDING" | "SUCCESS";
  createdAt: string;
  referee?: {
    id: string;
    name: string;
    email: string;
    phoneNo?: string;
  };
  course?: {
    id: string;
    title: string;
    code?: string;
  };
  status: "PENDING" | "APPROVED" | "REJECTED";
  message?: string;
};

export default function ManageReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    try {
      const res = await fetch("/api/super-admin/referrals");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReferrals(data);
    } catch (error) {
      console.log("Error while fetching referrals:", error);
      toast.error("Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const message =
        status === "REJECTED" ? prompt("Enter rejection reason:") || "" : "";

      const res = await fetch("/api/super-admin/referrals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(`Referral ${status.toLowerCase()} successfully`);
      fetchReferrals();
    } catch (error) {
      console.log("Error while updating status:", error);
      toast.error("Failed to update referral");
    }
  };

  const counts = {
    total: referrals.length,
    guest: referrals.filter((r) => r.type === "GUEST").length,
    pending: referrals.filter((r) => r.status === "PENDING").length,
    approved: referrals.filter((r) => r.status === "APPROVED").length,
    rejected: referrals.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">📋 Manage Referrals</h1>
          <p className="text-slate-600 mt-1">
            Approve, reject, and track user referrals
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="bg-white shadow-md rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-slate-800">{counts.total}</p>
            <p className="text-sm text-slate-500">Total Referrals</p>
          </div>
          <div className="bg-blue-100 shadow-md rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-blue-700">{counts.guest}</p>
            <p className="text-sm text-blue-600">Guest</p>
          </div>
          <div className="bg-yellow-100 shadow-md rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-yellow-700">{counts.pending}</p>
            <p className="text-sm text-yellow-600">Pending</p>
          </div>
          <div className="bg-green-100 shadow-md rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-green-700">{counts.approved}</p>
            <p className="text-sm text-green-600">Approved</p>
          </div>
          <div className="bg-red-100 shadow-md rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-red-700">{counts.rejected}</p>
            <p className="text-sm text-red-600">Rejected</p>
          </div>
        </div>

        {/* Referrals Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 text-sm uppercase">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Type</th>
                <th className="p-3">Course</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-slate-500">
                    Loading referrals...
                  </td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-slate-400">
                    No referrals found.
                  </td>
                </tr>
              ) : (
                referrals.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-slate-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{r.referee?.name || "N/A"}</p>
                        <p className="text-xs text-slate-500">{r.referee?.email}</p>
                        {r.referee?.phoneNo && (
                          <div className="flex gap-2 mt-1">
                            <a
                              href={`tel:${r.referee.phoneNo}`}
                              className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
                            >
                              <Phone size={14} /> Call
                            </a>
                            <a
                              href={`https://wa.me/${r.referee.phoneNo}`}
                              target="_blank"
                              className="text-green-600 hover:underline flex items-center gap-1 text-xs"
                            >
                              <MessageCircle size={14} /> WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          r.type === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : r.type === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td className="p-3">{r.course?.title || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          r.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : r.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {r.status}
                      </span>
                      {r.message && (
                        <span
                          className="ml-2 text-slate-400 cursor-pointer"
                          title={r.message}
                        >
                          <Info size={14} />
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center flex gap-2 justify-center">
                      <button
                        onClick={() => handleUpdateStatus(r.id, "APPROVED")}
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(r.id, "REJECTED")}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
