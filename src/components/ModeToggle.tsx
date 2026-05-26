"use client";
import { Server, Globe } from "lucide-react";

export function ModeToggle({
  mode, setMode,
}: {
  mode: "server" | "client";
  setMode: (m: "server" | "client") => void;
}) {
  return (
    <div className="inline-flex glass rounded-xl p-1 text-xs">
      <button
        type="button"
        onClick={() => setMode("server")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
          mode === "server"
            ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md"
            : "text-white/55 hover:text-white"
        }`}
      >
        <Server size={13} /> Server-side
      </button>
      <button
        type="button"
        onClick={() => setMode("client")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
          mode === "client"
            ? "bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-md"
            : "text-white/55 hover:text-white"
        }`}
      >
        <Globe size={13} /> Client-side
      </button>
    </div>
  );
}
