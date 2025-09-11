"use client";

import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

type BlurLockProps = {
  isLocked: boolean;
  children: ReactNode;
  message?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  fullPage?: boolean; // new: if true, overlay covers the whole page
};

export default function UnlockContent({
  isLocked,
  children,
  message = "This content is locked. Please complete your enrollment to access.",
  ctaText = "Unlock Now",
  onCtaClick,
  fullPage = false,
}: BlurLockProps) {

  const router = useRouter();

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      router.push("/all-courses");
    }
  }
  return (
    <div className={fullPage ? "relative min-h-screen" : "relative"}>
      {/* Content */}
      <div className={isLocked ? "blur-sm select-none pointer-events-none" : ""}>
        {children}
      </div>

      {/* Overlay */}
      {isLocked && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md p-6 ${
            fullPage ? "fixed top-0 left-0 w-full h-full z-50" : "rounded-lg"
          }`}
        >
          <Lock size={50} className="text-gray-700 mb-4" />
          <p className="text-center text-gray-800 font-medium mb-4">{message}</p>
          <button
            onClick={handleCtaClick}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
          >
            {ctaText}
          </button>
        </div>
      )}
    </div>
  );
}
