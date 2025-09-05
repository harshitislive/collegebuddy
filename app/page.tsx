import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl text-center space-y-6">
        {/* Logo / Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
          🎓 Welcome to <span className="text-blue-600">College Buddy</span>
        </h1>
        <p className="text-lg text-gray-600">
          Your all-in-one portal for <span className="font-semibold">Notes, Lectures, Live Classes, Referrals</span> and more.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link
            href="/register"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition"
          >
            Login
          </Link>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 text-left">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">📘 Notes</h3>
            <p className="text-gray-600 mt-2">Access course-wise notes, download, and study anytime.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">🎥 Recorded Lectures</h3>
            <p className="text-gray-600 mt-2">Watch recorded video lectures at your own pace.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">📡 Live Classes</h3>
            <p className="text-gray-600 mt-2">Join scheduled live sessions and interact with teachers.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">💎 Referral & Gigs</h3>
            <p className="text-gray-600 mt-2">Invite friends, earn rewards, and explore paid gigs.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
