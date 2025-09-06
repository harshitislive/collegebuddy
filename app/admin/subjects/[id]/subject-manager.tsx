"use client";

import { useEffect, useState } from "react";

type Note = { id: string; title: string; fileUrl: string };
type Lecture = { id: string; title: string; url: string };
type Session = { id: string; title: string; meetLink: string; date: string };
type Assignment = { id: string; title: string; description?: string | null; dueDate?: string | null };

export default function SubjectManager({ subjectId }: { subjectId: string }) {
  const [tab, setTab] = useState<"notes" | "lectures" | "live" | "assignments">("notes");

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b px-4 py-2 flex gap-2">
        <Tab label="Notes" active={tab === "notes"} onClick={() => setTab("notes")} />
        <Tab label="Lectures" active={tab === "lectures"} onClick={() => setTab("lectures")} />
        <Tab label="Live Sessions" active={tab === "live"} onClick={() => setTab("live")} />
        <Tab label="Assignments" active={tab === "assignments"} onClick={() => setTab("assignments")} />
      </div>
      <div className="p-4">
        {tab === "notes" && <NotesPanel subjectId={subjectId} />}
        {tab === "lectures" && <LecturesPanel subjectId={subjectId} />}
        {tab === "live" && <LivePanel subjectId={subjectId} />}
        {tab === "assignments" && <AssignmentsPanel subjectId={subjectId} />}
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded ${active ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-700"}`}
    >
      {label}
    </button>
  );
}

