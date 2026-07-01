"use client";

import { useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simple shared-password gate for a single-operator MVP. Set
    // NEXT_PUBLIC_ADMIN_PASSWORD in your environment variables -- this is
    // not real authentication, just a basic deterrent. Don't put anything
    // here you wouldn't want eventually exposed.
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setUnlocked(true);
      setError(false);
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
          <button
            type="submit"
            className="bg-ink text-sand px-5 py-2.5 rounded-full font-medium hover:bg-rust transition-colors"
          >
            Enter
          </button>
          {error && <p className="text-rust text-sm">Incorrect password.</p>}
        </form>
      </div>
    );
  }

  return <AdminDashboard />;
}
