"use client";

import { useState } from "react";
import ImportTool from "@/components/ImportTool";

export default function ImportPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setUnlocked(true);
    } else {
      setError(true);
    }
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
          <button type="submit" className="bg-ink text-sand px-5 py-2.5 rounded-full font-medium hover:bg-rust transition-colors">
            Enter
          </button>
          {error && <p className="text-rust text-sm">Incorrect password.</p>}
        </form>
      </div>
    );
  }

  return <ImportTool />;
}
