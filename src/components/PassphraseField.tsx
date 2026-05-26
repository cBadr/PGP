"use client";
import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

/**
 * Passphrase display with mask/reveal toggle and copy button.
 * Use for end-user pages — the actual value is in the DOM but hidden
 * visually until the user clicks the eye icon.
 */
export function PassphraseField({ value }: { value: string | null }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!value) {
    return <span className="text-white/40 text-sm italic">(none stored)</span>;
  }

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const masked = "•".repeat(Math.min(Math.max(value.length, 8), 18));

  return (
    <div className="flex items-center gap-2">
      <code className="font-mono text-xs tracking-wider select-all break-all">
        {show ? value : masked}
      </code>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="shrink-0 p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition"
        title={show ? "Hide passphrase" : "Show passphrase"}
        aria-label={show ? "Hide passphrase" : "Show passphrase"}
      >
        {show ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition"
        title="Copy passphrase"
        aria-label="Copy passphrase"
      >
        {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
      </button>
    </div>
  );
}
