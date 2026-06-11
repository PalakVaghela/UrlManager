"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BookmarkState = {
  error?: string;
  success?: boolean;
  /** Changes on every action completion so client effects always re-run. */
  nonce?: number;
};

export async function createBookmark(
  _prevState: BookmarkState,
  formData: FormData,
): Promise<BookmarkState> {
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const isPublic = formData.get("is_public") === "on";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("bookmarks").insert({
    user_id: user!.id,
    title,
    url,
    is_public: isPublic,
  });

  if (error) {
    return { nonce: Date.now(), error: error.message };
  }

  revalidatePath("/dashboard");

  return { success: true, nonce: Date.now() };
}

export async function updateBookmark(
  _prevState: BookmarkState,
  formData: FormData,
): Promise<BookmarkState> {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const isPublic = formData.get("is_public") === "on";

  const supabase = await createClient();

  const { error } = await supabase
    .from("bookmarks")
    .update({ title, url, is_public: isPublic })
    .eq("id", id);

  if (error) {
    return { nonce: Date.now(), error: error.message };
  }

  revalidatePath("/dashboard");

  return { success: true, nonce: Date.now() };
}

export async function deleteBookmark(
  _prevState: BookmarkState,
  formData: FormData,
): Promise<BookmarkState> {
  const id = String(formData.get("id") ?? "");

  const supabase = await createClient();

  const { error } = await supabase.from("bookmarks").delete().eq("id", id);

  if (error) {
    return { nonce: Date.now(), error: error.message };
  }

  revalidatePath("/dashboard");

  return { success: true, nonce: Date.now() };
}
