"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Gig = {
  id: string;
  title: string;
  description: string;
  url?: string;
  reward: number;
  createdAt: string;
};

export default function AdminGigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [reward, setReward] = useState<number>(0);

  // fetch gigs
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await fetch("/api/admin/gigs");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setGigs(data.gigs);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch gigs");
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  // create gig
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, url, reward }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Gig created!");
      setGigs((prev) => [...prev, data.gig]);
      setTitle("");
      setDescription("");
      setUrl("");
      setReward(0);
    } catch (err: any) {
      toast.error(err.message || "Failed to create gig");
    }
  };

  return (
    <main className="p-6 space-y-8">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold text-gray-800">📋 Manage Gigs</h1>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4 max-w-lg"
      >
        <h2 className="text-lg font-semibold text-gray-700">Create New Gig</h2>

        <input
          required
          className="w-full border rounded-lg p-2"
          placeholder="Gig title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          required
          className="w-full border rounded-lg p-2"
          placeholder="Gig description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="w-full border rounded-lg p-2"
          placeholder="Optional URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="number"
          required
          className="w-full border rounded-lg p-2"
          placeholder="Reward"
          value={reward}
          onChange={(e) => setReward(Number(e.target.value))}
        />

        <button className="w-full bg-blue-600 text-white rounded-lg p-2 font-semibold hover:bg-blue-700">
          Create Gig
        </button>
      </form>

      {/* Gig List */}
      <section>
        <h2 className="text-xl font-bold mb-4">Existing Gigs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : gigs.length === 0 ? (
          <p className="text-gray-500">No gigs created yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg">{gig.title}</h3>
                <p className="text-sm text-gray-600">{gig.description}</p>
                {gig.url && (
                  <a
                    href={gig.url}
                    target="_blank"
                    className="text-blue-600 text-sm underline"
                  >
                    Visit
                  </a>
                )}
                <p className="font-medium mt-2">Reward: ₹{gig.reward}</p>
                <p className="text-xs text-gray-400">
                  Created: {new Date(gig.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
