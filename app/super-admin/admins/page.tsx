"use client";

import { useEffect, useState } from "react";
import type { User } from "@prisma/client";

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [form, setForm] = useState({ id: "", name: "", email: "", password: "" });
  const [editing, setEditing] = useState(false);

  async function loadAdmins() {
    const res = await fetch("/api/super-admin/admins");
    setAdmins(await res.json());
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await fetch("/api/super-admin/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/super-admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ id: "", name: "", email: "", password: "" });
    setEditing(false);
    loadAdmins();
  }

  async function handleEdit(admin: User) {
    setForm({ id: admin.id, name: admin.name, email: admin.email, password: "" });
    setEditing(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    await fetch("/api/super-admin/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadAdmins();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">👨‍🏫 Manage Admins</h1>
      <p className="mt-2 text-gray-600">Add, edit, or remove Admin accounts.</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 bg-white shadow p-6 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">
          {editing ? "✏️ Edit Admin" : "➕ Add New Admin"}
        </h2>
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
          required={!editing}
        />
        <button className="bg-blue-600 text-white rounded px-4 py-2">
          {editing ? "Update Admin" : "Create Admin"}
        </button>
      </form>

      {/* Admins Table */}
      <div className="mt-6 bg-white shadow p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Current Admins</h2>
        {admins.length === 0 ? (
          <p className="text-gray-500">No admins yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-gray-700">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b last:border-none">
                  <td className="py-2 px-3">{admin.name}</td>
                  <td className="py-2 px-3">{admin.email}</td>
                  <td className="py-2 px-3 space-x-2">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="bg-yellow-500 text-white rounded px-3 py-1 text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="bg-red-600 text-white rounded px-3 py-1 text-sm hover:bg-red-700"
                    >
                      Remove
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
