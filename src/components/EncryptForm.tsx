"use client";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Lock, Loader2, AlertCircle } from "lucide-react";

type Key = { id: string; name: string; email: string | null; fingerprint: string; publicKey: string };

export function EncryptForm({ keys }: { keys: Key[] }) {
  const [mode, setMode] = useState<"server" | "client">("server");
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<string[]>(keys[0] ? [keys[0].id] : []);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const toggleKey = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const run = async () => {
    setError(""); setResult(""); setBusy(true);
    try {
      if (mode === "server") {
        const r = await fetch("/api/encrypt", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, keyIds: selected }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        setResult(j.result);
      } else {
        const openpgp = await import("openpgp");
        const recipients = keys.filter((k) => selected.includes(k.id));
        const encryptionKeys = await Promise.all(recipients.map((k) => openpgp.readKey({ armoredKey: k.publicKey })));
        const message = await openpgp.createMessage({ text });
        const encrypted = await openpgp.encrypt({ message, encryptionKeys, format: "armored" });
        setResult(encrypted as string);
        await fetch("/api/log", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "encrypt", details: `client-side · ${recipients.length} recipient(s)` }),
        });
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
        <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Plaintext message</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="input" placeholder="Type your secret message…" />
      </div>

      <div>
        <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Recipients ({selected.length}/{keys.length})</span>
        {keys.length === 0 ? (
          <p className="text-sm text-white/45 italic">No keys yet. Generate or import one first.</p>
        ) : (
          <div className="space-y-1 max-h-56 overflow-y-auto glass rounded-xl p-2">
            {keys.map((k) => (
              <label key={k.id} className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg hover:bg-white/[0.04] cursor-pointer">
                <input type="checkbox" checked={selected.includes(k.id)} onChange={() => toggleKey(k.id)} className="accent-violet-500" />
                <span className="flex-1 truncate">{k.name} {k.email && <span className="text-white/45">&lt;{k.email}&gt;</span>}</span>
                <span className="ml-auto font-mono text-[10px] text-white/35">{k.fingerprint.slice(-16)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button onClick={run} disabled={busy || selected.length === 0 || !text} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
        {busy ? <><Loader2 size={15} className="animate-spin" /> Encrypting…</> : <><Lock size={15} /> Encrypt</>}
      </button>

      {error && <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-400/30 text-rose-200 text-sm"><AlertCircle size={16} className="mt-0.5 shrink-0" />{error}</div>}
      {result && (
        <div>
          <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Encrypted output</span>
          <textarea readOnly value={result} rows={10} className="textarea" />
        </div>
      )}
    </div>
  );
}
