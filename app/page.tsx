"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Globe, Bookmark, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {

  const previewBookmarks = [
    { title: "Next.js Architecture Secrets", type: "public", url: "nextjs.org", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { title: "My Secret Side-Project Idea", type: "private", url: "localhost:3000", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    { title: "Tailwind Masterclass Portfolio", type: "public", url: "tailwindcss.com", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  ];

  return (
    <main className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-[#0B0F19] px-6 text-white selection:bg-indigo-500/30">
      <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute bottom-10 right-10 -z-10 h-[250px] w-[250px] rounded-full bg-purple-600/10 blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-md"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>Now featuring public handles</span>
      </motion.div>

      <div className="mt-6 max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl"
        >
          Save what matters.<br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Share what inspires.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-base text-gray-400 sm:text-lg"
        >
          A minimal vault for your digital discoveries. Keep your raw research private, or pass your handler to let anyone browse your public collection.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row gap-4"
      >
        <Link
          href="/signup"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-transform active:scale-98 hover:opacity-95"
        >
          Claim Your Handle
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-gray-900 hover:border-gray-700"
        >
          Sign In
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 w-full max-w-2xl rounded-2xl border border-gray-800/80 bg-gray-900/30 p-6 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-800/60 pb-4">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/40" />
            <span className="h-3 w-3 rounded-full bg-amber-500/40" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/40" />
          </div>
          <div className="rounded-md bg-gray-900/80 px-4 py-1 text-xs text-gray-500 font-mono">
            markapp.dev/alex
          </div>
          <div className="w-12" />
        </div>

        <div className="mt-6 space-y-3">
          {previewBookmarks.map((bookmark, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.02)" }}
              className="flex items-center justify-between rounded-xl border border-gray-800/40 bg-gray-950/40 p-4 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-900 border border-gray-800">
                  <Bookmark className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-gray-200 truncate">{bookmark.title}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{bookmark.url}</p>
                </div>
              </div>

              <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wider ${bookmark.color}`}>
                {bookmark.type === "private" ? (
                  <>
                    <Lock className="h-3 w-3" />
                    <span className="hidden sm:inline">Private</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-3 w-3" />
                    <span className="hidden sm:inline">Public</span>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </main>
  );
}
