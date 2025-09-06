"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard, BookOpen, FileText, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/subjects", label: "Subjects", Icon: BookOpen },
  // Child content will be accessed per subject; these are just quick links (optional):
  { href: "/admin/notes", label: "Notes", Icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar (mobile) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => setOpen(true)} className="p-2 rounded-md hover:bg-slate-100" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-bold">Admin <span className="text-blue-600">Panel</span></h1>
          <div className="w-6" />
        </div>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-slate-900 text-white">
        <div className="px-6 py-6 border-b border-white/10">
          <h2 className="text-2xl font-extrabold">College <span className="text-blue-400">Buddy</span></h2>
          <p className="text-xs text-white/60 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  active ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 font-medium"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Drawer (mobile) */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" aria-hidden="true" />}
      <div
        className={`fixed z-50 inset-y-0 left-0 w-72 bg-slate-900 text-white transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-4 py-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-xl font-bold">Admin <span className="text-blue-400">Panel</span></h2>
          <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-white/10" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  active ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 font-medium"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-72">
        <div className="hidden lg:block h-16" />
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
