import { supabase } from "@/lib/supabase";
import { Board } from "@/lib/data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getBoards(): Promise<Board[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/boards?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) {
      console.error("Failed to load boards:", res.status, await res.text());
      return [];
    }
    return (await res.json()) as Board[];
  } catch (err) {
    console.error("Failed to load boards:", err);
    return [];
  }
}

export async function getBoard(id: string): Promise<Board | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/boards?select=*&id=eq.${id}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as Board[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export type BoardInput = Omit<Board, "id" | "created_at" | "updated_at" | "photo_url"> & {
  photo_url?: string | null;
};

export async function createBoard(input: BoardInput) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.from("boards").insert(input).select().single();
  if (error) throw error;
  return data as Board;
}

export async function updateBoard(id: string, input: Partial<BoardInput & { photo_url: string | null }>) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from("boards")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Board;
}

export async function deleteBoard(id: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("boards").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadBoardPhoto(file: File, boardNumber: string): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const ext = file.name.split(".").pop();
  const path = `${boardNumber.replace(/\s+/g, "-")}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("board-photos").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("board-photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function importBoards(rows: BoardInput[]): Promise<{ imported: number; errors: string[] }> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const errors: string[] = [];
  let imported = 0;
  for (const row of rows) {
    const { error } = await supabase.from("boards").insert(row);
    if (error) {
      errors.push(`Board #${row.board_number}: ${error.message}`);
    } else {
      imported++;
    }
  }
  return { imported, errors };
}
