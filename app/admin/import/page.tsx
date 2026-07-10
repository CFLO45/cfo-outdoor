"use client";

import { useState, useEffect } from "react";
import ImportTool from "@/components/ImportTool";

export default function ImportPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin-auth")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) setUnlocked(true);
      })
      .finally(() => setChecking(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setUnlocked(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24 text-center text-ink/50 text-sm">
        Checking session...
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24">
        <h1 className="text-2xl mb-6">Admin</h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-ink/15 rounded-xl px-4 py-2.5 bg-white"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-ink text-sand px-5 py-2.5 rounded-full font-medium hover:bg-rust transition-colors disabled:opacity-50"
          >
            {loading ? "Checking..." : "Enter"}
          </button>
          {error && <p className="text-rust text-sm">Incorrect password.</p>}
        </form>
      </div>
    );
  }

  return <ImportTool />;
}
