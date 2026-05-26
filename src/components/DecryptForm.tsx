"use client";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Unlock, Loader2, AlertCircle, KeyRound, Eye, EyeOff } from "lucide-react";

type Key = { id: string; name: string; email: string | null; fingerprint: string; privateKey: string; passphrase: string | null };

export function DecryptForm({ keys }: { keys: Key[] }) {
  const [mode, setMode]           = useState<"server" | "client">("server");
  const [ciphertext, setCiphertext] = useState("");
  const [keyId, setKeyId]         = useState(keys[0]?.id ?? "");
  const [passphrase, setPassphrase] = useState(keys[0]?.passphrase ?? "");
  const [showPass, setShowPass]   = useState(false);
  const [overridden, setOverridden] = useState(false); // user typed manually
  const [result, setResult]       = useState("");
  const [error, setError]         = useState("");
  const [busy, setBusy]           = useState(false);

  const currentKey = keys.find((k) => k.id === keyId);

  // Auto-fill passphrase whenever the key selection changes, unless the user
  // has explicitly overridden the field.
  useEffect(() => {
    if (!overridden) setPassphrase(currentKey?.passphrase ?? "");
  }, [keyId, currentKey?.passphrase, overridden]);

  const usingStored = !overridden && !!currentKey?.passphrase && passphrase === currentKey.passphrase;

  const run = async () => {
    setError(""); setResult(""); setBusy(true);
    try {
      if (mode === "server") {
        const r = await fetch("/api/decrypt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ciphertext, keyId, passphrase }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        setResult(j.result);
      } else {
        const openpgp = await import("openpgp");
        if (!currentKey) throw new Error("Key not found");
        const pass = passphrase || currentKey.passphrase || "";
        let priv = await openpgp.readPrivateKey({ armoredKey: currentKey.privateKey });
        if (!priv.isDecrypted()) priv = await openpgp.decryptKey({ privateKey: priv, passphrase: pass });
        const message = await openpgp.readMessage({ armoredMessage: ciphertext });
        const { data } = await openpgp.decrypt({ message, decryptionKeys: priv });
        setResult(data as string);
        await fetch("/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "decrypt", details: `client-side · ${currentKey.fingerprint.slice(-16)}` }),
        });
      }
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };

  const resetToStored = () => {
    setPassphrase(currentKey?.passphrase ?? "");
    setOverridden(false);
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs uppercase tracking-widest text-white/50">Processing mode</span>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>

      <div>
        <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Encrypted message</span>
        <textarea value={ciphertext} onChange={(e) => setCiphertext(e.target.value)} rows={8} className="textarea" placeholder="-----BEGIN PGP MESSAGE-----" />
      </div>

      <div>
        <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5 inline-flex items-center gap-1.5">
          <KeyRound size={12} /> Private key
        </span>
        {keys.length === 0 ? (
          <p className="text-sm text-white/45 italic">No private keys available.</p>
        ) : (
          <select
            value={keyId}
            onChange={(e) => { setKeyId(e.target.value); setOverridden(false); }}
            className="select"
          >
            {keys.map((k) => <option key={k.id} value={k.id}>{k.name} — {k.fingerprint.slice(-16)}</option>)}
          </select>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs uppercase tracking-widest text-white/50">Passphrase</span>
          {usingStored ? (
            <span className="badge badge-emerald">using stored ✓</span>
          ) : overridden && currentKey?.passphrase ? (
            <button type="button" onClick={resetToStored} className="text-[11px] text-violet-300 hover:text-violet-200">
              ↺ use stored passphrase
            </button>
          ) : null}
        </div>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            value={passphrase}
            onChange={(e) => { setPassphrase(e.target.value); setOverridden(true); }}
            className="input pr-10"
            placeholder={currentKey?.passphrase ? "stored passphrase will be used" : "Type the passphrase…"}
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white"
            aria-label={showPass ? "Hide" : "Show"}
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      <button onClick={run} disabled={busy || !keyId || !ciphertext} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
        {busy ? <><Loader2 size={15} className="animate-spin" /> Decrypting…</> : <><Unlock size={15} /> Decrypt</>}
      </button>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-400/30 text-rose-200 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />{error}
        </div>
      )}
      {result && (
        <div>
          <span className="block text-xs uppercase tracking-widest text-emerald-300/80 mb-1.5">✓ Decrypted text</span>
          <textarea readOnly value={result} rows={6} className="input" />
        </div>
      )}
    </div>
  );
}
