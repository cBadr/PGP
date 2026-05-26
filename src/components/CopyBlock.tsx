"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyBlock({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="glass-card p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">{label}</span>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="btn-ghost text-xs py-1.5 px-3"
        >
          {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <pre className="code-block">{value}</pre>
    </div>
  );
}
