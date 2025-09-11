"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Gig = {
  id: string;
  title: string;
  description: string;
  reward: number;
  url?: string;
  createdAt: string;
};

export default function PaidGigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await fetch("/api/paid-gigs");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setGigs(data);
      } catch (error) {
        toast.error("Failed to load gigs");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-pink-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">
          💼 Paid Gigs
        </h1>

        {loading ? (
          <p className="text-slate-600 text-center">Loading gigs...</p>
        ) : gigs.length === 0 ? (
          <p className="text-slate-500 text-center">No gigs available right now.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6 space-y-3">
                  <h2 className="text-xl font-bold text-slate-900">
                    {gig.title}
                  </h2>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {gig.description}
                  </p>

                  <p className="text-lg font-semibold text-emerald-600">
                    Reward: ₹{gig.reward}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-slate-400">
                      {new Date(gig.createdAt).toLocaleDateString()}
                    </span>
                    {gig.url && (
                      <a
                        href={gig.url}
                        target="_blank"
                        className="text-sm text-blue-600 hover:underline"
                        rel="noopener noreferrer"
                      >
                        View Task ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
