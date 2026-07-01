"use client";

import { useEffect, useState } from "react";
import { counties, countyName, Board } from "@/lib/data";
import { getBoard } from "@/lib/boards";

export default function QuoteForm({ presetBoardId }: { presetBoardId?: string }) {
  const [presetBoard, setPresetBoard] = useState<Board | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  useEffect(() => {
    if (presetBoardId) {
      getBoard(presetBoardId).then(setPresetBoard);
    }
  }, [presetBoardId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="p-8 rounded-2xl bg-citrus/10 border border-citrus/30 text-center">
        <h2 className="text-xl mb-2">Request sent</h2>
        <p className="text-ink/60">
          We&apos;ll follow up with availability and pricing shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 max-w-xl">
      {presetBoard && (
        <div className="p-4 rounded-xl bg-ink/5 text-sm">
          Requesting a quote for <span className="font-medium">Board #{presetBoard.board_number}</span>
          {" "}({countyName(presetBoard.county)})
          <input type="hidden" name="boardId" value={presetBoard.id} />
        </div>
      )}

      <Field label="Name">
        <input name="name" required className="input" />
      </Field>
      <Field label="Email">
        <input type="email" name="email" required className="input" />
      </Field>
      <Field label="Phone">
        <input type="tel" name="phone" className="input" />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Board type">
          <select name="boardType" defaultValue={presetBoard?.board_type ?? ""} className="input">
            <option value="">Either type</option>
            <option value="static">Static</option>
            <option value="digital">Digital</option>
          </select>
        </Field>
        <Field label="County">
          <select name="county" defaultValue={presetBoard?.county ?? ""} className="input">
            <option value="">Any county</option>
            {counties.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Budget range">
          <select name="budget" className="input">
            <option value="">Select a range</option>
            <option value="under-5k">Under $5,000</option>
            <option value="5k-15k">$5,000&ndash;$15,000</option>
            <option value="15k-50k">$15,000&ndash;$50,000</option>
            <option value="50k-plus">$50,000+</option>
          </select>
        </Field>
        <Field label="Campaign start date">
          <input type="date" name="startDate" className="input" />
        </Field>
      </div>

      <Field label="Notes">
        <textarea name="notes" rows={4} className="input" />
      </Field>

      <p className="text-xs text-ink/40 leading-relaxed">
        Central Florida Outdoor is an independent broker. Submitting this form does not reserve
        or guarantee any placement. Availability and pricing are subject to confirmation with
        the media owner. See our{" "}
        <a href="/terms" className="underline hover:text-rust">Terms of Service</a>.
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-ink text-sand px-6 py-3 rounded-full font-medium hover:bg-rust transition-colors disabled:opacity-50 w-fit"
      >
        {status === "submitting" ? "Sending..." : "Send request"}
      </button>

      {status === "error" && (
        <p className="text-rust text-sm">Something went wrong &mdash; please try again.</p>
      )}

      <style jsx>{`
        .input {
          border: 1px solid rgba(28, 35, 33, 0.15);
          border-radius: 0.75rem;
          padding: 0.65rem 0.9rem;
          background: white;
          width: 100%;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
