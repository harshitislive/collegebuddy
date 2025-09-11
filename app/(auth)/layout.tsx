// app/(auth)/layout.tsx
"use client";

import { Toaster } from "react-hot-toast";
import { ReactNode, Suspense } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
        <Toaster position="top-right" />
        {children}
    </Suspense>
  );
}
