"use client";

import { useEffect, useState } from "react";
import { counties, Board, BoardType } from "@/lib/data";
import { getBoards, createBoard, updateBoard, deleteBoard, uploadBoardPhoto } from "@/lib/boards";

const emptyForm = {
  board_number: "",
  board_type: "static" as BoardType,
  weekly_impressions: "",
  size: "",
  county: counties[0].slug,
  zip_code: "",
  latitude: "",
  longitude: "",
  spots: "",
  loop_seconds: "",
  location_description: "",
  operator: "",
};

type FormState = typeof emptyForm;

export default function AdminDashboard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function refresh() {
    setLoading(true);
    setBoards(await getBoards());
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  const filteredBoards = search.trim()
    ? boards.filter((b) => b.board_number.toLowerCase().includes(search.toLowerCase().trim()))
    : boards;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(board: Board) {
    setEditingId(board.id);
    setForm({
      board_number: board.board_number,
      board_type: board.board_type,
      weekly_impressions: String(board.weekly_impressions),
      size: board.size,
      county: board.county,
      zip_code: board.zip_code,
      latitude: String(board.latitude),
      longitude: String(board.longitude),
      spots: board.spots != null ? String(board.spots) : "",
      loop_seconds: board.loop_seconds != null ? String(board.loop_seconds) : "",
      location_description: board.location_description ?? "",
      operator: board.operator ?? "",
    });
    setPhotoFile(null);
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      let photo_url: string | undefined = undefined;
      if (photoFile) {
        photo_url = await uploadBoardPhoto(photoFile, form.board_number);
      }

      const payload = {
        board_number: form.board_number,
        board_type: form.board_type,
        weekly_impressions: Number(form.weekly_impressions),
        size: form.size,
        county: form.county,
        zip_code: form.zip_code,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        spots: form.board_type === "digital" && form.spots ? Number(form.spots) : null,
        loop_seconds: form.board_type === "digital" && form.loop_seconds ? Number(form.loop_seconds) : null,
        location_description: form.location_description || null,
        operator: form.operator || null,
        ...(photo_url !== undefined ? { photo_url } : {}),
      };

      if (editingId) {
        await updateBoard(editingId, payload);
        setSuccess("Board updated.");
        setEditingId(null);
      } else {
        await createBoard({ ...payload, photo_url: photo_url ?? null });
        setSuccess("Board added.");
      }
      setForm(emptyForm);
      setPhotoFile(null);
      await refresh();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this board?")) return;
    await deleteBoard(id);
    await refresh();
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl">Admin &middot; Boards</h1>
        <a
          href="/admin/import"
          className="bg-ink text-sand px-5 py-2.5 rounded-full text-sm font-medium hover:bg-rust transition-colors"
        >
          Import CSV
        </a>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-10">
        <form onSubmit={handleSubmit} className="grid gap-4 content-start">
          <h2 className="text-lg">{editingId ? "Edit board" : "Add a board"}</h2>

          <Field label="Board #">
            <input required value={form.board_number} onChange={(e) => update("board_number", e.target.value)} className="input" />
          </Field>

          <Field label="Type">
            <select value={form.board_type} onChange={(e) => update("board_type", e.target.value as BoardType)} className="input">
              <option value="static">Static</option>
              <option value="digital">Digital</option>
            </select>
          </Field>

          <Field label="Weekly impressions (18+)">
            <input required type="number" value={form.weekly_impressions} onChange={(e) => update("weekly_impressions", e.target.value)} className="input" />
          </Field>

          <Field label="Size">
            <input required placeholder="e.g. 14x48" value={form.size} onChange={(e) => update("size", e.target.value)} className="input" />
          </Field>

          <Field label="County">
            <select value={form.county} onChange={(e) => update("county", e.target.value)} className="input">
              {counties.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Zip code">
            <input required value={form.zip_code} onChange={(e) => update("zip_code", e.target.value)} className="input" />
          </Field>

          <Field label="Location description">
            <input
              value={form.location_description}
              onChange={(e) => update("location_description", e.target.value)}
              placeholder="e.g. SR 200, .3 mi SW/O SW 99th St Rd; S/S"
              className="input"
            />
          </Field>

          <Field label="Operator">
            <input
              value={form.operator}
              onChange={(e) => update("operator", e.target.value)}
              placeholder="e.g. OUTFRONT, Lamar, Clear Channel"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitude">
              <input required type="number" step="any" value={form.latitude} onChange={(e) => update("latitude", e.target.value)} className="input" />
            </Field>
            <Field label="Longitude">
              <input required type="number" step="any" value={form.longitude} onChange={(e) => update("longitude", e.target.value)} className="input" />
            </Field>
          </div>

          {form.board_type === "digital" && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Spots">
                <input type="number" value={form.spots} onChange={(e) => update("spots", e.target.value)} className="input" />
              </Field>
              <Field label="Loop (seconds)">
                <input type="number" value={form.loop_seconds} onChange={(e) => update("loop_seconds", e.target.value)} className="input" />
              </Field>
            </div>
          )}

          <Field label={editingId ? "Replace photo (optional)" : "Photo (optional)"}>
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} className="input" />
          </Field>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-ink text-sand px-5 py-2.5 rounded-full font-medium hover:bg-rust transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Save changes" : "Add board"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="border border-ink/20 px-5 py-2.5 rounded-full font-medium hover:border-rust hover:text-rust transition-colors text-sm">
                Cancel
              </button>
            )}
          </div>

          {error && <p className="text-rust text-sm">{error}</p>}
          {success && <p className="text-citrus text-sm">{success}</p>}

          <style jsx>{`
            .input {
              border: 1px solid rgba(28,35,33,0.15);
              border-radius: 0.75rem;
              padding: 0.6rem 0.85rem;
              background: white;
              width: 100%;
            }
          `}</style>
        </form>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Search by board #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-ink/15 rounded-full px-4 py-2 text-sm bg-white flex-1"
            />
            <span className="text-sm text-ink/50 shrink-0">
              {loading ? "Loading..." : `${filteredBoards.length} of ${boards.length}`}
            </span>
          </div>
          <div className="grid gap-3">
            {filteredBoards.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-ink/10">
                {b.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.photo_url} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-ink/5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Board #{b.board_number} &middot; <span className="capitalize">{b.board_type}</span></p>
                  <p className="text-sm text-ink/60 truncate">
                    {b.county} &middot; {b.zip_code} &middot; {b.weekly_impressions.toLocaleString()} weekly
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => startEdit(b)} className="text-sm text-ink/60 hover:text-ink">Edit</button>
                  <button onClick={() => handleDelete(b.id)} className="text-sm text-rust hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