/* ----------------- NOTES ----------------- */
function NotesPanel({ subjectId }: { subjectId: string }) {
  const [items, setItems] = useState<Note[]>([]);
  const [form, setForm] = useState({ title: "", fileUrl: "" });

  async function load() {
    const res = await fetch(`/api/admin/notes?subjectId=${subjectId}`, { cache: "no-store" });
    setItems(await res.json());
  }
  
  useEffect(() => { load(); }, [subjectId]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, ...form }),
    });
    setForm({ title: "", fileUrl: "" });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete note?")) return;
    await fetch("/api/admin/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div>
      <FormSection title="Add Note">
        <form onSubmit={create} className="grid gap-2 sm:grid-cols-2">
          <input className="border rounded p-2" placeholder="Title" value={form.title}
                 onChange={e=>setForm({...form, title: e.target.value})} required />
          <input className="border rounded p-2" placeholder="File URL (PDF/Doc)" value={form.fileUrl}
                 onChange={e=>setForm({...form, fileUrl: e.target.value})} required />
          <button className="bg-blue-600 text-white rounded px-4 py-2 sm:col-span-2">Add Note</button>
        </form>
      </FormSection>

      <ListSection>
        {items.length === 0 ? <Empty /> : (
          <ul className="divide-y">
            {items.map(n=>(
              <li key={n.id} className="py-2 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{n.title}</div>
                  <a className="text-sm text-blue-600 hover:underline" href={n.fileUrl} target="_blank">Open</a>
                </div>
                <button onClick={()=>remove(n.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </ListSection>
    </div>
  );
}

/* --------------- LECTURES --------------- */
function LecturesPanel({ subjectId }: { subjectId: string }) {
  const [items, setItems] = useState<Lecture[]>([]);
  const [form, setForm] = useState({ title: "", url: "" });

  async function load() {
    const res = await fetch(`/api/admin/lectures?subjectId=${subjectId}`, { cache: "no-store" });
    setItems(await res.json());
  }
  useEffect(() => { load(); }, [subjectId]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/lectures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, ...form }),
    });
    setForm({ title: "", url: "" });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete lecture?")) return;
    await fetch("/api/admin/lectures", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div>
      <FormSection title="Add Lecture">
        <form onSubmit={create} className="grid gap-2 sm:grid-cols-2">
          <input className="border rounded p-2" placeholder="Title" value={form.title}
                 onChange={e=>setForm({...form, title: e.target.value})} required />
          <input className="border rounded p-2" placeholder="YouTube URL" value={form.url}
                 onChange={e=>setForm({...form, url: e.target.value})} required />
          <button className="bg-blue-600 text-white rounded px-4 py-2 sm:col-span-2">Add Lecture</button>
        </form>
      </FormSection>

      <ListSection>
        {items.length === 0 ? <Empty /> : (
          <ul className="divide-y">
            {items.map(l=>(
              <li key={l.id} className="py-2 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{l.title}</div>
                  <a className="text-sm text-blue-600 hover:underline" href={l.url} target="_blank">Open</a>
                </div>
                <button onClick={()=>remove(l.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </ListSection>
    </div>
  );
}

/* --------------- LIVE SESSIONS --------------- */
function LivePanel({ subjectId }: { subjectId: string }) {
  const [items, setItems] = useState<Session[]>([]);
  const [form, setForm] = useState({ title: "", meetLink: "", date: "" });

  async function load() {
    const res = await fetch(`/api/admin/sessions?subjectId=${subjectId}`, { cache: "no-store" });
    setItems(await res.json());
  }
  useEffect(() => { load(); }, [subjectId]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, ...form }),
    });
    setForm({ title: "", meetLink: "", date: "" });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete session?")) return;
    await fetch("/api/admin/sessions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div>
      <FormSection title="Schedule Live Session">
        <form onSubmit={create} className="grid gap-2 sm:grid-cols-3">
          <input className="border rounded p-2" placeholder="Title" value={form.title}
                 onChange={e=>setForm({...form, title: e.target.value})} required />
          <input className="border rounded p-2" placeholder="Meet Link" value={form.meetLink}
                 onChange={e=>setForm({...form, meetLink: e.target.value})} required />
          <input className="border rounded p-2" type="datetime-local" value={form.date}
                 onChange={e=>setForm({...form, date: e.target.value})} required />
          <button className="bg-blue-600 text-white rounded px-4 py-2 sm:col-span-3">Add Session</button>
        </form>
      </FormSection>

      <ListSection>
        {items.length === 0 ? <Empty /> : (
          <ul className="divide-y">
            {items.map(s=>(
              <li key={s.id} className="py-2 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-sm text-gray-600">
                    <a className="text-blue-600 hover:underline" href={s.meetLink} target="_blank">Meet</a>
                    <span className="ml-2">{new Date(s.date).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={()=>remove(s.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </ListSection>
    </div>
  );
}

/* --------------- ASSIGNMENTS --------------- */
function AssignmentsPanel({ subjectId }: { subjectId: string }) {
  const [items, setItems] = useState<Assignment[]>([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });

  async function load() {
    const res = await fetch(`/api/admin/assignments?subjectId=${subjectId}`, { cache: "no-store" });
    setItems(await res.json());
  }
  useEffect(() => { load(); }, [subjectId]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, ...form }),
    });
    setForm({ title: "", description: "", dueDate: "" });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete assignment?")) return;
    await fetch("/api/admin/assignments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div>
      <FormSection title="Create Assignment">
        <form onSubmit={create} className="grid gap-2 sm:grid-cols-3">
          <input className="border rounded p-2" placeholder="Title" value={form.title}
                 onChange={e=>setForm({...form, title: e.target.value})} required />
          <input className="border rounded p-2 sm:col-span-2" placeholder="Description (optional)" value={form.description}
                 onChange={e=>setForm({...form, description: e.target.value})} />
          <input className="border rounded p-2" type="date" value={form.dueDate}
                 onChange={e=>setForm({...form, dueDate: e.target.value})} />
          <button className="bg-blue-600 text-white rounded px-4 py-2 sm:col-span-3">Add Assignment</button>
        </form>
      </FormSection>

      <ListSection>
        {items.length === 0 ? <Empty /> : (
          <ul className="divide-y">
            {items.map(a=>(
              <li key={a.id} className="py-2 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-sm text-gray-600">
                    {a.description || "—"}
                    {a.dueDate && <span className="ml-2">Due: {new Date(a.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <button onClick={()=>remove(a.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </ListSection>
    </div>
  );
}

/* --------------- SHARED UI HELPERS --------------- */
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 border rounded-lg p-4 mb-4">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ListSection({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border rounded-lg p-4">{children}</div>;
}

function Empty() {
  return <p className="text-sm text-gray-500">Nothing here yet.</p>;
}
