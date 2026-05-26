"use client";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";

type Key = { id: string; name: string; fingerprint: string; publicKey: string };

export function VerifyForm({ keys }: { keys: Key[] }) {
  const [mode, setMode] = useState<"server" | "client">("server");
  const [signedMessage, setSignedMessage] = useState("");
  const [keyId, setKeyId] = useState(keys[0]?.id ?? "");
  const [pastedKey, setPastedKey] = useState("");
  const [result, setResult] = useState<{ valid: boolean; text: string; error?: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setError(""); setResult(null); setBusy(true);
    try {
      if (mode === "server") {
        const r = await fetch("/api/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ signedMessage, keyId: pastedKey ? null : keyId, publicKey: pastedKey || null }) });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        setResult(j);
      } else {
        const openpgp = await import("openpgp");
        const pub = pastedKey || keys.find((k) => k.id === keyId)?.publicKey;
        if (!pub) throw new Error("No public key");
        const publicKey = await openpgp.readKey({ armoredKey: pub });
        const message = await openpgp.readCleartextMessage({ cleartextMessage: signedMessage });
        const verification = await openpgp.verify({ message, verificationKeys: publicKey });
        let valid = false;
        try { await verification.signatures[0].verified; valid = true; } catch {}
        setResult({ valid, text: verification.data as string });
        await fetch("/api/log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify", details: `client-side · valid=${valid}` }) });
      }
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs uppercase tracking-widest text-white/50">Processing mode</span>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>

      <div>
        <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Signed message</span>
        <textarea value={signedMessage} onChange={(e) => setSignedMessage(e.target.value)} rows={8} className="textarea" placeholder="-----BEGIN PGP SIGNED MESSAGE-----" />
      </div>

      <div>
        <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Public key (saved)</span>
        {keys.length === 0 ? (
          <p className="text-sm text-white/45 italic">No saved keys — paste one below.</p>
        ) : (
          <select value={keyId} onChange={(e) => setKeyId(e.target.value)} disabled={!!pastedKey} className="select disabled:opacity-50">
            {keys.map((k) => <option key={k.id} value={k.id}>{k.name} — {k.fingerprint.slice(-16)}</option>)}
          </select>
        )}
      </div>

      <div>
        <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">…or paste a public key <span className="text-white/30 normal-case tracking-normal">(overrides above)</span></span>
        <textarea value={pastedKey} onChange={(e) => setPastedKey(e.target.value)} rows={4} className="textarea" />
      </div>

      <button onClick={run} disabled={busy || !signedMessage} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
        {busy ? <><Loader2 size={15} className="animate-spin" /> Verifying…</> : <><CheckCircle2 size={15} /> Verify signature</>}
      </button>

      {error && <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-400/30 text-rose-200 text-sm"><AlertCircle size={16} className="mt-0.5 shrink-0" />{error}</div>}
      {result && (
        <div className={`glass-card p-5 border-2 ${result.valid ? "border-emerald-400/40" : "border-rose-400/40"}`}>
          <div className={`flex items-center gap-2 font-bold mb-3 ${result.valid ? "text-emerald-300" : "text-rose-300"}`}>
            {result.valid ? <><CheckCircle2 size={20} /> Signature valid</> : <><XCircle size={20} /> Signature invalid</>}
          </div>
          <pre className="code-block">{result.text}</pre>
        </div>
      )}
    </div>
  );
}
