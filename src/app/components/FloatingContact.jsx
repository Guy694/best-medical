"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

// Facebook & LINE SVG
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M22 12a10 10 0 1 0-11.563 9.875v-6.988H7.898V12h2.539V9.797c0-2.506 1.493-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.261c-1.244 0-1.632.773-1.632 1.566V12h2.777l-.444 2.887h-2.333v6.988A10.002 10.002 0 0 0 22 12Z"/>
  </svg>
);

const LineIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.666 4.667C22.6 6.6 22.6 9.6 22.6 12c0 2.4 0 5.4-1.934 7.333C18.733 21.267 15.733 21.267 13.333 21.267H9.8c-.5 0-.9 0-1.267.333L6.4 23.6c-.4.4-1.067.133-1.067-.4v-1.533c0-.466-.167-.667-.733-.733C2.2 20.6 1.4 18.533 1.4 16c0-2.4 0-5.4 1.934-7.333C5.267 6.733 8.267 6.733 10.667 6.733h2.666c2.4 0 5.4 0 7.333 1.934Z"/>
  </svg>
);

export default function FloatingContact({
  facebookUrl = "https://m.me/yourpage",
  lineUrl = "https://line.me/R/ti/p/@yourlineid",
  label = "ติดต่อเรา",
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="mb-3 mr-2 w-56 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-3 border-b text-sm font-medium">
              {label}
            </div>
            <div className="p-2 flex flex-col gap-2">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2]">
                  <FacebookIcon className="h-5 w-5" />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">Facebook Messenger</span>
                  <span className="text-xs text-gray-500">แชตกับแอดมิน</span>
                </div>
              </a>

              <a
                href={lineUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#06C755]/10 text-[#06C755]">
                  <LineIcon className="h-5 w-5" />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">LINE Official</span>
                  <span className="text-xs text-gray-500">เพิ่มเพื่อน/แชตเลย</span>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="เปิดเมนูติดต่อ"
      >
        <AnimatePresence initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute"
            >
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute"
            >
              <MessageCircle className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Tooltip */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-gray-900/90 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
          {open ? "ปิดเมนู" : "ติดต่อเรา"}
        </span>
      </button>
    </div>
  );
}
