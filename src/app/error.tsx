"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

/**
 * Root error boundary. Catches any unhandled server- or client-side
 * exception and renders a useful debug surface (digest from Vercel
 * + the message in dev).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="glass-card p-8 max-w-lg w-full text-center">
        <AlertTriangle size={48} className="mx-auto text-rose-300 mb-4" />
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-white/55 mt-2 text-sm">
          The page hit an unexpected error. You can try again, head home, or contact support.
        </p>

        {error.digest && (
          <div className="mt-5 glass rounded-lg p-3 text-xs font-mono text-white/55">
            <div className="text-[10px] uppercase tracking-widest text-white/35 mb-1">Error reference</div>
            {error.digest}
          </div>
        )}

        {process.env.NODE_ENV !== "production" && error.message && (
          <pre className="mt-3 glass rounded-lg p-3 text-xs font-mono text-rose-200 whitespace-pre-wrap text-left">
            {error.message}
          </pre>
        )}

        <div className="mt-6 flex gap-2 justify-center">
          <button onClick={reset} className="btn-primary">
            <RotateCcw size={14} /> Try again
          </button>
          <Link href="/" className="btn-ghost">
            <Home size={14} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
