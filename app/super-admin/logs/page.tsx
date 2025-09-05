export default function SystemLogs() {
  return (
    <div>
      <h1 className="text-2xl font-bold">📊 System Logs</h1>
      <p className="mt-2 text-gray-600">Track login attempts, role changes, and important system events.</p>

      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Logs</h2>
        <p>No logs yet. (Prisma integration will go here)</p>
      </div>
    </div>
  );
}
