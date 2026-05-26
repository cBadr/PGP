"use client";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Lock, Loader2, AlertCircle, Users, ClipboardPaste } from "lucide-react";

type Key = { id: string; name: string; email: string | null; fingerprint: string; publicKey: string };

function splitArmoredPublicKeys(text: string): string[] {
  const blocks: string[] = [];
  const lines = text.split(/\r?\n/);
  let cur: string[] = [];
  let inBlock = false;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("-----BEGIN PGP PUBLIC KEY BLOCK-----")) {
      inBlock = true; cur = [line];
    } else if (inBlock) {
      cur.push(line);
      if (t.startsWith("-----END PGP PUBLIC KEY BLOCK-----")) {
        blocks.push(cur.join("\n"));
        cur = [];
        inBlock = false;
      }
    }
  }
  return blocks;
}

export function EncryptForm({ keys }: { keys: Key[] }) {
  const [mode, setMode]               = useState<"server" | "client">("server");
  const [text, setText]               = useState("");
  const [selected, setSelected]       = useState<string[]>([]);
  const [pastedKeys, setPastedKeys]   = useState("");
  const [result, setResult]           = useState("");
  const [error, setError]             = useState("");
  const [busy, setBusy]               = useState(false);

  const toggleKey = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const pastedBlocks = pastedKeys.trim() ? splitArmoredPublicKeys(pastedKeys) : [];
  const totalRecipients = selected.length + pastedBlocks.length;

  const run = async () => {
    setError(""); setResult(""); setBusy(true);
    try {
      if (totalRecipients === 0) throw new Error("Pick at least one recipient (saved or pasted).");

      if (mode === "server") {
        const r = await fetch("/api/encrypt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, keyIds: selected, pastedPublicKeys: pastedKeys }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        setResult(j.result);
      } else {
        const openpgp = await import("openpgp");
        const recipientsArmored = [
          ...keys.filter((k) => selected.includes(k.id)).map((k) => k.publicKey),
          ...pastedBlocks,
        ];
        const encryptionKeys = await Promise.all(
          recipientsArmored.map((a) => openpgp.readKey({ armoredKey: a })),
        );
        const message = await openpgp.createMessage({ text });
        const encrypted = await openpgp.encrypt({ message, encryptionKeys, format: "armored" });
        setResult(encrypted as string);
        await fetch("/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "encrypt",
            details: `client-side · ${selected.length} saved + ${pastedBlocks.length} pasted recipient(s)`,
          }),
        });
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
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

      {/* Saved keyring recipients */}
      <div>
        <span className="flex items-center justify-between text-xs uppercase tracking-widest text-white/50 mb-1.5">
          <span className="inline-flex items-center gap-1.5"><Users size={12} /> Saved recipients <span className="text-white/30 normal-case tracking-normal">· {selected.length}/{keys.length}</span></span>
        </span>
        {keys.length === 0 ? (
          <p className="text-sm text-white/45 italic">No saved keys. Generate / import one or paste a public key below.</p>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto glass rounded-xl p-2">
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

      {/* Pasted public keys */}
      <div>
        <span className="flex items-center justify-between text-xs uppercase tracking-widest text-white/50 mb-1.5">
          <span className="inline-flex items-center gap-1.5"><ClipboardPaste size={12} /> Paste recipients' public keys</span>
          {pastedBlocks.length > 0 && (
            <span className="badge badge-emerald normal-case tracking-normal">
              {pastedBlocks.length} key{pastedBlocks.length === 1 ? "" : "s"} detected
            </span>
          )}
        </span>
        <textarea
          value={pastedKeys}
          onChange={(e) => setPastedKeys(e.target.value)}
          rows={6}
          className="textarea"
          placeholder={"-----BEGIN PGP PUBLIC KEY BLOCK-----\n...\n-----END PGP PUBLIC KEY BLOCK-----\n\n(you can paste multiple blocks here)"}
        />
        <p className="text-[11px] text-white/40 mt-1.5">
          Paste one or more ASCII-armored public keys. The message will be encrypted to <strong>every</strong> recipient (saved + pasted) so each can decrypt it with their own private key.
        </p>
      </div>

      <button
        onClick={run}
        disabled={busy || totalRecipients === 0 || !text}
        className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {busy ? (
          <><Loader2 size={15} className="animate-spin" /> Encrypting…</>
        ) : (
          <><Lock size={15} /> Encrypt for {totalRecipients || "0"} recipient{totalRecipients === 1 ? "" : "s"}</>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-400/30 text-rose-200 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />{error}
        </div>
      )}
      {result && (
        <div>
          <span className="block text-xs uppercase tracking-widest text-emerald-300/80 mb-1.5">✓ Encrypted output</span>
          <textarea readOnly value={result} rows={10} className="textarea" />
        </div>
      )}
    </div>
  );
}
