"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Video,
  Radio,
  UserPlus,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", Icon: LayoutDashboard },
  { href: "/live", label: "Live Classes", Icon: Radio },
  { href: "/assignments", label: "Assignments", Icon: BookOpen },
  { href: "/lectures", label: "Recorded Lectures", Icon: Video },
  { href: "/notes", label: "Notes", Icon: BookOpen },
  { href: "/referral", label: "Referral", Icon: UserPlus },
  { href: "/profile", label: "Profile", Icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open (mobile)
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (_) {}
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar (mobile + tablet) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-bold">College <span className="text-blue-600">Buddy</span></h1>
          <div className="w-6" />
        </div>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-slate-900 text-white">
        <div className="px-6 py-6 border-b border-white/10">
          <h2 className="text-2xl font-extrabold tracking-tight">College <span className="text-blue-400">Buddy</span></h2>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${active ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 font-medium"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Drawer (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed z-50 inset-y-0 left-0 w-72 bg-slate-900 text-white transform transition-transform duration-300 lg:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Sidebar"
      >
        <div className="px-4 py-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-xl font-bold">College <span className="text-blue-400">Buddy</span></h2>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${active ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 font-medium"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content (adds left padding for desktop sidebar) */}
      <main className="lg:pl-72">
        {/* Optional desktop topbar (keeps spacing consistent) */}
        <div className="hidden lg:block h-16" />
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
