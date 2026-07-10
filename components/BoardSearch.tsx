"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBoards } from "@/lib/boards";

export default function BoardSearch() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setNotFound(false);
    const boards = await getBoards();
    const match = boards.find(
      (b) => b.board_number.toLowerCase() === query.trim().toLowerCase()
    );
    if (match) {
      router.push(`/boards/${match.id}`);
    } else {
      setNotFound(true);
      setSearching(false);
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setNotFound(false); }}
        placeholder="Search by board number..."
        className="flex-1 border border-ink/15 rounded-full px-4 py-2.5 text-sm bg-white"
      />
      <button
        type="submit"
        disabled={searching || !query.trim()}
        className="bg-ink text-sand px-5 py-2.5 rounded-full text-sm font-medium hover:bg-rust transition-colors disabled:opacity-40 shrink-0"
      >
        {searching ? "Searching..." : "Find board"}
      </button>
      {notFound && (
        <p className="text-rust text-sm self-center ml-1">Board #{query} not found.</p>
      )}
    </form>
  );
}
