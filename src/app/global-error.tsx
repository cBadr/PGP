"use client";

import { useEffect } from "react";

/**
 * Catches errors thrown in the root layout itself. Must include its own
 * <html> and <body> because the root layout isn't rendered.
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
    console.error("[RootLayoutError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0118",
          color: "#f4f1ff",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>The app crashed</h1>
          <p style={{ opacity: 0.65, marginTop: 12 }}>
            A root-level error stopped the page from rendering. Try reloading.
          </p>
          {error.digest && (
            <pre style={{
              marginTop: 16, padding: 12, borderRadius: 8,
              background: "rgba(255,255,255,0.04)", fontSize: 12,
              fontFamily: "ui-monospace, monospace",
            }}>
              {error.digest}
            </pre>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: 20, padding: "10px 18px", borderRadius: 10,
              background: "linear-gradient(135deg, #8b5cf6, #d946ef, #06b6d4)",
              color: "white", border: "none", fontWeight: 600, cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
