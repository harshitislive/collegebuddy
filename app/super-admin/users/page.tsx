"use client";

import { useEffect, useState } from "react";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STUDENT" });

  async function loadUsers() {
    const res = await fetch("/api/super-admin/users");
    setUsers(await res.json());
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/super-admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: "", email: "", password: "", role: "STUDENT" });
      loadUsers();
    } else {
      alert("Error creating user");
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this user permanently?")) return;
    await fetch("/api/super-admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadUsers();
  }

  async function promoteToAdmin(id: string) {
    await fetch("/api/super-admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: "ADMIN" }),
    });
    loadUsers();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">👥 Manage Users</h1>
      <p className="mt-2 text-gray-600">Add, promote, or delete users.</p>

      {/* Add User Form */}
      <form onSubmit={handleSubmit} className="mt-6 bg-white shadow p-6 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">➕ Add User</h2>
        <input
          className="w-full border rounded p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          className="w-full border rounded p-2"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="STUDENT">Student</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button className="bg-blue-600 text-white rounded px-4 py-2">
          Create User
        </button>
      </form>

      {/* Users Table */}
      <div className="mt-6 bg-white shadow p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Current Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">No users yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-gray-700">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-none">
                  <td className="py-2 px-3">{u.name}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3">{u.role}</td>
                  <td className="py-2 px-3 space-x-2">
                    {u.role === "STUDENT" && (
                      <button
                        onClick={() => promoteToAdmin(u.id)}
                        className="bg-yellow-500 text-white rounded px-3 py-1 text-sm hover:bg-yellow-600"
                      >
                        Promote to Admin
                      </button>
                    )}
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="bg-red-600 text-white rounded px-3 py-1 text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
